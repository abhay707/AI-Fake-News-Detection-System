# services/model_service.py
import os
import time
from config import settings
from datetime import datetime, timezone

_tokenizers = {}
_models     = {}

MODEL_MAP = {
    'roberta-base':    'roberta-base-fake-news',
    'bert-base':       'bert-base-fake-news',
    'distilbert-base': 'distilbert-base-fake-news',
}

def _load(model_id: str):
    # Only imported here — never runs in mock/development mode
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch

    if model_id not in _models:
        path = os.path.join(settings.model_path, MODEL_MAP[model_id])
        _tokenizers[model_id] = AutoTokenizer.from_pretrained(path)
        _models[model_id]     = AutoModelForSequenceClassification.from_pretrained(path)
        _models[model_id].eval()

def _approx_token_count(text: str) -> int:
    """Approximate RoBERTa token count: ~1.3 tokens per word, capped at 512."""
    word_count = len(text.split())
    return min(512, round(word_count * 1.3))

def predict(text: str, model_id: str = 'roberta-base') -> dict:
    t_start = time.perf_counter()

    if settings.environment == 'development':
        import random
        elapsed = (time.perf_counter() - t_start) * 1000
        return {
            'prediction':        'FAKE' if random.random() > 0.5 else 'REAL',
            'confidence':        round(random.uniform(0.7, 0.99), 4),
            'model_used':        f'{model_id}-mock',
            'analysed_at':       datetime.now(timezone.utc),
            'token_count':       _approx_token_count(text),
            'processing_time_ms': round(elapsed, 1),
        }

    # Only reached in production with real models
    try:
        _load(model_id)
        tok = _tokenizers[model_id]
        mdl = _models[model_id]
    except (ImportError, OSError) as e:
        print(f"Warning: ML models not ready or missing dependencies ({e}). Falling back to mock prediction.")
        import random
        elapsed = (time.perf_counter() - t_start) * 1000
        return {
            'prediction':        'FAKE' if random.random() > 0.5 else 'REAL',
            'confidence':        round(random.uniform(0.7, 0.99), 4),
            'model_used':        f'{model_id}-mock-fallback',
            'analysed_at':       datetime.now(timezone.utc),
            'token_count':       _approx_token_count(text),
            'processing_time_ms': round(elapsed, 1),
        }

    import torch

    inputs = tok(text, return_tensors='pt',
                 truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        logits = mdl(**inputs).logits
    probs  = torch.softmax(logits, dim=1)[0]
    label  = 'FAKE' if probs[1] > probs[0] else 'REAL'
    conf   = float(probs[1] if label == 'FAKE' else probs[0])
    tokens = int(inputs['input_ids'].shape[1])
    elapsed = (time.perf_counter() - t_start) * 1000

    return {
        'prediction':        label,
        'confidence':        round(conf, 4),
        'model_used':        model_id,
        'analysed_at':       datetime.now(timezone.utc),
        'token_count':       tokens,
        'processing_time_ms': round(elapsed, 1),
    }