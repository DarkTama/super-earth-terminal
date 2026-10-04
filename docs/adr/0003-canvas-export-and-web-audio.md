# 3. Native Canvas Meme Export and Web Audio Synthesis

## Status
Accepted

## Context
Players share Helldivers 2 memes on social channels (Reddit, Discord, TikTok) in addition to copying text in-game. Loading heavyweight external libraries (html2canvas, audio mp3 files) introduces network overhead, cross-origin font tainting on canvas, and asset hosting failure points.

## Decision
1. Implement a dedicated HTML5 `<canvas>` rendering pipeline that draws the tactical HUD box, fonts, colors, and squad callsigns directly with zero external imaging dependencies.
2. Implement tactical audio feedback via the browser's native `AudioContext` and oscillator nodes (square/sine/sawtooth waves with exponential frequency ramps) rather than serving static audio files.
3. Include an audio mute toggle persisted in `localStorage`.

## Consequences
- 100% offline capability without external sound asset downloads.
- Crystal-clear, instantaneous PNG export without DOM-to-image layout distortion or CORS issues.
- Negligible bundle size impact.
