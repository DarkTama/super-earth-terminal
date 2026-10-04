# Specification: Super Earth Terminal (Helldivers 2 Chat Color Formatter)

## 1. Project Overview
- **Name:** Super Earth Terminal
- **Objective:** Tactical web application for Helldivers 2 players to compose, preview, and copy rich-text color formatted chat strings (`<c=AARRGGBB>`) for in-game chat, and export in-game HUD meme screenshots for social sharing.
- **Visual Style:** Authentic Helldivers 2 Super Earth military aesthetic inspired by [Helldivers Companion](https://helldiverscompanion.com/) (deep gunmetal background, Helldivers yellow `#FFE800` accents, CRT scanlines, chamfered tactical HUD frames, monospace & sci-fi typography).
- **Target Platform:** Free GitHub Pages static deployment via Vite pipeline matching the user's `BagiAdil` repo architecture.

---

## 2. Core Functional Requirements

### 2.1 In-Game Markup Engine
- Outputs stingray-compliant inline color tags: `<c=AARRGGBB>[Payload]`.
- Enforces leading `FF` alpha channel (e.g. standard hex `#7DF9FF` produces `<c=FF7DF9FF>`).
- Final output string format: `<c=AARRGGBB>[UserText]`.

### 2.2 Presets & Meme Library
- **Official System Presets:**
  - *Discovery Cyan* (`#7DF9FF`): `discovered Minor Place of Interest`, `discovered SEAF ARTILLERY`, `discovered Super Uranium`.
  - *Warning Hazard Red* (`#FF0000`): `Warning: 380mm Orbital Barrage`, `Warning: Traitor Detected`.
  - *Objective Yellow* (`#FFFF00`): `Objective: Terminal Uplink Completed`, `Objective: Super Earth Needs You`.
  - *Ally Green* (`#00FF00`): `Squad: Reinforcements Deployed`, `Squad: Supply Drop Ready`.
- **Meme Preset Library:**
  - `discovered goth mommy's and tomboys` (screenshot meme)
  - `discovered a fresh cup of Liber-tea`
  - `discovered Automaton Propaganda`
  - `discovered Democracy Officer tracking your location`
- **Custom Preset Manager:**
  - User can save custom color + text presets to browser `localStorage`.
  - User can delete custom saved presets.

### 2.3 Live In-Game HUD Preview
- Translucent tactical HUD chat box reproducing in-game chat:
  - 2 simulated genuine system announcements above.
  - Active player line with callsign handle (`<squad_slot> <username>:`).
  - Configurable squad slot: B1 (Orange `#FF9900`), P2 (Blue `#38B6FF`), J3 (Pink `#FF66CC`), S4 (Green `#52FF3B`).
  - Editable player callsign handle (default `fishy_gaming__`).
  - Scroll indicator thumb on right.
  - Tactical `[OPEN CHAT]` pill at bottom.
- **Backdrop Switcher:**
  - Planetary Surface: Desert dune drop terrain inspired by reference screenshot.
  - Tactical Glass: Clean dark HUD backdrop.

### 2.4 Character Budget Enforcer
- Real-time length tracker against Helldivers 2 100-character chat limit.
- Color tag consumes 12 characters (`<c=AARRGGBB>`), leaving 88 characters for payload.
- Visual warning indicator (green -> amber -> flashing red) when budget is exceeded.

### 2.5 Meme Snapshot Export (Canvas PNG)
- Dedicated HTML5 `<canvas>` rendering pipeline.
- Optional top meme caption text (e.g. `"bro found heaven"`).
- Dual aspect ratios:
  - *Compact HUD*: 1200x675 (16:9 banner) focusing on the chat box.
  - *Mobile Story/Reel*: 1080x1920 (9:16 vertical) matching TikTok / mobile screenshot format.
- Actions:
  - Download PNG image.
  - Copy Image to clipboard (`navigator.clipboard.write([new ClipboardItem(...)])`).

### 2.6 Zero-Asset Tactical Web Audio Synthesizer
- Built-in Web Audio API synthesis:
  - Key click / UI selection chirp.
  - Stratagem confirmation tone.
  - Radio transmission buzz on copy.
- Mute toggle switch with `localStorage` persistence.

### 2.7 1-Click Clipboard Copy & Toast Feedback
- Prominent tactical yellow "TRANSMIT TO CLIPBOARD" button.
- Instant fallback copy (`navigator.clipboard` with `execCommand` fallback).
- Animated tactical toast notification: `"TRANSMISSION BUFFER LOADED // READY FOR IN-GAME CHAT"`.
