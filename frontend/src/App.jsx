import { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import NewsInputForm from './components/NewsInputForm';
import ModelSelector from './components/ModelSelector';
import HistoryTable from './components/HistoryTable';
import StatsPage from './components/StatsPage';
// ComparePage hidden until RoBERTa + DistilBERT are retrained
// import ComparePage from './components/ComparePage';
import SettingsPage from './components/SettingsPage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import './App.css';

export default function App() {
  const [selectedModel, setSelectedModel] = useState('roberta-base');
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
              <NewsInputForm />
            </div>
            
            {/* System Parameters & Nodes Sidebar */}
            <div className="xl:col-span-1 flex flex-col gap-6 h-full">
              {/* Parameters */}
              <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col gap-6 shadow-xl shadow-surface-lowest/40">
                <h3 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant">System Parameters</h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-on-surface-variant">
                      <span>Sensitivity</span>
                      <span>0.85</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-primary"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-on-surface-variant">
                      <span>Depth Alpha</span>
                      <span>0.42</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full w-[42%] bg-primary"></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="w-full h-24 bg-surface-container rounded-2xl relative overflow-hidden flex items-center justify-center border-2 border-dashed border-outline-variant/20 group">
                     <div className="w-full h-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] absolute inset-0"></div>
                     <div className="relative text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/50 group-hover:text-primary transition-colors">
                       Awaiting Target
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Semantic Nodes */}
              <div className="bg-surface-container-low p-6 rounded-3xl flex-grow shadow-xl shadow-surface-lowest/40">
                <h3 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-6">Semantic Nodes</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container border border-surface-container-high">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(173,198,255,0.6)]"></span>
                      <span className="text-xs font-medium text-on-surface">Entity Extraction</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container border border-surface-container-high">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-[pulse_2s_ease-in-out_infinite_0.5s] shadow-[0_0_8px_rgba(225,220,253,0.4)]"></span>
                      <span className="text-xs font-medium text-on-surface">Coreference Mesh</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container opacity-50 border border-transparent">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                      <span className="text-xs font-medium text-on-surface">Cross-Source Map</span>
                    </div>
                    <span className="text-[10px] font-bold text-outline-variant uppercase">Standby</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container opacity-50 border border-transparent">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                      <span className="text-xs font-medium text-on-surface">Temporal Logic</span>
                    </div>
                    <span className="text-[10px] font-bold text-outline-variant uppercase">Standby</span>
                  </div>
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

      {/* TODO Week 5 — re-enable when Member 1 delivers retrained checkpoints */}
      {/* Compare tab hidden until RoBERTa + DistilBERT are retrained
      {activeTab === 'compare' && (
        <ComparePage />
      )}
      */}

      {activeTab === 'settings' && (
        <SettingsPage userData={userData} authToken={authToken} setUserData={setUserData} onLogout={handleLogout} />
      )}
    </DashboardLayout>
  );
}
