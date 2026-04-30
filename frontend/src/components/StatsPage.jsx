import React from 'react';
import { 
  Calendar, 
  Download, 
  BarChart2, 
  ShieldCheck, 
  AlertTriangle, 
  Timer, 
  TrendingUp, 
  Network, 
  Server, 
  Radio, 
  AlertOctagon, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  History 
} from 'lucide-react';

export default function StatsPage() {
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
            Last 30 Days
          </button>
          <button className="bg-primary text-on-primary px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container p-6 rounded-3xl group hover:bg-surface-container-high transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <BarChart2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-primary">+12.4%</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-medium mb-1">Total Analysed</h3>
          <div className="text-3xl font-black tracking-tighter text-on-surface">1.28M</div>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[72%] transition-all duration-1000 ease-out"></div>
          </div>
        </div>

        <div className="bg-surface-container p-6 rounded-3xl group hover:bg-surface-container-high transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-tertiary">+3.1%</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-medium mb-1">Accuracy Rate</h3>
          <div className="text-3xl font-black tracking-tighter text-on-surface">98.4%</div>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-tertiary w-[98%] transition-all duration-1000 ease-out"></div>
          </div>
        </div>

        <div className="bg-surface-container p-6 rounded-3xl group hover:bg-surface-container-high transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-error-container/20 flex items-center justify-center text-error">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-error">-0.8%</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-medium mb-1">Detected Frauds</h3>
          <div className="text-3xl font-black tracking-tighter text-on-surface">42.5K</div>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-error w-[14%] transition-all duration-1000 ease-out"></div>
          </div>
        </div>

        <div className="bg-surface-container p-6 rounded-3xl group hover:bg-surface-container-high transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
              <Timer className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-on-surface-variant">Avg.</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-medium mb-1">Latent Processing</h3>
          <div className="text-3xl font-black tracking-tighter text-on-surface">142ms</div>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-on-surface-variant w-[45%] transition-all duration-1000 ease-out"></div>
          </div>
        </div>
      </div>

      {/* Main Visualization Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Large Bar Chart Container */}
        <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-[2rem] border-0 relative shadow-inner overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-10 z-10 relative">
            <div>
              <h4 className="text-xl font-bold text-on-surface">Volume Distribution</h4>
              <p className="text-xs text-on-surface-variant mt-1">Daily analysis load across verification nodes</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(173,198,255,0.6)]"></span>
                <span className="text-[10px] uppercase tracking-tighter font-bold text-on-surface-variant">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-surface-container-highest"></span>
                <span className="text-[10px] uppercase tracking-tighter font-bold text-on-surface-variant">Pending</span>
              </div>
            </div>
          </div>
          
          {/* Mock Bar Chart */}
          <div className="flex items-end justify-between h-64 gap-3 px-2 z-10 relative">
            {[
              { day: 'MON', val1: '80%', val2: '60%', hover1: '80%', hover2: '65%' },
              { day: 'TUE', val1: '90%', val2: '75%', hover1: '90%', hover2: '80%' },
              { day: 'WED', val1: '70%', val2: '50%', hover1: '70%', hover2: '55%' },
              { day: 'THU', val1: '100%', val2: '85%', hover1: '100%', hover2: '90%' },
              { day: 'FRI', val1: '85%', val2: '70%', hover1: '85%', hover2: '75%' },
              { day: 'SAT', val1: '50%', val2: '30%', hover1: '50%', hover2: '35%' },
              { day: 'SUN', val1: '40%', val2: '20%', hover1: '40%', hover2: '25%' },
            ].map((item) => (
              <div key={item.day} className="flex-1 flex flex-col gap-2 group">
                <div 
                  className="w-full bg-surface-container-highest rounded-t-lg relative flex items-end transition-all duration-500"
                  style={{ height: item.val1 }}
                >
                  <div 
                    className="w-full bg-primary rounded-t-lg transition-all duration-500 group-hover:bg-primary-dim"
                    style={{ height: item.val2 }}
                  ></div>
                </div>
                <span className="text-[10px] text-center text-on-surface-variant font-bold">{item.day}</span>
              </div>
            ))}
          </div>
          
          {/* Decorative background grid */}
          <div className="absolute inset-0 pointer-events-none opacity-5" 
               style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          </div>
        </div>

        {/* Line Chart / Integrity Map */}
        <div className="bg-surface-container p-8 rounded-[2rem] flex flex-col justify-between group">
          <div>
            <h4 className="text-xl font-bold text-on-surface mb-2">Accuracy Trend</h4>
            <p className="text-xs text-on-surface-variant">Real-time signal fidelity over 24h cycle</p>
          </div>
          <div className="relative h-40 mt-6 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
              <path d="M0,120 Q50,110 80,80 T160,40 T240,60 T320,30 T400,20" fill="none" stroke="#adc6ff" strokeWidth="4" className="shadow-lg drop-shadow-[0_0_8px_rgba(173,198,255,0.4)]"></path>
              <path d="M0,120 Q50,110 80,80 T160,40 T240,60 T320,30 T400,20 V150 H0 Z" fill="url(#grad1)"></path>
              <defs>
                <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#adc6ff', stopOpacity: 0.2 }}></stop>
                  <stop offset="100%" style={{ stopColor: '#adc6ff', stopOpacity: 0 }}></stop>
                </linearGradient>
              </defs>
              <circle cx="400" cy="20" fill="#adc6ff" r="6" className="animate-pulse"></circle>
            </svg>
          </div>
          <div className="pt-6 border-t border-outline-variant/10">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Peak Confidence</span>
                <span className="text-2xl font-black text-on-surface">99.2%</span>
              </div>
              <div className="bg-tertiary-container/30 px-3 py-1.5 rounded-full flex items-center gap-1 border border-tertiary/20">
                <TrendingUp className="w-3.5 h-3.5 text-tertiary" />
                <span className="text-xs font-bold text-tertiary">Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Details & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Breakdown Table */}
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

        {/* Side Metrics / Alerts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-primary-container p-8 rounded-[2rem] text-on-primary-container relative overflow-hidden group shadow-[inset_0_0_20px_rgba(0,67,149,0.5)]">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 block opacity-80">Network Status</span>
              <h4 className="text-3xl font-black mb-4 leading-tight">System fully operational.</h4>
              <p className="text-sm opacity-90 mb-6 font-medium">No forensic discrepancies detected in current verification stream. All filters are nominal.</p>
              <button className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all shadow-sm border border-white/5">
                Review Health
              </button>
            </div>
            {/* Decorative element */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-secondary rounded-full blur-[60px] opacity-10"></div>
          </div>

          <div className="bg-surface-container p-6 rounded-[2rem] flex-grow flex flex-col">
            <h5 className="text-sm font-bold mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Recent Activity
            </h5>
            <div className="space-y-6 flex-grow flex flex-col justify-center">
              <div className="flex gap-4 items-start">
                <div className="w-1 h-8 bg-primary rounded-full mt-0.5 shadow-[0_0_8px_rgba(173,198,255,0.4)]"></div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Bulk verification complete</p>
                  <p className="text-[10px] text-on-surface-variant uppercase mt-1 tracking-wider">2 mins ago • Node Alpha</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-1 h-8 bg-error rounded-full mt-0.5 shadow-[0_0_8px_rgba(238,125,119,0.4)]"></div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Deepfake trace isolated</p>
                  <p className="text-[10px] text-on-surface-variant uppercase mt-1 tracking-wider">14 mins ago • Node Omega</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-1 h-8 bg-tertiary rounded-full mt-0.5 shadow-[0_0_8px_rgba(225,220,253,0.4)]"></div>
                <div>
                  <p className="text-xs font-bold text-on-surface">New data source indexed</p>
                  <p className="text-[10px] text-on-surface-variant uppercase mt-1 tracking-wider">1h ago • API-Relay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
