import os
import time
from datetime import datetime, timezone
import logging
from config import settings

logger = logging.getLogger(__name__)

_models = {}
_tokenizers = {}

# Map frontend model_id → HuggingFace repo name
MODEL_REPO = {
    'roberta-base':    'Pulk17/Fake-News-Detection',
    'bert-base':       'jy46604790/Fake-News-Bert-Detect',
    'distilbert-base': 'mrm8488/bert-tiny-finetuned-fake-news-detection',
}

# Map frontend model_id → label inversion flag.
# False = LABEL_0 is FAKE, LABEL_1 is REAL (the natural mapping)
# True  = LABEL_0 is REAL, LABEL_1 is FAKE (flipped)
# Set empirically after testing. Start with False, flip if predictions are inverted.
LABEL_FLIPPED = {
    'roberta-base':    False,  # Verified working tonight
    'bert-base':       False,  # To verify
    'distilbert-base': True,  # To verify
}


def _load(model_id: str):
    from transformers import AutoTokenizer, AutoModelForSequenceClassification

    if model_id in _models:
        return

    if model_id not in MODEL_REPO:
        raise ValueError(f"Unknown model_id: {model_id}")

    hf_repo = MODEL_REPO[model_id]
    logger.info(f"Loading {hf_repo} for {model_id} from HuggingFace Hub.")
    _tokenizers[model_id] = AutoTokenizer.from_pretrained(hf_repo)
    _models[model_id] = AutoModelForSequenceClassification.from_pretrained(hf_repo)
    _models[model_id].eval()


def _approx_token_count(text: str) -> int:
    word_count = len(text.split())
    return min(512, round(word_count * 1.3))


def predict(text: str, model_id: str = 'roberta-base') -> dict:
    t_start = time.perf_counter()

    if model_id not in MODEL_REPO:
        raise ValueError(
            f"Model '{model_id}' is not available. "
            f"Choose from: {list(MODEL_REPO.keys())}"
        )

    _load(model_id)
    tokenizer = _tokenizers[model_id]
    model = _models[model_id]

    inputs = tokenizer(
        text,
        truncation=True,
        max_length=512,
        padding=True,
        return_tensors='pt',
    )

    import torch
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

    probs = torch.softmax(logits, dim=1)
    confidence = torch.max(probs).item()
    predicted_idx = torch.argmax(probs).item()

    # Apply per-model label direction
    flipped = LABEL_FLIPPED[model_id]
    if not flipped:
        # LABEL_0 = FAKE, LABEL_1 = REAL
        prediction = "FAKE" if predicted_idx == 0 else "REAL"
    else:
        # Inverted
        prediction = "REAL" if predicted_idx == 0 else "FAKE"

    tokens = int(inputs['input_ids'].shape[1])
    elapsed = (time.perf_counter() - t_start) * 1000

    return {
        'prediction': prediction,
        'confidence': round(float(confidence), 4),
        'model_used': model_id,
        'analysed_at': datetime.now(timezone.utc),
        'token_count': tokens,
        'processing_time_ms': round(elapsed, 1),
    }