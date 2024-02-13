import React from 'react';

interface TodoHeaderProps {
    title: string;
}

const TodoHeader: React.FC<TodoHeaderProps> = ({ title }) => (
    <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{title}</span>
    </h1>
);

export default TodoHeader;
