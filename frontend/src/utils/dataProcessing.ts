import type { KOL, OverviewStats, CountryData, ExpertiseData } from "../types/kol.types";


/**
 * Data Analysis Task Answer:
 * 1. Total Number of Unique Countries: 24
 * 2. Expertise Area with Highest Average H-Index: Both Pigmentation Disorders and Skin Immunology, 
 * with an average H-Index of ≈39.57.
 */

// Utility function to safely calculate the average
const calculateAverage = (sum: number, count: number): number => {
    return count === 0 ? 0 : parseFloat((sum / count).toFixed(2));
};

/**
 * processes a list of KOLs to calculate global statistics for the OverviewStats card and charts.
 */
export const calculateOverviewStats = (kols: KOL[]): OverviewStats => {
    if (kols.length === 0) {
        return {
            totalKols: 0,
            totalPublications: 0,
            averageHIndex: 0,
            countriesRepresented: 0,
            topCountries: [],
            expertiseDistribution: [],
        };
    }

    const totalKols = kols.length;
    let totalPublications = 0;
    let totalHIndex = 0;
    
    // grouping for aggregated data
    const countryMap = new Map<string, number>();
    const expertiseMap = new Map<string, { count: number, totalHIndex: number, totalPublications: number }>();

    for (const kol of kols) {
        totalPublications += kol.publicationsCount;
        totalHIndex += kol.hIndex;

        // country data
        countryMap.set(kol.country, (countryMap.get(kol.country) || 0) + 1);

        // expertise data
        const area = kol.expertiseArea;
        const currentData = expertiseMap.get(area) || { count: 0, totalHIndex: 0, totalPublications: 0 };
        expertiseMap.set(area, {
            count: currentData.count + 1,
            totalHIndex: currentData.totalHIndex + kol.hIndex,
            totalPublications: currentData.totalPublications + kol.publicationsCount,
        });
    }

    // Global Averages
    const averageHIndex = calculateAverage(totalHIndex, totalKols);
    const countriesRepresented = countryMap.size;

    //Country Distribution (Top 10)
    const countryArray: CountryData[] = Array.from(countryMap.entries()).map(([country, count]) => ({
        country,
        count,
        percentage: calculateAverage(count * 100, totalKols),
    }));
    const topCountries = countryArray
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // t op 10 for the chart

    // Expertise Distribution
    const expertiseDistribution: ExpertiseData[] = Array.from(expertiseMap.entries()).map(([area, data]) => ({
        area,
        count: data.count,
        averageHIndex: calculateAverage(data.totalHIndex, data.count),
        averagePublications: calculateAverage(data.totalPublications, data.count),
    }));

    return {
        totalKols,
        totalPublications,
        averageHIndex,
        countriesRepresented,
        topCountries,
        expertiseDistribution: expertiseDistribution.sort((a, b) => b.count - a.count),
    };
};