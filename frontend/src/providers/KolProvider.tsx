import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { fetchAllKols, fetchKolStats } from '../api/kolApi';
import { KolContext } from '../context/KolContext';
import type { KolFilterState, KOL, OverviewStats, KolContextType } from '../types/kol.types';

const initialFilters: KolFilterState = {
    searchTerm: '',
    countries: [],
    expertiseAreas: [],
    minPublications: null,
    maxPublications: null,
};

export const KolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [kols, setKols] = useState<KOL[]>([]);
    const [stats, setStats] = useState<OverviewStats | null>(null);

    const [filters, setFilters] = useState<KolFilterState>(initialFilters);
    const [isLoading, setIsLoading] = useState(true); // Start loading immediately
    const [error, setError] = useState<string | null>(null);

    const fetchKolStatsData = useCallback(async () => {
        // This function can be called separately to refresh just the stats
        try {
            const statsData = await fetchKolStats();
            setStats(statsData);
        } catch (err) {
            console.error("Error fetching stats:", err);
            setError(`Failed to fetch stats: ${err.message!}`);
        }
    }, []);

    const fetchKols = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const kolsData = await fetchAllKols();
            setKols(kolsData);
            // Note: In the final filtered version (Bonus), we'd fetch filtered data here.

            // After fetching KOLs, fetch global stats (which depend on the full dataset)
            await fetchKolStatsData();

        } catch (err) {
            console.error("Error fetching KOL data:", err);
            setError(`Failed to fetch KOLs: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [fetchKolStatsData]);


    useEffect(() => {
        fetchKols();
    }, [fetchKols]);

    const filteredKols = useMemo(() => {

        let result = kols;

        if (filters.searchTerm) {
            const lowerCaseSearch = filters.searchTerm.toLowerCase();
            result = result.filter(kol =>
                kol.name.toLowerCase().includes(lowerCaseSearch) ||
                kol.affiliation.toLowerCase().includes(lowerCaseSearch)
            );
        }

        return result;
    }, [kols, filters]);


    const updateFilters = useCallback((newFilters: Partial<KolFilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);


    const contextValue: KolContextType = {
        kols,
        filteredKols,
        stats,
        filters,
        updateFilters,
        clearFilters,
        isLoading,
        error,
        fetchKols,
        refetchStats: fetchKolStatsData,
    };

    return (
        <KolContext.Provider value={contextValue}>
            {children}
        </KolContext.Provider>
    );
};