from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PredictionRequest(BaseModel):
    text: str = Field(..., min_length=20, max_length=5000)
    model: str = Field(default='roberta-base', pattern='^(roberta-base)$')

class PredictionResponse(BaseModel):
    prediction:  str
    confidence:  float
    model_used:  str
    analysed_at: datetime

class HistoryItem(BaseModel):
    id: str
    input_text: str
    prediction: str
    confidence: float
    model_used: str
    created_at: datetime

class SignupRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(...)
    password: str = Field(..., min_length=6)

class LoginRequest(BaseModel):
    email: str
    password: str

class UpdateUserRequest(BaseModel):
    name: str
    id: str
    image: str
