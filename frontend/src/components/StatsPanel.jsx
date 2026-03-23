// ── IMPORTS ────────────────────────────────────────────────
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart2, Trophy, Info, FlaskConical } from "lucide-react";

// ── STATS DATA ─────────────────────────────────────────────
const MODEL_STATS = [
  {
    id:        "roberta-base",
    name:      "RoBERTa",
    fullName:  "roberta-base",
    accuracy:  0.984,
    precision: 0.981,
    recall:    0.986,
    f1:        0.983,
    roc_auc:   0.997,
    trainTime: "42 min",
    color:     "#2563EB",
    best:      true,
  },
  {
    id:        "bert-base",
    name:      "BERT",
    fullName:  "bert-base-uncased",
    accuracy:  0.971,
    precision: 0.968,
    recall:    0.973,
    f1:        0.970,
    roc_auc:   0.994,
    trainTime: "38 min",
    color:     "#7C3AED",
    best:      false,
  },
  {
    id:        "distilbert-base",
    name:      "DistilBERT",
    fullName:  "distilbert-base-uncased",
    accuracy:  0.963,
    precision: 0.959,
    recall:    0.965,
    f1:        0.962,
    roc_auc:   0.991,
    trainTime: "21 min",
    color:     "#059669",
    best:      false,
  },
];

const CHART_DATA = MODEL_STATS.map(m => ({
  name:  m.name,
  F1:    Math.round(m.f1 * 1000) / 10,
  color: m.color,
}));

// ── COMPONENT ──────────────────────────────────────────────
const StatsPanel = () => {
// ── RENDER ─────────────────────────────────────────────────
  return (
    <Card>
      {/* SECTION 1 — CARD HEADER */}
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <BarChart2 size={20} className="text-blue-600 mr-2" />
          <CardTitle>Model Performance</CardTitle>
        </div>
        <Badge variant="outline" className="text-xs gap-1">
          <FlaskConical size={12} /> ISOT Test Set
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* SECTION 2 — F1 BAR CHART */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            F1-Score Comparison (%)
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={CHART_DATA}
              barSize={48}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[94, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [value + "%", "F1 Score"]}
                contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="F1" radius={[6, 6, 0, 0]}>
                {CHART_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SECTION 3 — METRICS TABLE */}
        <div>
          <hr className="border-border mb-3" />
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
            Detailed Metrics
          </p>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-xs text-muted-foreground font-medium text-left">
                    Model
                  </th>
                  <th className="pb-2 text-xs text-muted-foreground font-medium text-right">
                    Acc
                  </th>
                  <th className="pb-2 text-xs text-muted-foreground font-medium text-right">
                    Prec
                  </th>
                  <th className="pb-2 text-xs text-muted-foreground font-medium text-right">
                    Rec
                  </th>
                  <th className="pb-2 text-xs text-muted-foreground font-medium text-right">
                    F1
                  </th>
                  <th className="pb-2 text-xs text-muted-foreground font-medium text-right">
                    AUC
                  </th>
                  <th className="pb-2 text-xs text-muted-foreground font-medium text-right">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {MODEL_STATS.map(model => (
                  <tr key={model.id} className="border-b last:border-0">
                    <td className="py-3 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: model.color }}
                      />
                      <div>
                        <p className="font-medium text-sm">{model.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {model.fullName}
                        </p>
                      </div>
                      {model.best && <Trophy size={14} className="text-amber-500 ml-1" />}
                    </td>
                    <td className="py-3 text-right text-sm font-mono">
                      {(model.accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-right text-sm font-mono">
                      {(model.precision * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-right text-sm font-mono">
                      {(model.recall * 100).toFixed(1)}%
                    </td>
                    <td
                      className="py-3 text-right text-sm font-mono font-bold"
                      style={{ color: model.color }}
                    >
                      {(model.f1 * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-right text-sm font-mono">
                      {(model.roc_auc * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-right text-xs text-muted-foreground">
                      {model.trainTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 4 — DISCLAIMER FOOTER */}
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground mt-2">
          <Info size={14} className="shrink-0 mt-0.5" />
          <p>
            Results from fine-tuning on the ISOT Fake News Dataset
            (80/10/10 train/val/test split). Metrics reported on the
            held-out test set only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsPanel;
