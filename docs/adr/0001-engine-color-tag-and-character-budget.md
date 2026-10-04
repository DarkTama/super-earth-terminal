# 1. Stingray Engine Color Tag Format and Character Budget

## Status
Accepted

## Context
Helldivers 2 runs on Autodesk Stingray (Bitsquid engine). The in-game chat text parser supports inline color tags using the syntax `<c=AARRGGBB>`, where the first two hexadecimal digits represent Alpha (`FF` for opaque), followed by Red, Green, and Blue pairs. Standard web colors use `#RRGGBB` or `#RRGGBBAA`.

Additionally, the in-game chat transmission buffer enforces a strict character ceiling (approximately 100 characters). Because the markup tag `<c=AARRGGBB>` consumes 12 characters, any payload exceeding 88 characters risks truncation or malformed tags inside the game client.

## Decision
1. Standardize all tag emission to uppercase `<c=FFAABBCC>` (prepending `FF` alpha to standard 6-digit RGB hex).
2. Enforce a live Character Budget widget tracking total generated string length against a 100-character threshold, issuing a visual tactical warning if the limit is exceeded.

## Consequences
- Guarantees copy strings parse reliably without manual alpha channel editing.
- Prevents players from failing chat transmissions due to unnoticed game engine character drops.
