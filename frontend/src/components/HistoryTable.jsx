// ── IMPORTS ────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { getHistory } from '../api'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, History, TrendingUp, Search, Trash2 } from "lucide-react";

// ── COMPONENT ──────────────────────────────────────────────
const HistoryTable = () => {
  // ── STATE ──────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerdict, setFilterVerdict] = useState("ALL");
  const [rows, setRows] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const ROWS_PER_PAGE = 8;

  useEffect(() => {
    getHistory()
      .then(data => setRows(data))
      .catch(() => setHistoryError('Could not load history'))
      .finally(() => setHistoryLoading(false))
  }, [])

  // ── DERIVED DATA ───────────────────────────────────────────
  const filtered = rows.filter(
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
        {historyLoading && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Loading history...
          </p>
        )}
        {historyError && (
          <p className="text-sm text-destructive py-4 text-center">
            {historyError}
          </p>
        )}
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
