from fastapi import APIRouter
from schemas import HistoryItem
from services import db_service

router = APIRouter(prefix='/api', tags=['history'])

@router.get('/history', response_model=list[HistoryItem])
async def get_history():
    return db_service.get_history(limit=50)

@router.get('/debug/supabase')
async def debug_supabase():
    try:
        # Attempt to get the client and make a simple request
        client = db_service.get_client()
        res = client.table('predictions').select('id').limit(1).execute()
        return {"status": "connected", "detail": f"Successfully connected. Found {len(res.data)} test rows."}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
