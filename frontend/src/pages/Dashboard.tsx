import React from 'react';
import StatCard from '../components/ui/StatCard';
import CountryBarChart from '../components/visualizations/CountryBarChart';
import { useKolData } from '../hooks/useKolData';
import Card from '../components/ui/Card';
import { FaSpinner } from 'react-icons/fa';
import Layout from '../components/layouts/Layout';

const Dashboard: React.FC = () => {

    const { stats, filteredKols, isLoading, error } = useKolData();

    const formatNumber = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const formatHIndex = (num: number) => num.toFixed(2);

    // --- Conditional Rendering for Loading/Error ---
    if (error) {
        return (
            <Layout>
                <Card className="p-10 text-center bg-red-100 border-red-400">
                    <h3 className="text-xl font-bold text-red-700">Error Loading Data</h3>
                    <p className="text-red-600 mt-2">{error}</p>
                    <p className="text-sm text-red-500 mt-1">Please ensure the FastAPI backend is running on http://127.0.0.1:8000.</p>
                </Card>
            </Layout>
        );
    }

    if (isLoading || !stats) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-64">
                    <FaSpinner className="w-8 h-8 text-primary-blue animate-spin-slow" />
                    <p className="mt-4 text-lg text-text-dark">Loading Analytics Data...</p>
                </div>
            </Layout>
        );
    }

    // Data for the chart *must* come from the backend's calculated stats
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

                {/* D3 Chart */}
                <Card>
                    <h2 className="text-xl font-semibold text-text-dark">KOL Distribution by Country</h2>
                    <p className="text-sm text-gray-500 mb-4">Top 10 countries by number of Key Opinion Leaders (Filtered count displayed: {filteredKols.length}).</p>
                    <div className="w-full">
                        <CountryBarChart data={chartData} />
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;