/**
 * Super Earth Terminal - Tactical Preset Catalogs & Color Palettes
 */

export const TACTICAL_SWATCHES = [
  { name: 'Super Earth Yellow', hex: '#FFE800', desc: 'Terminal Primary' },
  { name: 'System Cyan', hex: '#7DF9FF', desc: 'POI / Discovery' },
  { name: 'Hazard Red', hex: '#FF0033', desc: 'Orbital / Warning' },
  { name: 'Ally Green', hex: '#52FF3B', desc: 'Squad / Extraction' },
  { name: 'Squad Blue', hex: '#38B6FF', desc: 'Player 2' },
  { name: 'Squad Pink', hex: '#FF66CC', desc: 'Player 3' },
  { name: 'Host Orange', hex: '#FF9900', desc: 'Host B1' },
  { name: 'Traitor Purple', hex: '#7F00FF', desc: 'Automaton / Traitor' },
  { name: 'Opaque White', hex: '#FFFFFF', desc: 'Engine Default' },
  { name: 'Tactical Black', hex: '#000000', desc: 'Contrast / Shadow' }
];

export const STEAM_NAME_PRESETS = [
  {
    title: 'General Brasch ★',
    desc: 'Golden star marshal badge',
    raw: 'General Brasch<c=ffffe900>★'
  },
  {
    title: 'John Helldiver (Giant)',
    desc: 'Scale 30 oversized hero title',
    raw: '<c=ffffe900><s=30>John Helldiver'
  },
  {
    title: 'Yin & Yang Contrast',
    desc: 'White and black dual style',
    raw: '☯︎White<c=ff000000>Black☯︎'
  },
  {
    title: 'Ghost Anonymous',
    desc: '45% transparent black text',
    raw: '<c=74000000>👤<f=00>Anonymous'
  },
  {
    title: 'Blue & Red Split',
    desc: 'Dual squad allegiance split',
    raw: '<c=ff0096ff>Blue<c=ffff0000>Red'
  },
  {
    title: 'Smug Emote (Scale 90)',
    desc: 'Giant custom expression',
    raw: '<c=ffff006f><s=90>×͜×'
  },
  {
    title: 'Dragon Banner',
    desc: 'Scale 90 dragon divider',
    raw: '<c=ff00ff11><s=90>🐲============='
  },
  {
    title: 'Democracy Officer ★',
    desc: 'High command insignia title',
    raw: 'DEMOCRACY<c=ffffe800>★<c=ffff0033>OFFICER'
  }
];

export const TACTICAL_CHAT_PRESETS = [
  {
    category: 'HUD Callout',
    title: '🚪 Bunker on My Pin',
    colorHex: '#FF5F1F',
    desc: 'Bunker door HUD icon & location pin',
    raw: '<c=FFFF5F1F><f=05>5 Bunker on My Pin'
  },
  {
    category: 'HUD Callout',
    title: '💎 Super Uranium Located',
    colorHex: '#FF00FF',
    desc: 'Super Sample diamond HUD icon',
    raw: '<c=FFFF00FF><f=05>3 Super Uranium Located!'
  },
  {
    category: 'HUD Callout',
    title: '🔶 Rare Sample on Pin',
    colorHex: '#FF9900',
    desc: 'Rare Sample square HUD icon',
    raw: '<c=FFFF9900><f=05>7 Rare Sample on Pin'
  },
  {
    category: 'Hazard Alert',
    title: '🚨 380mm Barrage Incoming',
    colorHex: '#FF0033',
    desc: 'Heroic bold red danger callout',
    raw: '<c=FFFF0033><f=00><s=30>DANGER: 380MM BARRAGE INCOMING!'
  },
  {
    category: 'System Discovery',
    title: 'Minor Place of Interest',
    colorHex: '#7DF9FF',
    prefix: 'discovered ',
    payload: 'Minor Place of Interest',
    raw: '<c=FF7DF9FF>discovered Minor Place of Interest'
  },
  {
    category: 'System Discovery',
    title: 'Super Uranium',
    colorHex: '#7DF9FF',
    prefix: 'discovered ',
    payload: 'Super Uranium',
    raw: '<c=FF7DF9FF>discovered Super Uranium'
  },
  {
    category: 'Hazard Alert',
    title: '380mm Orbital Barrage',
    colorHex: '#FF0033',
    prefix: 'Warning: ',
    payload: '380mm Orbital Barrage',
    raw: '<c=FFFF0033>Warning: 380mm Orbital Barrage'
  },
  {
    category: 'Hazard Alert',
    title: 'Traitor Detected',
    colorHex: '#FF0033',
    prefix: 'Warning: ',
    payload: 'Traitor Detected',
    raw: '<c=FFFF0033>Warning: Traitor Detected'
  },
  {
    category: 'Objective',
    title: 'Terminal Uplink Complete',
    colorHex: '#FFE800',
    prefix: 'Objective: ',
    payload: 'Terminal Uplink Completed',
    raw: '<c=FFFFE800>Objective: Terminal Uplink Completed'
  },
  {
    category: 'Community Memes',
    title: 'Goth Mommies & Tomboys',
    colorHex: '#7DF9FF',
    prefix: 'discovered ',
    payload: "goth mommy's and tomboys",
    raw: "<c=FF7DF9FF>discovered goth mommy's and tomboys"
  },
  {
    category: 'Community Memes',
    title: 'Cup of Liber-tea',
    colorHex: '#7DF9FF',
    prefix: 'discovered ',
    payload: 'a fresh cup of Liber-tea',
    raw: '<c=FF7DF9FF>discovered a fresh cup of Liber-tea'
  },
  {
    category: 'Community Memes',
    title: 'Automaton Propaganda',
    colorHex: '#FF0033',
    prefix: 'discovered ',
    payload: 'Automaton Propaganda',
    raw: '<c=FFFF0033>discovered Automaton Propaganda'
  },
  {
    category: 'Community Memes',
    title: '500kg Bomb Incoming',
    colorHex: '#FF0033',
    prefix: 'Warning: ',
    payload: '500kg Bomb on your exact position',
    raw: '<c=FFFF0033>Warning: 500kg Bomb on your exact position'
  }
];

export const SQUAD_SLOTS = [
  { slot: 1, color: '#FF9900', label: 'Slot 1 (Orange - Squad Leader)' },
  { slot: 2, color: '#38B6FF', label: 'Slot 2 (Blue)' },
  { slot: 3, color: '#FF66CC', label: 'Slot 3 (Pink)' },
  { slot: 4, color: '#52FF3B', label: 'Slot 4 (Green)' }
];

/**
 * Returns Helldivers 2 squad badge identifier: [FirstLetter][SlotNumber]
 * e.g. "blackhawks" in slot 1 -> "B1", "DarkTama" in slot 1 -> "D1", "blackhawks" in slot 3 -> "B3"
 */
export function getSquadBadge(callsign, slotNumber = 1) {
  const clean = callsign ? callsign.trim().replace(/^[^a-zA-Z0-9]+/, '') : '';
  const initial = clean.length > 0 ? clean.charAt(0).toUpperCase() : 'B';
  return `${initial}${slotNumber}`;
}
