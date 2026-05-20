import os
import time
from datetime import datetime, timezone
import logging
from config import settings

logger = logging.getLogger(__name__)

_models = {}
_tokenizers = {}

MODEL_MAP = {
    'roberta-base': 'roberta-base-fake-news',
}

# HuggingFace model used when local weights aren't available.
# DistilBERT fine-tuned on fake news detection: LABEL_0=FAKE, LABEL_1=REAL.
HF_FALLBACK_REPO = "Pulk17/Fake-News-Detection"


def _load(model_id: str):
    from transformers import AutoTokenizer, AutoModelForSequenceClassification

    if model_id in _models:
        return

    folder_name = MODEL_MAP[model_id]
    model_path = os.path.join(settings.model_path, folder_name)
    has_local_weights = (
        os.path.exists(os.path.join(model_path, 'model.safetensors'))
        or os.path.exists(os.path.join(model_path, 'pytorch_model.bin'))
    )

    if has_local_weights:
        logger.info(f"Loading local weights for {model_id} from {model_path}")
        _tokenizers[model_id] = AutoTokenizer.from_pretrained(model_path)
        _models[model_id] = AutoModelForSequenceClassification.from_pretrained(model_path)
    else:
        logger.info(f"Local weights not found. Loading {HF_FALLBACK_REPO} from HuggingFace Hub.")
        _tokenizers[model_id] = AutoTokenizer.from_pretrained(HF_FALLBACK_REPO)
        _models[model_id] = AutoModelForSequenceClassification.from_pretrained(HF_FALLBACK_REPO)

    _models[model_id].eval()


def _approx_token_count(text: str) -> int:
    word_count = len(text.split())
    return min(512, round(word_count * 1.3))


def predict(text: str, model_id: str = 'roberta-base') -> dict:
    t_start = time.perf_counter()

    if model_id not in MODEL_MAP:
        raise ValueError(
            f"Model '{model_id}' is not available. Only 'roberta-base' is currently active."
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

    # Label mapping for hamzab/roberta-fake-news-classification
    # VERIFY THIS BEFORE TRUSTING: run the sanity check in the next step.
    # The model's config.id2label is the source of truth.
    id2label = model.config.id2label
    raw_label = id2label[predicted_idx]

    # Map common label formats to our standard FAKE/REAL output
    label_upper = raw_label.upper()
    if label_upper in ("LABEL_0", "FAKE", "0"):
        prediction = "FAKE"
    elif label_upper in ("LABEL_1", "REAL", "TRUE", "1"):
        prediction = "REAL"
    else:
        # Unexpected label — log and default based on index
        logger.warning(f"Unexpected label '{raw_label}' from model. Defaulting on index.")
        prediction = "FAKE" if predicted_idx == 0 else "REAL"

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