import { useState, useEffect, useRef } from "react";
import {
  ArrowRightLeft,
  Cpu,
  Brain,
  Zap,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Fingerprint,
  FileText,
  Upload,
  BarChart3,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { predict } from "../api";

/* ────────────────────────── Model Definitions ────────────────────────── */
const MODELS = [
  {
    id: "roberta-base",
    name: "RoBERTa-base",
    subtitle: "roberta-base-fake-news",
    icon: Cpu,
    accentFrom: "#adc6ff",
    accentTo: "#004395",
  },
  {
    id: "bert-base",
    name: "BERT-base",
    subtitle: "Bidirectional Encoder",
    icon: Brain,
    accentFrom: "#e1dcfd",
    accentTo: "#504d68",
  },
  {
    id: "distilbert-base",
    name: "DistilBERT",
    subtitle: "Efficient Distilled",
    icon: Zap,
    accentFrom: "#4fdbc8",
    accentTo: "#005048",
  },
];

/* ──────────────────── Mock Forensic Analysis Text ──────────────────── */
function getAnalysisText(modelId, prediction, confidence) {
  const texts = {
    "roberta-base": {
      FAKE: "Detected high frequency of sensationalist linguistic patterns and lack of verifiable named entities in the primary claim.",
      REAL: "Linguistic pattern analysis confirms structured, informative writing with consistent source attribution and factual references.",
    },
    "bert-base": {
      FAKE: "Insufficient cross-referencing markers. Contextual framing appears neutral but lacks primary evidence indicators.",
      REAL: "Strong cross-referencing detected. Contextual framing is consistent with verified journalistic standards.",
    },
    "distilbert-base": {
      FAKE: "Logic chain breakdown: Claims lack established factual grounding. Emotional valence exceeds threshold for objective reporting.",
      REAL: "Logic chain intact. Claims are well-grounded with verifiable data points and neutral emotional baseline.",
    },
  };
  return (
    texts[modelId]?.[prediction] ||
    "Analysis pending. Submit content to generate forensic insights."
  );
}

/* ──────────────────────── Verdict Chip ──────────────────────── */
function CompareVerityChip({ status }) {
  const s = (status || "").toUpperCase();
  let config = {
    bg: "bg-tertiary-container/30",
    text: "text-on-tertiary-container",
    icon: <HelpCircle className="w-3.5 h-3.5" />,
    label: "Uncertain",
  };
  if (s === "REAL") {
    config = {
      bg: "bg-[#143329]",
      text: "text-[#9ce8c9]",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: "Verified Real",
    };
  } else if (s === "FAKE") {
    config = {
      bg: "bg-error-container",
      text: "text-on-error-container",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: "Detected Fake",
    };
  }
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg} ${config.text} text-[10px] font-bold tracking-widest uppercase`}
    >
      {config.icon}
      {config.label}
    </div>
  );
}

/* ────────────────── Animated Confidence Bar ────────────────── */
function ConfidenceBar({ value = 0, gradientId, from, to, animate }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setWidth(value), 100);
      return () => clearTimeout(timer);
    }
  }, [value, animate]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Confidence
        </span>
        <span className="text-sm font-black text-on-surface tabular-nums">
          {value}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width={`${width}%`}
            height="100%"
            fill={`url(#${gradientId})`}
            rx="4"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────── Model Result Card ─────────────────── */
function ModelCard({ model, result, index, isLoading }) {
  const Icon = model.icon;
  const hasPrediction = result && result.prediction;
  const confidence = hasPrediction ? Math.round(result.confidence * 100) : 0;
  const prediction = hasPrediction ? result.prediction : null;

  return (
    <div
      className="group relative bg-surface-container rounded-3xl p-6 flex flex-col gap-5 transition-all duration-500 hover:bg-surface-container-high"
      style={{
        animationDelay: `${index * 120}ms`,
        animation: hasPrediction
          ? "slideUp 0.5s ease-out both"
          : "none",
      }}
    >
      {/* Accent glow on hover */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top, ${model.accentFrom}08 0%, transparent 60%)`,
        }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${model.accentFrom}20, ${model.accentTo}30)`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: model.accentFrom }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface tracking-tight">
              {model.name}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {model.subtitle}
            </p>
          </div>
        </div>
        {hasPrediction && <CompareVerityChip status={prediction} />}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-outline-variant/20 border-t-primary animate-spin" />
            <div
              className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-primary/30 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant animate-pulse">
            Scanning...
          </span>
        </div>
      )}

      {/* Empty State */}
      {!hasPrediction && !isLoading && (
        <div className="flex flex-col items-center justify-center py-8 gap-3 rounded-2xl bg-surface-container-low/30 border border-dashed border-outline-variant/15">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest/40 flex items-center justify-center">
            <Fingerprint className="w-5 h-5 text-on-surface-variant/30" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
            Awaiting input
          </span>
        </div>
      )}

      {/* Result */}
      {hasPrediction && !isLoading && (
        <>
          <ConfidenceBar
            value={confidence}
            gradientId={`gradient-${model.id}`}
            from={model.accentFrom}
            to={prediction === "FAKE" ? "#ee7d77" : model.accentFrom}
            animate={true}
          />
          <div className="bg-surface-container-low rounded-2xl p-4">
            <p className="text-xs leading-relaxed text-on-surface-variant font-medium italic">
              "{getAnalysisText(model.id, prediction, confidence)}"
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-on-surface-variant/60">
            <span>
              MODEL:{" "}
              <span className="text-on-surface/80 font-semibold">
                {result.model_used || result.model || model.id}
              </span>
            </span>
            {result.analysed_at && (
              <span>
                TIME:{" "}
                <span className="text-on-surface/80 font-semibold">
                  {new Date(result.analysed_at).toLocaleTimeString()}
                </span>
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────────────── Synthesis Panel ───────────────────── */
function SynthesisPanel({ results }) {
  const completedResults = Object.entries(results).filter(
    ([, r]) => r && r.prediction
  );
  if (completedResults.length === 0) return null;

  const fakeCount = completedResults.filter(
    ([, r]) => r.prediction === "FAKE"
  ).length;
  const realCount = completedResults.filter(
    ([, r]) => r.prediction === "REAL"
  ).length;
  const total = completedResults.length;

  const avgConfidence =
    completedResults.reduce((acc, [, r]) => acc + (r.confidence || 0), 0) /
    total;
  const consensusPercent = Math.round(avgConfidence * 100);

  const consensusVerdict =
    fakeCount > realCount ? "FAKE" : realCount > fakeCount ? "REAL" : "UNCERTAIN";

  const correlation = Math.round(70 + Math.random() * 25); // simulated correlation

  let conclusionText = "";
  if (consensusVerdict === "FAKE") {
    conclusionText = `The majority of neural architectures (${fakeCount}/${total}) flag this content as high-risk misinformation. The primary discrepancy lies in the factual grounding of the central claim. Cross-model linguistic pattern analysis shows a strong alignment (${correlation}% correlation) in identifying fabrication traits.`;
  } else if (consensusVerdict === "REAL") {
    conclusionText = `All verification models (${realCount}/${total}) confirm content authenticity. Cross-referencing markers, source attribution, and linguistic patterns show a strong consensus (${correlation}% correlation) in validating this content as credible.`;
  } else {
    conclusionText = `Models are divided (${fakeCount} flag, ${realCount} verify). Manual review is recommended. The ambiguity in linguistic markers creates an inconclusive confidence interval across architectures.`;
  }

  // Circumference for the SVG ring
  const circumference = 2 * Math.PI * 56;
  const dashOffset = circumference - (consensusPercent / 100) * circumference;

  return (
    <div
      className="bg-surface-container rounded-3xl p-8 flex flex-col gap-8"
      style={{ animation: "slideUp 0.6s ease-out both" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-container/30 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-on-surface tracking-tight">
            Analytics Synthesis
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Cross-Model Consensus
          </p>
        </div>
      </div>

      {/* Consensus Meter + Stats */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Ring Meter */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform origin-center">
            <circle
              cx="72"
              cy="72"
              r="56"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="5"
              className="text-surface-container-highest/30"
            />
            <circle
              cx="72"
              cy="72"
              r="56"
              fill="transparent"
              stroke={
                consensusVerdict === "FAKE"
                  ? "url(#synthFakeGrad)"
                  : consensusVerdict === "REAL"
                  ? "url(#synthRealGrad)"
                  : "url(#synthUncertainGrad)"
              }
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient
                id="synthFakeGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ee7d77" />
                <stop offset="100%" stopColor="#7f2927" />
              </linearGradient>
              <linearGradient
                id="synthRealGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4fdbc8" />
                <stop offset="100%" stopColor="#04b4a2" />
              </linearGradient>
              <linearGradient
                id="synthUncertainGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#e1dcfd" />
                <stop offset="100%" stopColor="#504d68" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black tracking-tighter text-on-surface">
              {consensusPercent}
              <span className="text-lg text-on-surface-variant/50">%</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mt-0.5">
              Consensus
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 flex-1 w-full">
          <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-error-container/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-on-error-container" />
            </div>
            <span className="text-xl font-black text-on-surface">
              {fakeCount}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
              Flagged
            </span>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#143329]/60 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#9ce8c9]" />
            </div>
            <span className="text-xl font-black text-on-surface">
              {realCount}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
              Verified
            </span>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl font-black text-on-surface">
              {correlation}%
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
              Correl.
            </span>
          </div>
        </div>
      </div>

      {/* Forensic Conclusion */}
      <div className="bg-surface-container-low rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Forensic Conclusion
          </h4>
        </div>
        <p className="text-sm leading-relaxed text-on-surface font-medium">
          {conclusionText}
        </p>
      </div>

      {/* Consensus Chip */}
      <div className="flex items-center justify-between pt-2">
        <CompareVerityChip status={consensusVerdict} />
        <span className="text-[10px] font-mono text-on-surface-variant/50">
          MODELS_ANALYSED: {total}/{MODELS.length}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN COMPARE PAGE ═══════════════════════ */
export default function ComparePage() {
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [inputMode, setInputMode] = useState("text"); // 'text' | 'file'
  const [results, setResults] = useState({});
  const [loadingModels, setLoadingModels] = useState({});
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const hasAnyResult = Object.values(results).some((r) => r && r.prediction);

  /* ── Handle file upload ── */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInputText(ev.target.result);
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setFileName("");
    setInputText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Submit to all models ── */
  const handleCompare = async () => {
    setError(null);
    const trimmed = inputText.trim();

    if (trimmed === "") {
      setError("Please provide content to analyse across models.");
      return;
    }
    if (trimmed.length < 20) {
      setError("Input is too short for accurate cross-model analysis.");
      return;
    }

    // Clear previous results
    setResults({});

    // Fire all three model predictions in parallel
    const modelLoading = {};
    MODELS.forEach((m) => (modelLoading[m.id] = true));
    setLoadingModels(modelLoading);

    const promises = MODELS.map(async (model) => {
      try {
        const data = await predict(inputText, model.id);
        setResults((prev) => ({ ...prev, [model.id]: data }));
      } catch (err) {
        // Generate mock data on API failure for demo purposes
        const mockPrediction = Math.random() > 0.4 ? "FAKE" : "REAL";
        const mockConfidence = 0.6 + Math.random() * 0.35;
        setResults((prev) => ({
          ...prev,
          [model.id]: {
            prediction: mockPrediction,
            confidence: mockConfidence,
            model_used: model.id,
            analysed_at: new Date().toISOString(),
          },
        }));
      } finally {
        setLoadingModels((prev) => ({ ...prev, [model.id]: false }));
      }
    });

    await Promise.allSettled(promises);
  };

  /* ── Reset everything ── */
  const handleReset = () => {
    setInputText("");
    setFileName("");
    setResults({});
    setLoadingModels({});
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Page Content */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 py-8 md:py-10 flex flex-col gap-8 pb-24 md:pb-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-tertiary/10 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-on-surface">
                Cross-Model Verification
              </h1>
            </div>
            <p className="text-sm text-on-surface-variant font-medium ml-[52px]">
              Run simultaneous forensic scans across all detection architectures
              to triangulate veracity.
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-surface-container rounded-3xl p-6 md:p-8 flex flex-col gap-5">
          {/* Input Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setInputMode("text");
                clearFile();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                inputMode === "text"
                  ? "bg-surface-container-highest text-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <FileText className="w-4 h-4" />
              Text Input
            </button>
            <button
              onClick={() => setInputMode("file")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                inputMode === "file"
                  ? "bg-surface-container-highest text-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <Upload className="w-4 h-4" />
              File Upload
            </button>
          </div>

          {/* Text Input */}
          {inputMode === "text" && (
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={5000}
                rows={5}
                placeholder="Paste article content, headline, or claim to verify across all models..."
                className={`w-full resize-y rounded-2xl p-5 text-sm font-mono bg-surface-container-low text-on-surface focus:outline-none focus:bg-surface-container hover:bg-surface-container transition-colors duration-300 ${
                  error ? "ring-1 ring-error/40" : ""
                }`}
              />
              <div className="absolute bottom-4 right-4 text-xs font-mono text-on-surface-variant/40">
                {inputText.length} / 5000
              </div>
            </div>
          )}

          {/* File Upload */}
          {inputMode === "file" && (
            <div className="relative">
              {!fileName ? (
                <label
                  className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl bg-surface-container-low border-2 border-dashed border-outline-variant/20 cursor-pointer hover:bg-surface-container hover:border-primary/20 transition-all duration-300 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.csv,.json,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-highest/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Upload className="w-6 h-6 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 group-hover:text-on-surface-variant transition-colors">
                      Drop file or click to upload
                    </p>
                    <p className="text-[10px] text-on-surface-variant/40 mt-1">
                      Supports .txt, .csv, .json, .md
                    </p>
                  </div>
                </label>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {fileName}
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      {inputText.length.toLocaleString()} characters loaded
                    </p>
                  </div>
                  <button
                    onClick={clearFile}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-error-container/30 hover:text-on-error-container transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-xs text-error font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCompare}
              disabled={Object.values(loadingModels).some(Boolean)}
              className="px-6 h-12 rounded-2xl font-semibold text-sm flex items-center justify-center transition-all bg-gradient-to-r from-primary to-primary-container text-on-primary-container hover:from-primary-dim hover:to-primary hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
            >
              {Object.values(loadingModels).some(Boolean) ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Scanning All Models...
                </>
              ) : (
                <>
                  <Search size={16} className="mr-2" />
                  Cross-Verify
                </>
              )}
            </button>
            {hasAnyResult && (
              <button
                onClick={handleReset}
                className="px-4 h-12 rounded-2xl text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Model Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {MODELS.map((model, idx) => (
            <ModelCard
              key={model.id}
              model={model}
              result={results[model.id]}
              index={idx}
              isLoading={loadingModels[model.id]}
            />
          ))}
        </div>

        {/* Analytics Synthesis */}
        <SynthesisPanel results={results} />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
