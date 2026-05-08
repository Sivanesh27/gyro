import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section data-testid="final-cta" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-50" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(closest-side, rgba(0,240,255,0.18), transparent 70%)" }} />
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(closest-side, rgba(255,182,0,0.12), transparent 70%)" }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-soft bg-[rgba(0,240,255,0.06)] px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] text-cyan"
        >
          <Sparkles size={12} /> READY · LIVE SIMULATION
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading text-4xl sm:text-5xl lg:text-7xl mt-6 font-semibold tracking-tight"
        >
          Experience
          <br />
          <span className="text-cyan">Precision</span> <span className="text-gold">Balancing.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-5 max-w-xl mx-auto text-[var(--text-2)]"
        >
          Drag virtual weights. Move the CG. Watch the AI rebalance the blade in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/simulator"
            className="group inline-flex items-center gap-2 rounded-2xl px-7 py-4 font-medium text-bg bg-cyan hover:bg-white transition-colors text-base sm:text-lg"
            data-testid="final-cta-launch-simulation"
          >
            Launch Simulation
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#viz"
            className="inline-flex items-center gap-2 rounded-2xl border border-gold px-7 py-4 font-medium text-gold hover:bg-[rgba(255,182,0,0.08)] transition-colors text-base sm:text-lg"
            data-testid="final-cta-explore-3d"
          >
            Try the 3D Demo
          </a>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { k: "±1g", v: "ACCURACY" },
            { k: "0–20kg", v: "RANGE" },
            { k: "Wi-Fi", v: "WIRELESS" },
            { k: "PDF", v: "EXPORT" },
          ].map((s) => (
            <div key={s.v} className="glass rounded-xl px-4 py-3">
              <div className="font-heading text-xl font-semibold">{s.k}</div>
              <div className="label-eyebrow text-[10px] mt-0.5">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
