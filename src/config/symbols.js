/**
 * Super Earth Terminal - Verified Tactical Symbol Definitions
 * Engine-tested ASCII & Unicode glyphs that render natively in Helldivers 2
 */

export const TACTICAL_SYMBOLS = [
  // In-Game Engine HUD Icons (<f=05>)
  { symbol: '🚪', insertText: '<f=05>5', label: 'Bunker Door (<f=05>5)', category: 'hud' },
  { symbol: '💎', insertText: '<f=05>3', label: 'Super Sample (<f=05>3)', category: 'hud' },
  { symbol: '🔶', insertText: '<f=05>7', label: 'Rare Sample (<f=05>7)', category: 'hud' },
  { symbol: '⚪', insertText: '<f=05>1', label: 'Common Sample (<f=05>1)', category: 'hud' },
  { symbol: '🦑', insertText: '<f=32>', label: 'Illuminate Font (<f=32>)', category: 'hud' },

  // Engine-tested Unicode Glyphs
  { symbol: '★', label: 'Star', category: 'rank' },
  { symbol: '☆', label: 'Hollow Star', category: 'rank' },
  { symbol: '☠︎', label: 'Skull', category: 'military' },
  { symbol: '☢︎', label: 'Radioactive', category: 'hazard' },
  { symbol: '☣︎', label: 'Biohazard', category: 'hazard' },
  { symbol: 'Ω︎', label: 'Omega', category: 'greek' },
  { symbol: '♥', label: 'Heart', category: 'flair' },
  { symbol: '☯︎', label: 'Yin Yang', category: 'flair' },
  { symbol: '✌︎', label: 'Peace', category: 'flair' },
  { symbol: '☀︎', label: 'Sun', category: 'weather' },
  { symbol: '☁︎', label: 'Cloud', category: 'weather' },
  { symbol: '☂︎', label: 'Umbrella', category: 'weather' },
  { symbol: '❄︎', label: 'Snowflake', category: 'weather' },
  { symbol: '×͜×', label: 'Smug Emote', category: 'meme' },
  { symbol: '🐲', label: 'Dragon', category: 'meme' }
];
