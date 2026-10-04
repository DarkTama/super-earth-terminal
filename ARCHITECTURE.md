# Architecture: Super Earth Terminal

## 1. System Architecture Overview

Super Earth Terminal is a high-performance, zero-backend, client-side web application built with modern vanilla ES Modules, Vite, and native browser APIs (Canvas 2D, Web Audio API, Clipboard API).

```
Browser Client
├── UI / DOM Layer (index.html, tactical.css)
│   ├── Target Mode Switcher ([ STEAM NAME ] / [ TACTICAL CHAT ])
│   ├── Tactical Symbol Tray (★, ☆, ☠︎, ☣︎, ☢︎, etc.)
│   ├── Formatting Toolbar (Color, Size, Bold/Fat, Template)
│   ├── Crash Hazard Warning Banner
│   ├── Character Budget Gauge (32 or 100 limit breakdown)
│   └── Live Preview (Nameplate Card / Tactical Chat HUD)
├── State & Controller (src/main.js)
│   ├── Target Mode Manager
│   ├── Preset Manager (Steam names, system dispatches, community memes)
│   └── Clipboard Bridge
├── Super Formatting Engine (src/parser/)
│   ├── Markup Lexer & AST Parser (tokenizes <c>, <s>, <f>, <i>)
│   ├── Minifier & Serializer (strips trailing closing tags)
│   └── Crash Safety Guard (intercepts <f=04..99> crash hazard)
├── Graphics Pipeline (src/canvas/meme-renderer.js)
│   ├── Procedural HUD chat drawing
│   ├── Procedural Destroyer / Lobby Nameplate card drawing
│   ├── Canvas terrain & meme caption rendering
│   └── Blob PNG exporter & image clipboard writer
└── Tactical Audio Engine (src/audio/synth.js)
    ├── Web Audio API oscillator synthesis (clicks, chirps, sirens, stratagems)
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
│       ├── 0003-canvas-export-and-web-audio.md
│       └── 0004-super-formatting-and-crash-safety.md
├── public/
│   └── favicon.svg                    # Super Earth tactical insignia icon
├── src/
│   ├── audio/
│   │   └── synth.js                   # Web Audio API tactical sound generator
│   ├── canvas/
│   │   └── meme-renderer.js           # HTML5 Canvas 2D meme, HUD & nameplate generator
│   ├── config/
│   │   ├── presets.js                 # Name & chat presets catalog
│   │   └── symbols.js                 # Verified ASCII/Unicode tactical symbols
│   ├── parser/
│   │   ├── markup.js                  # Super Formatting lexer, serializer & minifier
│   │   └── validator.js               # Crash hazard guard (<f=04..99>) & warnings
│   ├── styles/
│   │   └── tactical.css               # Helldivers aesthetic (scanlines, clip-paths, HUD)
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
- **Config:** `base: './'` to allow hosting on GitHub Pages project subpaths (`<user>.github.io/<repo>/`).
- **Dependencies:** Pure zero-dependency runtime. Fast loading, no package vulnerability alerts, zero runtime bloat.

### 3.2 Super Formatting Parser & Validator
- **Parser Pipeline:**
  - Tokenizes raw input into plain text spans and tag nodes: `{ type: 'color'|'size'|'fat'|'index', value, text }`.
  - Serializer outputs either minified markup (strips redundant tail tags) or strict closed XML tags based on user preference.
- **Safety Intercept:**
  - Regex scan: `/<f=(0[4-9]|[1-9][0-9])>/i` immediately trips safety state:
    - Sets `isCrashHazard = true`
    - Displays red pulsing banner in UI
    - Synthesizes tactical warning chirp
    - Disables copy button

### 3.3 Helldivers Companion Aesthetics (tactical.css)
- **Palette:**
  - `bg-dark`: `#0a0c10` (deep space / gunmetal)
  - `super-earth-yellow`: `#ffe800` (primary terminal accent)
  - `system-cyan`: `#7df9ff` (discovery / POI)
  - `alert-red`: `#ff0033` (warning / danger / crash hazard)
  - `squad-orange`: `#ff9900` (Host B1)
  - `squad-blue`: `#38b6ff` (P2)
  - `squad-pink`: `#ff66cc` (J3)
  - `squad-green`: `#52ff3b` (S4)
- **Tactical Geometry:** Chamfered corners via CSS `clip-path: polygon(...)`, diagonal hazard stripes, technical crosshairs.
- **CRT Shader FX:** Subtle CSS scanline overlays and screen glow.

### 3.4 Dual-Canvas Meme Pipeline
- Native 2D canvas drawing ensures zero CORS cross-origin image taint.
- Modes:
  - **In-Game Chat HUD**: Renders desert planetary backdrop, simulated previous squad messages, active player message, and `[OPEN CHAT]` prompt.
  - **Lobby Nameplate Card**: Renders destroyer bridge backdrop, squad rank insignia, player title, and formatted callsign.
- Exporter supports 16:9 banner and 9:16 mobile story aspect ratios.

### 3.5 Web Audio Synthesizer
- Built-in `window.AudioContext` oscillators.
- Procedural SFX:
  - `playClick()`: Tactical keypad tap.
  - `playStratagem()`: Multi-tone harmonic chime on preset select.
  - `playTransmit()`: Radio transmission burst on copy.
  - `playHazard()`: Rapid dual-tone warning buzzer on crash tag detection.

---

## 4. GitHub Pages Deployment Workflow
1. `push` to `main` triggers `.github/workflows/deploy.yml`.
2. Runner checks out code, runs `npm ci` and `npm run build`.
3. Output `dist/` is uploaded via `actions/upload-pages-artifact@v3`.
4. Deployed automatically via `actions/deploy-pages@v4`.
