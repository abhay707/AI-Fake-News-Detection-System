from fastapi import APIRouter
from schemas import HistoryItem
from services import db_service

router = APIRouter(prefix='/api', tags=['history'])

@router.get('/history', response_model=list[HistoryItem])
async def get_history():
    return db_service.get_history(limit=50)
