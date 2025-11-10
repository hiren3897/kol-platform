import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
    const hoverClasses = hoverable
        ? 'transition-shadow duration-300 hover:shadow-lg'
        : '';

    return (
        <div
            className={`bg-white p-6 rounded-xl shadow-md ${hoverClasses} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;