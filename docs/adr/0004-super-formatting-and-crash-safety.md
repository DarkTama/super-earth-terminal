# 4. Super Formatting Multi-Tag Engine, Dual Target Modes, and Crash Safety Guard

## Status
Accepted

## Context
Helldivers 2 rich-text engine supports four discrete inline tags:
- Color: `<c=AARRGGBB>`
- Size: `<s=XX>` (decimal scale factor 01–99, default 20)
- Fat/Bold: `<f=XX>` (00/01 bold, 02 invisible, 03 removed, 04–99 fatal crash)
- Index/Template: `<i=X>` (1 player color / yellow, 2–3 invisible)

Two main use cases exist with conflicting technical constraints:
1. **Steam Profile Name**: Limited to 32 characters total. Rendered on player lobby nameplates, host badges, and ship vitals. High pressure to save characters.
2. **In-Game Chat**: Limited to 100 characters total. Rendered in tactical chat feed.

Furthermore:
- Tags do not strictly require trailing closing tags (`</c>`, `</s>`, `</f>`) when formatting extends to the end of the text. Redundant closing tags consume 4 characters each.
- In-game client immediately crashes if `<f=04>` through `<f=99>` is evaluated.
- Engine breaks Unicode symbols if wrapped in `<f=XX>` (fat tag).

## Decision
1. **Dual Target Modes**: Provide distinct tabs:
   - `Steam Name Mode`: 32-character budget, nameplate card preview. *(Note: Deprecated for live in-game rendering due to Arrowhead name sanitizer patch; retained for canvas meme/card export).*
   - `Tactical Chat Mode`: 100-character budget, chat stream HUD preview.
2. **Minified Markup by Default**: Automatically omit trailing closing tags when styles extend to string end. Provide a toggle for strict explicit closing tags.
3. **Crash Hazard Intercept**: Implement an active validation guard in the parser. Any tag matching `<f=(0[4-9]|[1-9][0-9])>` triggers a critical UI warning banner and locks clipboard copy operations until rectified.
4. **Tactical Symbol Tray**: Provide verified working ASCII/Unicode symbols (★, ☆, ♥, ☠︎, ☯︎, Ω︎, ☀︎, ☁︎, ☂︎, ❄︎, ☢︎, ☣︎, ✌︎). Automatically warn if bold formatting wraps a symbol to prevent client rendering glitches.
5. **VIA / Hardware Keystroke Macro Generation (Planned)**: Because the Stingray engine blocks clipboard `Ctrl+V` inside chat, support generating raw VIA macro strings (`{KC_ENT}{100}[PAYLOAD]{50}{KC_ENT}`) for 1-click export to QMK/VIA hardware keyboards (NuPhy, Keychron, etc.).

## Consequences
- Protects users from inadvertent game crashes.
- Maximizes usable name length within Steam's strict 32-character limit.
- Clean separation between player identity styling and in-game tactical broadcasting.
- Documents live engine reality: Steam name color tags masked to asterisks `*`; in-game chat requires keystroke injection.
