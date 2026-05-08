import { motion } from "framer-motion";
import {
  Crosshair,
  Brain,
  Box,
  Battery,
  FileDown,
  Settings2,
  Zap,
  Wifi,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: Crosshair,
    title: "High Precision",
    body: "Detects minimal imbalance with high accuracy using advanced 3-point measurement.",
    span: "lg:col-span-5 lg:row-span-2",
    accent: "cyan",
  },
  {
    icon: Brain,
    title: "AI Powered Analysis",
    body: "Smart AI algorithms provide instant insights and accurate recommendations.",
    span: "lg:col-span-4",
    accent: "gold",
  },
  {
    icon: Box,
    title: "3D Visualization",
    body: "Interactive 3D blade model for clear imbalance visualization.",
    span: "lg:col-span-3",
    accent: "cyan",
  },
  {
    icon: FileDown,
    title: "Detailed Reports",
    body: "Generate comprehensive AI reports in PDF for easy documentation.",
    span: "lg:col-span-3",
    accent: "gold",
  },
  {
    icon: Truck,
    title: "Portable & Durable",
    body: "Lightweight, rugged design for easy field use and transport.",
    span: "lg:col-span-4",
    accent: "cyan",
  },
  {
    icon: Settings2,
    title: "Tare & Calibration",
    body: "Easy tare before measurement and accurate load cell calibration.",
    span: "lg:col-span-5",
    accent: "gold",
  },
  {
    icon: Zap,
    title: "Fast & Accurate",
    body: "Delivers precise results in seconds.",
    span: "lg:col-span-3",
    accent: "cyan",
  },
  {
    icon: Wifi,
    title: "Wi-Fi · Field Ready",
    body: "Wireless transmission to compute node — built for wind farms.",
    span: "lg:col-span-3",
    accent: "cyan",
  },
  {
    icon: Battery,
    title: "Rechargeable",
    body: "Battery-powered for true mobility in the field.",
    span: "lg:col-span-3",
    accent: "gold",
  },
];

export default function Features() {
  return (
    <section id="features" data-testid="features-section" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="label-eyebrow">KEY FEATURES</div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl mt-3 font-semibold tracking-tight">
              Built for <span className="text-cyan">performance.</span>
              <br />
              Engineered for the <span className="text-gold">field.</span>
            </h2>
          </div>
          <p className="max-w-md text-[var(--text-2)]">
            Every component of GYROBALANCE was designed to deliver lab-grade precision wherever the wind blows.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-[180px]" data-testid="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            const accent = f.accent === "gold" ? "gold" : "cyan";
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.04 }}
                className={`relative group glass rounded-2xl p-5 overflow-hidden ${f.span} hover:-translate-y-1 transition-all`}
                data-testid={`feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  className={`absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-0 group-hover:opacity-60 transition-opacity`}
                  style={{
                    background:
                      accent === "gold"
                        ? "radial-gradient(closest-side, rgba(255,182,0,0.25), transparent 70%)"
                        : "radial-gradient(closest-side, rgba(0,240,255,0.22), transparent 70%)",
                  }}
                />
                <div className={`grid place-items-center w-10 h-10 rounded-lg border ${accent === "gold" ? "border-gold text-gold" : "border-cyan-soft text-cyan"}`}>
                  <Icon size={18} />
                </div>
                <div className="mt-4 font-heading font-semibold text-lg">{f.title}</div>
                <p className="mt-1.5 text-sm text-[var(--text-2)]">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
