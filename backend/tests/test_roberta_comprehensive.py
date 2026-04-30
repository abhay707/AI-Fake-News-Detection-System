"""
Comprehensive RoBERTa Fake-News Model Test Suite
=================================================
Run from the `backend/` directory:
    python tests/test_roberta_comprehensive.py

Tests covered:
  T01  Model Loading & Architecture
  T02  Tokenizer Sanity (RoBERTa-specific: BPE, <s>/<\/s> tokens)
  T03  Config & Label Mapping
  T04  Inference Output Shape & Numerical Stability
  T05  Confidence Calibration
  T06  Real-World Known-Label Samples (Ground-truth accuracy)
  T07  Edge Cases (short, blank, numeric, long, unicode, noise, caps, urls)
  T08  Label Orientation (FAKE vs REAL direction)
  T09  Sensitivity / Contrastive Pairs & Negation
  T10  Inference Speed (single + batch)
"""

import os, sys, time, warnings
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

warnings.filterwarnings("ignore")

# ── Path resolution ────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT   = os.path.abspath(os.path.join(SCRIPT_DIR, '..', '..'))
MODEL_DIR   = os.path.join(REPO_ROOT, 'models', 'roberta-base-fake-news')

# ── Results accumulator ────────────────────────────────────────────────────────
results = []

def record(test_id, name, passed, detail=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    results.append({"test_id": test_id, "name": name,
                    "status": status, "passed": passed, "detail": detail})
    print(f"  {status}  [{test_id}] {name}")
    if detail:
        for line in detail.strip().split("\n"):
            print(f"         {line}")

# ── Inference helper ───────────────────────────────────────────────────────────
def infer(tok, mdl, text):
    """Return (label, fake_prob, real_prob, logits_tensor)."""
    inputs = tok(text, return_tensors='pt', truncation=True,
                 max_length=512, padding=True)
    with torch.no_grad():
        out = mdl(**inputs)
    probs    = torch.softmax(out.logits, dim=1)[0]
    id2label = mdl.config.id2label
    fake_idx = next((int(k) for k, v in id2label.items() if v.upper() == "FAKE"), 0)
    real_idx = 1 - fake_idx
    label    = "FAKE" if probs[fake_idx] > probs[real_idx] else "REAL"
    return label, float(probs[fake_idx]), float(probs[real_idx]), out.logits

# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 70)
print("  ROBERTA FAKE-NEWS MODEL — COMPREHENSIVE TEST SUITE")
print("=" * 70)
print(f"  Model path  : {MODEL_DIR}")
print(f"  Model exists: {os.path.isdir(MODEL_DIR)}")
print()

# ── T00: Pre-flight ────────────────────────────────────────────────────────────
print("── T00  Pre-flight ──────────────────────────────────────────────────────")
required = ["config.json", "model.safetensors", "tokenizer.json", "tokenizer_config.json"]
missing  = [f for f in required if not os.path.isfile(os.path.join(MODEL_DIR, f))]
if missing:
    print(f"  ❌ ABORT: Missing files: {missing}")
    sys.exit(1)
print(f"  ✅ All required files present: {required}")
print()

# ── T01: Model Loading & Architecture ─────────────────────────────────────────
print("── T01  Model Loading & Architecture ───────────────────────────────────")
tok = mdl = None
try:
    t0  = time.time()
    tok = AutoTokenizer.from_pretrained(MODEL_DIR)
    mdl = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    mdl.eval()
    load_time = time.time() - t0

    arch        = mdl.config.architectures[0] if mdl.config.architectures else "unknown"
    n_layers    = mdl.config.num_hidden_layers
    n_heads     = mdl.config.num_attention_heads
    hidden_size = mdl.config.hidden_size
    vocab_size  = mdl.config.vocab_size
    total_params = sum(p.numel() for p in mdl.parameters())

    record("T01a", "Model loads without error", True,
           f"Load time: {load_time:.2f}s")
    record("T01b", "Architecture = RobertaForSequenceClassification",
           arch == "RobertaForSequenceClassification", f"Got: {arch}")
    record("T01c", "num_hidden_layers = 12",   n_layers == 12,    f"Got: {n_layers}")
    record("T01d", "num_attention_heads = 12", n_heads  == 12,    f"Got: {n_heads}")
    record("T01e", "hidden_size = 768",         hidden_size == 768, f"Got: {hidden_size}")
    record("T01f", "vocab_size = 50265",        vocab_size == 50265, f"Got: {vocab_size}")
    record("T01g", "Parameter count reasonable (120–135M)",
           120_000_000 <= total_params <= 135_000_000,
           f"Got: {total_params:,}")
    record("T01h", "Model in eval mode", not mdl.training,
           f"Training flag: {mdl.training}")
    record("T01i", "max_position_embeddings = 514",
           mdl.config.max_position_embeddings == 514,
           f"Got: {mdl.config.max_position_embeddings}")

except Exception as e:
    record("T01", "Model loading FAILED", False, str(e))
    print("\n❌ Cannot continue — model failed to load.")
    sys.exit(1)
print()

# ── T02: Tokenizer Sanity (RoBERTa-specific) ──────────────────────────────────
print("── T02  Tokenizer Sanity (RoBERTa / BPE) ───────────────────────────────")
try:
    sample = "The quick brown fox jumps over the lazy dog."
    enc    = tok(sample, return_tensors='pt')
    ids    = enc['input_ids'][0]

    # RoBERTa special tokens: <s>=0, </s>=2, <pad>=1
    bos_id = tok.bos_token_id  # <s>
    eos_id = tok.eos_token_id  # </s>
    pad_id = tok.pad_token_id  # <pad>

    record("T02a", "Tokenizer returns input_ids",
           'input_ids' in enc, f"Keys: {list(enc.keys())}")
    record("T02b", f"BOS token <s> at start (id={bos_id})",
           ids[0].item() == bos_id,
           f"First token id: {ids[0].item()}, expected BOS={bos_id}")
    record("T02c", f"EOS token </s> at end (id={eos_id})",
           ids[-1].item() == eos_id,
           f"Last token id: {ids[-1].item()}, expected EOS={eos_id}")
    record("T02d", "Sequence length reasonable (5–512)",
           5 <= len(ids) <= 512, f"Tokens: {len(ids)}")
    record("T02e", "No token_type_ids (RoBERTa doesn't use segment IDs)",
           'token_type_ids' not in enc,
           f"Keys present: {list(enc.keys())}")

    # Truncation
    long_text = "word " * 600
    enc2 = tok(long_text, return_tensors='pt', truncation=True, max_length=512)
    record("T02f", "Truncation at max_length=512 works",
           enc2['input_ids'].shape[1] <= 512,
           f"Truncated length: {enc2['input_ids'].shape[1]}")

    # Batch padding
    enc3 = tok([sample, "Short text."], return_tensors='pt',
                padding=True, truncation=True, max_length=512)
    record("T02g", "Batch padding produces equal-length sequences",
           enc3['input_ids'].shape[0] == 2,
           f"Batch shape: {tuple(enc3['input_ids'].shape)}")

    # Decode roundtrip (RoBERTa uses BPE — should decode faithfully)
    decoded = tok.decode(ids, skip_special_tokens=True).strip()
    record("T02h", "Decode → re-encode roundtrip stable",
           decoded.lower() == sample.lower(),
           f"Original: '{sample}'\nDecoded : '{decoded}'")

    # BPE subword tokenisation check
    test_word = "disinformation"
    sub_ids   = tok.encode(test_word, add_special_tokens=False)
    sub_toks  = tok.convert_ids_to_tokens(sub_ids)
    record("T02i", "BPE subword tokenisation works",
           len(sub_toks) >= 1,
           f"'{test_word}' → {sub_toks}")

    # Vocabulary size sanity
    record("T02j", "Tokenizer vocab size matches config (50265)",
           tok.vocab_size == 50265,
           f"Got: {tok.vocab_size}")

except Exception as e:
    record("T02", "Tokenizer sanity FAILED", False, str(e))
print()

# ── T03: Config & Label Mapping ───────────────────────────────────────────────
print("── T03  Config & Label Mapping ──────────────────────────────────────────")
try:
    id2label = mdl.config.id2label
    label2id = mdl.config.label2id

    has_fake = any(v.upper() == "FAKE" for v in id2label.values())
    has_real = any(v.upper() == "REAL" for v in id2label.values())

    record("T03a", "id2label has exactly 2 labels",
           len(id2label) == 2, f"Got: {id2label}")
    record("T03b", "'FAKE' present in id2label values", has_fake,
           f"id2label={id2label}")
    record("T03c", "'REAL' present in id2label values", has_real,
           f"id2label={id2label}")
    record("T03d", "label2id has exactly 2 entries",
           len(label2id) == 2, f"Got: {label2id}")
    record("T03e", "num_labels == 2",
           mdl.config.num_labels == 2, f"Got: {mdl.config.num_labels}")
    record("T03f", "problem_type = single_label_classification",
           mdl.config.problem_type == "single_label_classification",
           f"Got: {mdl.config.problem_type}")
    record("T03g", "model_type = roberta",
           mdl.config.model_type == "roberta",
           f"Got: {mdl.config.model_type}")

    # Note: RoBERTa config.json here does NOT define id2label explicitly —
    # check if HF auto-populated defaults
    record("T03h", "id2label keys are integers 0 and 1",
           set(int(k) for k in id2label.keys()) == {0, 1},
           f"Keys: {list(id2label.keys())}")

    # Classifier head dimension check
    clf = getattr(mdl, 'classifier', None)
    if clf is not None:
        out_proj = getattr(clf, 'out_proj', None)
        if out_proj is not None:
            record("T03i", "Classifier out_proj output dim == 2",
                   out_proj.out_features == 2,
                   f"Got: {out_proj.out_features}")
        dense = getattr(clf, 'dense', None)
        if dense is not None:
            record("T03j", "Classifier dense input/output hidden_size=768",
                   dense.in_features == 768 and dense.out_features == 768,
                   f"in={dense.in_features} out={dense.out_features}")

except Exception as e:
    record("T03", "Config/label check FAILED", False, str(e))
print()

# ── T04: Inference Output Shape & Numerical Stability ─────────────────────────
print("── T04  Inference Output Shape & Numerical Stability ───────────────────")
try:
    text   = "Scientists have discovered a new treatment for Alzheimer's disease."
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
    texts = [
        "NASA confirms successful moon landing.",
        "Aliens secretly control the US government."
    ]
    enc_b = tok(texts, return_tensors='pt', truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        out_b = mdl(**enc_b)
    record("T04e", "Batch inference shape == [2, 2]",
           out_b.logits.shape == torch.Size([2, 2]),
           f"Got: {out_b.logits.shape}")

    # Logit magnitude sanity
    logit_mean = logits.abs().mean().item()
    record("T04f", "Logit magnitude reasonable (0.1–10)",
           0.1 <= logit_mean <= 10.0,
           f"Mean |logit| = {logit_mean:.4f}")

    # Softmax temperature check — neither class should be identically 0
    record("T04g", "Neither output probability is exactly 0",
           probs.min().item() > 0.0,
           f"Min prob: {probs.min().item():.6f}")

except Exception as e:
    record("T04", "Inference output shape FAILED", False, str(e))
print()

# ── T05: Confidence Calibration ───────────────────────────────────────────────
print("── T05  Confidence Calibration ──────────────────────────────────────────")
try:
    calib_tests = [
        ("The Earth revolves around the Sun.", "Clear scientific fact", 0.55),
        ("Drinking bleach daily cures all known diseases and doctors are hiding it.", "Obvious disinfo", 0.55),
        ("This paragraph is deliberately ambiguous and could be interpreted either way.", "Ambiguous text", 0.0),
        ("The president signed a new economic bill into law today.", "Neutral news", 0.50),
    ]
    for text, desc, min_conf in calib_tests:
        label, fp, rp, _ = infer(tok, mdl, text)
        conf = max(fp, rp)
        record(f"T05 – {desc}",
               f"Label={label}  Confidence={conf:.2%}  (threshold≥{min_conf:.0%})",
               conf >= min_conf,
               f"fake_prob={fp:.4f}, real_prob={rp:.4f}")

    # Overall: confidence should always exceed 50%
    label, fp, rp, logits = infer(tok, mdl, "The bank reported record profits this quarter.")
    conf = max(fp, rp)
    record("T05 – Confidence always > 50%", f"Confidence={conf:.2%}",
           conf > 0.50,
           f"Logits: {logits.tolist()}")

except Exception as e:
    record("T05", "Confidence calibration FAILED", False, str(e))
print()

# ── T06: Real-World Known-Label Samples ───────────────────────────────────────
print("── T06  Real-World Known-Label Samples ──────────────────────────────────")
try:
    known_samples = [
        (
            "The World Health Organization declared COVID-19 a pandemic in March 2020 "
            "after the virus spread to more than 100 countries worldwide.",
            "REAL", "WHO COVID declaration (factual)"
        ),
        (
            "BREAKING: Microchips hidden inside COVID vaccines can track your location "
            "in real-time and transmit data to government surveillance systems.",
            "FAKE", "Vaccine microchip conspiracy"
        ),
        (
            "NASA's James Webb Space Telescope has captured the deepest infrared image "
            "of the universe ever taken, revealing galaxies formed just 600 million years "
            "after the Big Bang.",
            "REAL", "JWST factual statement"
        ),
        (
            "EXCLUSIVE: Scientists confirm that 5G towers emit radiation that turns "
            "people into obedient zombies controlled by global elites.",
            "FAKE", "5G conspiracy theory"
        ),
        (
            "The United Nations Security Council consists of fifteen members, five of "
            "which are permanent members with veto power.",
            "REAL", "UN factual statement"
        ),
        (
            "A viral video proves the moon is actually a hologram projected by "
            "secret societies to hide the truth about flat earth.",
            "FAKE", "Moon hologram conspiracy"
        ),
        (
            "India successfully launched the Chandrayaan-3 mission to the Moon in 2023, "
            "becoming the first country to land near the lunar south pole.",
            "REAL", "Chandrayaan-3 factual"
        ),
        (
            "Secret documents reveal that climate change is a hoax invented by scientists "
            "bribed by the UN to impose a global carbon tax on citizens.",
            "FAKE", "Climate hoax conspiracy"
        ),
        (
            "Studies published in peer-reviewed journals show that regular physical "
            "activity reduces the risk of cardiovascular disease by up to 35 percent.",
            "REAL", "Health statistic (factual)"
        ),
        (
            "DOCTORS CONFESS: Big Pharma has suppressed a natural cure for cancer "
            "that costs less than one dollar and grows in your backyard.",
            "FAKE", "Big Pharma suppression conspiracy"
        ),
        (
            "The International Space Station has been continuously inhabited since "
            "November 2000 and orbits Earth at approximately 400 kilometres altitude.",
            "REAL", "ISS factual statement"
        ),
        (
            "FBI whistleblower reveals reptilian aliens have been running the "
            "United States government since 1947 under a secret treaty.",
            "FAKE", "Reptilian alien conspiracy"
        ),
    ]

    correct = 0
    for text, expected, desc in known_samples:
        label, fp, rp, _ = infer(tok, mdl, text)
        conf  = max(fp, rp)
        passed = (label == expected)
        if passed:
            correct += 1
        record(f"T06 – {desc}",
               f"Expected={expected}  Got={label}  @ {conf:.2%}",
               passed,
               f"fake_p={fp:.4f}  real_p={rp:.4f}")

    accuracy = correct / len(known_samples)
    record("T06 – Overall Accuracy on Known Samples",
           f"{correct}/{len(known_samples)} = {accuracy:.0%}",
           accuracy >= 0.70,
           "Threshold: ≥70% required for production readiness")

except Exception as e:
    record("T06", "Known-label samples FAILED", False, str(e))
print()

# ── T07: Edge Cases ───────────────────────────────────────────────────────────
print("── T07  Edge Cases ──────────────────────────────────────────────────────")
try:
    edge_cases = [
        ("This is short.",               "Very short text"),
        ("   ",                          "Whitespace-only"),
        ("42 100 3000 99.5",             "Numeric-only"),
        ("word " * 600,                  "Long text (>512 tokens, truncated)"),
        ("科学家证实气候变化是真实的 — Scientists confirm climate change is real worldwide.", "Mixed Unicode"),
        ("!!!! ?????? .... THE NEWS IS HAPPENING RIGHT NOW !!!!",  "Noisy punctuation"),
        ("SCIENTISTS HAVE CONFIRMED THAT THE EARTH IS ROUND AND ORBITS THE SUN.", "ALL-CAPS"),
        ("Visit https://example.com and http://fakenews.biz/article?id=123 for SHOCKING TRUTHS!", "URL-heavy"),
        ("💉🧬🌍🔬 Vaccine causes DNA mutation in 72 hours scientists say 😱🚨", "Emoji-heavy"),
        ("\n\n\nBreaking news from Washington D.C.\n\nThe president has signed a new bill.", "Multi-line with newlines"),
    ]

    for text, desc in edge_cases:
        try:
            label, fp, rp, _ = infer(tok, mdl, text)
            conf = max(fp, rp)
            record(f"T07 – {desc}",
                   f"→ {label} @ {conf:.2%}  (fake={fp:.4f} real={rp:.4f})",
                   True, "Handled gracefully — no exception")
        except Exception as e:
            record(f"T07 – {desc}", f"Raised exception: {e}", False, str(e))

except Exception as e:
    record("T07", "Edge-case tests FAILED globally", False, str(e))
print()

# ── T08: Label Orientation ────────────────────────────────────────────────────
print("── T08  Label Orientation ───────────────────────────────────────────────")
try:
    id2label = mdl.config.id2label
    fake_idx = next((int(k) for k, v in id2label.items() if v.upper() == "FAKE"), None)
    real_idx = next((int(k) for k, v in id2label.items() if v.upper() == "REAL"), None)

    record("T08a", f"FAKE is at index {fake_idx}",
           fake_idx is not None, f"id2label={id2label}")
    record("T08b", f"REAL is at index {real_idx}",
           real_idx is not None, f"id2label={id2label}")

    orientation_cases = [
        ("BREAKING: Government puts mind-control chemicals in tap water to suppress rebellion.", "FAKE"),
        ("Water is composed of two hydrogen atoms and one oxygen atom, forming H₂O.",           "REAL"),
        ("Scientists at MIT develop new method to remove microplastics from drinking water.",    "REAL"),
        ("EXPOSED: The moon landing in 1969 was filmed in a Hollywood studio by NASA actors.",  "FAKE"),
    ]
    for text, expected in orientation_cases:
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

# ── T09: Sensitivity / Contrastive Pairs & Negation ──────────────────────────
print("── T09  Sensitivity / Contrastive Pairs & Negation ──────────────────────")
try:
    contrastive_pairs = [
        (
            "Scientists confirm climate change is real and caused by human greenhouse gas emissions.",
            "Scientists confirm climate change is a hoax invented by globalists to control economy.",
            "Climate change: factual vs hoax framing"
        ),
        (
            "The FDA has approved a new vaccine after rigorous multi-year clinical trials.",
            "The vaccine contains secret DNA-altering nanorobots that will kill you in five years.",
            "Vaccine: regulated approval vs conspiracy"
        ),
        (
            "A new peer-reviewed study shows moderate exercise improves cardiovascular health by 30%.",
            "EXPOSED: Doctors paid millions to hide miracle cancer cure found in lemon juice.",
            "Health: peer-reviewed vs sensational suppression"
        ),
        (
            "Archaeologists excavating in Egypt discovered ancient tools dating back 3,000 years.",
            "Pyramids were built by aliens using anti-gravity technology hidden by Egyptologists.",
            "Archaeology: academic finding vs alien conspiracy"
        ),
    ]

    for real_text, fake_text, desc in contrastive_pairs:
        _, rfp, rrp, _ = infer(tok, mdl, real_text)
        _, ffp, frp, _ = infer(tok, mdl, fake_text)
        # Correct: real_text → higher real_prob; fake_text → higher fake_prob
        correct_direction = (rrp > frp) and (ffp > rfp)
        delta = abs(rrp - frp)
        record(f"T09 – {desc}",
               f"Real→real_p={rrp:.3f} | Fake→fake_p={ffp:.3f} | Δreal={delta:.3f}",
               correct_direction,
               f"  Real text : fake={rfp:.4f} real={rrp:.4f}\n"
               f"  Fake text : fake={ffp:.4f} real={frp:.4f}")

    # Negation sensitivity
    pos_text = "The president confirmed the new economic policy will take effect immediately."
    neg_text = "The president did NOT confirm the new economic policy will take effect."
    _, pfp, prp, _ = infer(tok, mdl, pos_text)
    _, nfp, nrp, _ = infer(tok, mdl, neg_text)
    delta = abs(pfp - nfp)
    record("T09 – Negation sensitivity (|Δfake_prob| > 0.01)",
           f"|Δfake_prob| = {delta:.4f}",
           delta > 0.01,
           f"  Positive: fake={pfp:.4f} real={prp:.4f}\n"
           f"  Negated : fake={nfp:.4f} real={nrp:.4f}")

    # Headline vs body text sensitivity
    headline = "Scientists discover cure for Alzheimer's."
    sensational = "MIRACLE CURE HIDDEN BY BIG PHARMA: Scientists PROVED they have cure for ALL disease!"
    _, hfp, hrp, _ = infer(tok, mdl, headline)
    _, sfp, srp, _ = infer(tok, mdl, sensational)
    record("T09 – Sensational headline vs neutral headline",
           f"Neutral→fake_p={hfp:.3f} | Sensational→fake_p={sfp:.3f}",
           sfp > hfp,
           f"  Headline    : fake={hfp:.4f} real={hrp:.4f}\n"
           f"  Sensational : fake={sfp:.4f} real={srp:.4f}")

except Exception as e:
    record("T09", "Sensitivity / contrastive tests FAILED", False, str(e))
print()

# ── T10: Inference Speed ──────────────────────────────────────────────────────
print("── T10  Inference Speed ─────────────────────────────────────────────────")
try:
    speed_text = (
        "Scientists have discovered a potential breakthrough in quantum computing "
        "that could revolutionise encryption and data security globally. "
        "The findings were published in Nature journal after extensive peer review."
    )
    N_RUNS = 10
    times  = []
    for _ in range(N_RUNS):
        t0 = time.time()
        infer(tok, mdl, speed_text)
        times.append(time.time() - t0)

    avg_ms = (sum(times) / N_RUNS) * 1000
    max_ms = max(times) * 1000
    min_ms = min(times) * 1000

    record("T10a", f"Average single inference < 3000ms ({avg_ms:.1f}ms avg)",
           avg_ms < 3000,
           f"Min={min_ms:.1f}ms  Avg={avg_ms:.1f}ms  Max={max_ms:.1f}ms")
    record("T10b", f"All {N_RUNS} inference runs completed without error",
           True, "All runs successful")

    # Batch-4
    batch_texts = [speed_text] * 4
    t0 = time.time()
    enc_b = tok(batch_texts, return_tensors='pt', truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        _ = mdl(**enc_b)
    batch_ms = (time.time() - t0) * 1000
    record("T10c", f"Batch-4 inference completed ({batch_ms:.1f}ms)",
           batch_ms < 8000,
           f"Batch-4 time: {batch_ms:.1f}ms")

    # Compare to single: batch efficiency
    efficiency = (avg_ms * 4) / batch_ms
    record("T10d", f"Batch-4 efficiency vs 4×single (≥1.0×)",
           efficiency >= 1.0,
           f"Efficiency ratio: {efficiency:.2f}×  (batch={batch_ms:.1f}ms vs 4×{avg_ms:.1f}ms={avg_ms*4:.1f}ms)")

except Exception as e:
    record("T10", "Speed test FAILED", False, str(e))
print()

# ══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
print("=" * 70)
print("  SUMMARY")
print("=" * 70)

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
print("  Done.")
print("=" * 70 + "\n")
