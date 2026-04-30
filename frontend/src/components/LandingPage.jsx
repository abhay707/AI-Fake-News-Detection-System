import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import captureImg from '../assets/Capture-2026-04-10-154418.png';

export default function LandingPage({ onStart, onLoginClick, onSignupClick }) {
  const [activeTab, setActiveTab] = useState('Fallacy Check');

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    const handleScroll = () => {
      const y = window.scrollY;
      const heroGlow = document.querySelector('.hero');
      if (heroGlow) {
        heroGlow.style.setProperty('--scroll', y + 'px');
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="verity-landing">
      {/* NAV */}
      <nav className="verity-nav">
        <a href="#" className="nav-logo">The Verity</a>
        <ul className="nav-links">
          <li><a href="#features" className="active">Features</a></li>
          <li><a href="#lab">The Lab</a></li>
          <li><a href="#methodology">Methodology</a></li>
        </ul>
        <div className="nav-right">
          <button className="btn-ghost" onClick={onLoginClick}>Login</button>
          <button className="btn-primary" onClick={onSignupClick}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero" id="features">
        <div className="hero-badge">
          <span>Live Forensic Analysis Active</span>
        </div>

        <h1 className="hero-title">
          Precision Truth in a<br />
          <span className="accent">Synthetic Era.</span>
        </h1>

        <p className="hero-subtitle">
          The Verity leverages proprietary neuro-linguistic models and deep-packet visual analysis to distinguish authentic signal from high-fidelity noise.
        </p>

        <div className="hero-ctas">
          <button className="btn-hero-primary" onClick={onStart}>Start Verification</button>
          <button className="btn-hero-ghost">
            View Methodology
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <p className="hero-meta">No account needed &nbsp;·&nbsp; Results in under 2 seconds</p>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">98.4%</div>
            <div className="stat-label">Accuracy Rating</div>
          </div>
          <div className="stat">
            <div className="stat-num">3 Models</div>
            <div className="stat-label">Neural Clusters</div>
          </div>
          <div className="stat">
            <div className="stat-num">50ms</div>
            <div className="stat-label">Global Latency</div>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="hero-mockup">
          <div className="mockup-frame">
            <div className="mockup-bar">
              <span className="dot dot-r"></span>
              <span className="dot dot-y"></span>
              <span className="dot dot-g"></span>
              <span className="mockup-url">app.theverity.com/analysis</span>
            </div>
            <div className="w-full bg-[#0a0a12] flex items-center justify-center p-0 m-0 leading-none">
              <img src={captureImg} alt="Dashboard Capture" className="w-full h-auto object-cover block" />
            </div>
          </div>
        </div>
      </div>

      <div className="glow-line"></div>

      {/* FEATURES BENTO */}
      <section id="methodology" className="verity-section reveal">
        <div className="section-overline">Capabilities</div>
        <h2 className="section-title">Automated Integrity.</h2>

        <div className="bento">
          {/* Large card */}
          <div className="bento-card large reveal reveal-delay-1">
            <div className="bento-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="bento-title">Source Origin Verification</div>
            <div className="bento-desc">Trace any piece of information back to its digital genesis. Our system identifies bot networks, coordinated inauthentic behavior, and state-sponsored messaging in real-time.</div>
            <div className="bento-image">
              <div className="bento-image-inner">
                <svg width="320" height="160" viewBox="0 0 320 160">
                  <defs>
                    <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#4f8eff" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#4f8eff" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  {/* network lines */}
                  <line x1="160" y1="80" x2="60" y2="40" stroke="#4f8eff" strokeWidth="0.5" strokeOpacity="0.3"/>
                  <line x1="160" y1="80" x2="260" y2="40" stroke="#4f8eff" strokeWidth="0.5" strokeOpacity="0.3"/>
                  <line x1="160" y1="80" x2="40" y2="120" stroke="#4f8eff" strokeWidth="0.5" strokeOpacity="0.3"/>
                  <line x1="160" y1="80" x2="280" y2="120" stroke="#4f8eff" strokeWidth="0.5" strokeOpacity="0.3"/>
                  <line x1="160" y1="80" x2="160" y2="20" stroke="#2dd4bf" strokeWidth="0.5" strokeOpacity="0.4"/>
                  <line x1="60" y1="40" x2="40" y2="120" stroke="#4f8eff" strokeWidth="0.5" strokeOpacity="0.15"/>
                  <line x1="260" y1="40" x2="280" y2="120" stroke="#4f8eff" strokeWidth="0.5" strokeOpacity="0.15"/>
                  {/* nodes */}
                  <circle cx="160" cy="80" r="8" fill="#4f8eff" fillOpacity="0.9"/>
                  <circle cx="160" cy="80" r="16" fill="url(#nodeGlow)" opacity="0.5"/>
                  <circle cx="60" cy="40" r="4" fill="#4f8eff" fillOpacity="0.5"/>
                  <circle cx="260" cy="40" r="4" fill="#4f8eff" fillOpacity="0.5"/>
                  <circle cx="40" cy="120" r="3" fill="#ff6b6b" fillOpacity="0.7"/>
                  <circle cx="280" cy="120" r="4" fill="#4f8eff" fillOpacity="0.5"/>
                  <circle cx="160" cy="20" r="3" fill="#2dd4bf" fillOpacity="0.8"/>
                  <circle cx="100" cy="100" r="2.5" fill="#4f8eff" fillOpacity="0.4"/>
                  <circle cx="220" cy="60" r="2.5" fill="#4f8eff" fillOpacity="0.4"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Right stack */}
          <div className="bento-card dark reveal reveal-delay-2">
            <div className="bento-icon" style={{background: 'rgba(45,212,191,0.1)', borderColor: 'rgba(45,212,191,0.25)', color: 'var(--teal)'}}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="9" y1="2" x2="9" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="9" y1="14" x2="9" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="bento-title">Deepfake Detection</div>
            <div className="bento-desc">Frame-by-frame visual forensic analysis detecting micro-variations in skin texture and ocular reflections.</div>
          </div>

          <div className="bento-card reveal reveal-delay-3">
            <div className="tabs">
              <span className={`tab ${activeTab === 'Fallacy Check' ? 'active' : ''}`} onClick={() => setActiveTab('Fallacy Check')}>Fallacy Check</span>
              <span className={`tab ${activeTab === 'Bias Audit' ? 'active' : ''}`} onClick={() => setActiveTab('Bias Audit')}>Bias Audit</span>
              <span className={`tab ${activeTab === 'Sentiment Lab' ? 'active' : ''}`} onClick={() => setActiveTab('Sentiment Lab')}>Sentiment Lab</span>
            </div>
            <div className="bento-title">Narrative Deconstruction</div>
            <div className="bento-desc">Identify logical fallacies, hidden bias, and emotional manipulation at the sentence level.</div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ANALYSIS / CHAT SECTION */}
      <div className="analysis-section" id="lab">
        <div className="analysis-inner">
          <div className="reveal">
            <div className="section-overline">Real-Time Analysis</div>
            <h2 className="section-title" style={{color: 'var(--text)'}}>The Truth,<br/>Conversational.</h2>
            <p style={{fontSize: '15px', color: 'var(--muted2)', marginTop: '1.25rem', lineHeight: '1.7'}}>
              Meet the Forensic Assistant. Upload documents, paste links, or record live audio to receive an instant credibility score and detailed debunking report.
            </p>
            <ul className="checklist">
              <li>
                <span className="check-icon">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                Cross-referenced with 50+ global fact-check databases
              </li>
              <li>
                <span className="check-icon">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                Identifies metadata tampering in images
              </li>
              <li>
                <span className="check-icon">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                Full citations for every debunked claim
              </li>
            </ul>
          </div>

          {/* Chat mockup */}
          <div className="chat-mockup reveal reveal-delay-2">
            <div className="chat-header">
              <div className="chat-avatar">V</div>
              <div>
                <div className="chat-name">The Verity Forensics</div>
                <div className="chat-status">ANALYZING CONTENT...</div>
              </div>
            </div>
            <div className="chat-body">
              <div className="chat-msg user">
                "Is the viral video of the central bank collapse authentic or synthetic?"
              </div>
              <div className="chat-msg ai">
                Forensic analysis complete. The video exhibits <span className="highlight">High-Probability Synthetic (94%)</span> markers.
                <div className="chat-alert">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l5 9H1L6 1z" stroke="currentColor" strokeWidth="1" fill="none"/><line x1="6" y1="5" x2="6" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                  OCULAR REFLECTION INCONSISTENCY DETECTED
                </div>
                <div className="chat-alert" style={{marginTop:'6px'}}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l5 9H1L6 1z" stroke="currentColor" strokeWidth="1" fill="none"/><line x1="6" y1="5" x2="6" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                  AUDIO-VISUAL SYNC LATENCY: 12MS (ARTIFICIAL)
                </div>
              </div>
            </div>
            <div className="chat-input-row">
              <input className="chat-input" type="text" placeholder="Upload file or paste URL..." readOnly />
              <button className="chat-send">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 11V3M3 7l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="glow-line"></div>

      {/* CTA */}
      <div className="cta-section" id="pricing">
        <div className="cta-inner reveal">
          <h2 className="cta-title">Secure the Information Layer.</h2>
          <p className="cta-sub">Deploy enterprise-grade forensic analysis to your platform.<br/>High accuracy, low latency, absolute truth.</p>
          <button className="btn-hero-primary" onClick={onStart} style={{fontSize:'14px', padding:'12px 32px', letterSpacing:'0.06em', textTransform:'uppercase'}}>
            Start Protecting Truth
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="verity-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">The Verity</div>
            <div className="footer-tagline">Automated digital forensics for a post-truth world.</div>
          </div>
          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-links">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Source Verification</a></li>
              <li><a href="#">API Reference</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#">The Lab</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Connect</div>
            <ul className="footer-links">
              <li><a href="#">Twitter</a></li>
              <li><a href="#">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} The Verity Forensic Lab. Precision Truth.</span>
          <div className="footer-certs">
            <span className="cert">Level 4 Certified</span>
            <span className="cert">AES-256 Encrypted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
