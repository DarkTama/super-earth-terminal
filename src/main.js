/**
 * Super Earth Terminal - Application Orchestration & Controller
 */

import { synth } from './audio/synth.js';
import {
  parseMarkup,
  minifyMarkup,
  buildColorTag,
  buildSizeTag,
  buildFatTag,
  buildIndexTag
} from './parser/markup.js';
import { validateMarkup } from './parser/validator.js';
import {
  TACTICAL_SWATCHES,
  STEAM_NAME_PRESETS,
  TACTICAL_CHAT_PRESETS,
  SQUAD_SLOTS,
  getSquadBadge
} from './config/presets.js';
import { TACTICAL_SYMBOLS } from './config/symbols.js';
import {
  renderTacticalChat,
  renderDestroyerCard,
  downloadCanvasImage,
  copyCanvasToClipboard
} from './canvas/meme-renderer.js';

// Application State
const state = {
  targetMode: 'steam', // 'steam' | 'chat'
  previewMode: 'nameplate', // 'nameplate' | 'chat'
  backdrop: 'desert', // 'desert' | 'tactical'
  aspectRatio: '16:9', // '16:9' | '9:16'
  currentColorHex: '#FFE800',
  currentAlphaHex: 'FF',
  selectedSquadSlot: SQUAD_SLOTS[0],
  callsign: 'blackhawks',
  playerTitle: 'CADET',
  playerLevel: '105',
  playerXP: '3,252 / 11,000',
  memeCaption: '',
  minify: true,
  lastHazardState: false
};

// DOM Elements
const elements = {
  tabSteamName: document.getElementById('tabSteamName'),
  tabTacticalChat: document.getElementById('tabTacticalChat'),
  targetModeLabel: document.getElementById('targetModeLabel'),
  crashHazardBanner: document.getElementById('crashHazardBanner'),
  crashHazardText: document.getElementById('crashHazardText'),
  symbolWarningBanner: document.getElementById('symbolWarningBanner'),
  presetsList: document.getElementById('presetsList'),
  quickSwatches: document.getElementById('quickSwatches'),
  nativeColorPicker: document.getElementById('nativeColorPicker'),
  symbolTray: document.getElementById('symbolTray'),
  rawInput: document.getElementById('rawInput'),
  budgetCounter: document.getElementById('budgetCounter'),
  budgetBreakdown: document.getElementById('budgetBreakdown'),
  budgetBar: document.getElementById('budgetBar'),
  alphaSlider: document.getElementById('alphaSlider'),
  alphaValueDisplay: document.getElementById('alphaValueDisplay'),
  chkMinify: document.getElementById('chkMinify'),
  btnBold: document.getElementById('btnBold'),
  btnIndex1: document.getElementById('btnIndex1'),
  btnIndex2: document.getElementById('btnIndex2'),
  btnTransmit: document.getElementById('btnTransmit'),
  btnAudioToggle: document.getElementById('btnAudioToggle'),
  audioIcon: document.getElementById('audioIcon'),
  audioLabel: document.getElementById('audioLabel'),
  selectPreviewMode: document.getElementById('selectPreviewMode'),
  selectBackdrop: document.getElementById('selectBackdrop'),
  selectAspectRatio: document.getElementById('selectAspectRatio'),
  fieldPlayerTitle: document.getElementById('fieldPlayerTitle'),
  fieldPlayerLevel: document.getElementById('fieldPlayerLevel'),
  fieldPlayerXP: document.getElementById('fieldPlayerXP'),
  fieldSquadSlot: document.getElementById('fieldSquadSlot'),
  fieldCallsign: document.getElementById('fieldCallsign'),
  inputPlayerTitle: document.getElementById('inputPlayerTitle'),
  inputPlayerLevel: document.getElementById('inputPlayerLevel'),
  inputPlayerXP: document.getElementById('inputPlayerXP'),
  selectSquadSlot: document.getElementById('selectSquadSlot'),
  inputCallsign: document.getElementById('inputCallsign'),
  inputMemeCaption: document.getElementById('inputMemeCaption'),
  memeCanvas: document.getElementById('memeCanvas'),
  btnCopyImage: document.getElementById('btnCopyImage'),
  btnDownloadImage: document.getElementById('btnDownloadImage'),
  tacticalToast: document.getElementById('tacticalToast'),
  toastMessage: document.getElementById('toastMessage')
};

/**
 * Shows tactical HUD toast notification
 */
let toastTimeout = null;
function showToast(message) {
  if (toastTimeout) clearTimeout(toastTimeout);
  elements.toastMessage.textContent = message;
  elements.tacticalToast.classList.add('visible');
  toastTimeout = setTimeout(() => {
    elements.tacticalToast.classList.remove('visible');
  }, 3200);
}

/**
 * Inserts or wraps text at active textarea selection/caret
 */
function insertOrWrap(openTag, closeTag = '') {
  synth.playClick();
  const textarea = elements.rawInput;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const original = textarea.value;

  if (start !== end) {
    // Text is selected -> Wrap
    const selectedText = original.substring(start, end);
    const wrapped = `${openTag}${selectedText}${closeTag}`;
    textarea.value = original.substring(0, start) + wrapped + original.substring(end);
    textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
  } else {
    // Caret insertion
    textarea.value = original.substring(0, start) + openTag + original.substring(end);
    textarea.setSelectionRange(start + openTag.length, start + openTag.length);
  }

  textarea.focus();
  updateUI();
}

/**
 * Renders the presets toolbar depending on mode
 */
function renderPresets() {
  elements.presetsList.innerHTML = '';
  const presets = state.targetMode === 'steam' ? STEAM_NAME_PRESETS : TACTICAL_CHAT_PRESETS;

  presets.forEach((preset) => {
    const btn = document.createElement('button');
    btn.className = 'btn-preset';
    btn.textContent = preset.title;
    btn.title = preset.desc || preset.category || '';
    btn.addEventListener('click', () => {
      synth.playStratagem();
      elements.rawInput.value = preset.raw;
      updateUI();
    });
    elements.presetsList.appendChild(btn);
  });
}

/**
 * Renders quick color swatches
 */
function renderSwatches() {
  elements.quickSwatches.innerHTML = '';
  TACTICAL_SWATCHES.forEach((swatch) => {
    const btn = document.createElement('button');
    btn.className = 'color-swatch-btn';
    btn.style.backgroundColor = swatch.hex;
    btn.title = `${swatch.name} (${swatch.hex})`;
    btn.addEventListener('click', () => {
      state.currentColorHex = swatch.hex;
      elements.nativeColorPicker.value = swatch.hex;
      const tag = buildColorTag(swatch.hex, state.currentAlphaHex);
      insertOrWrap(tag, '</c>');
    });
    elements.quickSwatches.appendChild(btn);
  });
}

/**
 * Renders Tactical Symbol Tray
 */
function renderSymbolTray() {
  elements.symbolTray.innerHTML = '';
  TACTICAL_SYMBOLS.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'btn-symbol';
    btn.textContent = item.symbol;
    btn.title = `${item.label} (${item.symbol})`;
    btn.addEventListener('click', () => {
      synth.playClick();
      const textarea = elements.rawInput;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const original = textarea.value;

      textarea.value = original.substring(0, start) + item.symbol + original.substring(end);
      textarea.setSelectionRange(start + item.symbol.length, start + item.symbol.length);
      textarea.focus();
      updateUI();
    });
    elements.symbolTray.appendChild(btn);
  });
}

/**
 * Main UI & Canvas Update Routine
 */
function updateUI() {
  const rawText = elements.rawInput.value;
  const validation = validateMarkup(rawText, state.targetMode);

  // 1. Budget Counter
  elements.budgetCounter.textContent = `${validation.length} / ${validation.maxLimit}`;
  
  // Calculate tag characters vs payload characters
  const spans = parseMarkup(rawText);
  const plainTextLength = spans.reduce((acc, s) => acc + (s.text ? Array.from(s.text).length : 0), 0);
  const tagBytes = Math.max(0, validation.length - plainTextLength);
  elements.budgetBreakdown.textContent = `TAGS: ${tagBytes}B // PAYLOAD: ${plainTextLength}B`;

  // Meter Bar
  const pct = Math.min(100, (validation.length / validation.maxLimit) * 100);
  elements.budgetBar.style.width = `${pct}%`;
  elements.budgetBar.className = 'budget-bar-fill';
  if (validation.overBudget) {
    elements.budgetBar.classList.add('hazard');
  } else if (pct > 75) {
    elements.budgetBar.classList.add('warning');
  }

  // 2. Safety Intercepts
  if (validation.hasCrashHazard) {
    elements.crashHazardBanner.style.display = 'flex';
    elements.crashHazardText.textContent = `CRASH HAZARD DETECTED // ENGINE INSTABILITY RISK (${validation.crashTag} will crash Helldivers 2 client). Clipboard transmission locked.`;
    elements.btnTransmit.disabled = true;
    if (!state.lastHazardState) {
      synth.playHazard();
      state.lastHazardState = true;
    }
  } else {
    elements.crashHazardBanner.style.display = 'none';
    elements.btnTransmit.disabled = false;
    state.lastHazardState = false;
  }

  // Symbol in Fat Tag warning
  elements.symbolWarningBanner.style.display = validation.symbolFatWarning ? 'flex' : 'none';

  // 3. Render Canvas
  renderCurrentCanvas();
}

/**
 * Re-draws Canvas based on active state
 */
function renderCurrentCanvas() {
  const rawMarkup = elements.rawInput.value;

  if (state.previewMode === 'nameplate' || state.previewMode === 'destroyer') {
    const parts = state.playerXP ? state.playerXP.split('/') : [];
    const curXP = parts[0] ? parts[0].trim() : '3,252';
    const maxXP = parts[1] ? parts[1].trim() : '11,000';
    renderDestroyerCard(elements.memeCanvas, {
      rawMarkup,
      title: state.playerTitle,
      level: state.playerLevel,
      xpCurrent: curXP,
      xpMax: maxXP,
      squadColor: state.selectedSquadSlot.color,
      memeCaption: state.memeCaption,
      backdrop: state.backdrop,
      aspectRatio: state.aspectRatio
    });
  } else {
    renderTacticalChat(elements.memeCanvas, {
      rawMarkup,
      callsign: state.callsign,
      squadSlot: state.selectedSquadSlot,
      memeCaption: state.memeCaption,
      backdrop: state.backdrop,
      aspectRatio: state.aspectRatio
    });
  }
}

/**
 * Target Mode Switching (Steam Name vs Tactical Chat)
 */
function setTargetMode(mode) {
  synth.playClick();
  state.targetMode = mode;

  if (mode === 'steam') {
    elements.tabSteamName.classList.add('active');
    elements.tabTacticalChat.classList.remove('active');
    elements.targetModeLabel.textContent = 'TARGET: STEAM NAME';
    state.previewMode = 'nameplate';
    elements.selectPreviewMode.value = 'nameplate';
  } else {
    elements.tabTacticalChat.classList.add('active');
    elements.tabSteamName.classList.remove('active');
    elements.targetModeLabel.textContent = 'TARGET: TACTICAL CHAT';
    state.previewMode = 'chat';
    elements.selectPreviewMode.value = 'chat';
  }

  syncPreviewModeFields();
  renderPresets();

  // If input is empty or contains a preset from the previous mode, load top preset for new mode
  const otherPresets = mode === 'steam' ? TACTICAL_CHAT_PRESETS : STEAM_NAME_PRESETS;
  const isFromOtherPresets = otherPresets.some((p) => p.raw === elements.rawInput.value);
  if (!elements.rawInput.value || isFromOtherPresets) {
    elements.rawInput.value = mode === 'steam' ? STEAM_NAME_PRESETS[0].raw : TACTICAL_CHAT_PRESETS[0].raw;
  }

  updateUI();
}

/**
 * Toggles preview form fields between Destroyer mode and Chat mode
 */
function syncPreviewModeFields() {
  const isNameplate = state.previewMode === 'nameplate' || state.previewMode === 'destroyer';
  if (elements.fieldPlayerTitle) elements.fieldPlayerTitle.style.display = isNameplate ? 'flex' : 'none';
  if (elements.fieldPlayerLevel) elements.fieldPlayerLevel.style.display = isNameplate ? 'flex' : 'none';
  if (elements.fieldPlayerXP) elements.fieldPlayerXP.style.display = isNameplate ? 'flex' : 'none';
  if (elements.fieldSquadSlot) elements.fieldSquadSlot.style.display = isNameplate ? 'none' : 'flex';
  if (elements.fieldCallsign) elements.fieldCallsign.style.display = isNameplate ? 'none' : 'flex';
}

/**
 * Setup Event Listeners
 */
function setupEvents() {
  // Mode Tabs
  elements.tabSteamName.addEventListener('click', () => setTargetMode('steam'));
  elements.tabTacticalChat.addEventListener('click', () => setTargetMode('chat'));

  // Editor Input
  elements.rawInput.addEventListener('input', updateUI);

  // Size Buttons
  document.querySelectorAll('button[data-size]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const size = btn.getAttribute('data-size');
      insertOrWrap(buildSizeTag(size), '</s>');
    });
  });

  // Bold Button
  elements.btnBold.addEventListener('click', () => {
    insertOrWrap(buildFatTag('00'), '</f>');
  });

  // Native Color Picker
  elements.nativeColorPicker.addEventListener('input', (e) => {
    state.currentColorHex = e.target.value;
  });
  elements.nativeColorPicker.addEventListener('change', (e) => {
    state.currentColorHex = e.target.value;
    const tag = buildColorTag(e.target.value, state.currentAlphaHex);
    insertOrWrap(tag, '</c>');
  });

  // Alpha Slider
  elements.alphaSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const hex = val.toString(16).padStart(2, '0').toUpperCase();
    const pct = Math.round((val / 255) * 100);
    state.currentAlphaHex = hex;
    elements.alphaValueDisplay.textContent = `${hex} (${pct}%)`;
  });

  // Template Index Tags
  elements.btnIndex1.addEventListener('click', () => insertOrWrap(buildIndexTag(1), '</i>'));
  elements.btnIndex2.addEventListener('click', () => insertOrWrap(buildIndexTag(2), '</i>'));

  // Minify Checkbox
  elements.chkMinify.addEventListener('change', (e) => {
    synth.playClick();
    state.minify = e.target.checked;
  });

  // Transmit Button
  elements.btnTransmit.addEventListener('click', async () => {
    let textToCopy = elements.rawInput.value;
    if (state.minify) {
      textToCopy = minifyMarkup(textToCopy);
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      synth.playTransmit();
      showToast('TRANSMISSION BUFFER LOADED // READY FOR IN-GAME CHAT');
    } catch {
      showToast('ERROR: CLIPBOARD WRITE PERMISSION BLOCKED');
    }
  });

  // Audio Toggle
  elements.btnAudioToggle.addEventListener('click', () => {
    const muted = synth.toggleMute();
    elements.audioIcon.textContent = muted ? '🔇' : '🔊';
    elements.audioLabel.textContent = muted ? 'AUDIO: OFF' : 'AUDIO: ON';
    if (!muted) synth.playClick();
  });

  // Preview Mode Select
  elements.selectPreviewMode.addEventListener('change', (e) => {
    synth.playClick();
    state.previewMode = e.target.value;
    syncPreviewModeFields();
    renderCurrentCanvas();
  });

  // Backdrop Select
  elements.selectBackdrop.addEventListener('change', (e) => {
    synth.playClick();
    state.backdrop = e.target.value;
    renderCurrentCanvas();
  });

  // Aspect Ratio Select
  elements.selectAspectRatio.addEventListener('change', (e) => {
    synth.playClick();
    state.aspectRatio = e.target.value;
    renderCurrentCanvas();
  });

  // Player Title, Level, XP
  elements.inputPlayerTitle.addEventListener('input', (e) => {
    state.playerTitle = e.target.value;
    renderCurrentCanvas();
  });
  elements.inputPlayerLevel.addEventListener('input', (e) => {
    state.playerLevel = e.target.value;
    renderCurrentCanvas();
  });
  elements.inputPlayerXP.addEventListener('input', (e) => {
    state.playerXP = e.target.value;
    renderCurrentCanvas();
  });

  // Squad Position & Callsign
  elements.selectSquadSlot.addEventListener('change', (e) => {
    synth.playClick();
    const slotNum = parseInt(e.target.value, 10) || 1;
    const found = SQUAD_SLOTS.find((s) => s.slot === slotNum);
    if (found) state.selectedSquadSlot = found;
    renderCurrentCanvas();
  });
  elements.inputCallsign.addEventListener('input', (e) => {
    state.callsign = e.target.value;
    updateSquadSlotDropdownLabels();
    renderCurrentCanvas();
  });

  // Meme Caption
  elements.inputMemeCaption.addEventListener('input', (e) => {
    state.memeCaption = e.target.value;
    renderCurrentCanvas();
  });

  // Copy Canvas Image
  elements.btnCopyImage.addEventListener('click', async () => {
    try {
      await copyCanvasToClipboard(elements.memeCanvas);
      synth.playTransmit();
      showToast('MEME SNAPSHOT COPIED TO CLIPBOARD');
    } catch {
      showToast('CLIPBOARD IMAGE FAILED // USE DOWNLOAD PNG');
    }
  });

  // Download Canvas PNG
  elements.btnDownloadImage.addEventListener('click', () => {
    synth.playClick();
    const filename = `${state.targetMode}-${Date.now()}.png`;
    downloadCanvasImage(elements.memeCanvas, filename);
    showToast('MEME SNAPSHOT DOWNLOADED');
  });
}

/**
 * Updates Squad position dropdown labels with first letter of callsign
 */
function updateSquadSlotDropdownLabels() {
  const badge1 = getSquadBadge(state.callsign, 1);
  const badge2 = getSquadBadge(state.callsign, 2);
  const badge3 = getSquadBadge(state.callsign, 3);
  const badge4 = getSquadBadge(state.callsign, 4);

  const options = elements.selectSquadSlot.options;
  if (options && options.length >= 4) {
    options[0].textContent = `${badge1} (Orange - Squad Leader)`;
    options[1].textContent = `${badge2} (Blue)`;
    options[2].textContent = `${badge3} (Pink)`;
    options[3].textContent = `${badge4} (Green)`;
  }
}

/**
 * Bootstrap Application
 */
function init() {
  // Sync Audio Mute state
  const muted = synth.isMuted();
  elements.audioIcon.textContent = muted ? '🔇' : '🔊';
  elements.audioLabel.textContent = muted ? 'AUDIO: OFF' : 'AUDIO: ON';

  renderPresets();
  renderSwatches();
  renderSymbolTray();
  setupEvents();

  // Set default raw input
  elements.rawInput.value = STEAM_NAME_PRESETS[0].raw;
  syncPreviewModeFields();
  updateSquadSlotDropdownLabels();
  updateUI();
}

// Start
init();
