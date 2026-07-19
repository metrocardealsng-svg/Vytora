"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import StarRating from "./StarRating";

// Particle canvas background
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let frame: number;
    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52,224,161,${p.opacity})`;
        ctx.fill();
      });
      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(52,224,161,${0.08 * (1 - d / 120)})`;
            ctx.stroke();
          }
        });
      });
      frame = requestAnimationFrame(draw);
    }
    draw();

    const resize = () => { canvas!.width = window.innerWidth; canvas!.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
}

// Floating 3D Phone mockup
function PhoneMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setTilt({
        x: ((e.clientY - cy) / cy) * -8,
        y: ((e.clientX - cx) / cx) * 8,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ perspective: "1000px" }}>
      {/* Glow */}
      <div className="absolute h-64 w-64 rounded-full bg-mint/20 blur-3xl animate-pulse" />
      
      {/* Phone */}
      <div
        ref={ref}
        className="relative transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(-3deg)`,
          animation: "float 4s ease-in-out infinite",
        }}
      >
        {/* Phone frame */}
        <div className="relative w-56 h-[440px] rounded-[3rem] border-2 border-white/20 bg-gradient-to-b from-[#1a1a2e] to-[#0e0e1a] shadow-2xl shadow-mint/10 overflow-hidden">
          {/* Screen reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-[3rem]" />
          {/* Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-20 rounded-full bg-black/60 z-10" />
          
          {/* Screen content */}
          <div className="absolute inset-0 flex flex-col p-4 pt-10">
            {/* Mini navbar */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="h-4 w-4 rounded-md bg-gradient-to-br from-mint to-teal" />
              <span className="text-[10px] font-black text-white">Vytora</span>
            </div>

            {/* Stats */}
            <div className="text-center mb-3">
              <CountUp target={12453} className="text-4xl font-black text-white" />
              <p className="text-[10px] text-mint font-bold uppercase tracking-widest">STEPS TODAY</p>
            </div>

            {/* Progress ring */}
            <div className="flex justify-center mb-3">
              <svg viewBox="0 0 80 80" className="h-16 w-16">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(52,224,161,0.1)" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#34e0a1" strokeWidth="6"
                  strokeDasharray="213" strokeDashoffset="53"
                  strokeLinecap="round" transform="rotate(-90 40 40)" />
                <text x="40" y="45" textAnchor="middle" fontSize="12" fill="white" fontWeight="900">75%</text>
              </svg>
            </div>

            {/* Mini map */}
            <div className="flex-1 rounded-2xl bg-[#0a0f1e] border border-white/10 overflow-hidden relative">
              <div className="absolute inset-0 opacity-30"
                style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 12px,rgba(52,224,161,0.1) 12px,rgba(52,224,161,0.1) 13px),repeating-linear-gradient(90deg,transparent,transparent 12px,rgba(52,224,161,0.1) 12px,rgba(52,224,161,0.1) 13px)" }} />
              {/* Route line */}
              <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full">
                <polyline points="10,50 25,35 40,40 55,25 70,30 90,15"
                  fill="none" stroke="#34e0a1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ strokeDasharray: 200, strokeDashoffset: 0, animation: "drawRoute 3s ease-in-out infinite alternate" }} />
                <circle cx="90" cy="15" r="3" fill="#34e0a1" />
              </svg>
              <div className="absolute bottom-2 left-2 text-[8px] text-mint font-black">8.6 km</div>
            </div>

            {/* Bottom stats row */}
            <div className="grid grid-cols-3 gap-1 mt-2">
              {[["812", "cal"], ["6.2", "mph"], ["43", "min"]].map(([v, l]) => (
                <div key={l} className="rounded-lg bg-white/5 p-1.5 text-center">
                  <p className="text-xs font-black text-white">{v}</p>
                  <p className="text-[8px] text-slate-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute right-0 top-20 w-1 h-8 rounded-full bg-white/20" />
        <div className="absolute left-0 top-16 w-1 h-6 rounded-full bg-white/20" />
        <div className="absolute left-0 top-24 w-1 h-6 rounded-full bg-white/20" />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(-3deg) translateY(0px); }
          50% { transform: rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(-3deg) translateY(-12px); }
        }
        @keyframes drawRoute {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

function CountUp({ target, className }: { target: number; className: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <div className={className}>{count.toLocaleString()}</div>;
}

// Before/After flip cards
function BeforeAfterSection() {
  const [flipped, setFlipped] = useState(false);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-white">The Vytora <span className="text-gradient">transformation</span></h2>
        <p className="mt-3 text-slate-400">What changes when you start moving daily.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Before */}
        <div className="glass rounded-3xl p-8 border border-red-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/40" />
          <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-6">Before Vytora</p>
          <div className="text-6xl mb-4">😓</div>
          <ul className="space-y-3">
            {["No exercise routine", "Poor sleep quality", "Gradual weight gain", "Low daily energy", "Zero step tracking"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* After */}
        <div className="rounded-3xl p-8 border border-mint/30 relative overflow-hidden bg-gradient-to-b from-mint/10 to-teal/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mint to-teal" />
          <p className="text-xs font-black text-mint uppercase tracking-widest mb-6">After 30 Days</p>
          <div className="text-6xl mb-4">😊</div>
          <ul className="space-y-3">
            {["10,000 daily steps", "7-8 hours quality sleep", "3-5kg weight reduction", "High daily energy", "AI meal planning"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-mint flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// Animated stats counter
function StatsBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { value: 10000, label: "Daily step goal", suffix: "" },
    { value: 30, label: "Nigerian foods tracked", suffix: "+" },
    { value: 0, label: "Ads. Ever.", suffix: "" },
    { value: 24, label: "Hour AI support", suffix: "/7" },
  ];

  return (
    <div ref={ref} className="border-y border-white/5 bg-ink-soft/40 py-12">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl font-black text-gradient">
              {visible ? <CountUp target={s.value} className="inline" /> : "0"}{s.suffix}
            </div>
            <p className="mt-1 text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Feature cards with scroll reveal
function FeatureCard({ icon, title, body, delay }: { icon: string; title: string; body: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="glass rounded-2xl p-6 transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transitionDelay: `${delay}ms` }}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-mint/20 to-teal/20 text-2xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed">{body}</p>
    </div>
  );
}

// PWA install banner
function NativeAppBanner() {
  return (
    <section className="border-y border-mint/10 bg-gradient-to-r from-mint/5 via-transparent to-teal/5 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10 justify-between">
          <div className="text-center lg:text-left">
            <p className="text-xs font-black text-mint uppercase tracking-widest mb-3">No App Store Required</p>
            <h2 className="text-4xl font-black text-white">Install in <span className="text-gradient">3 seconds.</span></h2>
            <p className="mt-3 text-slate-400 max-w-lg">
              No 200MB download. No App Store approval. No Play Store account. Just tap "Add to Home Screen" and Vytora lives on your phone like a native app — instantly, for free, forever.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="glass rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-black text-mint">0 MB</p>
                <p className="text-xs text-slate-400">Downloaded</p>
              </div>
              <div className="glass rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-black text-mint">3 sec</p>
                <p className="text-xs text-slate-400">To install</p>
              </div>
              <div className="glass rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-black text-mint">Free</p>
                <p className="text-xs text-slate-400">Always</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-3xl p-8 max-w-sm w-full">
            <p className="text-sm font-black text-white mb-4">How to install on iPhone:</p>
            <ol className="space-y-3">
              {[
                { step: "1", text: "Open vytora.fit in Safari" },
                { step: "2", text: 'Tap the share icon at the bottom' },
                { step: "3", text: '"Add to Home Screen"' },
                { step: "4", text: "Tap Add. Done. It's on your home screen." },
              ].map((s) => (
                <li key={s.step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-mint/20 text-xs font-black text-mint">{s.step}</span>
                  <p className="text-sm text-slate-300">{s.text}</p>
                </li>
              ))}
            </ol>
            <Link href="/tracker" className="mt-5 flex items-center justify-center w-full rounded-xl bg-gradient-to-r from-mint to-teal py-3 text-sm font-black text-ink">
              Try the tracker first →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CinematicHomePage({ userId }: { userId?: string | null }) {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      <ParticleCanvas />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(52,224,161,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(45,212,191,0.06) 0%, transparent 50%), #06080c" }}>
        
        {/* Moving grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(52,224,161,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(52,224,161,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left */}
          <div className="transition-all duration-1000" style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(40px)" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-4 py-2 text-xs font-semibold text-mint mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
              The AI Fitness App Built for Africa
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight text-white">
              Move More.
              <br />
              <span className="text-gradient relative">
                Live Better.
                <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-gradient-to-r from-mint to-transparent" />
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-lg">
              Vytora tracks every step, every km, every calorie — with AI that knows Nigerian food and military calisthenics. Built for Nigeria. Free to start.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup"
                className="btn-glow relative overflow-hidden rounded-xl bg-gradient-to-r from-mint to-teal px-8 py-4 text-base font-black text-ink group">
                <span className="relative z-10">Start Free Today</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              </Link>
              <Link href="/tracker"
                className="rounded-xl border border-white/15 px-8 py-4 text-base font-bold text-white hover:bg-white/5 hover:border-mint/30 transition-all">
                Try Tracker →
              </Link>
            </div>

            <div className="mt-8">
              <StarRating userId={userId || undefined} />
            </div>

            {/* Live counter */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#34e0a1", "#2dd4bf", "#c8ff5a", "#34e0a1"].map((c, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-[#06080c] flex items-center justify-center text-xs font-black text-ink"
                    style={{ background: c }}>
                    {["C", "A", "T", "N"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">Early users in Lagos, Abuja & PH</p>
            </div>
          </div>

          {/* Right - 3D Phone */}
          <div className="transition-all duration-1000 delay-300" style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(40px)" }}>
            <PhoneMockup />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 animate-bounce">
          <p className="text-xs font-medium">Scroll to explore</p>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* STATS BAR */}
      <StatsBar />

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-4xl font-black text-white">Everything you need to <span className="text-gradient">move more</span></h2>
          <p className="mt-4 text-slate-400">Built from scratch for how Nigerians actually train and eat.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: "📍", title: "Precise GPS routing", body: "Real-time location maps every step. Filters GPS noise for accurate distance — no inflated numbers.", delay: 0 },
            { icon: "🧠", title: "Vyto AI Coach", body: "Ask about Nigerian meal plans, military calisthenics, running tips. Answers in seconds, 24/7.", delay: 100 },
            { icon: "🔥", title: "Calorie & pace tracking", body: "Automatic calorie burn, pace, and speed for every walk, run, hike, gym session and more.", delay: 200 },
            { icon: "🍲", title: "Nigerian food database", body: "30 Nigerian foods with accurate calories. Jollof rice, egusi, suya, akara — all tracked properly.", delay: 300 },
            { icon: "👥", title: "Tribe community", body: "Post your journey. Chat live. Connect with other movers across Nigeria who keep you accountable.", delay: 400 },
            { icon: "🎖️", title: "Streaks & badges", body: "10,000 daily steps challenge, 10 achievement badges, weekly email reports. Stay motivated.", delay: 500 },
          ].map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <BeforeAfterSection />

      {/* PWA INSTALL SECTION */}
      <NativeAppBanner />

      {/* COMPARE */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="glass overflow-hidden rounded-3xl">
          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-3xl font-black text-white">Why Nigerians choose Vytora over Strava</h2>
              <p className="mt-4 text-slate-400">Strava doesn't know what egusi soup does to your training. We do.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/compare/vytora-vs-strava" className="rounded-lg bg-mint/10 px-4 py-2 text-sm font-semibold text-mint hover:bg-mint/20">vs Strava</Link>
                <Link href="/compare/vytora-vs-fitbit" className="rounded-lg bg-mint/10 px-4 py-2 text-sm font-semibold text-mint hover:bg-mint/20">vs Fitbit</Link>
                <Link href="/compare" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5">See all →</Link>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Nigerian meal plans + AI", them: false },
                { label: "Free live GPS maps", them: false },
                { label: "No ads, ever", them: false },
                { label: "Pay in Naira", them: false },
                { label: "Tribe community", them: false },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
                  <span className="text-slate-300">{r.label}</span>
                  <span className="flex items-center gap-6">
                    <span className="font-bold text-mint">✓ Vytora</span>
                    <span className="text-slate-600">✕ Others</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mint to-teal p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%)" }} />
          <div className="relative">
            <h2 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">Ready to live better?</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg font-medium text-ink/80">Join Nigerians building healthier habits, one step at a time. Free to start.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="rounded-xl bg-ink px-8 py-4 text-base font-black text-white hover:bg-ink-soft">
                Create Free Account
              </Link>
              <Link href="/tracker" className="rounded-xl bg-white/20 px-8 py-4 text-base font-black text-ink backdrop-blur hover:bg-white/30">
                Try the Tracker
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
