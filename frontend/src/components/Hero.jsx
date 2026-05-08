import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Blade3D from "./Blade3D";

export default function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative isolate overflow-hidden bg-noise"
      style={{ minHeight: "100vh" }}
    >
      {/* Background grid + glow */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[820px] h-[820px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(closest-side, rgba(0,240,255,0.18), transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[520px] h-[520px] pointer-events-none"
           style={{ background: "radial-gradient(closest-side, rgba(255,182,0,0.10), transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-32 pb-16 lg:pt-36 lg:pb-24 grid lg:grid-cols-12 gap-8 items-center min-h-[100vh]">
        {/* Left: Copy */}
        <div className="lg:col-span-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-soft bg-[rgba(0,240,255,0.06)] px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] text-cyan"
            data-testid="hero-eyebrow"
          >
            <Sparkles size={12} /> AI · Wind Turbines · Precision
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-heading text-4xl sm:text-5xl lg:text-7xl mt-6 font-semibold leading-[1.02] tracking-tight"
            data-testid="hero-title"
          >
            AI-Powered <span className="text-cyan">Wind Turbine</span>
            <br />
            Blade <span className="text-gold">Balancing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 max-w-xl text-base sm:text-lg text-[var(--text-2)]"
            data-testid="hero-tagline"
          >
            <span className="text-white font-medium">PRECISION BALANCE MADE SIMPLE.</span> A smart, portable
            system that measures, analyzes and corrects the center of gravity of large turbine blades — in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#how"
              className="group inline-flex items-center gap-2 rounded-xl bg-cyan px-5 py-3 font-medium text-bg hover:bg-white transition-colors"
              data-testid="hero-cta-explore"
            >
              Explore How It Works
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              to="/simulator"
              className="inline-flex items-center gap-2 rounded-xl border border-gold px-5 py-3 font-medium text-gold hover:bg-[rgba(255,182,0,0.08)] transition-colors"
              data-testid="hero-cta-simulator"
            >
              Launch Simulation
            </Link>
          </motion.div>

          {/* Spec ribbon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-10 grid grid-cols-3 gap-4 max-w-md"
            data-testid="hero-spec-ribbon"
          >
            {[
              { k: "±1g", v: "ACCURACY" },
              { k: "0–20kg", v: "RANGE" },
              { k: "Wi-Fi", v: "WIRELESS" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-xl px-3 py-3">
                <div className="font-heading text-xl font-semibold">{s.k}</div>
                <div className="label-eyebrow text-[10px] mt-0.5">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: 3D Blade */}
        <div className="lg:col-span-6 relative h-[420px] sm:h-[520px] lg:h-[640px]">
          <div className="absolute inset-0 rounded-3xl glass overflow-hidden" data-testid="hero-3d-container">
            <Canvas camera={{ position: [0, 1.6, 9], fov: 42 }} dpr={[1, 1.6]}>
              <ambientLight intensity={0.35} />
              <directionalLight position={[6, 8, 6]} intensity={1.3} color="#00F0FF" />
              <directionalLight position={[-6, -3, -4]} intensity={0.6} color="#FFB600" />
              <Suspense fallback={null}>
                <Blade3D cgPosition={0.62} idealCG={0.5} showHeatmap autoRotate />
              </Suspense>
            </Canvas>
            {/* Top label */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="label-eyebrow">CG · Live Telemetry</div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-cyan" />
                LIVE
              </div>
            </div>
            {/* Bottom legend */}
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 pointer-events-none">
              <div className="glass rounded-lg px-3 py-2">
                <div className="label-eyebrow text-[9px]">MEASURED CG</div>
                <div className="font-mono text-sm text-gold">22.85 cm</div>
              </div>
              <div className="glass rounded-lg px-3 py-2">
                <div className="label-eyebrow text-[9px]">IDEAL CG</div>
                <div className="font-mono text-sm text-cyan">22.50 cm</div>
              </div>
              <div className="glass rounded-lg px-3 py-2">
                <div className="label-eyebrow text-[9px]">DEVIATION</div>
                <div className="font-mono text-sm text-deviation-red">+0.35 cm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="label-eyebrow text-[10px] text-white/60">scroll</div>
        <div className="mx-auto mt-1 h-10 w-[2px] bg-gradient-to-b from-cyan to-transparent" />
      </div>
    </section>
  );
}
