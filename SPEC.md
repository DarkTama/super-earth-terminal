# Specification: Super Earth Terminal (Helldivers 2 Super Formatting Engine)

## 1. Project Overview
- **Name:** Super Earth Terminal
- **Objective:** Tactical web application for Helldivers 2 players to compose, preview, validate, and copy rich-text markup tags for Steam profile names and in-game tactical chat, with crash safety validation and meme snapshot generation.
- **Visual Style:** Authentic Helldivers 2 Super Earth military aesthetic inspired by [Helldivers Companion](https://helldiverscompanion.com/) (deep gunmetal background `#0A0C10`, Helldivers yellow `#FFE800` accents, CRT scanlines, chamfered tactical HUD frames, monospace & sci-fi typography).
- **Target Platform:** Free GitHub Pages static deployment via Vite pipeline matching the user's `BagiAdil` repo architecture.

---

## 2. Target Modes

### 2.1 Steam Profile Name Mode (`[ STEAM NAME ]`) [DEPRECATED IN-GAME]
> ⚠️ **ENGINE NOTICE:** Arrowhead has patched rich-text tags in Steam profile names. The game client sanitizes `<...>` tags and masks every character 1:1 with asterisks `*`. This mode is retained exclusively for procedural Helldivers 2 Nameplate card generation, Discord avatars, and meme export.

- **Target Constraint:** 32 characters maximum (Steam profile name ceiling).
- **Default Visual Preview:** Super Destroyer Nameplate Card:
  - Super Earth rank insignia shield.
  - Squad leader vertical bar.
  - Military title & level (e.g. `CADET`, Level `105`).
  - EXP progress bar.
  - Active formatted callsign with in-game glow.
  - `General Brasch<c=ffffe900>★` (Gold star general)
  - `<c=ffffe900><s=30>John Helldiver` (Oversized heroic font)
  - `☯︎White<c=ff000000>Black☯︎` (Yin yang dual tone)
  - `<c=74000000>👤<f=00>Anonymous` (Ghost transparency)
  - `<c=ff0096ff>Blue<c=ffff0000>Red` (Dual split squad color)
  - `<c=ffff006f><s=90>×͜×` (Giant custom emote)
  - `<c=ff00ff11><s=90>🐲=============` (Giant dragon banner)

### 2.2 Tactical Chat Mode (`[ TACTICAL CHAT ]`)
- **Target Constraint:** 100 characters maximum (Helldivers 2 chat engine buffer ceiling).
- **Default Visual Preview:** Tactical in-game HUD chat feed:
  - 2 prior system announcements.
  - Squad slot callsign badge (B1 Orange, P2 Blue, J3 Pink, S4 Green).
  - Active formatted message line.
  - Scroll indicator thumb & `[OPEN CHAT]` pill.
- **Curated Chat Presets:**
  - `discovered Minor Place of Interest` (`#7DF9FF`)
  - `Warning: 380mm Orbital Barrage` (`#FF0033`)
  - `discovered goth mommy's and tomboys` (Meme)
  - `discovered a fresh cup of Liber-tea` (Meme)
  - `discovered Automaton Propaganda` (Meme)

---

## 3. Core Functional Requirements

### 3.1 Interaction Model: Selection & Insertion Toolbar
- **Interactive Formatting Toolbar:**
  - Works on active textarea selection or inserts tag at caret.
  - Color Picker button: wraps selection in `<c=AARRGGBB>...</c>` (or injects tag).
  - Size Selector buttons: injects `<s=XX>` (10 Tiny, 20 Normal, 30 Medium, 40 Large, 90 Giant).
  - Bold / Fat toggle: wraps selection in `<f=00>...</f>`.
- **Direct Raw Text Editing:**
  - Real-time two-way synchronization between raw textarea, character budget meter, and live preview canvases.

### 3.2 Advanced Syntax Drawer
- Collapsible drawer for advanced parameters:
  - **Alpha Opacity Slider:** 0% (`00`) to 100% (`FF`), default `100%`.
  - **Template Index Tags:** `<i=1>` (Squad color / dispatch yellow), `<i=2>` (Hidden).
  - **Minify Markup Toggle:** Checkbox `[x] Minify Markup (Omit redundant closing tags)` enabled by default.

### 3.3 Crash Hazard Guard (Engine Safety Intercept)
- Helldivers 2 client crashes instantly if `<f=04>` through `<f=99>` is received.
- Real-time syntax analyzer scans input string.
- If pattern matching `/<f=(0[4-9]|[1-9][0-9])>/i` is detected:
  - Trigger audio hazard siren.
  - Display flashing red tactical alert banner: `⚠️ CRASH HAZARD DETECTED // ENGINE INSTABILITY RISK (<f=XX> will crash game)`.
  - Lock "TRANSMIT TO CLIPBOARD" button until hazard is resolved.

### 3.4 Tactical Symbol Tray
- Quick 1-click glyph injection:
  - Stars: `★`, `☆`
  - Helldivers emblems: `☠︎`, `☢︎`, `☣︎`
  - Decorative: `♥`, `☯︎`, `Ω︎`, `☀︎`, `☁︎`, `☂︎`, `❄︎`, `✌︎`
- Glyphs insert directly at current cursor position.
- Symbol compatibility warning triggers if `<f=XX>` tag wraps a symbol (engine known to break Unicode glyph rendering when bolded).

### 3.5 Character Budget Gauge
- Dynamic capacity meter switching by active mode:
  - 32 units in Steam Name Mode.
  - 100 units in Tactical Chat Mode.
- Live character counter with tag vs text byte breakdown.
- Color-coded meter bar: Green (0–75%), Yellow/Amber (76–99%), Red (>100%).

### 3.6 Live Previews & Canvas Meme Exporter
- **Live HTML/CSS Preview:**
  - Mode toggle between Super Destroyer Player Card and Tactical In-Game Chat HUD.
  - Renders all active tags (`<c>`, `<s>`, `<f>`, `<i>`).
- **HTML5 Canvas 2D PNG Exporter:**
  - Multi-aspect ratio export: 16:9 Tactical Banner (1200x675) and 9:16 Mobile Reel (1080x1920).
  - Optional meme top caption (e.g. `"bro found heaven"`).
  - 1-click Download PNG and 1-click Copy Image to Clipboard.

### 3.7 Zero-Asset Procedural Web Audio Synthesizer
- Built-in Web Audio API sound synthesis:
  - Key click / keypad tap.
  - Stratagem confirmation chime.
  - Transmission burst sound on clipboard copy.
  - Dual-tone hazard warning buzzer on crash tag detection.
- Mute toggle with `localStorage` persistence.

### 3.8 Clipboard Bridge & Tactical Notifications
- Tactical yellow "TRANSMIT TO CLIPBOARD" button.
- Native `navigator.clipboard` with fallback.
- Audio chirp and animated Super Earth HUD toast.

### 3.9 VIA & Hardware Keystroke Macro Generator (Planned)
- Because Helldivers 2 chat engine does not handle OS clipboard `Ctrl+V`, formatted strings cannot be pasted directly into in-game chat.
- The terminal will feature a dedicated **"COPY VIA MACRO"** action button.
- Converts formatted buffer into standard VIA macro format:
  ```text
  {KC_ENT}{100}[PAYLOAD]{50}{KC_ENT}
  ```
- Supports 1-click clipboard copy of the macro syntax for instant pasting into VIA (`usevia.app`), compatible with NuPhy, Keychron, and QMK hardware keyboards.
