import { CheckCircle2 } from "lucide-react";

// ModelSelector renders the selectable models as stat cards
// RoBERTa is active, other models are visually disabled with "Coming Soon" status.
const ModelSelector = ({ selectedModel = 'roberta-base', onModelChange }) => {
  const models = [
    {
      id: "roberta-base",
      name: "RoBERTa-base",
      badge: "Active",
      accuracy: "97.2%",
      speed: "Fast",
      parameters: "125M",
      description: "Robustly optimized BERT approach, best overall accuracy",
      disabled: false,
    },
    {
      id: "bert-base",
      name: "BERT-base",
      badge: "Active",
      accuracy: "96.1%",
      speed: "Medium",
      parameters: "110M",
      description: "Bidirectional encoder, strong general-purpose baseline",
      disabled: false,
    },
    {
      id: "distilbert-base",
      name: "DistilBERT",
      badge: "Active",
      accuracy: "94.5%",
      speed: "Fast",
      parameters: "66M",
      description: "Lighter, faster, distilled version of BERT",
      disabled: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {models.map((model) => {
        const isSelected = model.id === selectedModel;
        const isDisabled = model.disabled;
        
        return (
          <div
            key={model.id}
            onClick={() => !isDisabled && onModelChange(model.id)}
            className={`relative p-4 rounded-xl border-2 transition-all bg-surface-container ${
              isDisabled 
                ? "opacity-40 cursor-not-allowed border-transparent" 
                : isSelected 
                  ? "border-blue-500 bg-blue-500/10 shadow-md cursor-pointer" 
                  : "border-transparent border-surface-variant/30 hover:border-surface-variant hover:bg-surface-container-high cursor-pointer"
            }`}
          >
            {isSelected && (
              <CheckCircle2 className="absolute top-4 right-4 text-blue-500" size={20} />
            )}
            
            <div className="flex items-center gap-2 mb-2 pr-6">
              <h3 className="font-bold text-on-surface">{model.name}</h3>
              {model.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                  model.badge === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {model.badge}
                </span>
              )}
            </div>
            
            <p className="text-xs text-on-surface-variant mb-4 h-8">
              {model.description}
            </p>
            
            <div className="grid grid-cols-3 gap-2 text-xs border-t border-surface-variant/50 pt-3">
              <div className="flex flex-col">
                <span className="text-on-surface-variant/70 mb-1">Accuracy</span>
                <span className="font-mono font-medium text-on-surface">{model.accuracy}</span>
              </div>
              <div className="flex flex-col border-l border-surface-variant/50 pl-2">
                <span className="text-on-surface-variant/70 mb-1">Speed</span>
                <span className="font-medium text-on-surface">{model.speed}</span>
              </div>
              <div className="flex flex-col border-l border-surface-variant/50 pl-2">
                <span className="text-on-surface-variant/70 mb-1">Params</span>
                <span className="font-mono font-medium text-on-surface">{model.parameters}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ModelSelector;
