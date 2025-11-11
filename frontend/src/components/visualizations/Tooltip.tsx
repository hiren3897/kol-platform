import React from 'react';

interface TooltipProps {
    country: string;
    count: number;
    percentage: number;
    x: number;
    y: number;
    visible: boolean;
}

/**
 * A custom, floating tooltip component styled with TailwindCSS, absolutely positioned relative to the viewport.
 */
const Tooltip: React.FC<TooltipProps> = ({ country, count, percentage, x, y, visible }) => {
    if (!visible) return null;

    return (
        <div
            style={{
                left: x + 15,
                top: y - 50,

                pointerEvents: 'none',
                opacity: visible ? 1 : 0,
            }}
            className="fixed z-50 p-3 bg-gray-800 text-white rounded-lg shadow-xl text-sm transition-opacity duration-150"
        >
            <p className="font-bold text-lg mb-1">{country}</p>
            <p>KOL Count: <span className="font-semibold text-primary-blue">{count.toLocaleString()}</span></p>
            <p>Total Share: <span className="font-semibold text-secondary-cyan">{percentage.toFixed(1)}%</span></p>
        </div>
    );
};

export default Tooltip;