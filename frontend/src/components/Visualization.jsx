import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Move3d, Eye, EyeOff, RotateCcw } from "lucide-react";
import Blade3D from "./Blade3D";

export default function Visualization() {
  const [cg, setCg] = useState(0.62);
  const [heatmap, setHeatmap] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  const ideal = 0.5;
  const deviationCm = ((cg - ideal) * 45).toFixed(2); // map 0..1 over ~45cm blade
  const counterweight = Math.abs((cg - ideal) * 35).toFixed(1); // grams

  return (
    <section id="viz" data-testid="visualization-section" className="relative py-24 md:py-32 bg-noise">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="label-eyebrow">3D VISUALIZATION</div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl mt-3 font-semibold tracking-tight">
              See the imbalance.
              <br />
              <span className="text-cyan">Then watch it disappear.</span>
            </h2>
          </div>
          <p className="max-w-md text-[var(--text-2)]">
            Drag to rotate. Pinch to zoom. Drag the slider to shift the measured CG and watch the deviation
            heatmap shift from <span className="text-deviation-red">high</span> to{" "}
            <span className="text-deviation-green">low</span>.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-12 gap-6">
          {/* 3D viewport */}
          <div className="lg:col-span-8 relative h-[420px] sm:h-[520px] lg:h-[620px] rounded-3xl glass overflow-hidden" data-testid="viz-3d-container">
            <Canvas camera={{ position: [0, 1.5, 9.5], fov: 42 }} dpr={[1, 1.6]}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[6, 6, 4]} intensity={1.2} color="#00F0FF" />
              <directionalLight position={[-5, -3, -4]} intensity={0.6} color="#FFB600" />
              <Suspense fallback={null}>
                <Blade3D cgPosition={cg} idealCG={ideal} showHeatmap={heatmap} autoRotate={autoRotate} />
              </Suspense>
              <OrbitControls enablePan={false} />
            </Canvas>

            {/* Heatmap legend */}
            <div className="absolute left-4 bottom-4 right-4 flex flex-wrap items-center justify-between gap-3">
              <div className="glass rounded-xl px-3 py-2 flex items-center gap-3">
                <div className="label-eyebrow text-[9px]">DEVIATION</div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="w-3 h-3 rounded-full bg-deviation-red" /> HIGH
                </div>
                <div className="w-20 h-1.5 rounded-full"
                     style={{ background: "linear-gradient(90deg,#FF4747,#FFB600,#1EE64E)" }} />
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="w-3 h-3 rounded-full bg-deviation-green" /> LOW
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setHeatmap((v) => !v)}
                  className="glass rounded-xl px-3 py-2 text-xs flex items-center gap-2 hover:border-cyan-soft"
                  data-testid="viz-toggle-heatmap"
                >
                  {heatmap ? <Eye size={14} /> : <EyeOff size={14} />} Heatmap
                </button>
                <button
                  onClick={() => setAutoRotate((v) => !v)}
                  className="glass rounded-xl px-3 py-2 text-xs flex items-center gap-2 hover:border-cyan-soft"
                  data-testid="viz-toggle-rotate"
                >
                  <RotateCcw size={14} /> Auto-rotate
                </button>
              </div>
            </div>

            {/* Top label */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="label-eyebrow">INTERACTIVE 3D · DRAG TO ROTATE</div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                <Move3d size={14} className="text-cyan" /> ROT · ZOOM · TAP
              </div>
            </div>
          </div>

          {/* Controls + readouts */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="glass rounded-3xl p-6">
              <div className="label-eyebrow">CG · ADJUST MEASURED</div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="font-heading font-semibold text-3xl text-gold">{(cg * 45).toFixed(2)}<span className="text-base text-white/60"> cm</span></div>
                <div className="text-xs font-mono text-white/60">ideal {ideal * 45} cm</div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={cg}
                onChange={(e) => setCg(parseFloat(e.target.value))}
                className="w-full mt-4 accent-[#00F0FF]"
                data-testid="viz-cg-slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                <span>ROOT 0cm</span>
                <span>TIP 45cm</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-4">
                <div className="label-eyebrow text-[9px]">DEVIATION</div>
                <motion.div
                  key={deviationCm}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  className={`font-heading text-2xl font-semibold ${
                    Math.abs(deviationCm) > 0.2 ? "text-deviation-red" : "text-deviation-green"
                  }`}
                  data-testid="viz-deviation"
                >
                  {deviationCm > 0 ? "+" : ""}
                  {deviationCm} cm
                </motion.div>
              </div>
              <div className="glass rounded-2xl p-4">
                <div className="label-eyebrow text-[9px]">COUNTERWEIGHT</div>
                <div className="font-heading text-2xl font-semibold text-cyan" data-testid="viz-counterweight">
                  {counterweight} g
                </div>
              </div>
            </div>

            <button
              onClick={() => setCg(0.5)}
              className="rounded-2xl border border-cyan-soft glow-cyan px-4 py-3 font-medium text-cyan hover:bg-[rgba(0,240,255,0.06)] transition-colors"
              data-testid="viz-correct-cg"
            >
              ⚡ Auto-correct CG → 22.50 cm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
