
import React, { useEffect, useRef, useState } from 'react';
import { WordCloudItem } from '../types';

// Extend the window interface for d3-cloud
declare global {
    interface Window {
        d3: any;
    }
}

interface WordCloudProps {
    words: WordCloudItem[];
}

interface Word extends WordCloudItem {
    rotate?: number;
    size?: number;
    x?: number;
    y?: number;
}

const WordCloud: React.FC<WordCloudProps> = ({ words }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [layoutWords, setLayoutWords] = useState<Word[]>([]);
    
    useEffect(() => {
        if (words && words.length > 0 && ref.current) {
            const width = ref.current.offsetWidth;
            const height = 300;

            const maxFreq = Math.max(...words.map(w => w.value), 0);
            const minFreq = Math.min(...words.map(w => w.value), maxFreq);

            const fontSizeScale = window.d3.scaleSqrt()
                .domain([minFreq, maxFreq])
                .range([12, 48]);
            
            const layout = window.d3.layout.cloud()
                .size([width, height])
                .words(words.map(d => ({ ...d, size: fontSizeScale(d.value) })))
                .padding(5)
                .rotate(() => (Math.random() > 0.5 ? 0 : 90))
                .font("sans-serif")
                .fontSize((d: any) => d.size)
                .on("end", (drawnWords: Word[]) => {
                    setLayoutWords(drawnWords);
                });
            
            layout.start();
        }
    }, [words]);

    return (
        <div ref={ref} className="relative w-full h-[300px]">
            {layoutWords.map((word, i) => (
                <div
                    key={i}
                    className="absolute transition-all duration-300 ease-in-out text-slate-700"
                    style={{
                        fontSize: `${word.size}px`,
                        fontFamily: "sans-serif",
                        transform: `translate(${word.x! + ref.current!.offsetWidth / 2}px, ${word.y! + 300 / 2}px) rotate(${word.rotate}deg)`,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {word.text}
                </div>
            ))}
        </div>
    );
};

export default WordCloud;
