import { motion } from "framer-motion";
import { Gauge, Cpu, Wifi, Server, MonitorSmartphone, FileText } from "lucide-react";

const nodes = [
  { id: "loadcells", title: "Load Cells", subtitle: "3-point", icon: Gauge, x: 6, y: 50 },
  { id: "esp32", title: "ESP32", subtitle: "MCU", icon: Cpu, x: 26, y: 50 },
  { id: "wifi", title: "Wi-Fi", subtitle: "Wireless", icon: Wifi, x: 46, y: 50 },
  { id: "rpi", title: "Raspberry Pi", subtitle: "Compute", icon: Server, x: 66, y: 50 },
  { id: "dash", title: "Dashboard", subtitle: "Live UI", icon: MonitorSmartphone, x: 84, y: 30 },
  { id: "report", title: "Report", subtitle: "PDF", icon: FileText, x: 84, y: 70 },
];

export default function Architecture() {
  return (
    <section id="architecture" data-testid="architecture-section" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <div className="label-eyebrow">SYSTEM ARCHITECTURE</div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl mt-3 font-semibold tracking-tight">
            Edge sensors. <span className="text-cyan">AI brain.</span>{" "}
            <span className="text-gold">Instant report.</span>
          </h2>
          <p className="mt-4 text-[var(--text-2)]">
            From raw force readings to a signed PDF report — every component is wireless, lightweight and field-ready.
          </p>
        </div>

        <div className="mt-14 relative rounded-3xl glass p-6 sm:p-10">
          {/* Desktop SVG flow */}
          <div className="hidden md:block relative w-full" style={{ aspectRatio: "16/7" }}>
            <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lg" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FFB600" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {/* Connection lines */}
              <g fill="none" stroke="url(#lg)" strokeWidth="0.4" strokeLinecap="round">
                <line x1="6" y1="50" x2="26" y2="50" />
                <line x1="26" y1="50" x2="46" y2="50" />
                <line x1="46" y1="50" x2="66" y2="50" />
                <path d="M66 50 Q 76 50 84 30" />
                <path d="M66 50 Q 76 50 84 70" />
              </g>
              {/* Animated dashes */}
              <g fill="none" stroke="#00F0FF" strokeWidth="0.25" strokeLinecap="round">
                <line x1="6" y1="50" x2="26" y2="50" className="animate-flow" />
                <line x1="26" y1="50" x2="46" y2="50" className="animate-flow" style={{ animationDelay: "0.4s" }} />
                <line x1="46" y1="50" x2="66" y2="50" className="animate-flow" style={{ animationDelay: "0.8s" }} />
                <path d="M66 50 Q 76 50 84 30" className="animate-flow" style={{ animationDelay: "1.2s" }} />
                <path d="M66 50 Q 76 50 84 70" className="animate-flow" style={{ animationDelay: "1.4s" }} />
              </g>
            </svg>

            {nodes.map((n, i) => {
              const Icon = n.icon;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  data-testid={`arch-node-${n.id}`}
                >
                  <div className="relative w-32">
                    <div className="absolute inset-0 -m-2 rounded-2xl animate-pulse-cyan opacity-60" />
                    <div className="relative glass-cyan rounded-2xl px-3 py-3 text-center">
                      <Icon size={18} className="mx-auto text-cyan" />
                      <div className="font-heading text-sm font-semibold mt-1">{n.title}</div>
                      <div className="label-eyebrow text-[9px] mt-0.5">{n.subtitle}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile vertical flow */}
          <div className="md:hidden flex flex-col gap-2">
            {nodes.map((n, i) => {
              const Icon = n.icon;
              return (
                <div key={n.id} className="flex items-center gap-3">
                  <div className="glass-cyan rounded-2xl p-3 w-14 h-14 grid place-items-center shrink-0">
                    <Icon size={20} className="text-cyan" />
                  </div>
                  <div className="flex-1 glass rounded-xl px-3 py-2">
                    <div className="font-heading font-semibold text-sm">{n.title}</div>
                    <div className="label-eyebrow text-[9px]">{n.subtitle}</div>
                  </div>
                  {i < nodes.length - 1 && (
                    <div className="absolute" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
