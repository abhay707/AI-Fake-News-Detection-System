import { useState, useEffect, useRef, Fragment } from 'react';
import './LandingPage.css';

// ─────────────────────────────────────────────────────────────────────────
// Icons (inline SVGs — no library dependency)
// ─────────────────────────────────────────────────────────────────────────
const ShieldIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 3l8 3v6c0 4.5-3.2 8.4-8 9-4.8-.6-8-4.5-8-9V6l8-3z"
      stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M9 12.2l2.2 2.2L15.4 10" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.46-1.17-1.11-1.48-1.11-1.48-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0112 6.84c.85.004 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0022 12.25C22 6.58 17.52 2 12 2z" />
  </svg>
);

const ArrowIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExternalIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M14 5h5v5M19 5l-9 9M5 7v12h12" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconLayers = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" aria-hidden="true">
    <path d="M16 4l11 6-11 6L5 10l11-6z" stroke="#93c5fd" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M5 16l11 6 11-6" stroke="#60a5fa" strokeWidth="1.2" strokeLinejoin="round" opacity=".7" />
    <path d="M5 22l11 6 11-6" stroke="#60a5fa" strokeWidth="1.2" strokeLinejoin="round" opacity=".4" />
  </svg>
);

const IconGauge = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" aria-hidden="true">
    <path d="M5 22a11 11 0 0122 0" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M16 22l6-6" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="16" cy="22" r="1.6" fill="#60a5fa" />
    <path d="M9 24l-1 2M23 24l1 2M16 12v-2" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" opacity=".6" />
  </svg>
);

const IconHistory = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" aria-hidden="true">
    <circle cx="16" cy="16" r="10" stroke="#93c5fd" strokeWidth="1.2" />
    <path d="M16 9v7l5 3" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 11.5L4 10M25.5 20.5L28 22" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" opacity=".5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────
// Reveal-on-scroll wrapper
// ─────────────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "", as: As = "div" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("in"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <As ref={ref} className={`fade-up ${className}`}>{children}</As>;
}

// ─────────────────────────────────────────────────────────────────────────
// Count-up number
// ─────────────────────────────────────────────────────────────────────────
function CountUp({ to, decimals = 0, duration = 1400, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(to * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setVal(to);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────────────────
function Nav({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`nav-base ${scrolled ? "nav-scrolled" : ""} fixed top-0 left-0 right-0 z-50`}>
      <div className="nav-inner max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-md border border-white/10 bg-white/[0.02] text-accent">
            <ShieldIcon className="w-3.5 h-3.5" />
            <span className="absolute inset-0 rounded-md ring-1 ring-accent/0 group-hover:ring-accent/30 transition" />
          </span>
          <span className="font-semibold tracking-tight text-[15px] text-white">Digital Verity</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-white/70 hover:text-white transition">Features</a>
          <a href="#architecture" className="text-white/70 hover:text-white transition">Architecture</a>
        </nav>
        <div className="flex items-center gap-2.5">
          <a
            href="https://github.com/abhay707/AI-Fake-News-Detection-System"
            target="_blank" rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/75 hover:text-white px-3 py-1.5 rounded-md transition"
          >
            <GithubIcon className="w-4 h-4" />
            GitHub
          </a>
          <button
            onClick={onStart}
            className="btn-primary inline-flex items-center gap-1.5 text-sm font-medium text-white px-3.5 py-1.5 rounded-md"
          >
            Launch App
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────
function Hero({ onStart }) {
  return (
    <section id="top" className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden">
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-center text-center">

          <h1 className="font-sans font-semibold tracking-tightest text-white text-[36px] leading-[1.05] sm:text-[48px] md:text-[60px] lg:text-[70px] max-w-4xl">
            <span className="hero-line hero-l1 block">Detect AI-Era Misinformation.</span>
            <span className="hero-line hero-l2 block accent-text-strong">Verify Every Claim.</span>
          </h1>

          <p className="hero-line hero-sub mt-6 text-[16px] md:text-[17px] leading-[1.6] text-white/60" style={{ maxWidth: '580px' }}>
            An open-source research tool comparing three transformer architectures
            <span className="text-white/85"> RoBERTa</span>,
            <span className="text-white/85"> BERT</span>, and
            <span className="text-white/85"> DistilBERT</span> for fake news classification.
            Submit any article and see how each model scores its credibility in real time.
          </p>

          <div className="hero-line hero-cta mt-9 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onStart}
              className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-lg text-[15px] font-medium text-white"
            >
              Try the Analyzer
              <ArrowIcon className="w-4 h-4" />
            </button>
            <a
              href="https://github.com/abhay707/AI-Fake-News-Detection-System"
              target="_blank" rel="noreferrer"
              className="btn-ghost inline-flex items-center gap-2 px-5 py-3 rounded-lg text-[15px] font-medium text-white/90"
            >
              <GithubIcon className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          <div className="hero-line hero-meta mt-5 font-mono text-[11px] tracking-[0.22em] uppercase text-white/35">
            No account · Local inference · Open source
          </div>
        </div>

        <div className="hero-viz mt-16 lg:mt-20">
          <AppMockup />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Stats row
// ─────────────────────────────────────────────────────────────────────────
function Stats() {
  const items = [
    { value: 98.4, decimals: 1, suffix: "%",  label: "Validation Accuracy" },
    { value: 3,    decimals: 0, suffix: "",   label: "Transformer Models" },
    { value: 200,  decimals: 0, suffix: "ms", prefix: "<", label: "Inference Latency" },
  ];
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-stretch">
          {items.map((it, i) => (
            <Fragment key={it.label}>
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="hidden md:block w-px self-stretch bg-white/[0.06] mx-2 lg:mx-0"
                />
              )}
              <Reveal delay={i * 80} className="flex-1 px-2 md:px-10 py-8 md:py-2">
                <div className="font-mono font-medium text-white text-[36px] md:text-[44px] lg:text-[48px] leading-none tracking-tight">
                  <CountUp
                    to={it.value}
                    decimals={it.decimals}
                    duration={1200}
                    prefix={it.prefix || ""}
                    suffix={it.suffix || ""}
                  />
                </div>
                <div className="mt-5 font-mono text-[10px] tracking-[0.32em] uppercase text-white/45">
                  {it.label}
                </div>
              </Reveal>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// App mockup — hero centerpiece
// ─────────────────────────────────────────────────────────────────────────
function AppMockup() {
  return (
    <div className="relative max-w-5xl mx-auto" id="analyzer">
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 w-[80%] h-56 bg-accent/30 blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-[60%] h-40 bg-accent/40 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute left-1/4 -bottom-8 w-[40%] h-32 blur-[100px] rounded-full pointer-events-none" style={{ background: 'rgba(167,139,250,0.25)' }} />

      <div className="relative float" style={{ perspective: "1200px" }}>
        <div className="rounded-2xl border border-white/[0.09] bg-ink-850/90 backdrop-blur-sm shadow-2xl overflow-hidden" style={{ background: 'rgba(13,13,20,0.9)' }}>
          {/* window chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            </div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-white/35">
              digital-verity / analyse
            </div>
            <div className="w-12" />
          </div>

          {/* body */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* left: model selector */}
            <div className="lg:col-span-2 space-y-3">
              <div className="font-mono text-[10px] tracking-widest uppercase text-white/40">Model</div>
              {[
                { name: "RoBERTa",    sub: "125M · base", selected: true,  acc: "98.4" },
                { name: "BERT",       sub: "110M · base", selected: false, acc: "97.1" },
                { name: "DistilBERT", sub: " 66M · base", selected: false, acc: "96.0" },
              ].map((m) => (
                <div key={m.name}
                  className={`relative rounded-lg border p-3.5 transition cursor-default
                    ${m.selected
                      ? "border-accent/50 bg-accent/[0.06] shadow-[0_0_0_1px_rgba(96,165,250,0.25)]"
                      : "border-white/[0.07] bg-white/[0.015] hover:border-white/15"}`}
                  style={{ borderColor: m.selected ? 'rgba(96,165,250,0.5)' : undefined }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${m.selected ? "bg-accent border-accent" : "border-white/30"}`}
                        style={{ background: m.selected ? '#60a5fa' : undefined, borderColor: m.selected ? '#60a5fa' : undefined }}>
                        {m.selected && <span className="block w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <div>
                        <div className="text-white text-[13px] font-semibold tracking-tight">{m.name}</div>
                        <div className="font-mono text-[10px] text-white/45 mt-0.5">{m.sub}</div>
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-white/55">acc {m.acc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* right: input + result */}
            <div className="lg:col-span-3 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-[10px] tracking-widest uppercase text-white/40">Input · Article</div>
                  <div className="font-mono text-[10px] text-white/35">412 tokens</div>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-black/30 p-4 text-[13px] leading-relaxed text-white/80">
                  Researchers at a federal lab announced today that a newly discovered protein can reverse cognitive
                  decline in elderly patients within a single 12-hour dose — pending peer review.
                  Trials, the agency confirmed in a press release, will…
                  <span className="ml-0.5 inline-block w-1.5 h-3.5 align-text-bottom bg-accent/80 animate-pulse" style={{ background: 'rgba(96,165,250,0.8)' }} />
                </div>
              </div>

              <div className="rounded-lg border border-white/[0.07] bg-white/[0.015] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-[10px] tracking-widest uppercase text-white/40">Prediction</div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-400/10 border border-rose-400/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span className="text-rose-300 text-[11px] font-medium tracking-wide">LIKELY FAKE</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: "RoBERTa",    score: 0.92, color: "#60a5fa" },
                    { name: "BERT",       score: 0.87, color: "#93c5fd" },
                    { name: "DistilBERT", score: 0.81, color: "#a78bfa" },
                  ].map((r) => (
                    <div key={r.name} className="flex items-center gap-3">
                      <div className="w-20 text-[12px] text-white/70">{r.name}</div>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${r.score * 100}%`, background: r.color, boxShadow: `0 0 12px ${r.color}66` }} />
                      </div>
                      <div className="w-12 text-right font-mono text-[12px] text-white">{r.score.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────────────────────────────────
function Features() {
  const cards = [
    {
      icon: <IconLayers />,
      title: "Multi-Model Comparison",
      body: "Submit one article and watch three fine-tuned transformer models return independent classifications and confidence scores side by side. See how different architectures handle the same input.",
    },
    {
      icon: <IconGauge />,
      title: "Transparent Confidence Scoring",
      body: "Every prediction includes a calibrated softmax confidence value. See not just what the model thinks, but how certain it is — and where models disagree.",
    },
    {
      icon: <IconHistory />,
      title: "Persistent Analysis History",
      body: "Every analysis is logged to a Supabase backend. Revisit past predictions, track model behavior over time, build a research dataset.",
    },
  ];
  return (
    <section id="features" className="relative py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="overline">How it works</div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-5 text-white font-semibold tracking-tightest text-[40px] md:text-[56px] leading-[1.05] max-w-3xl">
            Three Models.<br />
            <span className="text-white/45">One Verdict.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="card p-7 lg:p-8 h-full flex flex-col">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.025)' }}>
                  {c.icon}
                </div>
                <div className="text-white text-[18px] font-semibold tracking-tight">{c.title}</div>
                <p className="mt-3 text-[14.5px] leading-[1.65] text-white/55">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Architecture
// ─────────────────────────────────────────────────────────────────────────
function Architecture() {
  const chips = ["PyTorch", "Transformers", "FastAPI", "React", "Supabase", "WELFake"];
  return (
    <section id="architecture" className="approach-strip py-28 lg:py-36 relative">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
        <Reveal>
          <div className="overline justify-center inline-block">Architecture</div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-5 text-white font-semibold tracking-tightest text-[36px] md:text-[48px] leading-[1.1]">
            Honest about what this is.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-10 space-y-5 text-left text-[15.5px] leading-[1.75] text-white/65">
            <p>
              Digital Verity is a research demonstration of how different transformer architectures
              perform on out-of-distribution news classification. Three models — fine-tuned on the
              <span className="text-white/90"> WELFake</span> dataset — run locally via PyTorch and serve predictions through a FastAPI backend.
            </p>
            <p>
              This is <span className="text-white">not</span> a deepfake detector. It does not perform
              image or video forensics, audio analysis, or cross-reference external fact-checking databases.
              It is text classification, transparently scored, openly documented.
            </p>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {chips.map((c, i) => (
              <Reveal key={c} delay={260 + i * 60} as="span" className="inline-block">
                <span className="chip font-mono text-[11px] tracking-wide px-3 py-1.5 rounded-full">
                  {c}
                </span>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CTA strip
// ─────────────────────────────────────────────────────────────────────────
function CTAStrip({ onStart }) {
  return (
    <section className="cta-strip relative py-28 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center relative">
        <Reveal>
          <h2 className="text-white font-semibold tracking-tightest text-[44px] md:text-[68px] leading-[1.05]">
            See it in action.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-6 max-w-2xl mx-auto text-[17px] leading-[1.65] text-white/65">
            Submit a real article. Compare three models. See the truth in milliseconds.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="mt-10 flex justify-center">
            <button
              onClick={onStart}
              className="btn-primary group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg text-[16px] font-medium text-white"
            >
              Launch Analyzer
              <ArrowIcon className="w-4 h-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/[0.06]" style={{ background: '#06060a' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-white/10 bg-white/[0.02]" style={{ color: '#60a5fa' }}>
                <ShieldIcon className="w-3.5 h-3.5" />
              </span>
              <span className="font-semibold tracking-tight text-white">Digital Verity</span>
            </div>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-white/50">
              Open source fake news classification research.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <a href="https://github.com/abhay707/AI-Fake-News-Detection-System"
               target="_blank" rel="noreferrer"
               className="text-white/65 hover:text-white transition inline-flex items-center gap-1.5">
              GitHub <ExternalIcon />
            </a>
            <a href="https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification"
               target="_blank" rel="noreferrer"
               className="text-white/65 hover:text-white transition inline-flex items-center gap-1.5">
              WELFake Dataset <ExternalIcon />
            </a>
            <a href="https://github.com/abhay707/AI-Fake-News-Detection-System#readme"
               target="_blank" rel="noreferrer"
               className="text-white/65 hover:text-white transition inline-flex items-center gap-1.5">
              Documentation <ExternalIcon />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="font-mono text-[11px] tracking-wide text-white/35">
            © 2026 Digital Verity · Open Source Research Project
          </div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-white/30">
            MIT licensed · v0.4.0
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// LandingPage — default export, accepts same props as old LandingPage
// ─────────────────────────────────────────────────────────────────────────
export default function LandingPage({ onStart, onLoginClick, onSignupClick }) {
  return (
    <>
      <div className="ambient" aria-hidden="true">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
      </div>
      <div className="page-grid" aria-hidden="true" />
      <div className="relative z-10 landing-noise" style={{ background: '#06060a', color: '#e7e9ee', minHeight: '100vh' }}>
        <Nav onStart={onStart} />
        <Hero onStart={onStart} />
        <Stats />
        <Features />
        <Architecture />
        <CTAStrip onStart={onStart} />
        <Footer />
      </div>
    </>
  );
}
