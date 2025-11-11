import os
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings using pydantic-settings for configuration."""
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        extra='ignore' # Ignore extra environment variables not defined here
    )

    APP_NAME: str = "KOL Data Platform API"
    DEBUG: bool = True
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Data path (relative to the backend/ directory)
    DATA_FILE_PATH: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'Vitiligo_kol_csv_29_07_2024_drug_and_kol_standardized.xlsx')

@lru_cache()
def get_settings():
    """Returns a cached, singleton instance of the Settings."""
    return Settings()