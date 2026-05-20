import { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import NewsInputForm from './components/NewsInputForm';
import ModelSelector from './components/ModelSelector';
import HistoryTable from './components/HistoryTable';
import StatsPage from './components/StatsPage';
import ComparePage from './components/ComparePage';
import SettingsPage from './components/SettingsPage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import './App.css';

export default function App() {
  const [selectedModel, setSelectedModel] = useState('roberta-base');
  const [latestResult, setLatestResult] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appView, setAppView] = useState('landing');
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('verity_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('verity_token'));

  const handleAuthSuccess = (user, token) => {
    setUserData(user);
    setAuthToken(token);
    localStorage.setItem('verity_user', JSON.stringify(user));
    if (token) localStorage.setItem('verity_token', token);
    setAppView('app');
  };

  const handleLogout = () => {
    setUserData(null);
    setAuthToken(null);
    localStorage.removeItem('verity_user');
    localStorage.removeItem('verity_token');
    setAppView('landing');
  };

  if (appView === 'landing') {
    return <LandingPage onStart={() => setAppView('app')} onLoginClick={() => setAppView('login')} onSignupClick={() => setAppView('signup')} />;
  }
  if (appView === 'login') {
    return <LoginPage onLogin={handleAuthSuccess} onNavigateToSignup={() => setAppView('signup')} onBackToLanding={() => setAppView('landing')} />;
  }
  if (appView === 'signup') {
    return <SignupPage onSignup={handleAuthSuccess} onNavigateToLogin={() => setAppView('login')} onBackToLanding={() => setAppView('landing')} />;
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && (
        <>
          <div className="w-full flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">Analysis Dashboard</h2>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start w-full">
            {/* Main Interface */}
            <div className="xl:col-span-2 flex flex-col gap-2">
              <div className="w-full">
                <ModelSelector 
                  selectedModel={selectedModel} 
                  onModelChange={setSelectedModel} 
                />
              </div>
              <NewsInputForm selectedModel={selectedModel} onPredictionComplete={setLatestResult} />
            </div>
            
            {/* Live Telemetry Sidebar */}
            <div className="xl:col-span-1 flex flex-col gap-6 h-full">

              {/* Section 1 — Analysis Telemetry */}
              <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col gap-6 shadow-xl shadow-surface-lowest/40">
                <h3 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant">Analysis Telemetry</h3>
                <div className="space-y-5">
                  {/* Confidence */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-on-surface-variant">
                      <span>Confidence</span>
                      <span className="font-mono text-on-surface">
                        {latestResult ? `${Math.round(latestResult.confidence * 100)}%` : '—'}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-700 ease-out"
                        style={{ width: latestResult ? `${Math.round(latestResult.confidence * 100)}%` : '0%' }}
                      />
                    </div>
                  </div>
                  {/* Processing Time */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-on-surface-variant">
                      <span>Processing Time</span>
                      <span className="font-mono text-on-surface">
                        {latestResult ? `${Math.round(latestResult.processing_time_ms)}ms` : '—'}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                      {/* cap bar at 2000ms max for display */}
                      <div
                        className="h-full bg-tertiary transition-all duration-700 ease-out"
                        style={{ width: latestResult ? `${Math.min(100, (latestResult.processing_time_ms / 2000) * 100)}%` : '0%' }}
                      />
                    </div>
                  </div>
                  {/* Token Usage */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-on-surface-variant">
                      <span>Token Usage</span>
                      <span className="font-mono text-on-surface">
                        {latestResult ? `${latestResult.token_count} / 512` : '—'}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary transition-all duration-700 ease-out"
                        style={{ width: latestResult ? `${Math.round((latestResult.token_count / 512) * 100)}%` : '0%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2 — Last Verdict */}
                <div className="pt-2">
                  {latestResult ? (
                    <div className={`w-full rounded-2xl p-4 flex flex-col gap-2 border ${
                      latestResult.prediction === 'FAKE'
                        ? 'bg-error-container/20 border-error/20'
                        : 'bg-emerald-500/10 border-emerald-500/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black uppercase tracking-widest ${
                          latestResult.prediction === 'FAKE' ? 'text-error' : 'text-emerald-400'
                        }`}>
                          {latestResult.prediction === 'FAKE' ? '⬤ Synthetic' : '⬤ Authentic'}
                        </span>
                        <span className="text-[10px] font-mono text-on-surface-variant">
                          {latestResult.analysed_at
                            ? new Date(latestResult.analysed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            : 'Just now'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                        {latestResult.model_used}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-20 bg-surface-container rounded-2xl flex items-center justify-center border-2 border-dashed border-outline-variant/20">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/50">
                        Awaiting Target
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3 — Diagnostic Modules */}
              <div className="bg-surface-container-low p-6 rounded-3xl flex-grow shadow-xl shadow-surface-lowest/40">
                <h3 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-6">Diagnostic Modules</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Model Inference',  active: !!latestResult },
                    { label: 'Database Logging', active: !!latestResult },
                    { label: 'Tokenizer',        active: !!(latestResult?.token_count > 0) },
                    { label: 'History Sync',     active: true },
                  ].map(({ label, active }) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-500 ${
                        active
                          ? 'bg-surface-container border-surface-container-high'
                          : 'bg-surface-container opacity-50 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${
                          active
                            ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(173,198,255,0.6)]'
                            : 'bg-outline-variant'
                        }`} />
                        <span className="text-xs font-medium text-on-surface">{label}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${
                        active ? 'text-on-surface-variant' : 'text-outline-variant'
                      }`}>
                        {active ? 'Active' : 'Standby'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <HistoryTable onNewAnalysis={() => setActiveTab('dashboard')} />
      )}

      {activeTab === 'stats' && (
        <StatsPage />
      )}

      {activeTab === 'compare' && (
        <ComparePage />
      )}

      {activeTab === 'settings' && (
        <SettingsPage userData={userData} authToken={authToken} setUserData={setUserData} onLogout={handleLogout} />
      )}
    </DashboardLayout>
  );
}
