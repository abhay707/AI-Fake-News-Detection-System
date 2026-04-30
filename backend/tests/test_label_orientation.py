from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import os

# Update to use the correct absolute or relative path from this script location
model_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'bert-base-fake-news')

tok = AutoTokenizer.from_pretrained(model_dir)
mdl = AutoModelForSequenceClassification.from_pretrained(model_dir)
mdl.eval()

# These are VERY obviously fake/real — if the model is trained,
# the probabilities should be lopsided in a predictable direction
tests = [
    ("The earth is flat and NASA is a government conspiracy to hide the truth from citizens worldwide.", "SHOULD BE FAKE"),
    ("Water boils at 100 degrees Celsius at standard atmospheric pressure.", "SHOULD BE REAL"),
    ("BREAKING: Drinking bleach cures cancer, doctors are hiding this secret from the public.", "SHOULD BE FAKE"),
    ("The United Nations was founded in 1945 after the end of World War II.", "SHOULD BE REAL"),
]

print("\n=== LABEL ORIENTATION TEST ===")
print(f"{'Text':<60} {'idx0_prob':>10} {'idx1_prob':>10} {'hint'}")
print("-" * 95)

for text, hint in tests:
    inputs = tok(text, return_tensors='pt', truncation=True, max_length=512)
    with torch.no_grad():
        logits = mdl(**inputs).logits
    probs = torch.softmax(logits, dim=1)[0]
    print(f"{text[:58]:<60} {float(probs[0]):>10.4f} {float(probs[1]):>10.4f}  ← {hint}")

print("\nCONCLUSION:")
print("If idx1_prob is HIGH for SHOULD BE FAKE rows → FAKE=1 (current assumption is correct)")
print("If idx0_prob is HIGH for SHOULD BE FAKE rows → FAKE=0 (need to flip the index)")
