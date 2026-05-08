import { Suspense, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { ArrowLeft, Wand2, RotateCw, Plus, Minus, Activity } from "lucide-react";
import Blade3D from "../components/Blade3D";

// Load cell positions in cm
const POSITIONS = [5, 22.5, 40];
const BLADE_LENGTH_CM = 45; // for visualization
const IDEAL_CG_CM = 22.5;

function computeCG(weights, posOffsets, virtualWeight) {
  // weights[i] in grams, posOffsets[i] in cm
  // virtualWeight: { mass (g), pos (cm) } | null
  let sumW = 0;
  let sumWX = 0;
  for (let i = 0; i < weights.length; i++) {
    sumW += weights[i];
    sumWX += weights[i] * posOffsets[i];
  }
  if (virtualWeight && virtualWeight.mass > 0) {
    sumW += virtualWeight.mass;
    sumWX += virtualWeight.mass * virtualWeight.pos;
  }
  if (sumW === 0) return { cg: 0, totalMass: 0 };
  return { cg: sumWX / sumW, totalMass: sumW };
}

function suggestCounterweight({ measuredCG, totalMass, targetCG, attachPos }) {
  // m at attachPos to drive CG to targetCG
  // m = (T * total - total * measuredCG) / (attachPos - T)
  // Equivalent: total*(measured - target) / (target - attachPos) ... let's derive cleanly
  // sumWX = total * measuredCG (ignoring virtual). After adding m at attachPos:
  // newCG = (total*measuredCG + m*attachPos) / (total + m) = target
  // => total*measuredCG + m*attachPos = target*total + target*m
  // => m*(attachPos - target) = total*(target - measuredCG)
  // => m = total*(target - measuredCG) / (attachPos - target)
  const denom = attachPos - targetCG;
  if (Math.abs(denom) < 0.001) return { mass: 0, pos: attachPos };
  const m = (totalMass * (targetCG - measuredCG)) / denom;
  return { mass: m, pos: attachPos };
}

function Slider({ value, onChange, min, max, step, label, unit, accent = "cyan", testid }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-baseline justify-between">
        <div className="label-eyebrow text-[10px]">{label}</div>
        <div
          className="font-heading text-xl font-semibold"
          style={{ color: accent === "gold" ? "#FFB600" : "#00F0FF" }}
        >
          {value.toFixed(2)} <span className="text-xs text-white/50">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full mt-3"
        style={{ accentColor: accent === "gold" ? "#FFB600" : "#00F0FF" }}
        data-testid={testid}
      />
      <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default function Simulator() {
  const [w1, setW1] = useState(1420);  // grams
  const [w2, setW2] = useState(960);
  const [w3, setW3] = useState(410);
  const [virtualMass, setVirtualMass] = useState(0);
  const [virtualPos, setVirtualPos] = useState(35);
  const [counterApplied, setCounterApplied] = useState(null); // { mass, pos } | null
  const [autoRotate, setAutoRotate] = useState(false);

  const result = useMemo(() => {
    const weights = [w1, w2, w3];
    const positions = POSITIONS.slice();

    const virtual = virtualMass > 0 ? { mass: virtualMass, pos: virtualPos } : null;
    const { cg: cgWithoutCounter, totalMass: totalWithoutCounter } = computeCG(weights, positions, virtual);

    // Apply counterweight if user pressed AI correct
    let cg = cgWithoutCounter;
    let totalMass = totalWithoutCounter;
    if (counterApplied) {
      const sumWX = cgWithoutCounter * totalWithoutCounter + counterApplied.mass * counterApplied.pos;
      totalMass = totalWithoutCounter + counterApplied.mass;
      cg = sumWX / totalMass;
    }

    const deviation = cg - IDEAL_CG_CM;
    const suggestion = suggestCounterweight({
      measuredCG: cgWithoutCounter,
      totalMass: totalWithoutCounter,
      targetCG: IDEAL_CG_CM,
      attachPos: cgWithoutCounter > IDEAL_CG_CM ? 5 : 40,
    });

    return { cg, deviation, totalMass, suggestion, cgWithoutCounter };
  }, [w1, w2, w3, virtualMass, virtualPos, counterApplied]);

  const cgNorm = Math.min(1, Math.max(0, result.cg / BLADE_LENGTH_CM));
  const idealNorm = IDEAL_CG_CM / BLADE_LENGTH_CM;

  const applyAI = () => setCounterApplied({ ...result.suggestion });
  const reset = () => {
    setW1(1420); setW2(960); setW3(410);
    setVirtualMass(0); setVirtualPos(35);
    setCounterApplied(null);
  };

  const status =
    Math.abs(result.deviation) < 0.05 ? "BALANCED" : Math.abs(result.deviation) < 0.5 ? "MINOR" : "IMBALANCED";
  const statusColor = status === "BALANCED" ? "#1EE64E" : status === "MINOR" ? "#FFB600" : "#FF4747";

  // Re-render trigger for live waveform
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 120);
    return () => clearInterval(id);
  }, []);

  return (
    <main data-testid="simulator-page" className="relative min-h-screen bg-[var(--bg)] overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-50" />
      {/* Top bar */}
      <header className="relative z-20 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="grid place-items-center w-10 h-10 rounded-lg border border-border text-white/80 hover:text-white" data-testid="simulator-back">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="font-heading font-semibold tracking-tight">GYROBALANCE · LIVE SIMULATOR</div>
              <div className="label-eyebrow text-[10px]">Move CG · Add weight · Watch AI rebalance</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-cyan" /> LIVE
            </div>
            <button
              onClick={reset}
              className="rounded-xl border border-border px-3 py-2 text-xs hover:border-cyan-soft flex items-center gap-2"
              data-testid="simulator-reset"
            >
              <RotateCw size={14} /> Reset
            </button>
          </div>
        </div>
      </header>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid lg:grid-cols-12 gap-5">
        {/* Stage */}
        <div className="lg:col-span-8">
          <div className="relative h-[380px] sm:h-[480px] lg:h-[620px] rounded-3xl glass overflow-hidden" data-testid="simulator-stage">
            <Canvas camera={{ position: [0, 1.6, 9.5], fov: 42 }} dpr={[1, 1.6]}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[6, 6, 4]} intensity={1.3} color="#00F0FF" />
              <directionalLight position={[-5, -3, -4]} intensity={0.6} color="#FFB600" />
              <Suspense fallback={null}>
                <Blade3D
                  cgPosition={cgNorm}
                  idealCG={idealNorm}
                  showHeatmap
                  autoRotate={autoRotate}
                  rotationSpeed={0.18}
                />
              </Suspense>
              <OrbitControls enablePan={false} />
            </Canvas>

            {/* Top HUD */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between flex-wrap gap-2">
              <div className="glass rounded-xl px-3 py-2 flex items-center gap-3">
                <div className="label-eyebrow text-[9px]">STATUS</div>
                <div className="font-heading text-sm font-semibold" style={{ color: statusColor }}>
                  {status}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAutoRotate((v) => !v)}
                  className="glass rounded-xl px-3 py-2 text-xs hover:border-cyan-soft"
                  data-testid="simulator-toggle-rotate"
                >
                  Auto-rotate {autoRotate ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* Bottom HUD: blade ruler */}
            <div className="absolute bottom-3 left-3 right-3 glass rounded-xl px-3 py-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                <span>0 cm</span>
                <span>{BLADE_LENGTH_CM} cm</span>
              </div>
              <div className="relative mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-deviation-red via-gold to-deviation-green opacity-30 w-full" />
                {/* Ideal CG marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-cyan"
                  style={{ left: `${idealNorm * 100}%` }}
                />
                {/* Measured CG marker */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold shadow-[0_0_12px_rgba(255,182,0,0.7)]"
                  animate={{ left: `${cgNorm * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] font-mono">
                {POSITIONS.map((p) => (
                  <div key={p} className="text-white/50">load · {p} cm</div>
                ))}
              </div>
            </div>
          </div>

          {/* Live waveform / KPI strip */}
          <div className="mt-4 grid sm:grid-cols-4 gap-3">
            <div className="glass rounded-2xl p-4">
              <div className="label-eyebrow text-[9px]">MEASURED CG</div>
              <motion.div
                key={result.cg.toFixed(2)}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="font-heading text-2xl font-semibold text-gold"
                data-testid="sim-cg"
              >
                {result.cg.toFixed(2)} <span className="text-sm text-white/50">cm</span>
              </motion.div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="label-eyebrow text-[9px]">DEVIATION</div>
              <div
                className="font-heading text-2xl font-semibold"
                style={{ color: Math.abs(result.deviation) < 0.05 ? "#1EE64E" : "#FF4747" }}
                data-testid="sim-deviation"
              >
                {result.deviation > 0 ? "+" : ""}
                {result.deviation.toFixed(2)} <span className="text-sm text-white/50">cm</span>
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="label-eyebrow text-[9px]">TOTAL MASS</div>
              <div className="font-heading text-2xl font-semibold text-cyan" data-testid="sim-total-mass">
                {(result.totalMass / 1000).toFixed(2)} <span className="text-sm text-white/50">kg</span>
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="label-eyebrow text-[9px]">SUGGESTION</div>
              <div className="font-mono text-sm text-white" data-testid="sim-suggestion">
                {counterApplied
                  ? `${Math.abs(counterApplied.mass).toFixed(1)} g @ ${counterApplied.pos} cm`
                  : `${Math.abs(result.suggestion.mass).toFixed(1)} g @ ${result.suggestion.pos} cm`}
              </div>
              <div className="text-[10px] font-mono text-white/40 mt-0.5">
                {counterApplied
                  ? "✓ Applied · re-balanced"
                  : `attach @ ${result.suggestion.pos > IDEAL_CG_CM ? "tip" : "root"}`}
              </div>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-cyan" />
              <div className="label-eyebrow">LOAD CELLS · GRAMS</div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <Slider label="CELL · 5 cm" value={w1} onChange={setW1} min={0} max={5000} step={5} unit="g" testid="sim-w1" />
              <Slider label="CELL · 22.5 cm" value={w2} onChange={setW2} min={0} max={5000} step={5} unit="g" testid="sim-w2" />
              <Slider label="CELL · 40 cm" value={w3} onChange={setW3} min={0} max={5000} step={5} unit="g" testid="sim-w3" />
            </div>
          </div>

          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div className="label-eyebrow">VIRTUAL IMBALANCE WEIGHT</div>
              <div className="flex items-center gap-1">
                <button
                  className="grid place-items-center w-7 h-7 rounded-lg border border-border text-white/70 hover:text-white"
                  onClick={() => setVirtualMass((m) => Math.max(0, m - 5))}
                  data-testid="sim-vmass-minus"
                >
                  <Minus size={12} />
                </button>
                <button
                  className="grid place-items-center w-7 h-7 rounded-lg border border-border text-white/70 hover:text-white"
                  onClick={() => setVirtualMass((m) => Math.min(500, m + 5))}
                  data-testid="sim-vmass-plus"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <Slider label="MASS" value={virtualMass} onChange={setVirtualMass} min={0} max={500} step={1} unit="g" accent="gold" testid="sim-vmass" />
              <Slider label="POSITION" value={virtualPos} onChange={setVirtualPos} min={0} max={BLADE_LENGTH_CM} step={0.5} unit="cm" accent="gold" testid="sim-vpos" />
            </div>
          </div>

          <button
            onClick={applyAI}
            className="rounded-2xl border border-cyan-soft glow-cyan px-4 py-4 font-medium text-cyan hover:bg-[rgba(0,240,255,0.06)] transition-colors flex items-center justify-center gap-2"
            data-testid="sim-apply-ai"
          >
            <Wand2 size={16} /> Apply AI Counterweight ({Math.abs(result.suggestion.mass).toFixed(1)} g)
          </button>
          {counterApplied && (
            <div className="rounded-2xl border border-deviation-green/40 bg-[rgba(30,230,78,0.06)] px-4 py-3 text-sm text-deviation-green">
              ✓ Applied {Math.abs(counterApplied.mass).toFixed(1)} g at {counterApplied.pos} cm
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
