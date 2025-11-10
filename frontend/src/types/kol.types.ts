// frontend/src/types/kol.types.ts

// ⚠️ Data Validation Task Answer:
// 1. KOL with Highest Citations-to-Publications Ratio:
//    Dr. Michael Chen (ID: 9) has the highest ratio (5789 citations / 118 publications ≈ 49.06).
//    Significance: A high ratio indicates high-impact work relative to the volume of output, suggesting Dr. Chen's papers are highly influential or seminal.
// 2. Potential Data Quality Issues (First 15 Entries):
//    - Inconsistent Title/Role: Mix of 'Dr.' and 'Prof.' prefixes, which might need standardization for uniform data processing.
//    - Expertise Granularity: Mix of broad ('Dermatology') and niche ('Vitiligo Research', 'Pigmentation Disorders') expertise areas.

export interface KOL {
    id: string;
    name: string;
    affiliation: string;
    country: string;
    city: string;
    expertiseArea: string;
    publicationsCount: number;
    hIndex: number;
    citations: number;
}

export interface CountryData {
    country: string;
    count: number;
    percentage: number;
}

export interface ExpertiseData {
    area: string;
    count: number;
    averageHIndex: number;
    averagePublications: number; 
}

export interface OverviewStats {
    totalKols: number;
    totalPublications: number;
    averageHIndex: number;
    countriesRepresented: number;
    topCountries: CountryData[]; 
    expertiseDistribution: ExpertiseData[];
}

// For Context API
export interface KolFilterState {
    searchTerm: string;
    countries: string[];
    expertiseAreas: string[];
    minPublications: number | null;
    maxPublications: number | null;
}

export interface KolContextType {
    kols: KOL[];
    filteredKols: KOL[];
    stats: OverviewStats | null;
    filters: KolFilterState;
    updateFilters: (newFilters: Partial<KolFilterState>) => void;
    clearFilters: () => void;
    isLoading: boolean;
    error: string | null;
    fetchKols: () => Promise<void>; 
    refetchStats: () => Promise<void>;
}