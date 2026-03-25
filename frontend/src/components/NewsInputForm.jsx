// ── IMPORTS ────────────────────────────────────────────────
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, RotateCcw, Loader2, AlertCircle } from "lucide-react";
import { predict } from '../api'

// ── COMPONENT ──────────────────────────────────────────────
const NewsInputForm = ({ selectedModel }) => {
  // ── STATE ──────────────────────────────────────────────────
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // ── HANDLERS ───────────────────────────────────────────────
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
      const data = await predict(inputText, selectedModel);
      setResult(data);
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
  };

  // ── RENDER ─────────────────────────────────────────────────
  const hasValidationError = error !== null && error !== "__API_ERROR__";
  const hasApiError = error === "__API_ERROR__";

  return (
    <Card className="w-full shadow-md rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield size={22} className="text-blue-600" />
          <CardTitle className="text-xl font-semibold">Fake News Detector</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Paste any news article or headline to analyse its credibility.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 1. Textarea block */}
        <div>
          <label className="text-sm font-medium block mb-1">Article or Headline</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={5000}
            rows={8}
            placeholder="Paste a news article or headline here..."
            className={`w-full resize-y rounded-lg border p-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${hasValidationError ? "border-red-500 ring-1 ring-red-500" : "border-input"
              }`}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-red-500">
              {hasValidationError ? error : ""}
            </span>
            <span className="text-xs text-muted-foreground">
              {inputText.length} / 5000
            </span>
          </div>
        </div>

        {/* 2. Submit Button */}
        <Button
          className="w-full h-11"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Analysing...
            </>
          ) : (
            <>
              <Search size={16} className="mr-2" />
              Analyse Article
            </>
          )}
        </Button>

        {/* 3. API Error Banner */}
        {hasApiError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
            <span>Something went wrong. Please try again.</span>
          </div>
        )}

        {/* 4. Result Panel */}
        {result !== null && (
          <div className="transition-all duration-500 ease-out">
            <hr className="border-border my-5" />
            <div
              className={`rounded-xl border p-5 space-y-4 ${result.prediction === "FAKE"
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
                }`}
            >
              {/* ROW 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Verdict
                  </div>
                  {result.prediction === "FAKE" ? (
                    <Badge variant="destructive" className="text-sm px-3 py-1">
                      FAKE NEWS
                    </Badge>
                  ) : (
                    <Badge className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1">
                      REAL NEWS
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className={`text-4xl font-bold ${result.prediction === "FAKE" ? "text-red-600" : "text-green-600"
                      }`}
                  >
                    {Math.round(result.confidence * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Confidence
                  </div>
                </div>
              </div>

              {/* ROW 2 */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Confidence Score</span>
                  <span>{result.confidence}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${result.prediction === "FAKE" ? "bg-red-500" : "bg-green-500"
                      }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* ROW 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="mr-1">Model used:</span>
                  <span className="font-mono bg-muted px-2 py-0.5 rounded text-foreground">
                    {result.model_used || result.model}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Analysed at: {new Date(result.analysed_at).toLocaleTimeString()}
                </div>
              </div>

              {/* ROW 4 */}
              <Button variant="outline" className="w-full" onClick={handleReset}>
                <RotateCcw size={14} className="mr-2" />
                Try Another Article
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsInputForm;
