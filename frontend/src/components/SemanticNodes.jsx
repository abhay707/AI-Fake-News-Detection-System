import { Network } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by",
  "from","up","about","into","through","during","is","are","was","were","be",
  "been","being","have","has","had","do","does","did","will","would","could",
  "should","may","might","shall","can","this","that","these","those","it","its",
  "they","them","their","he","she","him","her","his","we","us","our","you",
  "your","i","me","my","what","which","who","when","where","why","how","all",
  "both","each","few","more","most","other","some","such","no","not","only",
  "same","so","than","too","very","just","then","now","said","says","also",
  "as","if","been","then","after","before","while","since","because","although",
  "however","therefore","thus","still","even","over","under","between","among",
  "against","during","without","within","throughout","upon","using","used",
]);

function extractKeyTerms(text, topN = 14) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)
    .map(w => w.replace(/^['-]+|['-]+$/g, ""))
    .filter(w => w.length > 3 && !STOP_WORDS.has(w) && /^[a-z]/.test(w));

  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));
}

const FAKE_PALETTES = [
  "bg-red-50 text-red-700 border-red-200",
  "bg-orange-50 text-orange-700 border-orange-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-gray-100 text-gray-600 border-gray-200",
];
const REAL_PALETTES = [
  "bg-green-50 text-green-700 border-green-200",
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-teal-50 text-teal-700 border-teal-200",
  "bg-gray-100 text-gray-600 border-gray-200",
];

const SemanticNodes = ({ text, result }) => {
  if (!text || !result) {
    return (
      <Card className="shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Network size={15} className="text-blue-600" />
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Semantic Nodes
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

  const terms = extractKeyTerms(text);
  const maxCount = terms.length ? terms[0].count : 1;
  const isFake = result.prediction === "FAKE";
  const palettes = isFake ? FAKE_PALETTES : REAL_PALETTES;

  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Network size={15} className="text-blue-600" />
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Semantic Nodes
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {terms.length === 0 ? (
          <p className="text-center py-4 text-xs text-muted-foreground font-mono">
            No significant terms found.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {terms.map(({ word, count }, i) => {
              const intensity = count / maxCount;
              const colorClass = palettes[Math.min(i, palettes.length - 1)];
              const sizeClass = intensity > 0.65 ? "text-sm font-semibold" : "text-xs font-medium";
              return (
                <span
                  key={word}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono transition-all ${colorClass} ${sizeClass}`}
                  title={`Appears ${count} time${count !== 1 ? "s" : ""}`}
                >
                  {word}
                  {count > 1 && (
                    <span className="opacity-50 text-[10px]">×{count}</span>
                  )}
                </span>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SemanticNodes;
