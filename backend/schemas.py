from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PredictionRequest(BaseModel):
    text:  str  = Field(..., min_length=20, max_length=5000)
    model: str  = Field(default='roberta-base',
                        pattern='^(roberta-base|bert-base|distilbert-base)$')

class PredictionResponse(BaseModel):
    prediction:       str
    confidence:       float
    model_used:       str
    analysed_at:      datetime
    token_count:      Optional[int]   = None
    processing_time_ms: Optional[float] = None

class HistoryItem(BaseModel):
    id:          str
    input_text:  str
    prediction:  str
    confidence:  float
    model_used:  str
    created_at:  datetime
