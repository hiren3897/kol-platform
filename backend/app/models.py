from typing import List, Optional
from pydantic import BaseModel, Field, field_validator, ValidationError

class KOL(BaseModel):
    """Pydantic model for a Key Opinion Leader (KOL), used for parsing and responses."""
    id: str
    name: str = Field(..., min_length=1)
    affiliation: str
    country: str
    city: Optional[str]
    expertise_area: str = Field(..., alias="expertiseArea")
    publications_count: int = Field(..., ge=0, alias="publicationsCount")
    h_index: int = Field(..., ge=0, alias="hIndex")
    citations: int = Field(..., ge=0)

    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name must not be empty or whitespace.')
        return v
    
    class Config:
        # Allows mapping camelCase (from data) to snake_case (in Python model)
        populate_by_name = True 
        from_attributes = True


# --- Aggregation Models (for Detailed Stats) ---

class CountryData(BaseModel):
    country: str
    count: int
    percentage: float
    
class ExpertiseData(BaseModel):
    area: str
    count: int
    average_h_index: float = Field(..., alias="averageHIndex")
    average_publications: float = Field(..., alias="averagePublications")
    
    class Config:
        populate_by_name = True 
        from_attributes = True

# --- Response Models ---

class KolListResponse(BaseModel):
    """Response model for the list of KOLs endpoint."""
    data: List[KOL]
    total: int

class StatsResponse(BaseModel):
    """Response model for basic overview statistics."""
    total_kols: int = Field(..., ge=0)
    total_publications: int = Field(..., ge=0)
    average_h_index: float = Field(..., ge=0)
    countries_represented: int = Field(..., ge=0)
    top_countries: List[CountryData] = []
    expertise_distribution: List[ExpertiseData] = []