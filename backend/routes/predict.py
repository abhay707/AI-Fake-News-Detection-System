from fastapi import APIRouter, HTTPException
from schemas import PredictionRequest, PredictionResponse
from services import model_service, db_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix='/api', tags=['prediction'])

@router.post('/predict', response_model=PredictionResponse)
async def predict_news(req: PredictionRequest):
    try:
        result = model_service.predict(req.text, req.model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    try:
        db_service.save_prediction(req.text, result)
    except Exception as e:
        logger.warning(f"DB save failed (non-fatal): {e}")
        
    return result
