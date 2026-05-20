import React, { useState, useEffect } from 'react';
import { getHistory } from '../api';
import {
  Calendar,
  CalendarRange,
  Search,
  Filter,
  Plus,
  Link as LinkIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HistoryTable = ({ onNewAnalysis }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerdict, setFilterVerdict] = useState("ALL");
  const [rows, setRows] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Date period state
  const [datePeriod, setDatePeriod] = useState("all"); // "all" | "custom"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const ROWS_PER_PAGE = 8;

  useEffect(() => {
    setHistoryLoading(true);
    setHistoryError(null);
    getHistory()
      .then(data => {
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRows(sorted);
      })
      .catch((err) => {
        const isNetworkError = !err.response;
        setHistoryError(
          isNetworkError
            ? 'Backend offline — start the server on port 8002'
            : `Server error ${err.response?.status}: could not load history`
        );
      })
      .finally(() => setHistoryLoading(false));
  }, [retryCount]);

  const filtered = rows.filter((row) => {
    if (filterVerdict !== "ALL" && row.prediction !== filterVerdict) return false;
    if (!row.input_text.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    if (datePeriod === "custom") {
      const rowDate = new Date(row.created_at);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (rowDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (rowDate > end) return false;
      }
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handleDatePeriod = (period) => {
    setDatePeriod(period);
    if (period === "all") {
      setStartDate("");
      setEndDate("");
    }
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-surface pb-0 md:pb-0">
      {/* Sidebar: Advanced Filters */}
      <aside className="w-full md:w-80 bg-surface-container-low p-8 space-y-8 overflow-y-auto border-r border-outline-variant/10 shrink-0">
        <div>
          <h2 className="text-on-surface font-bold text-sm uppercase tracking-widest mb-6">Advanced Filters</h2>

          {/* Date Period */}
          <div className="space-y-4 mb-8">
            <label className="text-on-surface-variant text-xs font-semibold block uppercase tracking-wider">Date Period</label>
            <div className="space-y-2">
              <button
                onClick={() => handleDatePeriod("all")}
                className={`w-full bg-surface-container p-3 rounded-xl flex items-center justify-between transition-colors ${
                  datePeriod === "all"
                    ? "ring-2 ring-primary bg-surface-container-highest"
                    : "hover:bg-surface-container-highest"
                }`}
              >
                <span className={`text-sm ${datePeriod === "all" ? "text-primary font-semibold" : ""}`}>All Time</span>
                <Calendar className={`w-4 h-4 ${datePeriod === "all" ? "text-primary" : "text-outline"}`} />
              </button>
              <button
                onClick={() => handleDatePeriod("custom")}
                className={`w-full bg-surface-container p-3 rounded-xl flex items-center justify-between transition-colors ${
                  datePeriod === "custom"
                    ? "ring-2 ring-primary bg-surface-container-highest"
                    : "hover:bg-surface-container-highest"
                }`}
              >
                <span className={`text-sm ${datePeriod === "custom" ? "text-primary font-semibold" : ""}`}>Custom Range</span>
                <CalendarRange className={`w-4 h-4 ${datePeriod === "custom" ? "text-primary" : "text-outline"}`} />
              </button>
            </div>

            {datePeriod === "custom" && (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-on-surface-variant text-[10px] uppercase tracking-wider font-semibold mb-1 block">From</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-on-surface-variant text-[10px] uppercase tracking-wider font-semibold mb-1 block">To</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Analysis Model */}
          <div className="space-y-4 mb-8">
            <label className="text-on-surface-variant text-xs font-semibold block uppercase tracking-wider">Analysis Model</label>
            <div className="space-y-2">
              {/* Active model */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-highest cursor-default">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="rounded border-outline-variant bg-background text-primary focus:ring-primary/20"
                />
                <span className="text-sm">roberta-base-fake-news</span>
              </label>
              {/* Coming soon models */}
              {["bert-base-fake-news", "distilbert-fast"].map((name) => (
                <div key={name} className="flex items-center gap-3 p-3 rounded-xl opacity-50 cursor-not-allowed">
                  <input
                    type="checkbox"
                    disabled
                    className="rounded border-outline-variant bg-background text-primary"
                  />
                  <span className="text-sm flex-1">{name}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-outline border border-outline/30 rounded px-1.5 py-0.5">Soon</span>
                </div>
              ))}
            </div>
          </div>

          {/* Veracity Status */}
          <div className="space-y-4">
            <label className="text-on-surface-variant text-xs font-semibold block uppercase tracking-wider">Veracity Status</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setFilterVerdict("REAL"); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-95 active:scale-90 ${filterVerdict === 'REAL' ? 'bg-secondary-container text-on-secondary-container ring-2 ring-secondary-fixed' : 'bg-surface-container text-on-surface-variant'}`}
              >
                REAL
              </button>
              <button
                onClick={() => { setFilterVerdict("FAKE"); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-95 active:scale-90 ${filterVerdict === 'FAKE' ? 'bg-error-container text-on-error-container ring-2 ring-error' : 'bg-surface-container text-on-surface-variant'}`}
              >
                FAKE
              </button>
              <button
                onClick={() => { setFilterVerdict("ALL"); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-95 active:scale-90 ${filterVerdict === 'ALL' ? 'bg-tertiary-container text-on-tertiary-container ring-2 ring-tertiary' : 'bg-surface-container text-on-surface-variant'}`}
              >
                ALL
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content: Data Table */}
      <section className="flex-1 bg-surface flex flex-col min-w-0">

        {/* Search & Actions Bar */}
        <div className="px-10 py-6 bg-surface flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-outline-variant/5">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input
              type="text"
              placeholder="Search investigation ID, source URL, or metadata..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-6 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-4 bg-surface-container-highest rounded-2xl text-on-surface text-sm font-bold hover:bg-[#2b2c32] transition-colors">
              <Filter className="w-4 h-4" />
              <span>Sort: Newest</span>
            </button>
            <button
              onClick={onNewAnalysis}
              className="flex items-center gap-2 px-6 py-4 bg-primary text-on-primary rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* The Forensic Table */}
        <div className="flex-1 overflow-x-auto px-10 py-4">
          <table className="w-full border-separate border-spacing-y-3 min-w-[800px]">
            <thead>
              <tr className="text-left text-on-surface-variant text-[11px] uppercase tracking-[0.2em] font-bold">
                <th className="px-6 pb-2">Investigative Source</th>
                <th className="px-6 pb-2">Analysis Model</th>
                <th className="px-6 pb-2">Timestamp</th>
                <th className="px-6 pb-2">Outcome</th>
                <th className="px-6 pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {historyLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-on-surface-variant bg-surface-container rounded-2xl">
                    Initializing secure data link...
                  </td>
                </tr>
              ) : historyError ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 bg-error-container/20 rounded-2xl">
                    <p className="text-error font-semibold text-sm mb-3">{historyError}</p>
                    <button
                      onClick={() => setRetryCount(c => c + 1)}
                      className="px-4 py-2 bg-surface-container text-on-surface text-xs font-bold rounded-xl hover:bg-surface-container-high transition-colors"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 bg-surface-container rounded-2xl">
                    <Search className="mx-auto text-on-surface-variant mb-4 w-10 h-10 opacity-30" />
                    <p className="text-on-surface-variant text-sm font-medium">No forensic logs meet criteria.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((row) => {
                  const isFake = row.prediction === 'FAKE';

                  return (
                    <tr key={row.id} className="group bg-surface-container hover:bg-surface-container-high transition-colors">
                      <td className="px-6 py-5 rounded-l-2xl">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0">
                            <LinkIcon className="text-primary w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-on-surface truncate max-w-[240px]">
                              {row.input_text.slice(0, 40) || "Unknown string element"}{row.input_text.length > 40 && '...'}
                            </div>
                            <div className="text-xs text-on-surface-variant truncate max-w-[240px]">
                              id: {String(row.id).split('-')[0]}... ({Math.round(row.confidence * 100)}% conf)
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-mono bg-surface-container-highest px-3 py-1.5 rounded-md text-on-surface-variant border border-outline-variant/10 shadow-inner inline-block">
                          {row.model_used?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant font-light whitespace-nowrap">
                        {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="mx-1">·</span>
                        {new Date(row.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-5">
                        {isFake ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-error-container text-on-error-container text-[10px] font-black uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-error shadow-[0_0_6px_rgba(238,125,119,0.5)]"></span>
                            Synthetic
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]"></span>
                            Authentic
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 rounded-r-2xl text-right">
                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <footer className="px-10 py-6 border-t border-outline-variant/10 flex items-center justify-between">
          <div className="text-xs text-on-surface-variant font-medium">
            Showing <span className="text-on-surface">
              {filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1} - {Math.min(currentPage * ROWS_PER_PAGE, filtered.length)}
            </span> of {filtered.length} investigations
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1 || filtered.length === 0}
              onClick={() => setCurrentPage(p => p - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-highest text-on-surface-variant hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
               {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                 if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                   return (
                     <button
                       key={p}
                       onClick={() => setCurrentPage(p)}
                       className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-colors ${
                         currentPage === p
                           ? 'bg-primary text-on-primary'
                           : 'bg-surface-container-highest text-on-surface hover:bg-[#2b2c32]'
                       }`}
                     >
                       {p}
                     </button>
                   );
                 } else if (p === currentPage - 2 || p === currentPage + 2) {
                   return <div key={`ellipsis-${p}`} className="px-2 text-on-surface-variant">...</div>;
                 }
                 return null;
               })}
            </div>

            <button
              disabled={currentPage === totalPages || filtered.length === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-highest text-on-surface hover:bg-[#2b2c32] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default HistoryTable;
