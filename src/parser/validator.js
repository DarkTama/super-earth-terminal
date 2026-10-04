/**
 * Super Earth Terminal - Markup Validation & Crash Safety Intercept
 */

// Safe font indices: 00/01 (bold), 02 (invisible), 03 (removed), 05 (HUD icons), 32 (Illuminate font)
export const SAFE_FONT_INDICES = new Set(['00', '0', '01', '1', '02', '2', '03', '3', '05', '5', '32']);
export const FAT_TAG_REGEX = /<f=([0-9]{1,2})>/gi;

// Verified list of Helldivers 2 engine symbols
export const KNOWN_SYMBOLS = ['★', '☆', '♥', '☠︎', '☯︎', 'Ω︎', '☀︎', '☁︎', '☂︎', '❄︎', '☢︎', '☣︎', '✌︎', '×͜×', '🐲'];

/**
 * Validates markup string against Helldivers 2 engine rules
 * @param {string} text - Raw input string
 * @param {'steam'|'chat'} mode - Active target mode
 * @returns {object} Validation result
 */
export function validateMarkup(text, mode = 'chat') {
  const maxLimit = mode === 'steam' ? 32 : 100;
  const length = text ? Array.from(text).length : 0; // Unicode-aware length
  const overBudget = length > maxLimit;

  // 1. Crash Hazard Check (<f=04> through <f=99>, except safe 05 and 32; and empty <f=03></f>)
  let hasCrashHazard = false;
  let crashTag = null;

  if (text) {
    // Empty <f=03></f> triggers client crash
    if (/<f=03>\s*<\/f>/i.test(text)) {
      hasCrashHazard = true;
      crashTag = '<f=03></f>';
    } else {
      const fatMatches = text.matchAll(/<f=([0-9]{1,2})>/gi);
      for (const m of fatMatches) {
        const rawIdx = m[1];
        const paddedIdx = rawIdx.padStart(2, '0');
        if (!SAFE_FONT_INDICES.has(rawIdx) && !SAFE_FONT_INDICES.has(paddedIdx)) {
          hasCrashHazard = true;
          crashTag = m[0];
          break;
        }
      }
    }
  }
  // 2. Symbol in Fat Tag warning (Engine breaks symbols when wrapped in <f=XX>)
  let symbolFatWarning = false;
  if (text && /<f=[0-9]{2}>/i.test(text)) {
    // Check if any known symbol appears after an active <f=00> or <f=01> before </f>
    for (const sym of KNOWN_SYMBOLS) {
      if (text.includes(sym)) {
        // Simple check if symbol is in the string and fat tag is used
        symbolFatWarning = true;
        break;
      }
    }
  }

  return {
    valid: !hasCrashHazard && !overBudget,
    hasCrashHazard,
    crashTag,
    symbolFatWarning,
    length,
    maxLimit,
    remaining: maxLimit - length,
    overBudget
  };
}
