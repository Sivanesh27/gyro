export default function Footer() {
  return (
    <footer data-testid="footer" className="relative pt-20 pb-10 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan/20 to-gold/20 grid place-items-center border border-cyan-soft glow-cyan">
                <span className="font-heading font-bold text-cyan text-sm">G</span>
              </div>
              <div>
                <div className="font-heading font-semibold text-white">GYROBALANCE</div>
                <div className="label-eyebrow text-[10px]">Precision Balance Made Simple</div>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm text-[var(--text-2)]">
              An AI-powered, portable system for easy wind turbine blade balancing — engineered at Sri Ramakrishna
              Engineering College in collaboration with TECHgium and L&T Technology Services.
            </p>
            <div className="mt-5 font-mono text-xs text-white/50">PID · TG0907281 · Coimbatore, IN</div>
          </div>

          <div className="lg:col-span-3">
            <div className="label-eyebrow">Product</div>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-2)]">
              <li><a href="#how" className="hover:text-white">How it works</a></li>
              <li><a href="#viz" className="hover:text-white">3D Visualization</a></li>
              <li><a href="#architecture" className="hover:text-white">System Architecture</a></li>
              <li><a href="#features" className="hover:text-white">Features</a></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="label-eyebrow">Specifications</div>
            <dl className="mt-4 grid grid-cols-2 gap-y-2 text-xs font-mono">
              <dt className="text-white/50">Accuracy</dt><dd className="text-white">±1 g (typ.)</dd>
              <dt className="text-white/50">Range</dt><dd className="text-white">0 – 20 kg</dd>
              <dt className="text-white/50">Voltage</dt><dd className="text-white">5 V DC</dd>
              <dt className="text-white/50">Wireless</dt><dd className="text-white">Wi-Fi</dd>
              <dt className="text-white/50">Power</dt><dd className="text-white">Rechargeable</dd>
              <dt className="text-white/50">Op. Temp</dt><dd className="text-white">0 – 40 °C</dd>
            </dl>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-white/40 font-mono">
            © {new Date().getFullYear()} GYROBALANCE · MEASURE. ANALYZE. BALANCE. PERFECT.
          </div>
          <div className="text-xs text-white/40 font-mono uppercase tracking-[0.2em]">
            Precision today. Perfect rotations tomorrow.
          </div>
        </div>
      </div>
    </footer>
  );
}
