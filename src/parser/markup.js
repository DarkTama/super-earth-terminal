/**
 * Super Earth Terminal - Super Formatting Markup Engine
 * Lexer, AST Parser, Minifier, and Tokenizer for Helldivers 2 engine tags
 */

/**
 * Converts Helldivers 2 <c=AARRGGBB> (or RRGGBB) to RGBA components and CSS string
 * In Helldivers 2: First 2 chars = Alpha (00-FF), next 6 chars = RGB
 */
export function parseHelldiversColor(hexStr) {
  if (!hexStr) return null;
  const cleanHex = hexStr.replace(/^#/, '').trim();

  let alphaHex = 'ff';
  let rgbHex = cleanHex;

  if (cleanHex.length === 8) {
    alphaHex = cleanHex.slice(0, 2);
    rgbHex = cleanHex.slice(2, 8);
  } else if (cleanHex.length === 6) {
    alphaHex = 'ff';
    rgbHex = cleanHex;
  } else {
    return null;
  }

  const alpha = parseInt(alphaHex, 16) / 255;
  const r = parseInt(rgbHex.slice(0, 2), 16) || 0;
  const g = parseInt(rgbHex.slice(2, 4), 16) || 0;
  const b = parseInt(rgbHex.slice(4, 6), 16) || 0;

  return {
    alphaHex: alphaHex.toUpperCase(),
    rgbHex: rgbHex.toUpperCase(),
    r,
    g,
    b,
    alpha: Number.isNaN(alpha) ? 1 : alpha,
    cssColor: `rgba(${r}, ${g}, ${b}, ${Number.isNaN(alpha) ? 1 : alpha.toFixed(2)})`
  };
}

/**
 * Builds Helldivers 2 color tag <c=AARRGGBB>
 * @param {string} rgbHex - 6-digit RGB hex (with or without #)
 * @param {string|number} alpha - 2-digit hex or 0-1 float or 0-100 percentage
 */
export function buildColorTag(rgbHex, alpha = 'FF') {
  const cleanRgb = rgbHex.replace(/^#/, '').padStart(6, '0').slice(-6).toUpperCase();
  let alphaHex = 'FF';

  if (typeof alpha === 'number') {
    if (alpha <= 1) {
      alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase();
    } else {
      alphaHex = Math.round((alpha / 100) * 255).toString(16).padStart(2, '0').toUpperCase();
    }
  } else if (typeof alpha === 'string') {
    const cleanAlpha = alpha.replace(/[^0-9a-fA-F]/g, '');
    if (cleanAlpha.length === 2) {
      alphaHex = cleanAlpha.toUpperCase();
    }
  }

  return `<c=${alphaHex}${cleanRgb}>`;
}

/**
 * Builds size tag <s=XX> (01 to 99)
 */
export function buildSizeTag(size) {
  const num = Math.max(1, Math.min(99, parseInt(size, 10) || 20));
  return `<s=${String(num).padStart(2, '0')}>`;
}

/**
 * Builds fat/bold tag <f=XX> (00/01 bold, 02 invisible, 03 removed)
 */
export function buildFatTag(val = '00') {
  const str = String(val).padStart(2, '0');
  return `<f=${str}>`;
}

/**
 * Builds index template tag <i=X> (1, 2, 3)
 */
export function buildIndexTag(val = 1) {
  return `<i=${val}>`;
}

/**
 * Strips redundant trailing closing tags to save character budget
 */
export function minifyMarkup(text) {
  if (!text) return '';
  let minified = text;
  // Repeatedly strip trailing </c>, </s>, </f>, </i> at end of string
  const trailingClosingTagRegex = /(<\/(?:c|s|f|i)>\s*)+$/i;
  minified = minified.replace(trailingClosingTagRegex, '');
  return minified;
}

/**
 * Tokenizes raw markup into styled spans for DOM preview and Canvas rendering
 * Supports unclosed tags, mixed styles, alpha translucency, font size scale
 */
export function parseMarkup(rawText, defaultColor = '#FFFFFF') {
  if (!rawText) return [];

  // Regex matching all Helldivers 2 opening and closing tags
  const tagRegex = /<(?:\/([csfi])|([csfi])=([^>]+))>/gi;

  const spans = [];
  let lastIndex = 0;

  // Active style states
  let currentColor = null; // null defaults to defaultColor
  let currentOpacity = 1;
  let currentSize = 20; // 20 is default Helldivers 2 font size
  let currentBold = false;
  let currentInvisible = false;
  let currentRemoved = false;
  let currentFont = 0; // 0 = standard, 5 = HUD icons, 32 = Illuminate
  let match;
  while ((match = tagRegex.exec(rawText)) !== null) {
    const textChunk = rawText.slice(lastIndex, match.index);
    if (textChunk.length > 0) {
      spans.push({
        text: textChunk,
        color: currentColor ? currentColor.cssColor : defaultColor,
        rgbHex: currentColor ? currentColor.rgbHex : null,
        alpha: currentOpacity,
        size: currentSize,
        scale: currentSize / 20,
        bold: currentBold,
        invisible: currentInvisible,
        removed: currentRemoved,
        font: currentFont
      });
    }

    const isClose = !!match[1];
    const tagType = (match[1] || match[2]).toLowerCase();
    const tagValue = match[3];

    if (isClose) {
      if (tagType === 'c') {
        currentColor = null;
        currentOpacity = 1;
      } else if (tagType === 's') {
        currentSize = 20;
      } else if (tagType === 'f') {
        currentBold = false;
        currentInvisible = false;
        currentRemoved = false;
        currentFont = 0;
        currentInvisible = false;
      }
    } else {
      if (tagType === 'c') {
        const parsed = parseHelldiversColor(tagValue);
        if (parsed) {
          currentColor = parsed;
          currentOpacity = parsed.alpha;
        }
      } else if (tagType === 's') {
        const sizeNum = parseInt(tagValue, 10);
        if (!Number.isNaN(sizeNum)) {
          if (sizeNum === 0) {
            currentRemoved = true;
          } else {
            currentSize = sizeNum;
            currentRemoved = false;
          }
        }
      } else if (tagType === 'f') {
        const fatNum = parseInt(tagValue, 10);
        if (fatNum === 0 || fatNum === 1) {
          currentBold = true;
          currentInvisible = false;
          currentRemoved = false;
          currentFont = 0;
        } else if (fatNum === 2) {
          currentInvisible = true;
        } else if (fatNum === 3) {
          currentRemoved = true;
        } else if (fatNum === 5) {
          currentFont = 5;
        } else if (fatNum === 32) {
          currentFont = 32;
        }
      } else if (tagType === 'i') {
        const indexNum = parseInt(tagValue, 10);
        if (indexNum === 1) {
          // Yellow player / dispatch color
          currentColor = { cssColor: '#FFE800', rgbHex: 'FFE800', alpha: 1 };
          currentOpacity = 1;
        } else if (indexNum === 2 || indexNum === 3) {
          currentInvisible = true;
        }
      }
    }

    lastIndex = tagRegex.lastIndex;
  }

  // Final trailing chunk
  if (lastIndex < rawText.length) {
    const textChunk = rawText.slice(lastIndex);
    spans.push({
      text: textChunk,
      color: currentColor ? currentColor.cssColor : defaultColor,
      rgbHex: currentColor ? currentColor.rgbHex : null,
      alpha: currentOpacity,
      size: currentSize,
      scale: currentSize / 20,
      bold: currentBold,
      invisible: currentInvisible,
      removed: currentRemoved,
      font: currentFont
    });
  }

  return spans;
}

/**
 * Formats raw markup buffer into standard VIA / QMK macro syntax
 * @param {string} rawText - Input string
 * @param {object} options - Macro formatting options
 * @returns {string} VIA macro string
 */
export function formatViaMacro(rawText, options = {}) {
  const {
    mode = 'immediate', // 'immediate' | 'draft' | 'insert'
    openDelay = 100,
    sendDelay = 50,
    minify = true
  } = options;

  const payload = minify ? minifyMarkup(rawText || '') : (rawText || '');

  if (mode === 'immediate') {
    return `{KC_ENT}{${openDelay}}${payload}{${sendDelay}}{KC_ENT}`;
  }
  if (mode === 'draft') {
    return `{KC_ENT}{${openDelay}}${payload}`;
  }
  return payload;
}

/**
 * Generates a ready-to-run AutoHotkey v2 script for typing chat messages
 * @param {string} rawText - Input string
 * @param {object} options - Script options
 * @returns {string} AHK v2 script contents
 */
export function generateAhkScript(rawText, options = {}) {
  const {
    hotkey = 'F8',
    openDelay = 90,
    sendDelay = 50,
    mode = 'immediate',
    minify = true
  } = options;

  const payload = minify ? minifyMarkup(rawText || '') : (rawText || '');
  const safePayload = payload.replace(/"/g, '""');

  if (mode === 'draft') {
    return `#Requires AutoHotkey v2.0
#SingleInstance Force

; Super Earth Terminal - Keystroke Macro (Draft Mode)
${hotkey}:: {
    SendEvent("{Enter}")
    Sleep ${openDelay}
    SendEvent("${safePayload}")
}
`;
  }

  return `#Requires AutoHotkey v2.0
#SingleInstance Force

; Super Earth Terminal - Keystroke Macro (Immediate Send)
${hotkey}:: {
    SendEvent("{Enter}")
    Sleep ${openDelay}
    SendEvent("${safePayload}")
    Sleep ${sendDelay}
    SendEvent("{Enter}")
}
`;
}
