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
  Download,
  FileText
} from "lucide-react";

const HistoryTable = ({ onNewAnalysis }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerdict, setFilterVerdict] = useState("ALL");
  const [rows, setRows] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const ROWS_PER_PAGE = 8;

  useEffect(() => {
    getHistory()
      .then(data => {
        // Sort newest first
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRows(sorted);
      })
      .catch(() => setHistoryError('Could not load history'))
      .finally(() => setHistoryLoading(false));
  }, []);

  const filtered = rows.filter(
    (row) =>
      (filterVerdict === "ALL" || row.prediction === filterVerdict) &&
      row.input_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-surface pb-0 md:pb-0">
      {/* Sidebar: Advanced Filters */}
      <aside className="w-full md:w-80 bg-surface-container-low p-8 space-y-8 overflow-y-auto border-r border-outline-variant/10 shrink-0">
        <div>
          <h2 className="text-on-surface font-bold text-sm uppercase tracking-widest mb-6">Advanced Filters</h2>
          
          {/* Date Range */}
          <div className="space-y-4 mb-8">
            <label className="text-on-surface-variant text-xs font-semibold block uppercase tracking-wider">Date Period</label>
            <div className="space-y-2">
              <div className="bg-surface-container p-3 rounded-xl flex items-center justify-between group hover:bg-surface-container-highest transition-colors cursor-pointer">
                <span className="text-sm">All Time</span>
                <Calendar className="w-4 h-4 text-outline" />
              </div>
              <div className="bg-surface-container p-3 rounded-xl flex items-center justify-between group hover:bg-surface-container-highest transition-colors cursor-pointer border border-primary/20">
                <span className="text-sm text-primary">Custom Range</span>
                <CalendarRange className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
          
          {/* Model Type */}
          <div className="space-y-4 mb-8">
            <label className="text-on-surface-variant text-xs font-semibold block uppercase tracking-wider">Analysis Model</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer">
                <input type="checkbox" className="rounded border-outline-variant bg-background text-primary focus:ring-primary/20" />
                <span className="text-sm">bert-base-fake-news</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer">
                <input type="checkbox" className="rounded border-outline-variant bg-background text-primary focus:ring-primary/20" />
                <span className="text-sm">distilbert-fast</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-highest cursor-pointer">
                <input type="checkbox" checked className="rounded border-outline-variant bg-background text-primary focus:ring-primary/20" />
                <span className="text-sm">roberta-base-fake-news</span>
              </label>
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
        
        {/* Quick Export Card */}
        <div className="bg-primary-container p-6 rounded-3xl relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[0.98] mt-auto">
          <div className="relative z-10">
            <h4 className="text-on-primary-container font-bold text-lg leading-tight mb-2">Export Forensic Protocol</h4>
            <p className="text-on-primary-container/70 text-xs mb-4">Generate signed PDF for current filtered results.</p>
            <div className="flex items-center gap-2 text-on-primary-container font-bold text-xs uppercase tracking-widest">
              <span>Download</span>
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <FileText className="w-24 h-24" />
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
                  <td colSpan="5" className="text-center py-10 text-error bg-error-container/20 rounded-2xl">
                    {historyError}
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
                              id: {row.id.split('-')[0]}... ({Math.round(row.confidence * 100)}% conf)
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
