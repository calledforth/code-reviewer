import React from 'react';

interface ReviewResultProps {
  data: any;
}

export const ReviewResult: React.FC<ReviewResultProps> = ({ data }) => {
  return (
    <div className="fixed top-4 right-4 w-80 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-2">Review Results</h3>
      <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};
