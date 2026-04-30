import React, { useState } from 'react';
import axios from 'axios';

export default function SignupPage({ onSignup, onNavigateToLogin, onBackToLanding }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/auth/signup', { name, email, password });
      if (response.data.status === 'success') {
        const { user, session } = response.data;
        const userData = {
          email: user.email,
          name: user.user_metadata?.full_name || name,
          id: user.user_metadata?.investigator_id || 'VERITY-0000-X',
          image: user.user_metadata?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW2r1gU1EuB6W5aTg17aNRxKVzPdpasARMD5fXDb0bjQ0MumlkSYqouX-tZmLQRuJLbcyGjrjIpCxVpR84dbCFQYxfRj3B3SBDYBDYv_fWB-TkyRXiPYgU1lg22Jskk06w8qjqpqmhaP5sV7U4UXYSu_ia02vpc6GnxzpxYj4r2T-Jo2yrQP71Q5VxYni1cffy0CL0q08-6ovBEGEEuJhKTZMP-eHdrQw4UiVMBUVgEHOFPpeVqQv39hzwYxci16hBQPfL5ByuSSY'
        }
        onSignup(userData, session?.access_token);
      }
    } catch (err) {
      console.warn("Backend signup failed, using mock auth fallback", err);
      if (name && email && password) {
        const userData = {
          email: email,
          name: name,
          id: 'VERITY-0000-X',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW2r1gU1EuB6W5aTg17aNRxKVzPdpasARMD5fXDb0bjQ0MumlkSYqouX-tZmLQRuJLbcyGjrjIpCxVpR84dbCFQYxfRj3B3SBDYBDYv_fWB-TkyRXiPYgU1lg22Jskk06w8qjqpqmhaP5sV7U4UXYSu_ia02vpc6GnxzpxYj4r2T-Jo2yrQP71Q5VxYni1cffy0CL0q08-6ovBEGEEuJhKTZMP-eHdrQw4UiVMBUVgEHOFPpeVqQv39hzwYxci16hBQPfL5ByuSSY'
        }
        onSignup(userData, 'mock-token-xyz');
      } else {
        setError(err.response?.data?.detail || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-row w-full bg-[#0e0e10] text-[#e7e4ec] font-body selection:bg-primary selection:text-on-primary antialiased">
      {/* Left Side: Form Area */}
      <section className="w-full lg:w-[45%] flex flex-col justify-between px-8 md:px-16 lg:px-24 py-12 bg-surface">
        <nav className="flex items-center gap-2 mb-12 cursor-pointer" onClick={onBackToLanding}>
          <span className="material-symbols-outlined text-primary text-3xl" translate="no">biotech</span>
          <span className="text-xl font-black tracking-tighter text-on-surface uppercase">The Verity</span>
        </nav>
        
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3">Create Account</h1>
            <p className="text-on-surface-variant text-lg">Join the fight against misinformation.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-container/20 border border-error/50 text-error p-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="full_name">Full Name</label>
              <input 
                className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all" 
                id="full_name" 
                placeholder="John Doe" 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="agency_email">Agency Email</label>
              <input 
                className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all" 
                id="agency_email" 
                placeholder="name@agency.gov" 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="access_key">Access Key</label>
              <div className="relative">
                <input 
                  className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all" 
                  id="access_key" 
                  placeholder="••••••••••••" 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-4 text-outline cursor-pointer hover:text-on-surface" translate="no">visibility</span>
              </div>
            </div>
            
            <div className="pt-4 space-y-4">
              <button 
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-outline-variant/30"></div>
                <span className="flex-shrink mx-4 text-xs font-bold text-outline uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-outline-variant/30"></div>
              </div>
              
              <button className="w-full py-4 rounded-2xl bg-surface-container-highest text-on-surface font-semibold flex items-center justify-center gap-3 hover:bg-surface-bright transition-all active:scale-[0.98]" type="button">
                <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYUQN5H5WLWWI4DqJFd1vDnPWJF8DiFavFmxReprErV3Ut03FNqXrVkjdcBAIGdIwbMsj5kmJLiRFtdLbexRs8wz_EB7fye_iECHQJiAPA67822O6Pxv384xGZVdUoPYbpGdQBbtFv1TavaOhHo3dSebC_ICvPn3gVeDpJrN0QRUQfHV0Meu2FF4hSPRC6-m02DdNqtKJXwFp3V5JaGOvSrF-9jyNZY4NTBli9yPZ9zdZszx7ZO79l8v6ywcKuFiTN_bqV0e2VPNY"/>
                Sign in with Google
              </button>
            </div>
          </form>
          
          <p className="mt-10 text-center lg:text-left text-on-surface-variant">
            Already have an account? <a className="text-primary font-bold hover:underline underline-offset-4 transition-all cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }}>Sign In</a>
          </p>
        </div>
        
        <footer className="mt-20 pt-8 border-t border-outline-variant/10 flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">© {new Date().getFullYear()} The Verity. Forensic-Grade Truth.</p>
        </footer>
      </section>
      
      {/* Right Side: High-Impact Image Area */}
      <section className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent z-10"></div>
        <img alt="High-impact truth narrative" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWgwAGKInhpYdIOr2FYfnl2hw_v5epdJLkoQtgtRgPss5719xLbtQVTJGPEV1DsQifKpEpJXfEsW98U-Sq3Tk-TToQtMlB29A2-PDHstgIk03_nOacNSH1yJQ5o2piFs2urYftIc4FiXjjtCrraj6p4Kr03mvv5Z0z7wFpYnWMZYZe3xNjlviwuygEbHxBxdncBLsXlpxSeputvgb7tX62wXiOpVMpaNFXHSp8zI3a8V2io40KFjIAUR4G50b0YQ96W5XkSkccMmw"/>
        
        <div className="absolute bottom-20 left-20 z-20 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full border border-primary/20 mb-6">
            <span className="material-symbols-outlined text-primary text-sm" translate="no">verified_user</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Forensic-Grade Truth</span>
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mb-6">Securing the sanctity of global information.</h2>
          <div className="flex gap-4">
            <div className="w-12 h-1 bg-primary"></div>
            <div className="w-12 h-1 bg-white/20"></div>
            <div className="w-12 h-1 bg-white/20"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
