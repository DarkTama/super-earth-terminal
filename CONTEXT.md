# Super Earth Terminal — Domain Glossary

### Super Earth Terminal
The client-side web application providing tactical chat text formatting and Helldivers 2 in-game communication markup generation.

### Color Tag
Game engine rich-text markup prefix in format `<c=AARRGGBB>`, where `AA` is alpha channel (always `FF` for opaque text), `RR` is red hex, `GG` is green hex, and `BB` is blue hex.

### Payload
The user-authored message body appended directly behind the Color Tag.

### Preset Template
A predefined transmission archetype containing a designated Color Tag, a canonical Helldivers 2 system prefix verb (e.g. `discovered `, `Warning: `), and suggested default payload.

### Callsign Handle
The player's username identifier displayed in the chat stream (e.g. `fishy_gaming__:`), color-coded by squad slot index (B1 Orange, P2 Blue, J3 Pink, S4 Green).

### Character Budget
The in-game Helldivers 2 chat engine buffer constraint (100 total characters). The 12-character Color Tag consumes 12 units of budget, leaving 88 usable characters for the Payload.

### HUD Preview Canvas
Visual tactical simulation reproducing the Helldivers 2 in-game chat interface, complete with translucent backing, squad badge, scroll thumb, and tactical controls.

### Meme Snapshot
A PNG raster export of the HUD Preview Canvas generated via native HTML5 Canvas for sharing across social platforms.

### Audio Synthesizer
A zero-asset Web Audio API oscillator module generating procedural terminal feedback, Stratagem confirmation tones, and transmission bursts.

### Meme Header
An optional top caption superimposed above the HUD (e.g. "bro found heaven") matching social media gaming meme conventions.

### Atmospheric Backdrop
The visual backdrop layer behind the HUD preview simulating in-game planetary terrain drops or clean tactical glass.
