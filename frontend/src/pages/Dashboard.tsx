// frontend/src/pages/Dashboard.tsx - Updated

import React, { useMemo } from 'react';
import StatCard from '../components/ui/StatCard';
import { mockKolData } from '../data/mockKolData';
import { calculateOverviewStats } from '../utils/dataProcessing';
import CountryBarChart from '../components/visualizations/CountryBarChart'; // Import chart
import Layout from '../components/layouts/Layout';
import Card from '../components/ui/Card';

// NOTE: This will be migrated to use Context API (Step 3) 
// and the API (Step 5), but for Step 1/2A, we use mock data directly.

const Dashboard: React.FC = () => {

    const stats = useMemo(() => calculateOverviewStats(mockKolData), []);

    const formatNumber = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const formatHIndex = (num: number) => num.toFixed(2);

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

                {/* D3 Chart - Step 2A */}
                <Card>
                    <h2 className="text-xl font-semibold text-text-dark">KOL Distribution by Country</h2>
                    <p className="text-sm text-gray-500 mb-4">Top 10 countries by number of Key Opinion Leaders.</p>
                    <div className="w-full">
                        <CountryBarChart data={stats.topCountries} />
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;