import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Cpu, Radio, Brain, FileBarChart } from "lucide-react";
import Blade3D from "./Blade3D";

const steps = [
  {
    n: "01",
    title: "Measure",
    icon: Activity,
    eyebrow: "STEP 01 · ACQUISITION",
    body: "Blade is placed on three high-precision load cells at 5 cm, 22.5 cm and 40 cm from the root. Weight distribution is captured in real time.",
  },
  {
    n: "02",
    title: "Acquire",
    icon: Cpu,
    eyebrow: "STEP 02 · ESP32",
    body: "An ESP32 microcontroller reads each load cell channel synchronously and timestamps the raw force vectors at sub-millisecond cadence.",
  },
  {
    n: "03",
    title: "Transmit",
    icon: Radio,
    eyebrow: "STEP 03 · WIRELESS",
    body: "Signals are streamed wirelessly over Wi-Fi to a Raspberry Pi compute node — no cables, no clutter, full mobility on the field.",
  },
  {
    n: "04",
    title: "Process",
    icon: Brain,
    eyebrow: "STEP 04 · AI ANALYSIS",
    body: "Onboard AI compares 60 readings against the ideal CG model — instantly computing deviation magnitude and counterweight requirements.",
  },
  {
    n: "05",
    title: "Report",
    icon: FileBarChart,
    eyebrow: "STEP 05 · OUTPUT",
    body: "A live dashboard shows measured CG, ideal CG, deviation and counterweight position. Export the full AI report as PDF in one tap.",
  },
];

function StageVisual({ stepProgress }) {
  // stepProgress: 0..5 (continuous)
  // We'll fade visuals based on which step is active
  const opacity = (target) => {
    const dist = Math.abs(stepProgress - target);
    return Math.max(0, 1 - dist * 1.4);
  };

  // CG drifts dramatically at step 4 to show AI correction
  const cg =
    stepProgress < 3 ? 0.62 :
    stepProgress < 4 ? 0.62 - (stepProgress - 3) * 0.06 :
    0.5 + (stepProgress - 4) * 0.0; // settles at 0.5

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 1.4, 9], fov: 44 }} dpr={[1, 1.6]}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 6]} intensity={1.2} color="#00F0FF" />
        <directionalLight position={[-5, -3, -4]} intensity={0.6} color="#FFB600" />
        <Suspense fallback={null}>
          <Blade3D cgPosition={cg} idealCG={0.5} showHeatmap={stepProgress >= 3} autoRotate rotationSpeed={0.18} />
        </Suspense>
      </Canvas>

      {/* Overlay: Load Cells (Step 1) */}
      <div
        className="absolute inset-x-6 bottom-6 grid grid-cols-3 gap-3 transition-opacity duration-500"
        style={{ opacity: opacity(0) }}
      >
        {[
          { d: "5 cm", v: "1.42 kg" },
          { d: "22.5 cm", v: "0.96 kg" },
          { d: "40 cm", v: "0.41 kg" },
        ].map((c, i) => (
          <div key={i} className="glass-cyan rounded-lg px-3 py-2">
            <div className="label-eyebrow text-[9px]">CELL · {c.d}</div>
            <div className="font-mono text-sm text-white">{c.v}</div>
            <div className="mt-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-cyan" style={{ width: `${[80, 56, 28][i]}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Overlay: ESP32 chip (Step 2) */}
      <div
        className="absolute top-6 right-6 transition-opacity duration-500"
        style={{ opacity: opacity(1) }}
      >
        <div className="glass-cyan rounded-xl p-3 w-44">
          <div className="label-eyebrow text-[9px]">ESP32 · MCU</div>
          <div className="mt-1 font-mono text-xs text-white/80">CH1 ▮▮▮▮▮▯▯▯</div>
          <div className="font-mono text-xs text-white/80">CH2 ▮▮▮▮▯▯▯▯</div>
          <div className="font-mono text-xs text-white/80">CH3 ▮▮▯▯▯▯▯▯</div>
          <div className="mt-1 text-[10px] text-cyan font-mono">SAMPLING · 1 kHz</div>
        </div>
      </div>

      {/* Overlay: Wireless (Step 3) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500"
        style={{ opacity: opacity(2) }}
      >
        <svg viewBox="0 0 200 100" className="w-1/2 max-w-[260px]">
          <g fill="none" stroke="#00F0FF" strokeWidth="1.4" strokeLinecap="round">
            <path d="M40 50 Q60 30 80 50 T120 50 T160 50" className="animate-flow" />
            <path d="M40 50 Q60 70 80 50 T120 50 T160 50" className="animate-flow" style={{ animationDelay: "0.6s" }} />
          </g>
          <circle cx="34" cy="50" r="5" fill="#00F0FF" />
          <circle cx="166" cy="50" r="5" fill="#FFB600" />
        </svg>
      </div>

      {/* Overlay: AI Processing (Step 4) */}
      <div
        className="absolute top-6 left-6 transition-opacity duration-500"
        style={{ opacity: opacity(3) }}
      >
        <div className="glass-cyan rounded-xl p-3 w-56">
          <div className="label-eyebrow text-[9px]">AI · COMPUTING DEVIATION</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="text-white/70">measured</div>
            <div className="text-gold text-right">22.85 cm</div>
            <div className="text-white/70">ideal</div>
            <div className="text-cyan text-right">22.50 cm</div>
            <div className="text-white/70">Δ</div>
            <div className="text-deviation-red text-right">+0.35 cm</div>
          </div>
        </div>
      </div>

      {/* Overlay: Final Dashboard (Step 5) */}
      <div
        className="absolute inset-x-6 bottom-6 transition-opacity duration-500"
        style={{ opacity: opacity(4) }}
      >
        <div className="glass rounded-xl p-3 grid grid-cols-3 gap-3">
          <div>
            <div className="label-eyebrow text-[9px]">COUNTERWEIGHT</div>
            <div className="font-heading text-lg text-gold">12.45 g</div>
          </div>
          <div>
            <div className="label-eyebrow text-[9px]">POSITION</div>
            <div className="font-heading text-lg text-cyan">38.2 cm</div>
          </div>
          <div>
            <div className="label-eyebrow text-[9px]">STATUS</div>
            <div className="font-heading text-lg text-deviation-green">BALANCED</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Map progress to continuous step index 0..5
  const stepProgressMV = useTransform(scrollYProgress, [0, 1], [0, 4.99]);
  const [progress, setProgress] = useMemoState(stepProgressMV);

  return (
    <section
      id="how"
      data-testid="how-it-works"
      ref={containerRef}
      className="relative"
      style={{ height: "520vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left text panel */}
          <div className="hidden lg:block">
            <div className="label-eyebrow">How it works</div>
            <h2 className="font-heading text-4xl xl:text-5xl mt-3 leading-tight font-semibold tracking-tight">
              Measure. Analyze. <span className="text-cyan">Balance.</span>{" "}
              <span className="text-gold">Perfect.</span>
            </h2>
            <p className="mt-4 max-w-md text-[var(--text-2)]">
              A guided five-step pipeline — from raw load-cell signals to a balanced blade — visualized as you scroll.
            </p>
            <div className="mt-10 space-y-3" data-testid="how-it-works-steps">
              {steps.map((s, i) => {
                const active = Math.round(progress) === i;
                const Icon = s.icon;
                return (
                  <div
                    key={s.n}
                    className={`rounded-2xl border transition-all duration-300 p-4 ${
                      active
                        ? "border-cyan-soft bg-[rgba(0,240,255,0.06)]"
                        : "border-border bg-transparent opacity-60"
                    }`}
                    data-testid={`step-${s.n}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`grid place-items-center w-10 h-10 rounded-lg shrink-0 border ${
                          active ? "border-cyan-soft text-cyan glow-cyan" : "border-border text-white/60"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="label-eyebrow text-[10px]">{s.eyebrow}</div>
                        <div className="font-heading font-semibold text-lg mt-0.5">{s.title}</div>
                        <p className="text-sm text-[var(--text-2)] mt-1">{s.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right stage */}
          <div className="relative h-[60vh] lg:h-[78vh] rounded-3xl glass overflow-hidden">
            <StageVisual stepProgress={progress} />
            {/* Step indicator (mobile + desktop) */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <div className="label-eyebrow">STEP {String(Math.min(5, Math.floor(progress) + 1)).padStart(2, "0")} / 05</div>
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-colors ${
                      Math.round(progress) === i ? "bg-cyan" : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile-only: Step text under stage */}
          <div className="lg:hidden px-1">
            <MobileStepText progress={progress} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper: react state from MotionValue
function useMemoState(motionValue) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const unsub = motionValue.on("change", (v) => setVal(v));
    return () => unsub();
  }, [motionValue]);
  return [val, setVal];
}

function MobileStepText({ progress }) {
  const idx = Math.min(steps.length - 1, Math.max(0, Math.round(progress)));
  const s = steps[idx];
  return (
    <motion.div
      key={s.n}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 glass rounded-2xl p-4"
    >
      <div className="label-eyebrow">{s.eyebrow}</div>
      <div className="font-heading font-semibold text-lg mt-1">{s.title}</div>
      <p className="text-sm text-[var(--text-2)] mt-1">{s.body}</p>
    </motion.div>
  );
}
