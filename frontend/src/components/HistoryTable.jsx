// ── IMPORTS ────────────────────────────────────────────────
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, History, TrendingUp, Search, Trash2 } from "lucide-react";

// ── MOCK DATA ──────────────────────────────────────────────
const MOCK_HISTORY = [
  { id: "a1", input_text: "NASA confirms discovery of a new habitable planet in the Alpha Centauri system.", prediction: "REAL", confidence: 0.94, model_used: "roberta-base", created_at: "2026-03-20T10:00:00Z" },
  { id: "a2", input_text: "Shocking: Eating 5 pounds of raw garlic cures all known illnesses overnight!", prediction: "FAKE", confidence: 0.99, model_used: "bert-base", created_at: "2026-03-19T14:30:00Z" },
  { id: "a3", input_text: "Global markets rally as tech stocks see unprecedented growth in Q1.", prediction: "REAL", confidence: 0.88, model_used: "distilbert-base", created_at: "2026-03-19T09:15:00Z" },
  { id: "a4", input_text: "Local man builds working time machine out of microwave parts and a car battery.", prediction: "FAKE", confidence: 0.92, model_used: "roberta-base", created_at: "2026-03-18T16:45:00Z" },
  { id: "a5", input_text: "New federal budget proposes significant increases to renewable energy initiatives.", prediction: "REAL", confidence: 0.81, model_used: "bert-base", created_at: "2026-03-18T11:20:00Z" },
  { id: "a6", input_text: "Aliens have officially landed in Central Park and are requesting to speak with the manager.", prediction: "FAKE", confidence: 0.98, model_used: "distilbert-base", created_at: "2026-03-17T20:10:00Z" },
  { id: "a7", input_text: "Study: Regular exercise linked to improved mental health and longevity.", prediction: "REAL", confidence: 0.96, model_used: "roberta-base", created_at: "2026-03-17T08:05:00Z" },
  { id: "a8", input_text: "Breaking: The moon is actually made of cheese, government cover-up exposed.", prediction: "FAKE", confidence: 0.95, model_used: "bert-base", created_at: "2026-03-16T22:30:00Z" },
  { id: "a9", input_text: "Major infrastructure bill passes Senate with bipartisan support.", prediction: "REAL", confidence: 0.89, model_used: "distilbert-base", created_at: "2026-03-16T15:40:00Z" },
  { id: "a10", input_text: "Drinking bleach destroys the virus inside your body within seconds, claims expert.", prediction: "FAKE", confidence: 0.99, model_used: "roberta-base", created_at: "2026-03-15T18:25:00Z" },
  { id: "a11", input_text: "Scientists develop new drought-resistant crop variety for arid regions.", prediction: "REAL", confidence: 0.85, model_used: "bert-base", created_at: "2026-03-15T09:50:00Z" },
  { id: "a12", input_text: "Secret society of mole people living under New York City demands voting rights.", prediction: "FAKE", confidence: 0.91, model_used: "distilbert-base", created_at: "2026-03-14T21:15:00Z" },
  { id: "a13", input_text: "Tech giant announces revolutionary new solid state battery technology for EVs.", prediction: "REAL", confidence: 0.93, model_used: "roberta-base", created_at: "2026-03-14T12:00:00Z" },
  { id: "a14", input_text: "Celebrity found alive after being cloned at a secret island facility.", prediction: "FAKE", confidence: 0.87, model_used: "bert-base", created_at: "2026-03-13T19:40:00Z" },
  { id: "a15", input_text: "National healthcare reform proposed to lower prescription drug costs.", prediction: "REAL", confidence: 0.84, model_used: "distilbert-base", created_at: "2026-03-13T10:30:00Z" },
  { id: "a16", input_text: "Water turns into wine across several major cities a miracle occurs.", prediction: "FAKE", confidence: 0.96, model_used: "roberta-base", created_at: "2026-03-12T16:55:00Z" },
  { id: "a17", input_text: "The Earth is definitively flat, high-altitude balloon footage confirms.", prediction: "FAKE", confidence: 0.99, model_used: "bert-base", created_at: "2026-03-12T11:20:00Z" },
  { id: "a18", input_text: "Championship finals end in a stunning overtime victory for the underdogs.", prediction: "REAL", confidence: 0.97, model_used: "distilbert-base", created_at: "2026-03-11T23:10:00Z" },
  { id: "a19", input_text: "Government releasing mind-control chemicals through airplane contrails.", prediction: "FAKE", confidence: 0.88, model_used: "roberta-base", created_at: "2026-03-11T14:45:00Z" },
  { id: "a20", input_text: "Famous politician secretly replaced by reptilian shape-shifter years ago.", prediction: "FAKE", confidence: 0.94, model_used: "bert-base", created_at: "2026-03-10T17:30:00Z" },
  { id: "a21", input_text: "Vaccine completely alters human DNA causing physical mutations, report says.", prediction: "FAKE", confidence: 0.99, model_used: "distilbert-base", created_at: "2026-03-10T09:15:00Z" },
  { id: "a22", input_text: "Birds are not real; they are government surveillance drones meant to spy on us.", prediction: "FAKE", confidence: 0.92, model_used: "roberta-base", created_at: "2026-03-09T20:50:00Z" },
  { id: "a23", input_text: "Millions of bees found dead due to new 5G towers being activated.", prediction: "FAKE", confidence: 0.89, model_used: "bert-base", created_at: "2026-03-09T13:40:00Z" }
];

// ── COMPONENT ──────────────────────────────────────────────
const HistoryTable = () => {
  // ── STATE ──────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerdict, setFilterVerdict] = useState("ALL");
  const ROWS_PER_PAGE = 8;

  // ── DERIVED DATA ───────────────────────────────────────────
  const filtered = MOCK_HISTORY.filter(
    (row) =>
      (filterVerdict === "ALL" || row.prediction === filterVerdict) &&
      row.input_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);

  const paginated = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <Card>
      {/* SECTION 1 — CARD HEADER */}
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <History size={20} className="text-blue-600 mr-2" />
          <CardTitle>Prediction History</CardTitle>
          <span className="text-sm text-muted-foreground ml-2">
            ({filtered.length} records)
          </span>
        </div>
        <TrendingUp size={16} className="text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {/* SECTION 2 — FILTER BAR */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "REAL", "FAKE"].map((verdict) => (
              <Button
                key={verdict}
                variant={filterVerdict === verdict ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilterVerdict(verdict);
                  setCurrentPage(1);
                }}
              >
                {verdict}
              </Button>
            ))}
          </div>
        </div>

        {/* SECTION 3 — TABLE */}
        <div className="w-full overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Article Preview
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Verdict
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Model
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-4 py-3 max-w-xs font-medium">
                    {row.input_text.length > 60
                      ? row.input_text.slice(0, 60) + "…"
                      : row.input_text}
                  </td>
                  <td className="px-4 py-3">
                    {row.prediction === "FAKE" ? (
                      <Badge variant="destructive">FAKE</Badge>
                    ) : (
                      <Badge className="bg-green-600 text-white hover:bg-green-700">
                        REAL
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.prediction === "FAKE"
                          ? "text-red-600 font-medium"
                          : "text-green-600 font-medium"
                      }
                    >
                      {Math.round(row.confidence * 100)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                      {row.model_used}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="text-center py-12 text-muted-foreground">
                      <Search size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No records match your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SECTION 4 — PAGINATION FOOTER */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="text-muted-foreground text-xs">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1}–
            {Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length} records
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || filtered.length === 0}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={14} className="mr-1" /> Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                if (
                  p === 1 ||
                  p === totalPages ||
                  (p >= currentPage - 2 && p <= currentPage + 2)
                ) {
                  return (
                    <Button
                      key={p}
                      variant={currentPage === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </Button>
                  );
                } else if (p === currentPage - 3 || p === currentPage + 3) {
                  return <span key={`ellipsis-${p}`} className="px-2 text-muted-foreground">…</span>;
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || filtered.length === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryTable;
