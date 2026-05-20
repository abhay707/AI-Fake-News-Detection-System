import React from 'react';
import { ShieldCheck, Search, History, BarChart2, ArrowRightLeft, Settings } from 'lucide-react';

export default function DashboardLayout({ children, activeTab = 'dashboard', onTabChange }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-inter">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 w-full flex items-center justify-between px-6 py-4 bg-surface-container-low/90 backdrop-blur-xl z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant/20 shadow-inner inline-flex">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-black tracking-tighter text-on-surface">Digital Verity</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onTabChange && onTabChange('dashboard')}
            className={`font-inter text-[11px] font-semibold uppercase tracking-widest transition-colors duration-300 ${activeTab === 'dashboard' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Analyse
          </button>
          <button 
            onClick={() => onTabChange && onTabChange('history')}
            className={`font-inter text-[11px] font-semibold uppercase tracking-widest transition-colors duration-300 ${activeTab === 'history' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            History
          </button>
          <button 
            onClick={() => onTabChange && onTabChange('stats')}
            className={`font-inter text-[11px] font-semibold uppercase tracking-widest transition-colors duration-300 ${activeTab === 'stats' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Stats
          </button>
          <button
            onClick={() => onTabChange && onTabChange('compare')}
            className={`font-inter text-[11px] font-semibold uppercase tracking-widest transition-colors duration-300 ${activeTab === 'compare' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Compare
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onTabChange && onTabChange('settings')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-surface-container-high hover:bg-surface-container-highest border ${activeTab === 'settings' ? 'border-primary text-primary shadow-[0_0_15px_rgba(173,198,255,0.2)]' : 'border-outline-variant/30 text-on-surface-variant hover:text-on-surface'}`}
            title="Settings & Overview"
          >
             <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className={`mx-auto w-full h-full flex flex-col ${activeTab === 'dashboard' ? 'max-w-7xl px-8 py-10' : ''}`}>
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-10 p-12 bg-surface-container-lowest border-t border-surface-variant/30">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-on-surface flex items-center gap-2">
            Forensic Lens
          </span>
        </div>
        <div className="flex gap-8">
          <span className="font-inter text-xs font-light text-on-surface-variant">Made by @Abhay Chaturvedi</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-3 pb-6 bg-surface-container-lowest/95 backdrop-blur-2xl border-t border-outline-variant/10">
        <button 
          onClick={() => onTabChange && onTabChange('dashboard')}
          className={`flex flex-col items-center justify-center transition-all ${activeTab === 'dashboard' ? 'bg-surface-container text-primary rounded-xl px-3 py-1.5' : 'text-on-surface-variant opacity-60 hover:opacity-100'}`}
        >
          <Search className="w-5 h-5" />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-widest mt-1">Analyse</span>
        </button>
        <button 
          onClick={() => onTabChange && onTabChange('history')}
          className={`flex flex-col items-center justify-center transition-all ${activeTab === 'history' ? 'bg-surface-container text-primary rounded-xl px-3 py-1.5' : 'text-on-surface-variant opacity-60 hover:opacity-100'}`}
        >
          <History className="w-5 h-5" />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-widest mt-1">History</span>
        </button>
        <button 
          onClick={() => onTabChange && onTabChange('stats')}
          className={`flex flex-col items-center justify-center transition-all ${activeTab === 'stats' ? 'bg-surface-container text-primary rounded-xl px-3 py-1.5' : 'text-on-surface-variant opacity-60 hover:opacity-100'}`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-widest mt-1">Stats</span>
        </button>
        <button
          onClick={() => onTabChange && onTabChange('compare')}
          className={`flex flex-col items-center justify-center transition-all ${activeTab === 'compare' ? 'bg-surface-container text-primary rounded-xl px-3 py-1.5' : 'text-on-surface-variant opacity-60 hover:opacity-100'}`}
        >
          <ArrowRightLeft className="w-5 h-5" />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-widest mt-1">Compare</span>
        </button>
      </nav>
    </div>
  );
}
