# Architecture: Super Earth Terminal

## 1. System Architecture Overview

Super Earth Terminal is a high-performance, zero-backend, client-side web application built with modern vanilla ES Modules, Vite, and native browser APIs (Canvas 2D, Web Audio API, Clipboard API).

```
Browser Client
├── UI / DOM Layer (index.html, tactical.css)
│   ├── Preset Picker & Meme Palette
│   ├── Rich Input & Color Selector
│   ├── Character Budget Gauge
│   └── Live HUD Preview & Backdrop
├── State & Controller (src/main.js)
│   ├── Preset Manager (localStorage custom presets)
│   ├── Color Formatter (<c=AARRGGBB>)
│   └── Clipboard Bridge
├── Graphics Pipeline (src/canvas/meme-renderer.js)
│   ├── Procedural HUD chat drawing
│   ├── Canvas terrain & meme caption rendering
│   └── Blob PNG exporter & image clipboard writer
└── Tactical Audio Engine (src/audio/synth.js)
    ├── Web Audio API oscillator synthesis
    └── LocalStorage mute toggle state
```

---

## 2. Directory Layout

```
super-earth-terminal/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # Automated GitHub Pages CI/CD workflow
├── docs/
│   └── adr/
│       ├── 0001-engine-color-tag-and-character-budget.md
│       ├── 0002-vite-and-github-pages-workflow.md
│       └── 0003-canvas-export-and-web-audio.md
├── public/
│   └── favicon.svg                    # Super Earth tactical insignia icon
├── src/
│   ├── audio/
│   │   └── synth.js                   # Web Audio API tactical sound generator
│   ├── canvas/
│   │   └── meme-renderer.js           # HTML5 Canvas 2D meme & HUD generator
│   ├── config/
│   │   └── presets.js                 # System & meme template presets catalog
│   ├── styles/
│   │   └── tactical.css               # Helldivers aesthetic (scanlines, clip-paths)
│   └── main.js                        # App orchestration, DOM events & state
├── index.html                         # Tactical terminal layout & HUD canvas
├── package.json                       # Scripts (dev, build, preview) & devDependencies
├── vite.config.js                     # Portable base ('./') configuration
├── CONTEXT.md                         # Ubiquitous domain language glossary
├── SPEC.md                            # Complete functional and UI specification
└── ARCHITECTURE.md                    # Technical blueprint and pipeline docs
```

---

## 3. Technology Stack & Design Decisions

### 3.1 Build & Bundling
- **Tool:** Vite 6
- **Config:** `base: './'` to allow hassle-free hosting on GitHub Pages project subpaths (`<user>.github.io/<repo>/`).
- **Dependencies:** Pure zero-dependency runtime. Fast loading, no package vulnerability alerts, zero runtime bloat.

### 3.2 Helldivers Companion Aesthetics (tactical.css)
- **Palette:**
  - `bg-dark`: `#0a0c10` (deep space / gunmetal)
  - `super-earth-yellow`: `#ffe800` (primary terminal accent)
  - `system-cyan`: `#7df9ff` (discovery / POI)
  - `alert-red`: `#ff0033` (warning / danger)
  - `squad-orange`: `#ff9900` (Host B1)
  - `squad-blue`: `#38b6ff` (P2)
  - `squad-pink`: `#ff66cc` (J3)
  - `squad-green`: `#52ff3b` (S4)
- **Tactical Geometry:** Chamfered corners achieved via CSS `clip-path: polygon(...)`, diagonal hazard stripes, technical crosshairs.
- **CRT Shader FX:** Subtle CSS scanline overlays (`background: repeating-linear-gradient(...)`) and screen glow.

### 3.3 Meme Canvas Pipeline
- Native 2D canvas drawing ensures zero CORS cross-origin image taint when downloading or copying to clipboard.
- Renders:
  - Atmospheric desert terrain or clean dark glass.
  - Bold TikTok/meme top caption (with text shadow and stroke).
  - Authentic Helldivers 2 HUD chat box with pixel-accurate text, squad color highlights, scroll thumb, and `[OPEN CHAT]` pill.

### 3.4 Web Audio Synthesizer
- Uses `window.AudioContext` with custom attack-decay frequency ramps.
- Sounds synthesized in real-time:
  - `playClick()`: Short high-frequency chirp (tactical keypad tap).
  - `playStratagem()`: Multi-tone harmonic chime (preset selection).
  - `playTransmit()`: Radio crackle + transmission tone (copy action).
- No external `.mp3` or `.wav` files required.

---

## 4. GitHub Pages Deployment Workflow

Deploy workflow matches user's `BagiAdil` repo:
1. `push` to `main` triggers `.github/workflows/deploy.yml`.
2. Runner checks out code, runs `npm ci` and `npm run build`.
3. Output `dist/` is uploaded via `actions/upload-pages-artifact@v3`.
4. Deployed automatically via `actions/deploy-pages@v4`.
