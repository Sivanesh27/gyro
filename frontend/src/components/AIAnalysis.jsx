import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Play, CheckCircle2, AlertTriangle, FileDown } from "lucide-react";

const defects = [
  { name: "Mass distribution offset (root)", severity: "moderate" },
  { name: "Possible internal void at 32 cm", severity: "low" },
  { name: "Surface finish asymmetry", severity: "low" },
];

export default function AIAnalysis() {
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (running) return;
    setDone(false);
    setRunning(true);
    setCount(0);
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c >= 60) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setDone(true);
          return 60;
        }
        return c + 1;
      });
    }, 35);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <section data-testid="ai-analysis-section" className="relative py-24 md:py-32 bg-noise">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <div className="label-eyebrow">AI ANALYSIS</div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl mt-3 font-semibold tracking-tight">
            <span className="text-cyan">60 readings</span>
            <br />
            in one click.
          </h2>
          <p className="mt-4 text-[var(--text-2)] max-w-md">
            Tap once. Our AI samples 60 synchronized force readings, compares them against the ideal CG model, and returns deviation, counterweight and probable manufacturing defects.
          </p>
          <button
            onClick={start}
            disabled={running}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-cyan px-5 py-3 font-medium text-bg hover:bg-white transition-colors disabled:opacity-60"
            data-testid="ai-run-button"
          >
            <Play size={16} /> {running ? "Sampling…" : done ? "Run Again" : "Run AI Analysis"}
          </button>
        </div>

        <div className="lg:col-span-7">
          <div className="glass rounded-3xl p-5 sm:p-7">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan">
                <Brain size={18} />
                <span className="label-eyebrow text-[10px]">SAMPLING</span>
              </div>
              <div className="font-mono text-xs text-white/60">
                {count}/60 · {(count / 60 * 100).toFixed(0)}%
              </div>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan to-gold transition-all"
                style={{ width: `${(count / 60) * 100}%` }}
                data-testid="ai-progress-bar"
              />
            </div>

            {/* Live waveform */}
            <div className="mt-5 grid grid-cols-30 gap-0.5 h-16" style={{ gridTemplateColumns: "repeat(30, 1fr)" }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const active = count > i * 2;
                const h = active ? 30 + Math.abs(Math.sin(i * 0.7 + count * 0.3)) * 60 : 6;
                return (
                  <div
                    key={i}
                    className="self-end rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: active ? "linear-gradient(180deg,#00F0FF,#FFB600)" : "rgba(255,255,255,0.06)",
                    }}
                  />
                );
              })}
            </div>

            {/* Result */}
            <AnimatePresence mode="wait">
              {done && (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 grid sm:grid-cols-3 gap-3"
                  data-testid="ai-result"
                >
                  <div className="glass-cyan rounded-2xl p-4">
                    <div className="label-eyebrow text-[9px]">MEASURED CG</div>
                    <div className="font-heading text-2xl font-semibold text-gold">22.85 cm</div>
                  </div>
                  <div className="glass-cyan rounded-2xl p-4">
                    <div className="label-eyebrow text-[9px]">DEVIATION</div>
                    <div className="font-heading text-2xl font-semibold text-deviation-red">+0.35 cm</div>
                  </div>
                  <div className="glass-cyan rounded-2xl p-4">
                    <div className="label-eyebrow text-[9px]">COUNTERWEIGHT</div>
                    <div className="font-heading text-2xl font-semibold text-cyan">12.45 g @ 38.2 cm</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-5 grid sm:grid-cols-2 gap-3"
                >
                  <div className="rounded-2xl border border-border p-4">
                    <div className="flex items-center gap-2 text-deviation-green">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-medium">AI Verdict</span>
                    </div>
                    <p className="text-sm text-[var(--text-2)] mt-2">
                      Imbalance detected. Apply 12.45 g counterweight at 38.2 cm to align CG within ±0.05 cm of ideal.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <div className="flex items-center gap-2 text-gold">
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">Possible Defects</span>
                    </div>
                    <ul className="mt-2 space-y-1.5 text-sm text-[var(--text-2)]">
                      {defects.map((d) => (
                        <li key={d.name} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />
                          {d.name}{" "}
                          <span className="text-[10px] uppercase font-mono text-white/40">{d.severity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {done && (
              <div className="mt-5 flex items-center justify-end">
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-gold text-gold px-4 py-2 text-sm hover:bg-[rgba(255,182,0,0.08)] transition-colors"
                  data-testid="ai-export-pdf"
                >
                  <FileDown size={14} /> Export PDF Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
