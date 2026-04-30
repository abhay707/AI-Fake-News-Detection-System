import { useState } from "react";
import { Search, RotateCcw, Loader2, AlertCircle, Fingerprint, Brain, BarChart, AlertTriangle } from "lucide-react";
import { predict } from '../api';

<<<<<<< HEAD
import VerityChip from "./ui/VerityChip";

// NewsInputForm handles the input of news text and performs inference.
// It is now locked to 'roberta-base' for all requests.
const NewsInputForm = () => {
=======
// ── COMPONENT ──────────────────────────────────────────────
const NewsInputForm = ({ selectedModel, onResult }) => {
  // ── STATE ──────────────────────────────────────────────────
>>>>>>> origin/main
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    const trimmed = inputText.trim();
    if (trimmed === "") {
      setError("Please paste an article or headline before analysing.");
      return;
    }
    if (trimmed.length < 20) {
      setError("Input is too short. Please provide more text for accurate analysis.");
      return;
    }

    setIsLoading(true);
    try {
      // API call is now hardcoded to always use 'roberta-base'
      const data = await predict(inputText, 'roberta-base');
      setResult(data);
      onResult?.(data, inputText);
    } catch (err) {
      setError("__API_ERROR__");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setResult(null);
    setError(null);
    onResult?.(null, "");
  };

  const hasValidationError = error !== null && error !== "__API_ERROR__";
  const hasApiError = error === "__API_ERROR__";

  let sentiment = "Neutral";
  let complexity = "Narrative";
  let anomalyText = "";

  if (result) {
    if (result.prediction === "FAKE") {
      sentiment = "Sensationalist";
      complexity = "Persuasive / Low Logic";
      if (result.confidence > 0.85) anomalyText = "High Emotional Valence Detected";
    } else {
      sentiment = "Objective";
      complexity = "Informative / Structured";
      if (result.confidence < 0.6) anomalyText = "Inconsistent Attribution Patterns";
    }
  }

  const confidenceValue = result ? Math.round(result.confidence * 100) : 0;
  const isUncertain = result && result.confidence < 0.85;
  // SVG SVG metrics calculations
  const circumference = 452.39; // 2 * pi * 72
  const dashOffset = circumference - (confidenceValue / 100) * circumference;

  return (
    <div className="w-full bg-surface-container rounded-3xl p-8 flex flex-col gap-6 shadow-xl shadow-surface-lowest/40">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-2 flex items-center gap-3">
          <Fingerprint className="text-primary w-6 h-6" />
          Content Scanner
        </h2>
        <p className="text-sm text-on-surface-variant font-medium">
          Deploy deep-learning heuristic models to unmask media fabrications.
        </p>
      </div>

      {/* Input Area */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={5000}
            rows={6}
            placeholder="Initialize analysis target..."
            className={`w-full resize-y rounded-2xl p-5 text-sm font-mono bg-surface-container-low text-on-surface focus:outline-none focus:bg-surface-container hover:bg-surface-container transition-colors duration-300 ${
              hasValidationError ? "ghost-border !ring-error" : ""
            }`}
          />
          <div className="absolute font-mono bottom-4 right-4 text-xs text-on-surface-variant/50">
            {inputText.length} / 5000
          </div>
        </div>
        
        {hasValidationError && (
          <div className="text-xs text-error font-medium flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-start">
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="w-48 h-12 rounded-2xl font-semibold text-sm flex items-center justify-center transition-all bg-gradient-to-r from-primary to-primary-container text-on-primary-container hover:from-primary-dim hover:to-primary hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search size={16} className="mr-2" />
              Initiate Scan
            </>
          )}
        </button>
        <p className="text-xs font-mono text-on-surface-variant mt-2">
          🟢 Using RoBERTa-base  •  BERT & DistilBERT coming soon
        </p>
      </div>

      {/* API Error Banner */}
      {hasApiError && (
        <div className="flex items-start gap-3 rounded-2xl bg-error-container p-4 text-sm text-on-error-container animate-fade-in ghost-border">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span className="font-medium">System failure: Unable to establish handshake with the inference engine.</span>
        </div>
      )}

      {/* Result Empty State Placeholder */}
      {result === null && !isLoading && !hasApiError && (
        <div className="mt-4 rounded-[2.5rem] bg-surface-container-low/30 border-2 border-dashed border-outline-variant/20 p-12 flex flex-col items-center justify-center gap-4 text-on-surface-variant min-h-[300px]">
           <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-2">
              <Fingerprint className="w-8 h-8 opacity-40 text-on-surface-variant" />
           </div>
           <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/80">Awaiting Target Data</h3>
           <p className="text-xs font-medium opacity-60 max-w-sm text-center">Execute a forensic scan on input text to generate sentiment, complexity, and confidence metrics.</p>
        </div>
      )}

      {/* Result Panel nested surface */}
      {result !== null && (
        <div className="mt-4 rounded-[2.5rem] bg-surface-container-low p-8 flex flex-col gap-10 animate-in slide-in-from-bottom-4 duration-500 fade-in shadow-2xl shadow-surface-lowest/60">
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Circular Confidence Meter */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform origin-center drop-shadow-2xl">
                <circle className="text-surface-highest/20" cx="96" cy="96" fill="transparent" r="72" stroke="currentColor" strokeWidth="6"></circle>
                <circle 
                  cx="96" cy="96" fill="transparent" r="72" 
                  stroke={isUncertain ? 'url(#uncertainGradient)' : (result.prediction === "FAKE" ? 'url(#fakeGradient)' : 'url(#realGradient)')}
                  strokeDasharray={circumference} 
                  strokeDashoffset={dashOffset} 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                ></circle>
                <defs>
                  <linearGradient id="fakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ee7d77" />
                    <stop offset="100%" stopColor="#7f2927" />
                  </linearGradient>
                  <linearGradient id="realGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4fdbc8" />
                    <stop offset="100%" stopColor="#04b4a2" />
                  </linearGradient>
                  <linearGradient id="uncertainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tracking-tighter text-on-surface drop-shadow-md">
                  {confidenceValue}<span className="text-2xl text-on-surface-variant/50">%</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mt-1">Confidence</span>
              </div>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <div className="space-y-4">
                <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Verdict Profile</div>
                <VerityChip status={isUncertain ? 'UNCERTAIN' : result.prediction} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-surface-container p-4 rounded-3xl border border-outline-variant/10 shadow-inner max-w-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">Source Rank</span>
                  <span className="text-lg md:text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis text-primary">
                    {isUncertain ? "Inconclusive" : (result.prediction === "FAKE" ? "Untrusted" : "Verified")}
                  </span>
                </div>
                <div className="bg-surface-container p-4 rounded-3xl border border-outline-variant/10 shadow-inner max-w-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">Bias Index</span>
                  <span className="text-lg md:text-xl font-bold text-on-surface whitespace-nowrap overflow-hidden text-ellipsis">
                    {isUncertain ? "Unclear" : (result.prediction === "FAKE" ? "High" : "Low")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Linguistic Metrics Bento Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container p-5 rounded-[2rem] flex flex-col gap-3 border border-outline-variant/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
              <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary mb-1">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sentiment Profile</div>
                <div className="text-lg font-bold text-on-surface whitespace-nowrap overflow-hidden text-ellipsis">{sentiment}</div>
              </div>
            </div>
            
            <div className="bg-surface-container p-5 rounded-[2rem] flex flex-col gap-3 border border-outline-variant/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
              <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-tertiary mb-1">
                <BarChart className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Linguistic Complexity</div>
                <div className="text-lg font-bold text-on-surface whitespace-nowrap overflow-hidden text-ellipsis">{complexity}</div>
              </div>
            </div>

            {anomalyText && (
              <div className="col-span-1 md:col-span-2 bg-error-container/20 p-5 rounded-[2rem] flex items-center justify-between border border-error-container/30">
                <div className="flex items-center gap-4 text-on-error-container">
                  <div className="w-12 h-12 rounded-2xl bg-error-container flex items-center justify-center shadow-lg shadow-error-container/40">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Anomaly Detected</div>
                    <div className="text-sm font-bold tracking-tight">{anomalyText}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
            <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant">
              <span>MODEL: <span className="text-on-surface font-semibold">{result.model_used || result.model}</span></span>
              <span>TIME: <span className="text-on-surface font-semibold">{new Date(result.analysed_at).toLocaleTimeString()}</span></span>
            </div>
            
            <button 
              onClick={handleReset}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Target
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsInputForm;
