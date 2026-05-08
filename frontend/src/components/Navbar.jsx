import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { to: "#how", label: "How It Works" },
  { to: "#viz", label: "3D Visualization" },
  { to: "#architecture", label: "Architecture" },
  { to: "#features", label: "Features" },
  { to: "#why", label: "Why It Matters" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 transition-all ${
          scrolled ? "" : ""
        }`}
      >
        <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" data-testid="navbar-logo">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan/20 to-gold/20 grid place-items-center border border-cyan-soft glow-cyan">
              <span className="font-heading font-bold text-cyan text-sm">G</span>
            </div>
            <div className="leading-tight">
              <div className="font-heading font-semibold tracking-tight text-white text-base">GYROBALANCE</div>
              <div className="label-eyebrow text-[10px]">Precision Balance</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {pathname === "/" &&
              links.map((l) => (
                <a
                  key={l.to}
                  href={l.to}
                  className="text-sm text-[var(--text-2)] hover:text-white transition-colors"
                  data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {l.label}
                </a>
              ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/simulator"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-cyan text-bg hover:bg-white transition-colors"
              data-testid="navbar-launch-simulator"
            >
              Launch Simulator
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden grid place-items-center w-10 h-10 rounded-lg border border-border text-white"
              data-testid="navbar-mobile-toggle"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-2xl mt-2 p-4 md:hidden"
            >
              <ul className="flex flex-col gap-3">
                {pathname === "/" &&
                  links.map((l) => (
                    <li key={l.to}>
                      <a
                        href={l.to}
                        onClick={() => setOpen(false)}
                        className="block py-2 text-[var(--text-2)] hover:text-white"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                <li>
                  <Link
                    to="/simulator"
                    onClick={() => setOpen(false)}
                    className="block text-center rounded-xl px-4 py-3 bg-cyan text-bg font-medium"
                  >
                    Launch Simulator
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
