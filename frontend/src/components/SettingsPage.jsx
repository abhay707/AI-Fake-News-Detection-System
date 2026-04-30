import React, { useState, useEffect } from 'react';
import { IdCard, Camera, PieChart, Brain, Moon, FileText, Check, X, ShieldAlert, LogOut } from 'lucide-react';
import axios from 'axios';
import { getHistory } from '../api';

export default function SettingsPage({ userData, authToken, setUserData, onLogout }) {
  const [userInfo, setUserInfo] = useState({
    name: 'Alex Sterling',
    id: 'VERITY-7742-X',
    email: 'a.sterling@forensics.digital',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW2r1gU1EuB6W5aTg17aNRxKVzPdpasARMD5fXDb0bjQ0MumlkSYqouX-tZmLQRuJLbcyGjrjIpCxVpR84dbCFQYxfRj3B3SBDYBDYv_fWB-TkyRXiPYgU1lg22Jskk06w8qjqpqmhaP5sV7U4UXYSu_ia02vpc6GnxzpxYj4r2T-Jo2yrQP71Q5VxYni1cffy0CL0q08-6ovBEGEEuJhKTZMP-eHdrQw4UiVMBUVgEHOFPpeVqQv39hzwYxci16hBQPfL5ByuSSY'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [defaultModel, setDefaultModel] = useState('RoBERTa');
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({ total: 0, fakePercent: 0, realPercent: 0 });

  useEffect(() => {
    getHistory().then(data => {
      if (data && data.length > 0) {
        const total = data.length;
        const fakes = data.filter(d => d.prediction === 'FAKE').length;
        const fakePercent = Math.round((fakes / total) * 100);
        const realPercent = 100 - fakePercent;
        setStats({ total, fakePercent, realPercent });
      }
    }).catch(err => console.error("Failed to fetch history for stats", err));
    if (userData) {
      setUserInfo(userData);
    }
    const savedModel = localStorage.getItem('verity_model');
    if (savedModel) setDefaultModel(savedModel);
  }, [userData]);

  const toggleEdit = async () => {
    if (isEditing) {
      // Save changes
      setIsSaving(true);
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/auth/update`, userInfo, {
           headers: { Authorization: `Bearer ${authToken}` }
        });
        localStorage.setItem('verity_user', JSON.stringify(userInfo));
        setUserData(userInfo);
      } catch(err) {
        console.error("Failed to update profile", err);
        // Handle error gracefully
      } finally {
        setIsSaving(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        setUserInfo(prev => ({ ...prev, image: newImage }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModelSelect = (model) => {
    setDefaultModel(model);
    localStorage.setItem('verity_model', model);
  };

  const availableModels = ['RoBERTa', 'BERT', 'DistilBERT'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Settings & Overview</h1>
        <p className="text-on-surface-variant">Manage your preferences and monitor your analysis activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Primary Settings & Stats (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal Credentials Bento Card */}
          <section className="bg-surface-container p-8 rounded-[2rem] relative overflow-hidden group border border-outline-variant/10">
            {!userData && (
              <div className="absolute inset-0 z-50 bg-surface-container/60 backdrop-blur-md flex flex-col items-center justify-center border border-outline-variant/20 rounded-[2rem]">
                <ShieldAlert className="w-10 h-10 text-primary mb-3" />
                <h3 className="text-lg font-bold text-on-surface mb-1">Authentication Required</h3>
                <p className="text-xs text-on-surface-variant max-w-[250px] text-center">Kindly log in first to view or modify your investigator credentials.</p>
              </div>
            )}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32"></div>
            <div className={`relative z-10 ${!userData ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <IdCard className="text-primary w-6 h-6" />
                  Personal Credentials
                </h2>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={toggleEdit}
                    disabled={isSaving}
                    className="text-sm font-bold text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    {isEditing ? (
                      <>{isSaving ? <span className="animate-pulse">Saving...</span> : <><Check className="w-4 h-4" /> Save Info</>}</>
                    ) : (
                      'Edit Info'
                    )}
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-sm font-bold text-error hover:bg-error/10 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative">
                  <div className="h-32 w-32 rounded-3xl overflow-hidden border-2 border-primary/30 p-1">
                    <img 
                      alt="Investigator Profile" 
                      className="h-full w-full object-cover rounded-2xl" 
                      src={userInfo.image}
                    />
                  </div>
                  {isEditing && (
                    <label htmlFor="imageUpload" className="absolute -bottom-2 -right-2 bg-surface-container-highest p-2 rounded-xl border border-outline-variant/50 text-on-surface hover:text-primary transition-colors cursor-pointer shadow-lg overflow-hidden hover:scale-110">
                      <Camera className="w-4 h-4" />
                      <input 
                        id="imageUpload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </label>
                  )}
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="name"
                        value={userInfo.name} 
                        onChange={handleChange}
                        className="w-full text-lg font-medium text-on-surface py-2 px-4 bg-surface-container-high rounded-xl border border-primary/30 focus:outline-none focus:border-primary transition-colors"
                      />
                    ) : (
                      <div className="text-lg font-medium text-on-surface py-2 px-4 bg-surface-container-low rounded-xl border border-transparent">{userInfo.name}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Investigator ID</label>
                    <div className="text-lg font-mono text-primary py-2 px-4 bg-surface-container-low rounded-xl tracking-tighter border border-transparent opacity-80 select-none">{userInfo.id}</div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Primary Email</label>
                    <div className="text-lg font-medium text-on-surface py-2 px-4 bg-surface-container-low rounded-xl border border-transparent opacity-80 select-none">{userInfo.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Activity Breakdown Card */}
          <section className="bg-surface-container p-8 rounded-[2rem] border border-outline-variant/10 relative overflow-hidden group">
            <div className="mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                <PieChart className="text-primary w-6 h-6" />
                Prediction breakdown — all time
              </h2>
            </div>

            <div className="space-y-6 flex flex-col items-stretch">
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-error-container/20 border border-error/20 rounded-2xl">
                  <p className="text-[10px] font-bold text-error uppercase tracking-widest mb-1">Fake Detected</p>
                  <p className="text-2xl font-black text-on-surface">{stats.fakePercent}%</p>
                </div>
                <div className="flex-1 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Real Verified</p>
                  <p className="text-2xl font-black text-on-surface">{stats.realPercent}%</p>
                </div>
              </div>

              {/* Horizontal Split Bar */}
              <div className="w-full h-4 bg-surface-container-low rounded-full overflow-hidden flex">
                <div className="h-full bg-error" style={{ width: `${stats.fakePercent}%` }}></div>
                <div className="h-full bg-primary" style={{ width: `${stats.realPercent}%` }}></div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: System Status & Preferences (Narrower) */}
        <div className="space-y-8">
          
          {/* Backend Status Card */}
          <section className="bg-surface-container p-6 rounded-[2rem] border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">API Online</p>
                  <p className="text-[10px] text-on-surface-variant uppercase font-medium">Backend Status</p>
                </div>
              </div>
              <span className="text-[10px] text-on-surface-variant font-mono">Checked 3s ago</span>
            </div>
          </section>

          {/* Default Model Selection Card */}
          <section className="bg-surface-container p-6 rounded-[2rem] border border-outline-variant/10">
            <div className="mb-4">
              <h2 className="text-base font-bold flex items-center gap-2 mb-1">
                <Brain className="text-primary w-5 h-5" />
                Default Model
              </h2>
              <p className="text-[10px] text-on-surface-variant">Saved to browser.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableModels.map(model => (
                <button 
                  key={model}
                  onClick={() => handleModelSelect(model)}
                  className={`px-4 py-2 rounded-full font-bold text-[11px] transition-all
                    ${defaultModel === model 
                      ? 'bg-primary text-on-primary shadow-[0_4px_14px_0_rgba(173,198,255,0.2)]' 
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}
                  `}
                >
                  {model}
                </button>
              ))}
            </div>
          </section>

          {/* Dark Mode Toggle Card */}
          <section className="bg-surface-container p-6 rounded-[2rem] border border-outline-variant/10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="text-primary w-5 h-5" />
                  <span className="font-bold text-on-surface">Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <p className="text-xs text-on-surface-variant">Toggle light/dark theme across the app.</p>
            </div>
          </section>

          {/* Total Articles Analysed Card */}
          <section className="bg-surface-container p-6 rounded-[2rem] border border-outline-variant/10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <FileText className="text-primary w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Total Articles Analysed</p>
                <p className="text-2xl font-black text-on-surface">{stats.total}</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
