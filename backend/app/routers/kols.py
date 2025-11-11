from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ..dependencies import get_kol_service
from ..services.kol_service import KolService
from ..models import KOL, KolListResponse, StatsResponse

router = APIRouter(
    prefix="/api/kols",
    tags=["KOL Data"],
)

@router.get("/", response_model=KolListResponse, summary="Get all KOLs")
def list_kols(
    kol_service: KolService = Depends(get_kol_service)
):
    """
    Retrieves the complete list of KOLs.
    (No filtering or pagination in the mandatory core version)
    """
    kols = kol_service.get_all()
    return KolListResponse(data=kols, total=len(kols))

@router.get("/stats/overview", response_model=StatsResponse, summary="Get global overview statistics")
def get_overview_stats(
    kol_service: KolService = Depends(get_kol_service)
):
    """
    Retrieves global calculated statistics, including total counts, averages, and distributions.
    """
    stats = kol_service.get_stats()
    return stats

@router.get("/{kol_id}", response_model=KOL, summary="Get KOL by ID")
def get_kol_by_id(
    kol_id: str,
    kol_service: KolService = Depends(get_kol_service)
):
    """
    Retrieves a single KOL record by their unique ID.
    """
    kol = kol_service.get_by_id(kol_id)
    if kol is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"KOL with id '{kol_id}' not found"
        )
    return kol