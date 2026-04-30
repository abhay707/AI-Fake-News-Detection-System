import { Cpu } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ProbBar = ({ label, value, colorClass, barColor }) => (
  <div className="py-2 border-b border-gray-100 last:border-0">
    <div className="flex justify-between text-xs mb-1.5">
      <span className="font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className={`font-mono font-semibold ${colorClass}`}>{value.toFixed(1)}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${value}%`, backgroundColor: barColor }}
      />
    </div>
  </div>
);

const Param = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-xs font-mono font-semibold text-foreground truncate max-w-[140px] text-right">{value}</span>
  </div>
);

const SystemParameters = ({ result }) => {
  if (!result) {
    return (
      <Card className="shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Cpu size={15} className="text-blue-600" />
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              System Parameters
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-center py-8 text-xs text-muted-foreground font-mono">
            Awaiting analysis...
          </p>
        </CardContent>
      </Card>
    );
  }

  const isFake = result.prediction === "FAKE";
  const fakeProb = isFake ? result.confidence * 100 : (1 - result.confidence) * 100;
  const realProb = isFake ? (1 - result.confidence) * 100 : result.confidence * 100;

  const latency = result.processing_time_ms != null
    ? `${result.processing_time_ms.toFixed(0)} ms`
    : "—";
  const tokenCount = result.token_count != null ? String(result.token_count) : "—";
  const modelName = result.model_used || "—";
  const timestamp = new Date(result.analysed_at).toLocaleTimeString();

  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Cpu size={15} className="text-blue-600" />
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            System Parameters
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-0">
        <ProbBar
          label="FAKE_PROB"
          value={fakeProb}
          colorClass="text-red-600"
          barColor="#dc2626"
        />
        <ProbBar
          label="REAL_PROB"
          value={realProb}
          colorClass="text-green-600"
          barColor="#16a34a"
        />
        <Param label="TOKEN_COUNT" value={tokenCount} />
        <Param label="LATENCY" value={latency} />
        <Param label="MODEL" value={modelName} />
        <Param label="TIMESTAMP" value={timestamp} />
      </CardContent>
    </Card>
  );
};

export default SystemParameters;
