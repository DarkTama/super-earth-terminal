# Super Earth Terminal

[![Deploy to GitHub Pages](https://github.com/DarkTama/super-earth-terminal/actions/workflows/deploy.yml/badge.svg)](https://github.com/DarkTama/super-earth-terminal/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Zero Runtime Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)](#)

> **Tactical Helldivers 2 Rich-Text Formatting Console, Procedural Canvas Card Studio, and Hardware Keystroke Macro Generator.**

Live Deployment: **[https://darktama.github.io/super-earth-terminal/](https://darktama.github.io/super-earth-terminal/)**

---

## ⚡ Overview

**Super Earth Terminal** is a static client-side web application built for *Helldivers 2* players. It enables composing, validating, and generating game-engine rich-text markup tags for in-game tactical chat and player identity cards, with real-time crash safety validation, zero-asset Web Audio synthesis, and procedural canvas meme exports.

Because the *Helldivers 2* engine blocks Windows clipboard paste (`Ctrl+V`) inside the chat box and Arrowhead sanitizes Steam profile names, this terminal bridges the gap by generating hardware-level **QMK/VIA keyboard macros** and **AutoHotkey v2 scripts** to inject formatted callouts directly over USB HID.

---

## 🛰️ Core Features

### 1. Super Formatting Tag Engine
- **Color Tags (`<c=AARRGGBB>`):** Full 8-digit hexadecimal support with 2-digit alpha channel opacity (`00` to `FF`) and quick swatches for Super Earth Yellow (`#FFE800`), POI Cyan (`#7DF9FF`), Hazard Red (`#FF0033`), Ally Green (`#52FF3B`), and squad colors.
- **Font Size Scale (`<s=XX>`):** Engine text scaling from size 10 (tiny) to 90 (giant).
- **Text Weight (`<f=00>` / `<f=01>`):** Bold styling.
- **Template Index Tags (`<i=1>`):** Major order yellow and squad slot color templates.
- **Tail Minification:** Automatically strips redundant closing tags (`</c>`, `</s>`, `</f>`, `</i>`) to maximize tight character limits.

### 2. In-Game HUD Icon Font Palette (`<f=05>`)
Direct 1-click insertion for native game HUD icon sprites (which bypass Unicode font missing errors and render natively inside the engine):
- `<f=05>5` — **Friendship Bunker / Vault Door**
- `<f=05>3` — **Super Uranium (Super Sample Diamond)**
- `<f=05>7` — **Rare Sample (Canister Square)**
- `<f=05>1` — **Common Sample (Circle)**
- `<f=32>` — **Illuminate Alien Runes**
- *Icons dynamically inherit colors from preceding `<c=...>` tags.*

### 3. Active Crash Hazard Guard
- Detects fatal engine crash tags (`<f=04>`, `<f=06..31>`, `<f=33..99>`, and empty `<f=03></f>`).
- Triggers dual-tone procedural warning siren and flashing hazard banner.
- Locks clipboard copy and macro transmission buttons until the hazardous syntax is rectified.

### 4. Hardware Keystroke Macro Generator (QMK / VIA)
Because the Stingray engine rejects OS `Ctrl+V` inside chat:
- Generates standard **VIA macro scripts** for programmable keyboards (NuPhy Air75 V2, Keychron, Wooting, QMK boards).
- **Immediate Send (Combat Autopilot):**
  ```text
  {KC_ENT}{100}<c=FFFF5F1F><f=05>5 Bunker on My Pin{50}{KC_ENT}
  ```
- **Draft Mode (Type Only):**
  ```text
  {KC_ENT}{100}<c=FFFF5F1F><f=05>5 Bunker on My Pin
  ```
  *(Opens chat and types payload, leaving prompt open for personal notes).*
- 1-click **COPY VIA MACRO** button for instant pasting into [usevia.app](https://usevia.app).

### 5. AutoHotkey v2 (.ahk) Exporter
- 1-click **DOWNLOAD .AHK SCRIPT** inside Advanced Controls drawer.
- Binds configured callout to `F8` with automated chat open, type, and send delays.

### 6. Procedural Canvas 2D Card & Meme Exporter
- **Nameplate Card Mode:** Reproduces authentic in-game player banner (metallic rank shield, squad vertical bar, title, level, and XP bar).
- **Tactical Chat Stream HUD:** Live translucent mission HUD with squad badges (`B1`, `P2`, `J3`, `S4`) and system dispatches.
- **Procedural Vector Glyphs:** Native vector rendering for bunker doors, super samples, and rare canisters—zero external images or CORS canvas tainting.
- **Multi-Aspect Ratio:** 16:9 Tactical Banner (1200x675) & 9:16 Mobile Reel (1080x1920) with optional meme top caption.
- 1-click **Copy PNG to Clipboard** and **Download PNG**.

### 7. Zero-Asset Web Audio Synthesizer
- Built-in Web Audio API oscillator synthesis:
  - Tactical key clicks & menu blips.
  - Stratagem confirmation chimes.
  - Transmission burst sounds on export.
  - Hazard warning buzzers.
- Persistent mute toggle (`localStorage`).

---

## 🛡️ Current Engine Status Matrix

| Channel | In-Game Status | Details |
|---|---|---|
| **Steam Profile Name** | **PATCHED / CENSORED** | Arrowhead sanitizes `<...>` tags 1:1 into asterisks (`************`). Terminal retains this mode for procedural card maker and Discord avatars. |
| **In-Game Tactical Chat** | **FUNCTIONAL** | In-game chat pipeline renders colors, sizes, and HUD icon fonts. |
| **Chat Clipboard (`Ctrl+V`)** | **BLOCKED BY ENGINE** | In-game chat input buffer does not handle `WM_PASTE`. Requires keystroke injection via VIA macro or AutoHotkey. |

*Detailed technical documentation available in [`docs/ENGINE-STATUS-AND-WORKAROUNDS.md`](docs/ENGINE-STATUS-AND-WORKAROUNDS.md).*

---

## ⌨️ Quick Start: Setting Up NuPhy / VIA Macros

1. Open **Super Earth Terminal**, switch to **Tactical Chat** mode.
2. Select or compose a callout (e.g., `🚪 Bunker on My Pin`).
3. Select **Immediate Send** or **Draft (Type Only)**.
4. Click **`[ ⌨️ COPY VIA MACRO ]`**.
5. Connect your programmable keyboard and navigate to **[usevia.app](https://usevia.app)**.
6. Under **MACROS** (`</>`), select `M0`, paste the script, and click **Save**.
7. Under **KEYMAP**, switch to **Layer 3** (Windows `Fn`), click a free transparent key (`▽`), and assign `M0`.
   *(⚠️ Warning: Never overwrite `1`, `2`, `3`, `4` on NuPhy Layer 3 as they control wireless pairing).*

*Complete hardware step-by-step guide available in [`docs/VIA-MACRO-GUIDE.md`](docs/VIA-MACRO-GUIDE.md).*

---

## 🛠️ Tech Stack & Architecture

- **Runtime:** Pure Vanilla ES Modules (Zero runtime dependencies).
- **Bundler:** Vite 6.
- **Rendering:** HTML5 Canvas 2D procedural rendering (zero external image assets, zero CORS taint).
- **Audio:** Web Audio API (`AudioContext`, procedural oscillators, gain nodes).
- **Deployment:** Automated CI/CD via GitHub Actions to GitHub Pages.

---

## 💻 Local Development

```bash
# Clone repository
git clone https://github.com/DarkTama/super-earth-terminal.git
cd super-earth-terminal

# Install dependencies (Vite dev server)
npm install

# Start local tactical server
npm run dev

# Build production bundle (dist/)
npm run build
```

---

## 📜 Documentation

- [`SPEC.md`](SPEC.md) — Technical product specification and requirements.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — Architecture diagrams, data pipelines, and design decisions.
- [`CONTEXT.md`](CONTEXT.md) — Domain glossary and terminology.
- [`docs/VIA-MACRO-GUIDE.md`](docs/VIA-MACRO-GUIDE.md) — NuPhy Air75 V2 and QMK/VIA setup manual.
- [`docs/ENGINE-STATUS-AND-WORKAROUNDS.md`](docs/ENGINE-STATUS-AND-WORKAROUNDS.md) — Engine status, tag sanitization, and keystroke workarounds.
- [`docs/adr/`](docs/adr/) — Architectural Decision Records.

---

## ⚖️ Disclaimer

*Super Earth Terminal is an unofficial, open-source community tool. Helldivers 2 is a trademark of Arrowhead Game Studios and Sony Interactive Entertainment. This project is not affiliated with or endorsed by Arrowhead or Sony.*
