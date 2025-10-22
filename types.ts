
export interface SentimentPoint {
  period: string;
  sentimentScore: number;
}

export interface WordCloudItem {
  text: string;
  value: number;
}

export interface WordCloudData {
  praises: WordCloudItem[];
  complaints: WordCloudItem[];
}

export interface AnalysisResult {
  sentimentTrend: SentimentPoint[];
  wordCloud: WordCloudData;
  summary: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}
