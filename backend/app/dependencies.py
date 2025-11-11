from functools import lru_cache
from .config import get_settings
from .services.kol_service import KolService

@lru_cache()
def get_kol_service() -> KolService:
    """
    Returns a cached, singleton instance of KolService, ensuring data is loaded only once.
    """
    settings = get_settings()
    return KolService(data_file_path=settings.DATA_FILE_PATH)