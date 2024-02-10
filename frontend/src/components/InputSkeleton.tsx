import React from 'react';

interface InputSkeletonProps {
  length: number;
}

const InputSkeleton: React.FC<InputSkeletonProps> = ({ length }) => (
  <div role="status" className="ml-4 mr-4 animate-pulse mb-2.5">
    {Array.from({ length }, (_, index) => (
      <div key={index} className="h-12 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
    ))}
  </div>
);

export default InputSkeleton;
