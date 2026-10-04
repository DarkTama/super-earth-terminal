/**
 * Super Earth Terminal - Markup Validation & Crash Safety Intercept
 */

export const CRASH_HAZARD_REGEX = /<f=(0[4-9]|[1-9][0-9])>/i;
export const FAT_TAG_REGEX = /<f=([0-9]{2})>/i;

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

  // 1. Crash Hazard Check (<f=04> through <f=99>)
  const crashMatch = text ? text.match(CRASH_HAZARD_REGEX) : null;
  const hasCrashHazard = !!crashMatch;
  const crashTag = crashMatch ? crashMatch[0] : null;

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
