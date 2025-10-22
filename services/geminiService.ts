
import { GoogleGenAI, Type, Chat } from '@google/genai';
import { AnalysisResult, ChatMessage } from '../types';

let chat: Chat | null = null;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    sentimentTrend: {
      type: Type.ARRAY,
      description: "An array of objects representing sentiment over time. The 'period' should be sequential like 'Review 1', 'Review 2', etc.",
      items: {
        type: Type.OBJECT,
        properties: {
          period: { type: Type.STRING },
          sentimentScore: { type: Type.NUMBER, description: "A score from 1 (very negative) to 5 (very positive)" }
        },
        required: ["period", "sentimentScore"]
      }
    },
    wordCloud: {
      type: Type.OBJECT,
      properties: {
        praises: {
          type: Type.ARRAY,
          description: "Top 15 most frequent and meaningful keywords/phrases from positive feedback.",
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              value: { type: Type.NUMBER, description: "Frequency count, scaled for importance" }
            },
            required: ["text", "value"]
          }
        },
        complaints: {
          type: Type.ARRAY,
          description: "Top 15 most frequent and meaningful keywords/phrases from negative feedback.",
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              value: { type: Type.NUMBER, description: "Frequency count, scaled for importance" }
            },
            required: ["text", "value"]
          }
        }
      },
      required: ["praises", "complaints"]
    },
    summary: {
      type: Type.STRING,
      description: "A concise executive summary (around 150 words) identifying the top 3 actionable areas for improvement based on the reviews."
    }
  },
  required: ["sentimentTrend", "wordCloud", "summary"]
};

export async function analyzeReviews(reviews: string, isThinkingMode: boolean): Promise<AnalysisResult> {
  const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  const thinkingConfig = isThinkingMode ? { thinkingBudget: 32768 } : {};

  const prompt = `
    You are an expert in customer sentiment analysis. Analyze the following batch of customer reviews.
    1.  For each review, determine its sentiment and assign a sentiment score from 1 (very negative) to 5 (very positive). Create a sequential time period for each review (e.g., 'Review 1', 'Review 2', 'Review 3', etc.).
    2.  Identify the top 15 most frequent and meaningful keywords or short phrases associated with positive feedback (praises) and the top 15 for negative feedback (complaints). For each keyword, provide a frequency count as its value.
    3.  Write a concise executive summary (around 150 words) that identifies the top 3 actionable areas for improvement based on the reviews.
    4.  Provide the entire output in the requested JSON format, strictly adhering to the provided schema.

    Here are the reviews:
    ---
    ${reviews}
    ---
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      ...(isThinkingMode && { thinkingConfig }),
    },
  });

  const jsonText = response.text.trim();
  const result = JSON.parse(jsonText);
  
  return result as AnalysisResult;
}

export function initializeChat(context: string) {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a helpful assistant analyzing customer feedback. The user has provided a set of reviews and an AI-generated summary. Your task is to answer the user's questions based ONLY on this provided context. Do not use external knowledge.

CONTEXT:
${context}`
        }
    });
}

export async function sendMessageToBot(message: string): Promise<ChatMessage> {
    if (!chat) {
        throw new Error("Chat is not initialized.");
    }

    const response = await chat.sendMessage({ message });
    return {
        sender: 'bot',
        text: response.text,
    };
}
