# Super Earth Terminal — Domain Glossary

### Super Earth Terminal
The client-side web application providing tactical chat text formatting, Steam name styling, and Helldivers 2 in-game communication markup generation.

### Target Mode
The operational context defining character budget and visual rendering target:
- **Steam Name Mode**: Enforces Steam profile name 32-character ceiling; renders player lobby nameplate and ship HUD badge.
- **Tactical Chat Mode**: Enforces in-game chat engine 100-character ceiling; renders in-game tactical chat stream box.

### Super Destroyer Player Card
Visual tactical simulation reproducing the Helldivers 2 ship bridge / lobby player card displaying Super Earth insignia, ship name banner (e.g. `SES PATRIOT OF FREEDOM`), military rank badge (e.g. `STAR MARSHAL`), and styled callsign.

### Selection Toolbar
Interactive editing controls operating on the active text selection or cursor position to inject or wrap markup tags (`<c>`, `<s>`, `<f>`, `<i>`) while supporting direct raw string editing.

### Alpha Channel Opacity
The 2-digit leading hexadecimal value (`00` to `FF`) in Color Tags controlling text translucency. Defaulted to `FF` (100% opaque) with an optional opacity slider in the Advanced Syntax drawer.

### Color Tag
Game engine rich-text markup prefix in format `<c=AARRGGBB>`, where `AA` is alpha channel (`00` transparent to `FF` fully opaque), `RR` is red hex, `GG` is green hex, and `BB` is blue hex.

### Size Tag
Game engine font scale markup in format `<s=XX>`, where `XX` is a 2-digit decimal scale factor (`01` smallest to `99` largest; engine baseline default is `20`).

### Fat Tag
Game engine text weight markup in format `<f=XX>`, where `00` and `01` apply bold weight, `02` sets invisible text, and `03` strips text entirely.

### Crash Hazard Guard
An active safety validator intercepting dangerous out-of-bounds tags—specifically `<f=04>` through `<f=99>`—which trigger an unhandled game engine crash. Locks clipboard transmission until hazard is cleared.

### Index Tag
Game engine template lookup markup in format `<i=X>`, where `1` designates player slot HUD color in chat, and values `2`–`3` provide engine-internal invisible styles.

### Minified Markup
The optimization practice of dropping redundant closing tags (`</c>`, `</s>`, `</f>`) when formatting applies to the tail of the payload, conserving critical character budget.

### Tactical Symbol Tray
A curated palette of engine-tested ASCII and Unicode glyphs (★, ☆, ♥, ☠︎, ☯︎, Ω︎, ☀︎, ☁︎, ☂︎, ❄︎, ☢︎, ☣︎, ✌︎) known to render natively in the Helldivers 2 engine.

### Character Budget
The active character limit gauge: 32 units in Steam Name Mode or 100 units in Tactical Chat Mode, tracking remaining available payload bytes.

### HUD Preview Canvas
Visual tactical simulation reproducing the Helldivers 2 in-game chat interface, complete with translucent backing, squad badge, scroll thumb, and tactical controls.

### Meme Snapshot
A PNG raster export of the HUD Preview Canvas or Super Destroyer Player Card generated via native HTML5 Canvas for sharing across social platforms.

### Audio Synthesizer
A zero-asset Web Audio API oscillator module generating procedural terminal feedback, Stratagem confirmation tones, hazard sirens, and transmission bursts.
