import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

MODELS_TO_TEST = [
    ('bert-base',       '../models/bert-base-fake-news'),
    ('distilbert-base', '../models/distilbert-base-fake-news'),
]

TEST_CASES = [
    ("NASA confirms water ice found on the Moon, enabling future lunar missions.", "REAL"),
    ("BREAKING: Scientists reveal 5G towers alter human DNA within 72 hours.", "FAKE"),
]

def test_model_load():
    for model_id, path in MODELS_TO_TEST:
        print(f"\n{'='*60}")
        print(f"Testing: {model_id}")
        print(f"Path: {path}")
        
        try:
            tok = AutoTokenizer.from_pretrained(path)
            mdl = AutoModelForSequenceClassification.from_pretrained(path)
            mdl.eval()
        except Exception as e:
            print(f"Failed to load model: {e}")
            continue

        print(f"id2label: {getattr(mdl.config, 'id2label', 'NOT SET')}")
        
        # Check classifier weight mean
        classifier_weight = None
        if hasattr(mdl, 'classifier'):
            if hasattr(mdl.classifier, 'weight'):
                classifier_weight = mdl.classifier.weight.detach()
            elif hasattr(mdl.classifier, 'out_proj') and hasattr(mdl.classifier.out_proj, 'weight'):
                classifier_weight = mdl.classifier.out_proj.weight.detach()
                
        if classifier_weight is not None:
            print(f"Classifier weight mean: {classifier_weight.abs().mean():.6f}")

        for text, expected in TEST_CASES:
            inputs = tok(text, return_tensors='pt',
                         truncation=True, max_length=512, padding=True)
            with torch.no_grad():
                logits = mdl(**inputs).logits
            probs = torch.softmax(logits, dim=1)[0]
            
            # Determine fake idx from id2label
            id2label = getattr(mdl.config, 'id2label', {})
            fake_idx = 0
            for idx, lbl in id2label.items():
                if str(lbl).upper() == 'FAKE':
                    fake_idx = int(idx)
            
            label = 'FAKE' if probs[fake_idx] > probs[1 - fake_idx] else 'REAL'
            conf = float(probs[fake_idx] if label == 'FAKE' else probs[1 - fake_idx])
            status = '✅' if label == expected else '❌'
            print(f"{status} [{expected}] → [{label}] {conf:.4f} | {text[:55]}...")

if __name__ == "__main__":
    # Script is run from `backend`
    test_model_load()
