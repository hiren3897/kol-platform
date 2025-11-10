// frontend/src/pages/Dashboard.tsx

import React, { useMemo } from 'react';
import StatCard from '../components/ui/StatCard';
import { mockKolData } from '../data/mockKolData';
import { calculateOverviewStats } from '../utils/dataProcessing';
import Layout from '../components/layouts/Layout';

// NOTE: This will be migrated to use Context API (Step 3) 
// and the API (Step 5), but for Step 1, we use mock data directly.

const Dashboard: React.FC = () => {

    // Calculate initial stats from mock data
    const stats = useMemo(() => calculateOverviewStats(mockKolData), []);

    // For display formatting
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
                        // Example trend (static for now)
                        trend={{ value: 1.5, isPositive: true }}
                    />
                    <StatCard
                        title="Countries Represented"
                        value={formatNumber(stats.countriesRepresented)}
                        icon="countries"
                    />
                </div>

                {/* Placeholder for D3 Chart (Step 2A) */}
                <div className="p-4 rounded-xl border border-gray-200">
                    <h2 className="text-xl font-semibold text-text-dark mb-4">KOL Distribution by Country (D3 Chart Placeholder)</h2>
                    <p className="text-gray-500">The interactive D3 Bar Chart will be rendered here in **Step 2A**.</p>
                    {/* <CountryBarChart data={stats.topCountries} /> */}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;