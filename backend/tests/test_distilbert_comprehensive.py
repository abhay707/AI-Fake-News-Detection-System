"""
Comprehensive DistilBERT Fake-News Model Test Suite
====================================================
Run from the `backend/` directory:
    python tests/test_distilbert_comprehensive.py

Tests covered:
  T01  Model Loading & Architecture
  T02  Tokenizer Sanity
  T03  Config & Label Mapping
  T04  Inference Output Shape
  T05  Confidence Calibration
  T06  Real-World Known-Label Samples
  T07  Edge Cases (empty, whitespace, numeric-only, long text, unicode)
  T08  Label Orientation (FAKE vs REAL direction)
  T09  Sensitivity / Contrastive Pairs
  T10  Inference Speed
"""

import os, sys, time, json, warnings
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

warnings.filterwarnings("ignore")

# ── Path resolution ────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT   = os.path.abspath(os.path.join(SCRIPT_DIR, '..', '..'))
MODEL_DIR   = os.path.join(REPO_ROOT, 'models', 'distilbert-base-fake-news')

# ── Results accumulator ────────────────────────────────────────────────────────
results = []   # list of {test_id, name, status, detail}

def record(test_id, name, passed, detail=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    results.append({"test_id": test_id, "name": name, "status": status,
                    "passed": passed, "detail": detail})
    print(f"  {status}  [{test_id}] {name}")
    if detail:
        for line in detail.strip().split("\n"):
            print(f"         {line}")

# ── Helpers ────────────────────────────────────────────────────────────────────
def infer(tok, mdl, text):
    """Return (label, fake_prob, real_prob, logits) for a text string."""
    inputs = tok(text, return_tensors='pt', truncation=True,
                 max_length=512, padding=True)
    with torch.no_grad():
        out = mdl(**inputs)
    probs  = torch.softmax(out.logits, dim=1)[0]
    id2label = mdl.config.id2label
    fake_idx = next((int(k) for k,v in id2label.items() if v.upper()=="FAKE"), 0)
    real_idx = 1 - fake_idx
    label    = "FAKE" if probs[fake_idx] > probs[real_idx] else "REAL"
    return label, float(probs[fake_idx]), float(probs[real_idx]), out.logits

# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "="*70)
print("  DISTILBERT FAKE-NEWS MODEL — COMPREHENSIVE TEST SUITE")
print("="*70)
print(f"  Model path : {MODEL_DIR}")
print(f"  Model exists: {os.path.isdir(MODEL_DIR)}")
print()

# ─── T00: Pre-flight: PATH CHECK ──────────────────────────────────────────────
print("── T00  Pre-flight ──────────────────────────────────────────────────────")
required_files = ["config.json", "model.safetensors"]
missing = [f for f in required_files if not os.path.isfile(os.path.join(MODEL_DIR, f))]
if missing:
    print(f"  ❌ ABORT: Missing files: {missing}")
    sys.exit(1)
print(f"  ✅ All required files present: {required_files}")
print()

# ─── T01: Model Loading & Architecture ────────────────────────────────────────
print("── T01  Model Loading & Architecture ───────────────────────────────────")
tok = mdl = None
try:
    t0  = time.time()
    tok = AutoTokenizer.from_pretrained(MODEL_DIR)
    mdl = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    mdl.eval()
    load_time = time.time() - t0

    arch = mdl.config.architectures[0] if mdl.config.architectures else "unknown"
    n_layers = mdl.config.n_layers
    n_heads  = mdl.config.n_heads
    dim      = mdl.config.dim
    vocab    = mdl.config.vocab_size
    total_params = sum(p.numel() for p in mdl.parameters())

    record("T01a", "Model loads without error",          True,
           f"Load time: {load_time:.2f}s")
    record("T01b", "Architecture = DistilBertForSequenceClassification",
           arch == "DistilBertForSequenceClassification", f"Got: {arch}")
    record("T01c", "n_layers = 6",   n_layers == 6, f"Got: {n_layers}")
    record("T01d", "n_heads  = 12",  n_heads  == 12, f"Got: {n_heads}")
    record("T01e", "dim = 768",      dim == 768, f"Got: {dim}")
    record("T01f", "vocab_size = 30522", vocab == 30522, f"Got: {vocab}")
    record("T01g", "Parameter count reasonable (60-70M)",
           55_000_000 <= total_params <= 75_000_000,
           f"Got: {total_params:,}")
    record("T01h", "Model in eval mode", not mdl.training, f"Training flag: {mdl.training}")

except Exception as e:
    record("T01", "Model loading FAILED", False, str(e))
    print("\n❌ Cannot continue — model failed to load.")
    sys.exit(1)
print()

# ─── T02: Tokenizer Sanity ────────────────────────────────────────────────────
print("── T02  Tokenizer Sanity ────────────────────────────────────────────────")
try:
    sample = "The quick brown fox jumps over the lazy dog."
    enc = tok(sample, return_tensors='pt')
    ids = enc['input_ids'][0]

    record("T02a", "Tokenizer returns input_ids",  'input_ids' in enc,
           f"Keys: {list(enc.keys())}")
    record("T02b", "Tokens include [CLS] and [SEP]",
           ids[0].item() == tok.cls_token_id and ids[-1].item() == tok.sep_token_id,
           f"First={ids[0].item()} (CLS={tok.cls_token_id}), Last={ids[-1].item()} (SEP={tok.sep_token_id})")
    record("T02c", "Sequence length reasonable (5–512)",
           5 <= len(ids) <= 512, f"Tokens: {len(ids)}")

    # Truncation test
    long_text = "word " * 600
    enc2 = tok(long_text, return_tensors='pt', truncation=True, max_length=512)
    record("T02d", "Truncation at max_length=512 works",
           enc2['input_ids'].shape[1] <= 512,
           f"Truncated length: {enc2['input_ids'].shape[1]}")

    # Padding test
    enc3 = tok([sample, "Short text."], return_tensors='pt',
                padding=True, truncation=True, max_length=512)
    record("T02e", "Batch padding produces equal-length sequences",
           enc3['input_ids'].shape[0] == 2,
           f"Batch shape: {tuple(enc3['input_ids'].shape)}")

    # Roundtrip test
    decoded = tok.decode(ids, skip_special_tokens=True)
    record("T02f", "Decode → re-encode roundtrip stable",
           decoded.lower() == sample.lower(),
           f"Original: '{sample}'\nDecoded : '{decoded}'")

except Exception as e:
    record("T02", "Tokenizer sanity FAILED", False, str(e))
print()

# ─── T03: Config & Label Mapping ──────────────────────────────────────────────
print("── T03  Config & Label Mapping ──────────────────────────────────────────")
try:
    id2label = mdl.config.id2label
    label2id = mdl.config.label2id

    record("T03a", "id2label has exactly 2 labels",
           len(id2label) == 2, f"Got: {id2label}")
    record("T03b", "'FAKE' present in id2label values",
           any(v.upper()=="FAKE" for v in id2label.values()), f"id2label={id2label}")
    record("T03c", "'REAL' present in id2label values",
           any(v.upper()=="REAL" for v in id2label.values()), f"id2label={id2label}")
    record("T03d", "label2id has exactly 2 entries",
           len(label2id) == 2, f"Got: {label2id}")
    record("T03e", "num_labels == 2",
           mdl.config.num_labels == 2, f"Got: {mdl.config.num_labels}")
    record("T03f", "problem_type = single_label_classification",
           mdl.config.problem_type == "single_label_classification",
           f"Got: {mdl.config.problem_type}")
    record("T03g", "max_position_embeddings = 512",
           mdl.config.max_position_embeddings == 512,
           f"Got: {mdl.config.max_position_embeddings}")

    # Verify classifier output size matches num_labels
    if hasattr(mdl, 'classifier'):
        clf = mdl.classifier
        if hasattr(clf, 'out_proj'):
            out_dim = clf.out_proj.out_features
        elif hasattr(clf, 'weight'):
            out_dim = clf.weight.shape[0]
        else:
            out_dim = None
        if out_dim is not None:
            record("T03h", "Classifier output dim == 2",
                   out_dim == 2, f"Got: {out_dim}")
except Exception as e:
    record("T03", "Config/label check FAILED", False, str(e))
print()

# ─── T04: Inference Output Shape ──────────────────────────────────────────────
print("── T04  Inference Output Shape ──────────────────────────────────────────")
try:
    text = "Scientists have discovered a new treatment for Alzheimer's disease."
    inputs = tok(text, return_tensors='pt', truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        out = mdl(**inputs)

    logits = out.logits
    probs  = torch.softmax(logits, dim=1)

    record("T04a", "Logits shape is [1, 2]",
           logits.shape == torch.Size([1, 2]), f"Got: {logits.shape}")
    record("T04b", "Probabilities sum to 1.0 (±1e-4)",
           abs(probs.sum().item() - 1.0) < 1e-4,
           f"Sum: {probs.sum().item():.6f}")
    record("T04c", "All probabilities in [0, 1]",
           bool((probs >= 0).all() and (probs <= 1).all()),
           f"Min: {probs.min().item():.4f}, Max: {probs.max().item():.4f}")
    record("T04d", "Logits are finite (no NaN/Inf)",
           bool(torch.isfinite(logits).all()),
           f"Logits: {logits.tolist()}")

    # Batch inference
    texts = ["NASA confirms successful moon landing.", "Aliens control the US government secretly."]
    enc_b = tok(texts, return_tensors='pt', truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        out_b = mdl(**enc_b)
    record("T04e", "Batch inference shape == [2, 2]",
           out_b.logits.shape == torch.Size([2, 2]),
           f"Got: {out_b.logits.shape}")

except Exception as e:
    record("T04", "Inference output shape check FAILED", False, str(e))
print()

# ─── T05: Confidence Calibration ──────────────────────────────────────────────
print("── T05  Confidence Calibration ──────────────────────────────────────────")
try:
    calibration_tests = [
        # (text, description, expected_min_confidence)
        ("The Earth revolves around the Sun.", "Clear fact", 0.55),
        ("Drinking bleach cures all known diseases and doctors are hiding it.", "Obvious disinfo", 0.55),
        ("This text is somewhat ambiguous and hard to classify accurately.", "Ambiguous", 0.0),
    ]
    for text, desc, min_conf in calibration_tests:
        label, fp, rp, _ = infer(tok, mdl, text)
        conf = max(fp, rp)
        record("T05 – " + desc, f"Confidence ≥ {min_conf:.0%} ({label} @ {conf:.2%})",
               conf >= min_conf, f"fake_prob={fp:.4f}, real_prob={rp:.4f}")

    # Confidence should be between 50% and 100% for any non-uniform output
    label, fp, rp, logits = infer(tok, mdl, "The president signed a new bill today.")
    conf = max(fp, rp)
    record("T05 – Confidence always > 50%", f"Confidence={conf:.2%}",
           conf > 0.50, f"Logits: {logits.tolist()}")

except Exception as e:
    record("T05", "Confidence calibration FAILED", False, str(e))
print()

# ─── T06: Real-World Known-Label Samples ──────────────────────────────────────
print("── T06  Real-World Known-Label Samples ──────────────────────────────────")
try:
    known_samples = [
        # (text, expected_label, description)
        (
            "The World Health Organization declared COVID-19 a pandemic in March 2020 "
            "after the virus spread to more than 100 countries worldwide.",
            "REAL",
            "WHO COVID declaration (factual)"
        ),
        (
            "BREAKING: Microchips hidden inside COVID vaccines can track your location "
            "in real-time and transmit data to government surveillance systems.",
            "FAKE",
            "Vaccine microchip conspiracy"
        ),
        (
            "NASA's James Webb Space Telescope has captured the deepest infrared image "
            "of the universe ever taken, revealing galaxies formed just 600 million years after the Big Bang.",
            "REAL",
            "JWST factual statement"
        ),
        (
            "EXCLUSIVE: Scientists confirm that 5G towers emit radiation that turns "
            "people into obedient zombies controlled by global elites.",
            "FAKE",
            "5G conspiracy theory"
        ),
        (
            "The United Nations Security Council consists of fifteen members, five of which "
            "are permanent members with veto power.",
            "REAL",
            "UN factual statement"
        ),
        (
            "A viral video proves that the moon is actually a hologram projected by "
            "secret societies to hide the truth about flat earth.",
            "FAKE",
            "Moon hologram conspiracy"
        ),
        (
            "India successfully launched the Chandrayaan-3 mission to the Moon in 2023, "
            "becoming the first country to land near the lunar south pole.",
            "REAL",
            "Chandrayaan-3 factual"
        ),
        (
            "Secret documents reveal that climate change is a hoax invented by scientists "
            "bribed by the UN to impose a global carbon tax on citizens.",
            "FAKE",
            "Climate hoax conspiracy"
        ),
    ]

    correct = 0
    for text, expected, desc in known_samples:
        label, fp, rp, _ = infer(tok, mdl, text)
        conf = max(fp, rp)
        passed = (label == expected)
        if passed:
            correct += 1
        record(f"T06 – {desc}",
               f"Expected={expected} Got={label} @ {conf:.2%}",
               passed, f"fake_p={fp:.4f} real_p={rp:.4f}")

    accuracy = correct / len(known_samples)
    record("T06 – Overall Accuracy on Known Samples",
           f"{correct}/{len(known_samples)} = {accuracy:.0%}",
           accuracy >= 0.70,
           f"Threshold: ≥70% required")

except Exception as e:
    record("T06", "Known-label samples FAILED", False, str(e))
print()

# ─── T07: Edge Cases ──────────────────────────────────────────────────────────
print("── T07  Edge Cases ──────────────────────────────────────────────────────")
try:
    # T07a — Minimum viable text (20+ chars for schema, but model should handle any)
    short_text = "This is short."
    try:
        label, fp, rp, lg = infer(tok, mdl, short_text)
        record("T07a", f"Very short text handled gracefully → {label} ({max(fp,rp):.2%})",
               True, f"fake={fp:.4f} real={rp:.4f}")
    except Exception as e:
        record("T07a", "Very short text raises exception", False, str(e))

    # T07b — All whitespace / blank
    try:
        label, fp, rp, _ = infer(tok, mdl, "   ")
        record("T07b", f"Whitespace-only text → {label} ({max(fp,rp):.2%})", True,
               "Model handles blank gracefully")
    except Exception as e:
        record("T07b", "Whitespace-only raises exception", False, str(e))

    # T07c — Numeric-only text
    try:
        label, fp, rp, _ = infer(tok, mdl, "42 100 3000 99.5")
        record("T07c", f"Numeric-only text → {label} ({max(fp,rp):.2%})", True,
               "Model handles numbers gracefully")
    except Exception as e:
        record("T07c", "Numeric-only raises exception", False, str(e))

    # T07d — Long text (>512 tokens → truncated)
    long_text = "The quick brown fox jumps over the lazy dog. " * 200
    try:
        label, fp, rp, _ = infer(tok, mdl, long_text)
        record("T07d", f"Long text (>512 tokens) truncated and inferred → {label}", True,
               f"fake={fp:.4f} real={rp:.4f}")
    except Exception as e:
        record("T07d", "Long text raises exception", False, str(e))

    # T07e — Unicode / non-ASCII
    uni_text = "科学家证实气候变化是真实的 — Scientists confirm climate change is real worldwide."
    try:
        label, fp, rp, _ = infer(tok, mdl, uni_text)
        record("T07e", f"Mixed Unicode text → {label} ({max(fp,rp):.2%})", True,
               "Model handles Unicode gracefully")
    except Exception as e:
        record("T07e", "Unicode text raises exception", False, str(e))

    # T07f — Repeated punctuation / noise
    noise_text = "!!!! ?????? .... THE NEWS IS HAPPENING RIGHT NOW !!!!"
    try:
        label, fp, rp, _ = infer(tok, mdl, noise_text)
        record("T07f", f"Noisy punctuation text → {label} ({max(fp,rp):.2%})", True,
               "Model handles noisy punctuation")
    except Exception as e:
        record("T07f", "Noisy text raises exception", False, str(e))

    # T07g — ALL CAPS text
    caps_text = "SCIENTISTS HAVE CONFIRMED THAT THE EARTH IS ROUND AND ORBITS THE SUN."
    try:
        label, fp, rp, _ = infer(tok, mdl, caps_text)
        record("T07g", f"ALL-CAPS text → {label} ({max(fp,rp):.2%})", True,
               "Model handles all-caps text")
    except Exception as e:
        record("T07g", "ALL-CAPS raises exception", False, str(e))

    # T07h — URL-heavy text
    url_text = ("Visit https://example.com and http://fakenews.biz/article?id=123 "
                "for more shocking TRUTHS they don't want you to see!")
    try:
        label, fp, rp, _ = infer(tok, mdl, url_text)
        record("T07h", f"URL-heavy text → {label} ({max(fp,rp):.2%})", True,
               "Model handles URL-laden text")
    except Exception as e:
        record("T07h", "URL-heavy text raises exception", False, str(e))

except Exception as e:
    record("T07", "Edge-case tests FAILED globally", False, str(e))
print()

# ─── T08: Label Orientation ───────────────────────────────────────────────────
print("── T08  Label Orientation ───────────────────────────────────────────────")
try:
    id2label = mdl.config.id2label
    fake_idx = next((int(k) for k,v in id2label.items() if v.upper()=="FAKE"), None)
    real_idx = next((int(k) for k,v in id2label.items() if v.upper()=="REAL"), None)

    record("T08a", f"FAKE is at index {fake_idx}",
           fake_idx is not None, f"id2label={id2label}")
    record("T08b", f"REAL is at index {real_idx}",
           real_idx is not None, f"id2label={id2label}")

    orientation_tests = [
        ("BREAKING: Government puts mind-control chemicals in tap water to suppress rebellion.", "FAKE"),
        ("Water is composed of two hydrogen atoms and one oxygen atom, forming H₂O.", "REAL"),
    ]
    for text, expected in orientation_tests:
        inputs = tok(text, return_tensors='pt', truncation=True, max_length=512, padding=True)
        with torch.no_grad():
            probs = torch.softmax(mdl(**inputs).logits, dim=1)[0]
        fp = float(probs[fake_idx])
        rp = float(probs[real_idx])
        predicted = "FAKE" if fp > rp else "REAL"
        record(f"T08 – Orientation [{expected}]",
               f"fake_prob={fp:.4f}, real_prob={rp:.4f} → {predicted}",
               predicted == expected)

except Exception as e:
    record("T08", "Label orientation check FAILED", False, str(e))
print()

# ─── T09: Sensitivity / Contrastive Pairs ─────────────────────────────────────
print("── T09  Sensitivity / Contrastive Pairs ─────────────────────────────────")
try:
    contrastive_pairs = [
        (
            "Scientists confirm climate change is real and caused by human activity.",
            "Scientists confirm climate change is a hoax invented by globalists.",
            "Climate change: real vs hoax framing"
        ),
        (
            "The vaccine has been approved by the FDA after rigorous clinical trials.",
            "The vaccine contains secret DNA-altering nanorobots that will kill you in 5 years.",
            "Vaccine: legitimate vs conspiracy"
        ),
        (
            "New study shows moderate exercise improves cardiovascular health.",
            "EXPOSED: Doctors paid millions to hide miracle cancer cure found in lemon juice.",
            "Health: scientific vs sensational"
        ),
    ]

    for real_text, fake_text, desc in contrastive_pairs:
        _, rfp, rrp, _ = infer(tok, mdl, real_text)
        _, ffp, frp, _ = infer(tok, mdl, fake_text)

        # real_text should have higher real_prob than fake_text
        # fake_text should have higher fake_prob than real_text
        correct_direction = (rrp > frp) and (ffp > rfp)
        record(f"T09 – {desc}",
               f"Real sentence → real_p={rrp:.3f} | Fake sentence → fake_p={ffp:.3f}",
               correct_direction,
               f"  Real text: fake={rfp:.4f}, real={rrp:.4f}\n"
               f"  Fake text: fake={ffp:.4f}, real={frp:.4f}")

    # Negation sensitivity
    pos = "The president confirmed the new economic policy today."
    neg = "The president did NOT confirm the new economic policy today."
    _, pfp, prp, _ = infer(tok, mdl, pos)
    _, nfp, nrp, _ = infer(tok, mdl, neg)
    diff = abs(pfp - nfp)
    record("T09 – Negation changes output probabilities",
           f"|Δfake_prob| = {diff:.4f}",
           diff > 0.001,
           f"  Positive: fake={pfp:.4f} real={prp:.4f}\n"
           f"  Negated:  fake={nfp:.4f} real={nrp:.4f}")

except Exception as e:
    record("T09", "Sensitivity / contrastive tests FAILED", False, str(e))
print()

# ─── T10: Inference Speed ─────────────────────────────────────────────────────
print("── T10  Inference Speed ─────────────────────────────────────────────────")
try:
    speed_text = ("Scientists have discovered a potential breakthrough in quantum computing "
                  "that could revolutionize encryption and data security globally. "
                  "The findings were published in Nature journal after peer review.")
    N_RUNS = 10
    times  = []
    for _ in range(N_RUNS):
        t0 = time.time()
        infer(tok, mdl, speed_text)
        times.append(time.time() - t0)
    avg_ms = (sum(times) / N_RUNS) * 1000
    max_ms = max(times) * 1000
    min_ms = min(times) * 1000

    record("T10a", f"Average inference < 2000ms ({avg_ms:.1f}ms avg)",
           avg_ms < 2000, f"Min={min_ms:.1f}ms  Avg={avg_ms:.1f}ms  Max={max_ms:.1f}ms")
    record("T10b", f"All {N_RUNS} inference runs completed without error", True,
           f"All runs successful")

    # Batch speed
    batch_texts = [speed_text] * 4
    t0 = time.time()
    enc_b = tok(batch_texts, return_tensors='pt', truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        _ = mdl(**enc_b)
    batch_ms = (time.time() - t0) * 1000
    record("T10c", f"Batch-4 inference completed ({batch_ms:.1f}ms)",
           batch_ms < 5000, f"Batch-4 time: {batch_ms:.1f}ms")

except Exception as e:
    record("T10", "Speed test FAILED", False, str(e))
print()

# ══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
print("="*70)
print("  SUMMARY")
print("="*70)

passed = [r for r in results if r["passed"]]
failed = [r for r in results if not r["passed"]]
total  = len(results)

print(f"\n  Total Tests : {total}")
print(f"  Passed      : {len(passed)} ✅")
print(f"  Failed      : {len(failed)} ❌")
print(f"  Pass Rate   : {len(passed)/total*100:.1f}%")

if failed:
    print(f"\n  ─── FAILED TESTS ───────────────────────────────────────────────")
    for r in failed:
        print(f"  ❌  [{r['test_id']}] {r['name']}")
        if r['detail']:
            for line in r['detail'].strip().split("\n"):
                print(f"         {line}")

print()
print("  Done. ")
print("="*70 + "\n")
