import time
from datetime import datetime, timezone
import logging
import requests
from config import settings

logger = logging.getLogger(__name__)

MODEL_MAP = {
    'roberta-base': 'roberta-base-fake-news',
}

# HuggingFace Inference API endpoint
HF_MODEL_ID = "Pulk17/Fake-News-Detection"
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL_ID}"


def _approx_token_count(text: str) -> int:
    word_count = len(text.split())
    return min(512, round(word_count * 1.3))


def predict(text: str, model_id: str = 'roberta-base') -> dict:
    t_start = time.perf_counter()

    if model_id not in MODEL_MAP:
        raise ValueError(
            f"Model '{model_id}' is not available. Only 'roberta-base' is currently active."
        )

    headers = {
        "Authorization": f"Bearer {settings.hf_api_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": text[:2000],  # truncate to be safe
        "options": {"wait_for_model": True},
    }

    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"HuggingFace API call failed: {e}")
        raise RuntimeError(f"Inference service unavailable: {e}")

    # HF API returns: [[{"label": "LABEL_0", "score": 0.9}, {"label": "LABEL_1", "score": 0.1}]]
    # We pick the top scoring label.
    if isinstance(data, list) and len(data) > 0 and isinstance(data[0], list):
        scores = data[0]
        top = max(scores, key=lambda x: x["score"])
        raw_label = top["label"]
        confidence = float(top["score"])
    else:
        logger.error(f"Unexpected HF API response: {data}")
        raise RuntimeError(f"Unexpected response format from inference service")

    # Map label to FAKE / REAL
    label_upper = raw_label.upper()
    if label_upper in ("LABEL_0", "FAKE", "0"):
        prediction = "FAKE"
    elif label_upper in ("LABEL_1", "REAL", "TRUE", "1"):
        prediction = "REAL"
    else:
        logger.warning(f"Unexpected label '{raw_label}' from HF API.")
        prediction = "FAKE" if "0" in raw_label else "REAL"

    elapsed = (time.perf_counter() - t_start) * 1000

    return {
        'prediction': prediction,
        'confidence': round(confidence, 4),
        'model_used': model_id,
        'analysed_at': datetime.now(timezone.utc),
        'token_count': _approx_token_count(text),
        'processing_time_ms': round(elapsed, 1),
    }