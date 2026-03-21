from fastapi import APIRouter, HTTPException
from schemas import PredictionRequest, PredictionResponse
from services import model_service, db_service

router = APIRouter(prefix='/api', tags=['prediction'])

@router.post('/predict', response_model=PredictionResponse)
async def predict_news(req: PredictionRequest):
    try:
        result = model_service.predict(req.text, req.model)
        db_service.save_prediction(req.text, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
