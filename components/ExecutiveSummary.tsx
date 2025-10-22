
import React from 'react';

interface ExecutiveSummaryProps {
  summary: string;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summary }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-700 mb-4 flex items-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Executive Summary & Actionable Insights
      </h3>
      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{summary}</p>
    </div>
  );
};

export default ExecutiveSummary;
