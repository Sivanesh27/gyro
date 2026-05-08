import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, ShieldCheck, Coins, Wrench, Volume2, ZapOff } from "lucide-react";

const benefits = [
  {
    icon: TrendingDown,
    title: "Reduced Vibration",
    sub: "Up to -42%",
    body: "Minimizes vibration, noise and mechanical stress to improve turbine performance.",
    progress: 42,
    color: "#00F0FF",
  },
  {
    icon: TrendingUp,
    title: "Higher Energy Capture",
    sub: "+6.8% yield",
    body: "Properly balanced blades deliver higher energy output and operational efficiency.",
    progress: 68,
    color: "#FFB600",
  },
  {
    icon: ShieldCheck,
    title: "Longer Component Life",
    sub: "+3 yrs avg.",
    body: "Lower structural stress translates to extended turbine and bearing lifespan.",
    progress: 76,
    color: "#1EE64E",
  },
  {
    icon: Coins,
    title: "Cost Effective",
    sub: "ROI in 9 mo",
    body: "Reduces downtime and maintenance cost — better return on investment.",
    progress: 60,
    color: "#FFB600",
  },
  {
    icon: Volume2,
    title: "Reduced Noise",
    sub: "Quieter ops",
    body: "Smoother rotation cuts acoustic emissions across the wind farm.",
    progress: 55,
    color: "#00F0FF",
  },
  {
    icon: Wrench,
    title: "Reliable & Safe",
    sub: "Field-grade",
    body: "Reliable, repeatable balancing for safer turbine operation.",
    progress: 88,
    color: "#1EE64E",
  },
];

export default function WhyMatters() {
  return (
    <section id="why" data-testid="why-matters-section" className="relative py-24 md:py-32 bg-noise">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <div className="label-eyebrow">WHY IT MATTERS</div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl mt-3 font-semibold tracking-tight">
            A balanced blade
            <br />
            is a <span className="text-cyan">smarter</span> turbine.
          </h2>
          <p className="mt-4 text-[var(--text-2)]">
            CG imbalance translates directly into lost energy, premature wear and avoidable downtime. GYROBALANCE
            reverses every one of those losses.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6"
                data-testid={`benefit-${b.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="grid place-items-center w-10 h-10 rounded-lg"
                    style={{ background: `${b.color}1A`, color: b.color, border: `1px solid ${b.color}55` }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="font-mono text-xs" style={{ color: b.color }}>
                    {b.sub}
                  </div>
                </div>
                <div className="font-heading font-semibold text-lg mt-4">{b.title}</div>
                <p className="text-sm text-[var(--text-2)] mt-1">{b.body}</p>
                <div className="mt-4 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${b.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    className="h-full"
                    style={{ background: b.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom marquee-style highlights */}
        <div className="mt-12 glass rounded-2xl p-5 flex flex-wrap items-center justify-around gap-4 text-xs font-mono uppercase tracking-[0.18em] text-white/70">
          <span className="flex items-center gap-2"><ZapOff size={14} className="text-cyan" /> Lower structural stress</span>
          <span className="flex items-center gap-2"><Volume2 size={14} className="text-cyan" /> Reduced acoustic emissions</span>
          <span className="flex items-center gap-2"><TrendingUp size={14} className="text-gold" /> Improved power quality</span>
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-deviation-green" /> Reliable & safe operation</span>
        </div>
      </div>
    </section>
  );
}
