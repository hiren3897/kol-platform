import type { KOL, OverviewStats } from "../types/kol.types";

const BASE_URL = 'http://127.0.0.1:8000/api/kols'; 

async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.detail || `API call failed with status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const fetchAllKols = async (): Promise<KOL[]> => {
  // FastAPI endpoint: GET /api/kols/
  const response = await fetchData<{ data: KOL[], total: number }>('/');
  return response.data;
};

export const fetchKolStats = async (): Promise<OverviewStats> => {
  // FastAPI endpoint: GET /api/kols/stats/overview
  const rawStats = await fetchData<any>('/stats/overview');
  
  // Map snake_case keys from Python to camelCase in TypeScript model (if necessary)
  // Our Pydantic models already use aliases, so direct mapping should mostly work.
  // We explicitly handle the top-level keys for safety:
  const mappedStats: OverviewStats = {
    totalKols: rawStats.total_kols,
    totalPublications: rawStats.total_publications,
    averageHIndex: rawStats.average_h_index,
    countriesRepresented: rawStats.countries_represented,
    topCountries: rawStats.top_countries,
    // Note: expertise_distribution's keys are handled by Pydantic aliases
    expertiseDistribution: rawStats.expertise_distribution.map((item: any) => ({
        area: item.area,
        count: item.count,
        averageHIndex: item.average_h_index,
        averagePublications: item.average_publications,
    })),
  };

  return mappedStats;
};