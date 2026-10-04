# Helldivers 2 Engine Status, Markup Sanitization & Chat Workarounds

Documented operational status of Super Formatting tags in *Helldivers 2* (Bitsquid/Stingray engine) following patch updates.

---

## 1. Engine Sanitization Matrix

| Channel | Status | Behavior / Engine Intercept |
|---|---|---|
| **Steam Profile Name** | **PATCHED / CENSORED** | Client masks `<...>` markup tags 1:1 with asterisks `*`. Tags do not execute. |
| **In-Game Tactical Chat** | **FUNCTIONAL** | In-game chat pipeline still parses rich-text tags (`<c>`, `<s>`, `<f>`, `<i>`). |
| **Chat Input Clipboard (`Ctrl+V`)** | **BLOCKED BY ENGINE** | Chat input buffer does not handle Windows `WM_PASTE`. Keystroke injection required. |

---

## 2. In-Game HUD Icon Font Findings (`<f=05>`)

Community testing confirms font index `05` references the internal tactical HUD icon sprite sheet.

### Known Glyphs:
- `<f=05>1` — **Common Sample** icon
- `<f=05>7` — **Rare Sample** icon
- `<f=05>3` — **Super Sample** icon (Super Uranium)
- `<f=05>5` — **Friendship Bunker / Vault** icon
- `<f=32>` — **Illuminate Text** alien font

### Color Inheritance:
Icons inherit color from preceding color tags:
```text
<c=FFFF5F1F><f=05>5 Found a Bunker
<c=FF0FFF50>Samples Found: <f=05>1 </f></c>
```

### Instability Hazards:
- Empty font commands like `<f=03></f>` or out-of-range font indices can induce client crashes.
- Font index `04` and indices > `32` (except specific developer font banks) trigger access violations.

---

## 3. In-Game Chat Keystroke Emulation Workaround

Because `Ctrl+V` is blocked inside the in-game chat prompt, messages must be entered as keyboard scan codes.

### Option A: AutoHotkey v2 Keystroke Macro

Create an `.ahk` script using AutoHotkey v2:

```ahk
#Requires AutoHotkey v2.0
#SingleInstance Force

; Press F8 to send Tactical Bunker Callout
F8:: {
    SendChat("<c=FFFF5F1F><f=05>5 Bunker on My Pin")
}

; Press F9 to send Super Uranium Callout
F9:: {
    SendChat("<c=FFFF00FF><f=05>3 Super Uranium Located")
}

; Press F10 to send discovered POI
F10:: {
    SendChat("<c=FF7DF9FF>discovered Minor Place of Interest")
}

SendChat(msg) {
    SendEvent("{Enter}")
    Sleep 90
    SendEvent(msg)
    Sleep 50
    SendEvent("{Enter}")
}
```

### Option B: Hardware Keyboard Macros (Logitech G-Hub, Razer Synapse, Corsair iCUE)

1. Create a **Text Macro** (not Clipboard Paste).
2. Set sequence:
   - Keystroke: `Enter`
   - Delay: `80 ms`
   - Keystroke string: `<c=FFFF5F1F><f=05>5 Bunker on My Pin`
   - Delay: `40 ms`
   - Keystroke: `Enter`
3. Bind macro to extra mouse button or dedicated G-key.
