import { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  BarChart2,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Network,
  Server,
  Radio,
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  XCircle,
  History,
} from 'lucide-react';
import { getStats } from '../api';

const format = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
};

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getStats()
      .then(data => { if (!cancelled) { setStats(data); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const dash = loading ? '—' : null;

  const totalDisplay = dash ?? format(stats?.total ?? 0);
  const accuracyDisplay = dash ?? ((stats?.training_accuracy ?? 0) * 100).toFixed(1) + '%';
  const fraudDisplay = dash ?? format(stats?.fake_count ?? 0);
  const peakDisplay = dash ?? ((stats?.peak_confidence ?? 0) * 100).toFixed(1) + '%';

  const maxDayTotal = stats?.daily_counts
    ? Math.max(...stats.daily_counts.map(d => d.total), 1)
    : 1;

  const BAR_MAX_PX = 160; // pixel height of the tallest bar

  const handleExport = () => {
    if (!stats) return;
    const lines = [
      '# Digital Verity — Forensic Metrics Report',
      `# Generated: ${new Date().toISOString()}`,
      '',
      '## Summary',
      'Metric,Value',
      `Total Analysed,${stats.total}`,
      `Fake Count,${stats.fake_count}`,
      `Real Count,${stats.real_count}`,
      `Peak Confidence,${(stats.peak_confidence * 100).toFixed(2)}%`,
      `Avg Confidence,${(stats.avg_confidence * 100).toFixed(2)}%`,
      `Training Accuracy (WELFake),${(stats.training_accuracy * 100).toFixed(1)}%`,
      '',
      '## Daily Breakdown (Last 7 Days)',
      'Date,Day,Total,Fake,Real',
      ...stats.daily_counts.map(d =>
        `${d.date},${d.day_name},${d.total},${d.fake},${d.real}`
      ),
      '',
      '## Model Distribution',
      'Model,Count',
      ...Object.entries(stats.model_counts).map(([m, c]) => `${m},${c}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-verity-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Dashboard Header */}
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block">System Analytics</span>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Forensic Metrics</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">
            Deep-layer statistical breakdown of verified claims, source integrity clusters, and algorithmic confidence intervals.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-highest px-5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 hover:bg-surface-bright transition-colors">
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </button>
          <button
            onClick={handleExport}
            disabled={!stats}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </section>

      {/* Error banner */}
      {error && (
        <div className="mb-6 px-5 py-4 rounded-2xl bg-error-container/30 text-error text-sm font-medium border border-error/20">
          Could not load stats. Backend may be down. ({error})
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Analysed */}
        <div className="bg-surface-container p-6 rounded-3xl group hover:bg-surface-container-high transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <BarChart2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-primary">Live</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-medium mb-1">Total Analysed</h3>
          <div className="text-3xl font-black tracking-tighter text-on-surface">{totalDisplay}</div>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: stats ? `${Math.min(100, (stats.total / Math.max(stats.total, 1)) * 100)}%` : '0%' }}
            />
          </div>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-surface-container p-6 rounded-3xl group hover:bg-surface-container-high transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-tertiary">WELFake</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-medium mb-0.5">Accuracy Rate</h3>
          <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider mb-2">WELFake test set</p>
          <div className="text-3xl font-black tracking-tighter text-on-surface">{accuracyDisplay}</div>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-tertiary transition-all duration-1000 ease-out"
              style={{ width: stats ? `${(stats.training_accuracy * 100).toFixed(0)}%` : '0%' }}
            />
          </div>
        </div>

        {/* Detected Frauds */}
        <div className="bg-surface-container p-6 rounded-3xl group hover:bg-surface-container-high transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-error-container/20 flex items-center justify-center text-error">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-error">FAKE</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-medium mb-1">Detected Frauds</h3>
          <div className="text-3xl font-black tracking-tighter text-on-surface">{fraudDisplay}</div>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-error transition-all duration-1000 ease-out"
              style={{ width: stats && stats.total > 0 ? `${Math.round((stats.fake_count / stats.total) * 100)}%` : '0%' }}
            />
          </div>
        </div>

        {/* Peak Confidence */}
        <div className="bg-surface-container p-6 rounded-3xl group hover:bg-surface-container-high transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-on-surface-variant">Peak</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-medium mb-1">Peak Confidence</h3>
          <div className="text-3xl font-black tracking-tighter text-on-surface">{peakDisplay}</div>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-on-surface-variant transition-all duration-1000 ease-out"
              style={{ width: stats ? `${Math.round(stats.peak_confidence * 100)}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Main Visualization Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Volume Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-[2rem] relative shadow-inner overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-10 z-10 relative">
            <div>
              <h4 className="text-xl font-bold text-on-surface">Volume Distribution</h4>
              <p className="text-xs text-on-surface-variant mt-1">Daily analysis load — last 7 days</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(173,198,255,0.6)]"></span>
                <span className="text-[10px] uppercase tracking-tighter font-bold text-on-surface-variant">Real</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-error shadow-[0_0_8px_rgba(238,125,119,0.4)]"></span>
                <span className="text-[10px] uppercase tracking-tighter font-bold text-on-surface-variant">Fake</span>
              </div>
            </div>
          </div>

          {/* Bar chart — pixel heights so bars actually render */}
          <div className="flex items-end gap-3 px-2 z-10 relative" style={{ height: `${BAR_MAX_PX + 36}px` }}>
            {loading ? (
              Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: `${BAR_MAX_PX + 36}px` }}>
                  <div className="w-full bg-surface-container-highest rounded-t-lg animate-pulse" style={{ height: '32px' }} />
                  <span className="text-[10px] text-on-surface-variant font-bold opacity-40">···</span>
                </div>
              ))
            ) : (
              (stats?.daily_counts ?? []).map((d) => {
                const barPx = d.total > 0
                  ? Math.max(Math.round((d.total / maxDayTotal) * BAR_MAX_PX), 4)
                  : 0;
                const fakePx = d.total > 0 ? Math.round((d.fake / d.total) * barPx) : 0;
                const realPx = barPx - fakePx;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center justify-end gap-1.5 group">
                    {/* Stacked bar: real (primary) on top, fake (error) on bottom */}
                    <div className="w-full flex flex-col justify-end rounded-t-lg overflow-hidden transition-all duration-700"
                      style={{ height: `${barPx}px`, minHeight: barPx > 0 ? '4px' : '0' }}>
                      <div className="w-full bg-primary transition-all duration-500 group-hover:opacity-90"
                        style={{ height: `${realPx}px` }} />
                      <div className="w-full bg-error transition-all duration-500 group-hover:opacity-90"
                        style={{ height: `${fakePx}px` }} />
                    </div>
                    <span className="text-[10px] text-center text-on-surface-variant font-bold leading-none">{d.day_name}</span>
                    <span className="text-[10px] text-center font-mono text-on-surface leading-none">{d.total > 0 ? d.total : ''}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Decorative background grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
        </div>

        {/* Accuracy Trend */}
        <div className="bg-surface-container p-8 rounded-[2rem] flex flex-col justify-between group">
          <div>
            <h4 className="text-xl font-bold text-on-surface mb-2">Accuracy Trend</h4>
            <p className="text-xs text-on-surface-variant">Model signal fidelity (WELFake validation)</p>
          </div>
          <div className="relative h-40 mt-6 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
              <path d="M0,120 Q50,110 80,80 T160,40 T240,60 T320,30 T400,20" fill="none" stroke="#adc6ff" strokeWidth="4" className="drop-shadow-[0_0_8px_rgba(173,198,255,0.4)]" />
              <path d="M0,120 Q50,110 80,80 T160,40 T240,60 T320,30 T400,20 V150 H0 Z" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#adc6ff', stopOpacity: 0.2 }} />
                  <stop offset="100%" style={{ stopColor: '#adc6ff', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <circle cx="400" cy="20" fill="#adc6ff" r="6" className="animate-pulse" />
            </svg>
          </div>
          <div className="pt-6 border-t border-outline-variant/10">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Peak Confidence</span>
                <span className="text-2xl font-black text-on-surface">{peakDisplay}</span>
              </div>
              <div className="bg-tertiary-container/30 px-3 py-1.5 rounded-full flex items-center gap-1 border border-tertiary/20">
                <TrendingUp className="w-3.5 h-3.5 text-tertiary" />
                <span className="text-xs font-bold text-tertiary">Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Node Breakdown Table */}
        <div className="lg:col-span-8 bg-surface-container p-1 rounded-[2rem] overflow-hidden">
          <div className="px-8 py-6 flex items-center justify-between">
            <h4 className="text-lg font-bold">Node Breakdown</h4>
            <button className="text-primary text-xs font-bold uppercase tracking-widest hover:text-primary-dim transition-colors">View All Clusters</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-xl">
                  <th className="px-8 py-4 first:rounded-l-xl">Verification Node</th>
                  <th className="px-4 py-4">Throughput</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Integrity</th>
                  <th className="px-8 py-4 text-right last:rounded-r-xl">Load</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5 text-sm">
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Network className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-on-surface">Alpha-Seven-9</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 font-medium text-on-surface-variant">42.4 GB/s</td>
                  <td className="px-4 py-5">
                    <span className="bg-secondary-container/50 text-secondary px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-secondary/20">Active</span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-1.5 text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold">Verified</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-mono text-xs text-on-surface">84.2%</td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Server className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-on-surface">Delta-Core-Primary</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 font-medium text-on-surface-variant">118.2 GB/s</td>
                  <td className="px-4 py-5">
                    <span className="bg-secondary-container/50 text-secondary px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-secondary/20">Active</span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-1.5 text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold">Verified</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-mono text-xs text-on-surface">96.8%</td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                        <Radio className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-on-surface">External-Relay-S</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 font-medium text-on-surface-variant">8.1 GB/s</td>
                  <td className="px-4 py-5">
                    <span className="bg-tertiary-container/30 text-tertiary px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-tertiary/20">Idle</span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-xs font-bold">Uncertain</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-mono text-xs text-on-surface">12.1%</td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors group border-b-0">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-error-container/20 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
                        <AlertOctagon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-on-surface">Omega-Bridge-4</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 font-medium text-on-surface-variant">0.0 GB/s</td>
                  <td className="px-4 py-5">
                    <span className="bg-error-container/30 text-error px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-error/20">Critical</span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-1.5 text-error">
                      <XCircle className="w-4 h-4" />
                      <span className="text-xs font-bold">Failed</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-mono text-xs text-on-surface">0.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-primary-container p-8 rounded-[2rem] text-on-primary-container relative overflow-hidden group shadow-[inset_0_0_20px_rgba(0,67,149,0.5)]">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 block opacity-80">Network Status</span>
              <h4 className="text-3xl font-black mb-4 leading-tight">System fully operational.</h4>
              <p className="text-sm opacity-90 mb-6 font-medium">
                {stats
                  ? `${stats.total} prediction${stats.total !== 1 ? 's' : ''} logged — ${stats.real_count} verified real, ${stats.fake_count} flagged fake.`
                  : 'No forensic discrepancies detected in current verification stream.'}
              </p>
              <button className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all shadow-sm border border-white/5">
                Review Health
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-secondary rounded-full blur-[60px] opacity-10" />
          </div>

          <div className="bg-surface-container p-6 rounded-[2rem] flex-grow flex flex-col">
            <h5 className="text-sm font-bold mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Model Distribution
            </h5>
            <div className="space-y-4 flex-grow flex flex-col justify-center">
              {loading ? (
                <p className="text-xs text-on-surface-variant">Loading...</p>
              ) : stats?.model_counts && Object.keys(stats.model_counts).length > 0 ? (
                Object.entries(stats.model_counts).map(([model, count]) => {
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={model} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                        <span className="font-mono">{model}</span>
                        <span>{count} ({pct}%)</span>
                      </div>
                      <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-on-surface-variant opacity-60">No predictions yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
