
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SentimentPoint } from '../types';

interface SentimentChartProps {
  data: SentimentPoint[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="period" 
            tick={{ fill: '#64748b' }} 
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: '#64748b' }} 
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
            label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft', fill: '#334155', offset: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend wrapperStyle={{ color: '#334155' }} />
          <Line 
            type="monotone" 
            dataKey="sentimentScore" 
            name="Sentiment Score" 
            stroke="#0ea5e9" 
            strokeWidth={2}
            activeDot={{ r: 8, stroke: '#0284c7', fill: '#fff' }} 
            dot={{ r: 4, fill: '#0ea5e9' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;
