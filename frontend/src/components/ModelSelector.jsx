// ── IMPORTS ────────────────────────────────────────────────
import { Badge } from "@/components/ui/badge";
import { Zap, Brain, Gauge, CheckCircle2, Cpu } from "lucide-react";

// ── MODEL CONFIG ───────────────────────────────────────────
const MODELS = [
  {
    id:          "roberta-base",
    name:        "RoBERTa",
    fullName:    "roberta-base",
    description: "Best accuracy. Optimised pre-training with dynamic masking and larger batch sizes.",
    accuracy:    98,
    speed:       "Slow",
    params:      "125M",
    recommended: true,
    icon:        Brain,
    speedColor:  "text-amber-600",
  },
  {
    id:          "bert-base",
    name:        "BERT",
    fullName:    "bert-base-uncased",
    description: "Strong baseline transformer with bidirectional context understanding.",
    accuracy:    97,
    speed:       "Medium",
    params:      "110M",
    recommended: false,
    icon:        Cpu,
    speedColor:  "text-blue-600",
  },
  {
    id:          "distilbert-base",
    name:        "DistilBERT",
    fullName:    "distilbert-base-uncased",
    description: "Lightweight and fast. 40% smaller than BERT with 97% of its performance.",
    accuracy:    96,
    speed:       "Fast",
    params:      "66M",
    recommended: false,
    icon:        Zap,
    speedColor:  "text-green-600",
  },
];

// ── COMPONENT ──────────────────────────────────────────────
const ModelSelector = ({ selectedModel, onModelChange }) => {
  const activeModel = MODELS.find(m => m.id === selectedModel);

// ── RENDER ─────────────────────────────────────────────────
  return (
    <div>
      <p className="text-sm font-medium mb-3">Select Model</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MODELS.map((model) => {
          const isSelected = selectedModel === model.id;
          const Icon = model.icon;

          return (
            <div
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className={`cursor-pointer rounded-xl border-2 p-4 space-y-3 transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-border bg-background hover:border-blue-300 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <Icon
                  size={22}
                  className={isSelected ? "text-blue-600" : "text-muted-foreground"}
                />
                <div className="flex flex-col items-end gap-1">
                  {model.recommended && (
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                      Recommended
                    </Badge>
                  )}
                  {isSelected && <CheckCircle2 size={18} className="text-blue-600" />}
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm">{model.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {model.fullName}
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {model.description}
              </p>

              <div className="grid grid-cols-3 gap-1 text-xs">
                <div>
                  <p className="text-muted-foreground">Accuracy</p>
                  <p className="font-semibold">{model.accuracy}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Speed</p>
                  <p className={`font-semibold ${model.speedColor}`}>
                    {model.speed}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Params</p>
                  <p className="font-semibold">{model.params}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
        <Gauge size={14} />
        <span>
          Using <span className="font-mono font-medium text-foreground">{activeModel.fullName}</span> — {activeModel.accuracy}% accuracy on ISOT test set
        </span>
      </div>
    </div>
  );
};

export default ModelSelector;
