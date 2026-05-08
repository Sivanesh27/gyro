# GYROBALANCE — Precision Balance Made Simple

## Original Problem Statement
Build a modern, futuristic, highly interactive website for "GYROBALANCE – Precision Balance Made Simple". A product demo (not a webpage) explaining how the AI-powered wind turbine blade balancing system works through scroll storytelling, interactive 3D, and a live simulator. Match brochure branding strictly.

## Architecture
- **Frontend-only** React 19 SPA (no backend) with two routes:
  - `/` — Landing experience with 10 sections
  - `/simulator` — Dedicated fullscreen live simulator
- **3D**: Three.js + @react-three/fiber + @react-three/drei (procedural blade geometry with vertex-color heatmap)
- **Animation**: framer-motion (scroll storytelling, micro-interactions)
- **Styling**: Tailwind + custom CSS variables (dark theme, glass/glow utilities)
- **Fonts**: Outfit (heading), Manrope (body), JetBrains Mono (data)
- **Brand colors** (verbatim from brochure): #002C4D navy, #00F0FF cyan, #FFB600 gold, #FF4747 / #1EE64E for deviation indicators

## User Personas
- Engineering students/faculty showing the project
- Wind-energy R&D evaluators
- Industry partners (L&T Technology Services / TECHgium)

## Core Requirements (static)
- Futuristic UI, dark theme + neon, glassmorphism, scroll storytelling, 3D, mobile-first
- Real product copy from PDF brochure/standee/sticker
- Hero with 3D rotating blade + dynamic CG marker
- Scroll-linked 5-step "How It Works" simulation (Measure → Acquire → Transmit → Process → Report)
- Interactive 3D blade with rotate/zoom + heatmap legend
- Animated System Architecture flow diagram
- AI Analysis demo ("60 readings in one click")
- Features bento grid, Why It Matters benefits
- Final CTA → /simulator route
- Live simulator: 3 load cell sliders + virtual imbalance weight + AI counterweight suggestion + apply button

## Implemented (this iteration)
- Patched @react-three/fiber to skip `x-*` and `data-*` props (needed because @emergentbase/visual-edits Babel plugin injects `x-line-number`, `x-file-name`, etc. on every JSX element, conflicting with R3F's `applyProps` piercing logic).
- Procedural turbine blade geometry (`Blade3D.jsx`) with airfoil cross-sections, taper, twist, vertex-color heatmap shifting from cyan → gold → red based on CG deviation
- All 10 landing sections built and wired
- Fullscreen simulator with real CG physics (Σ F·x / Σ F) and counterweight equation `m = total*(target − measured) / (attach − target)`
- Mobile responsive (vertical architecture flow, mobile step text under stage, hamburger nav)

## Known Notes / Mocked
- All data is client-side simulation (no backend). MOCKED report PDF export button (UI only).
- Hero & some sections show illustrative numbers (22.85 cm measured, +0.35 cm deviation, 12.45 g counterweight) drawn from brochure copy.

## Backlog / Next Action Items
- P1: Add subtle sound effects on simulator interactions (optional)
- P1: Add a "compare before/after" toggle in 3D Visualization
- P2: Persist user simulator state in localStorage
- P2: Real PDF export of simulator report (jsPDF)
- P2: i18n / Hindi support
EOF
