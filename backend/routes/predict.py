from fastapi import APIRouter, HTTPException
from schemas import PredictionRequest, PredictionResponse
from services import model_service, db_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix='/api', tags=['prediction'])

# Endpoint to predict whether news text is fake or real.
@router.post('/predict', response_model=PredictionResponse)
async def predict_news(req: PredictionRequest):
    try:
        # Perform inference using the requested model
        result = model_service.predict(req.text, req.model)
        
        # Save the result to the history database
        try:
            db_service.save_prediction(req.text, result)
        except Exception as e:
            logger.warning(f"Database preservation failed (non-fatal): {e}")
            
        return result
        
    except ValueError as e:
        # Raise 400 for model availability or input validation issues
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Raise 500 for general system errors
        logger.error(f"Prediction system error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
