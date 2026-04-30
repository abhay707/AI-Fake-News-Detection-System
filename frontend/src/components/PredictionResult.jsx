// ── IMPORTS ────────────────────────────────────────────────
import { ShieldCheck, ShieldX, Clock, Cpu, TrendingUp } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from "recharts";

// ── COMPONENT ──────────────────────────────────────────────
const PredictionResult = ({ result }) => {
  // ── DERIVED VALUES ─────────────────────────────────────────
  const isFake = result.prediction === "FAKE";
  const pct = Math.round(result.confidence * 100);
  const colorClass = isFake ? "text-red-600" : "text-green-600";
  const bgClass = isFake ? "bg-red-50" : "bg-green-50";
  const borderClass = isFake ? "border-red-200" : "border-green-200";
  const barColor = isFake ? "#dc2626" : "#16a34a";
  const Icon = isFake ? ShieldX : ShieldCheck;
  const chartData = [{ name: "confidence", value: pct, fill: barColor }];

  let interpretationText = "";
  if (isFake && pct >= 85) {
    interpretationText = "This article shows strong indicators of misinformation. The model is highly confident in this classification.";
  } else if (isFake && pct < 85) {
    interpretationText = "This article shows some indicators of misinformation, though the model's confidence is moderate. Verify with trusted sources.";
  } else if (!isFake && pct >= 85) {
    interpretationText = "This article appears to be credible. The model is highly confident this is authentic news.";
  } else if (!isFake && pct < 85) {
    interpretationText = "This article appears credible, though the model's confidence is moderate. Cross-referencing is always recommended.";
  }

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div className={`rounded-2xl border p-6 space-y-6 ${bgClass} ${borderClass}`}>
      {/* SECTION 1 — VERDICT HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon size={40} className={colorClass} />
          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Verdict
            </p>
            <p className={`text-3xl font-bold ${colorClass}`}>
              {result.prediction} NEWS
            </p>
            <div className="mt-1 inline-flex w-fit items-center rounded-md bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">
              Model: {result.model_used || result.model || 'bert-base'}
            </div>
          </div>
        </div>
        <div className="relative w-[100px] h-[100px]">
          <RadialBarChart
            width={100}
            height={100}
            innerRadius={30}
            outerRadius={46}
            startAngle={90}
            endAngle={-270}
            data={chartData}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              background={{ fill: "#e5e7eb", opacity: 0.5 }}
            />
          </RadialBarChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={`text-xl font-bold ${colorClass}`}>{pct}%</p>
            <p className="text-xs text-muted-foreground">confidence</p>
          </div>
        </div>
      </div>

      {/* SECTION 2 — CONFIDENCE BAR */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Confidence Score</span>
          <span>{result.confidence.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%`, background: barColor }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* SECTION 3 — STATS ROW */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/50 rounded-xl p-3 text-center">
          <Cpu size={16} className="mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Model</p>
          <p className="text-sm font-mono font-medium">{result.model}</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-3 text-center">
          <TrendingUp size={16} className="mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Confidence</p>
          <p className={`text-sm font-bold ${colorClass}`}>{pct}%</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-3 text-center">
          <Clock size={16} className="mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Analysed At</p>
          <p className="text-sm font-medium">
            {new Date(result.analysed_at).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* SECTION 4 — INTERPRETATION CALLOUT */}
      <div className={`rounded-xl border p-4 text-sm leading-relaxed ${bgClass} ${borderClass} ${colorClass}`}>
        {interpretationText}
      </div>
    </div>
  );
};

export default PredictionResult;
