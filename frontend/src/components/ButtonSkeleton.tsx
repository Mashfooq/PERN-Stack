import React from 'react';

interface buttonSkeletonProps {
  length: number;
}

const ButtonSkeleton: React.FC<buttonSkeletonProps> = ({ length }) => (
  <div role="status" className="flex items-center justify-center animate-pulse">
    {Array.from({ length }, (_, index) => (
      <div key={index} className="py-6 px-20 bg-gray-300 rounded-lg dark:bg-gray-700 me-3"></div>
    ))}
  </div>
);

export default ButtonSkeleton;
