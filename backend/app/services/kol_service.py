from typing import Dict, List, Optional
from functools import lru_cache
from collections import defaultdict
import logging

from ..models import KOL, StatsResponse, CountryData, ExpertiseData
from ..utils.data_loader import load_kol_data, DataLoaderError

logging.basicConfig(level=logging.INFO)

class KolService:
    """Handles business logic related to KOL data."""
    
    def __init__(self, data_file_path: str):
        self._all_kols: List[KOL] = self._load_data(data_file_path)
        self._kol_map: Dict[str, KOL] = {kol.id: kol for kol in self._all_kols}
        
    def _load_data(self, file_path: str) -> List[KOL]:
        """Loads and parses data from the Excel file on startup."""
        try:
            return load_kol_data(file_path) # NEW CALL
        except DataLoaderError as e:
            logging.error(f"FATAL: Could not load KOL data: {e}")
            # If data loading fails, start with an empty list but log the error
            return []
    
    @staticmethod
    def _calculate_average(total: float, count: int) -> float:
        """Utility to safely calculate average."""
        return round(total / count, 2) if count > 0 else 0.0

    def get_all(self) -> List[KOL]:
        """Returns all loaded KOLs (no filtering/pagination in mandatory step)."""
        return self._all_kols

    def get_by_id(self, kol_id: str) -> Optional[KOL]:
        """Returns a single KOL by ID."""
        return self._kol_map.get(kol_id)

    def get_stats(self) -> StatsResponse:
        """Calculates and returns core and detailed statistics."""
        kols = self._all_kols
        if not kols:
            return StatsResponse(
                total_kols=0, total_publications=0, average_h_index=0, 
                countries_represented=0, top_countries=[], expertise_distribution=[]
            )

        total_kols = len(kols)
        total_publications = sum(kol.publications_count for kol in kols)
        total_h_index = sum(kol.h_index for kol in kols)

        country_counts = defaultdict(int)
        expertise_data = defaultdict(lambda: {'count': 0, 'h_index_sum': 0, 'publications_sum': 0})

        for kol in kols:
            country_counts[kol.country] += 1
            
            exp = expertise_data[kol.expertise_area]
            exp['count'] += 1
            exp['h_index_sum'] += kol.h_index
            exp['publications_sum'] += kol.publications_count

        # 1. Global Stats
        average_h_index = self._calculate_average(total_h_index, total_kols)
        countries_represented = len(country_counts)

        # 2. Country Distribution (Top 10)
        country_list: List[CountryData] = []
        for country, count in country_counts.items():
            country_list.append(CountryData(
                country=country,
                count=count,
                percentage=self._calculate_average(count * 100, total_kols)
            ))
        top_countries = sorted(country_list, key=lambda x: x.count, reverse=True)[:10]

        # 3. Expertise Distribution
        expertise_list: List[ExpertiseData] = []
        for area, data in expertise_data.items():
            expertise_list.append(ExpertiseData(
                area=area,
                count=data['count'],
                averageHIndex=self._calculate_average(data['h_index_sum'], data['count']),
                averagePublications=self._calculate_average(data['publications_sum'], data['count'])
            ))
        expertise_distribution = sorted(expertise_list, key=lambda x: x.count, reverse=True)

        return StatsResponse(
            total_kols=total_kols,
            total_publications=total_publications,
            average_h_index=average_h_index,
            countries_represented=countries_represented,
            top_countries=top_countries,
            expertise_distribution=expertise_distribution
        )