import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const Header: React.FC = () => {
    return (
        <header className="bg-primary-blue shadow-md">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
                <FaChartLine color="w-8 h-8 text-white mr-3" />
                <h1 className="text-3xl font-bold text-white">
                    KOL Analytics Platform
                </h1>
            </div>
        </header>
    );
};

export default Header;