# VIA Macro Setup Guide: Helldivers 2 Tactical Chat

Hardware-level keystroke injection guide for QMK/VIA keyboards (NuPhy Air75 V2, Keychron, Wooting, custom boards).

Bypasses the engine's `Ctrl+V` clipboard block. Executes inside keyboard MCU. Zero background software. Zero anti-cheat flags.

---

## 1. Why VIA Macros?

- **Problem:** *Helldivers 2* (Stingray engine) does not bind Windows `WM_PASTE` (`Ctrl+V`) to in-game chat. Only accepts direct keyboard scan codes.
- **Solution:** Keyboard hardware controller types characters into the chat prompt over raw USB HID.

---

## 2. NuPhy Air75 V2 Layer Architecture

| Layer | System State | Default Function |
|---|---|---|
| **0** | Mac Mode | Mac Base |
| **1** | Mac Mode | Mac `Fn` Layer |
| **2** | Windows Mode | Windows Base (WASD, standard keys) |
| **3** | Windows Mode | Windows `Fn` Layer (Holding `Fn` activates this layer) |

> ⚠️ **CRITICAL WARNING (NuPhy Air75 V2):**  
> **DO NOT** overwrite keys `1`, `2`, `3`, or `4` on **Layer 3**.  
> They are hard-bound to wireless pairing (`Lnk BL_1`, `Lnk BL_2`, `Lnk BL_3`, `Lnk RF`). Replacing them breaks Bluetooth and 2.4GHz switching.  
> Only map macros to transparent **`▽`** keys.

---

## 3. Recommended Safe Key Bindings (Layer 3)

### Mnemonic Alphabet Keys (Recommended):
- `Fn + B` ➔ **Macro 0** (Bunker Callout)
- `Fn + U` ➔ **Macro 1** (Super Uranium / Samples)
- `Fn + S` ➔ **Macro 2** (General Samples on Pin)
- `Fn + D` ➔ **Macro 3** (Danger 380mm Barrage)

### Alternative Number Keys:
- `Fn + 5` ➔ **Macro 0**
- `Fn + 6` ➔ **Macro 1**
- `Fn + 7` ➔ **Macro 2**
- `Fn + 8` ➔ **Macro 3**

---

## 4. VIA Macro Syntax & Execution Modes

### Mode A: Immediate Send (Autopilot / Combat Callouts)
Opens chat, types formatted payload, and immediately transmits message.
```text
{KC_ENT}{100}[PAYLOAD]{50}{KC_ENT}
```
- `{KC_ENT}`: Presses `Enter` to open chat box.
- `{100}`: 100ms hardware delay for game UI prompt to open.
- `[PAYLOAD]`: Tagged text string (max 100 characters).
- `{50}`: 50ms buffer delay before transmit.
- `{KC_ENT}`: Presses `Enter` to send message to squad.

### Mode B: Type Only / Draft (Review & Append)
Opens chat and types formatted payload, but **does not send**. Leaves cursor at end of line so player can review, add extra text, or cancel.
```text
{KC_ENT}{100}[PAYLOAD]
```

### Mode C: Raw In-Chat Insert (No Enter)
Assumes chat box already open. Injects tags/symbols at current cursor position.
```text
[PAYLOAD]
```

---

## 5. Curated Macro Catalog

### 1. Danger 380mm Barrage (Heroic Red, Bold)
```text
{KC_ENT}{100}<c=FFFF0033><f=00><s=30>DANGER: 380MM BARRAGE INCOMING!{50}{KC_ENT}
```

### 2. Friendship Bunker / Vault Door (Tactical Orange + Bunker Icon)
```text
{KC_ENT}{100}<c=FFFF5F1F><f=05>5 Bunker on My Pin{50}{KC_ENT}
```
*Note: `<f=05>5` displays the in-game bunker door HUD sprite.*

### 3. Super Uranium Located (Magenta + Super Sample Diamond Icon)
```text
{KC_ENT}{100}<c=FFFF00FF><f=05>3 Super Uranium Located!{50}{KC_ENT}
```
*Note: `<f=05>3` displays the in-game pink super sample icon.*

### 4. Samples Callout (Ally Green + Common/Rare Icons)
```text
{KC_ENT}{100}<c=FF52FF3B>Samples: <f=05>1 </f><f=05>7 </f>on Pin{50}{KC_ENT}
```
*Note: `<f=05>1` is Common Sample, `<f=05>7` is Rare Sample.*

### 5. Discovered Minor Place of Interest (System Cyan)
```text
{KC_ENT}{100}<c=FF7DF9FF>discovered Minor Place of Interest{50}{KC_ENT}
```

---

## 6. Step-by-Step Programming in VIA

1. Connect keyboard via USB cable (or 2.4GHz dongle).
2. Open **[usevia.app](https://usevia.app)** in Chromium browser (Chrome / Edge / Brave).
3. Authorize NuPhy Air75 V2 connection.

### Step 1: Program Macro Script
1. Click **MACRO** tab (`</>` icon on left panel).
2. Select macro slot (e.g. `M0`).
3. Click the code editor switch (`</>`).
4. Paste macro script line from Catalog above.
5. Click **Save** in bottom-right corner.

### Step 2: Bind Macro to Layer 3
1. Click **KEYMAP** tab (keyboard icon on left panel).
2. Click layer number **`3`** above keyboard visualizer.
3. Click target transparent key (`▽`), such as `B`, `U`, `S`, or `D`.
4. In lower categories menu, select **MACRO**.
5. Click assigned macro key (e.g. `M0`).
6. Key label on visualizer changes to `M0`.

### Step 3: Finish
Settings write instantly to keyboard flash memory. Close browser.

---

## 7. Troubleshooting

- **First letter missing in chat:**  
  Game frame rate dipped during chat opening. Increase pre-delay from `{100}` to `{150}`.
- **Message not sending (stuck open in chat box):**  
  Increase send delay from `{50}` to `{80}`.
- **Numbers type literally instead of delaying:**  
  Older QMK firmware versions do not support bracketed `{100}` delays in the text tab. Switch to filmstrip tab in VIA macro editor to insert delay blocks visually.
- **Symbol renders as `?`:**  
  Do not use OS color emojis (e.g. `☠️`). Use game engine HUD icon codes (`<f=05>1..7`) or basic Unicode symbols (`★`, `☆`).
