import React, { useState, useMemo, useCallback } from 'react';
import { mockKolData } from '../data/mockKolData';
import { calculateOverviewStats } from '../utils/dataProcessing';
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
    const [kols] = useState<KOL[]>(mockKolData);

    const [filters, setFilters] = useState<KolFilterState>(initialFilters);

    const [isLoading, setIsLoading] = useState(false);
    const [error] = useState<string | null>(null);


    const filteredKols = useMemo(() => {
        let result = kols;

        if (filters.searchTerm) {
            const lowerCaseSearch = filters.searchTerm.toLowerCase();
            result = result.filter(kol =>
                kol.name.toLowerCase().includes(lowerCaseSearch) ||
                kol.affiliation.toLowerCase().includes(lowerCaseSearch)
            );
        }

        if (filters.countries.length > 0) {
            result = result.filter(kol => filters.countries.includes(kol.country));
        }

        if (filters.expertiseAreas.length > 0) {
            result = result.filter(kol => filters.expertiseAreas.includes(kol.expertiseArea));
        }

        if (filters.minPublications !== null) {
            result = result.filter(kol => kol.publicationsCount >= filters.minPublications!);
        }
        if (filters.maxPublications !== null) {
            result = result.filter(kol => kol.publicationsCount <= filters.maxPublications!);
        }

        return result;
    }, [kols, filters]);


    const stats: OverviewStats = useMemo(() => {
        return calculateOverviewStats(filteredKols);
    }, [filteredKols]);

    const updateFilters = useCallback((newFilters: Partial<KolFilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    const fetchKols = useCallback(async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        setIsLoading(false);
    }, []);

    const refetchStats = useCallback(async () => {
        return;
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
        refetchStats,
    };

    return (
        <KolContext.Provider value={contextValue}>
            {children}
        </KolContext.Provider>
    );
};