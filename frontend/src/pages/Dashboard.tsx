// frontend/src/pages/Dashboard.tsx - FINAL MANDATORY UPDATE FOR STEP 3A

import React from 'react';
import StatCard from '../components/ui/StatCard';
import CountryBarChart from '../components/visualizations/CountryBarChart';
import { useKolData } from '../hooks/useKolData'; // Import hook
import Card from '../components/ui/Card';
import Layout from '../components/layouts/Layout';

const Dashboard: React.FC = () => {

    // Use the custom hook to access global state
    const { stats, filteredKols, isLoading, error } = useKolData();

    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (isLoading || !stats) return <p>Loading...</p>; // Placeholder for LoadingSpinner

    const formatNumber = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const formatHIndex = (num: number) => num.toFixed(2);

    // Data for the chart is now derived from the global context/stats
    const chartData = stats.topCountries;

    return (
        <Layout>
            <div className="space-y-8">

                {/* StatCards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total KOLs"
                        value={formatNumber(stats.totalKols)}
                        icon="users"
                    />
                    <StatCard
                        title="Total Publications"
                        value={formatNumber(stats.totalPublications)}
                        icon="publications"
                    />
                    <StatCard
                        title="Average H-Index"
                        value={formatHIndex(stats.averageHIndex)}
                        icon="hindex"
                        trend={{ value: 1.5, isPositive: true }}
                    />
                    <StatCard
                        title="Countries Represented"
                        value={formatNumber(stats.countriesRepresented)}
                        icon="countries"
                    />
                </div>

                {/* D3 Chart - Now using context data */}
                <Card>
                    <h2 className="text-xl font-semibold text-text-dark">KOL Distribution by Country</h2>
                    <p className="text-sm text-gray-500 mb-4">Top 10 countries by number of Key Opinion Leaders (Filtered: {filteredKols.length}).</p>
                    <div className="w-full">
                        <CountryBarChart data={chartData} />
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;