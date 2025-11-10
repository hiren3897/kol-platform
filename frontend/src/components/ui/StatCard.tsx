import React from 'react';
import Card from './Card';
import { FaBook, FaGlobe, FaUsers, FaArrowUp, FaArrowDown, FaChartBar } from 'react-icons/fa';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: 'users' | 'publications' | 'hindex' | 'countries';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const getIcon = (iconName: StatCardProps['icon']) => {
    const baseClasses = 'w-6 h-6';
    switch (iconName) {
        case 'users':
            return <FaUsers color={`text-primary-blue ${baseClasses}`} />;
        case 'publications':
            return <FaBook color={`text-secondary-cyan ${baseClasses}`} />;
        case 'hindex':
            return <FaChartBar color={`text-warning ${baseClasses}`} />;
        case 'countries':
            return <FaGlobe color={`text-success ${baseClasses}`} />;
        default:
            return null;
    }
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend }) => {
    const trendClasses = trend
        ? (trend.isPositive ? 'text-success' : 'text-red-500')
        : 'text-gray-500';
    const TrendIcon = trend
        ? (trend.isPositive ? FaArrowUp : FaArrowDown)
        : null;

    return (
        <Card className="flex items-center justify-between">
            <div>
                <h4 className="text-sm font-medium text-gray-500">{title}</h4>
                <p className="text-3xl font-bold text-text-dark my-1">{value}</p>

                {trend && (
                    <span className={`flex items-center text-sm ${trendClasses}`}>
                        {TrendIcon && <TrendIcon color="w-3 h-3 mr-1" />}
                        {Math.abs(trend.value).toFixed(2)}%
                        <span className="text-xs text-gray-500 ml-1"> vs. previous</span>
                    </span>
                )}

                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
                {getIcon(icon)}
            </div>
        </Card>
    );
};

export default StatCard;