/**
 * Super Earth Terminal - HTML5 Canvas Meme & Tactical HUD Renderer
 * Procedural drawing with zero external image asset dependencies
 */

import { parseMarkup } from '../parser/markup.js';
import { getSquadBadge } from '../config/presets.js';
export const ASPECT_RATIOS = {
  '16:9': { width: 1200, height: 675, label: '16:9 Tactical Banner' },
  '9:16': { width: 1080, height: 1920, label: '9:16 Mobile Reel' }
};

/**
 * Draws procedural background (Planetary Desert or Clean Tactical Glass)
 */
function drawBackdrop(ctx, width, height, type = 'desert') {
  if (type === 'desert') {
    // Planetary twilight sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#04070D');
    skyGrad.addColorStop(0.4, '#1A0E08');
    skyGrad.addColorStop(0.7, '#3A1E0D');
    skyGrad.addColorStop(1, '#662F0C');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Procedural distant dunes
    ctx.fillStyle = 'rgba(40, 18, 8, 0.85)';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.72);
    ctx.bezierCurveTo(width * 0.3, height * 0.65, width * 0.7, height * 0.78, width, height * 0.68);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(25, 10, 4, 0.95)';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.82);
    ctx.bezierCurveTo(width * 0.4, height * 0.88, width * 0.6, height * 0.76, width, height * 0.84);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Orbital dust particles
    ctx.fillStyle = 'rgba(255, 232, 0, 0.15)';
    for (let i = 0; i < 40; i++) {
      const px = ((i * 137) % width);
      const py = ((i * 89) % (height * 0.65));
      ctx.fillRect(px, py, 2, 2);
    }
  } else {
    // Clean Tactical Glass
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#080A0E');
    bgGrad.addColorStop(1, '#020305');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Tactical grid
    ctx.strokeStyle = 'rgba(255, 232, 0, 0.04)';
    ctx.lineWidth = 1;
    const step = 48;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // Scanlines overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 1.5);
  }
}

/**
 * Draws meme caption at top of canvas
 */
function drawMemeCaption(ctx, width, caption) {
  if (!caption || !caption.trim()) return;

  ctx.save();
  const text = caption.trim().toUpperCase();
  const fontSize = Math.floor(width * 0.045);
  ctx.font = `900 ${fontSize}px "Impact", "Arial Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const x = width / 2;
  const y = 36;

  // Thick black outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 2;
  ctx.strokeText(text, x, y);

  // Crisp white fill
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(text, x, y);
  ctx.restore();
}

/**
 * Procedural Helldivers 2 Rank Shield Emblem
 */
function drawRankShield(ctx, x, y, width = 44, height = 58) {
  ctx.save();
  ctx.translate(x, y);

  // Outer shield shape with pointed base
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, height * 0.62);
  ctx.lineTo(width / 2, height);
  ctx.lineTo(0, height * 0.62);
  ctx.closePath();

  // Metallic grey gradient fill
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#5C6778');
  grad.addColorStop(0.5, '#414B58');
  grad.addColorStop(1, '#2E3540');
  ctx.fillStyle = grad;
  ctx.fill();

  // Metallic outer rim
  ctx.strokeStyle = '#8B97A6';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Subtle vertical division line
  ctx.beginPath();
  ctx.moveTo(width / 2, 3);
  ctx.lineTo(width / 2, height - 5);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}
/**
 * Draws procedural Helldivers 2 internal HUD glyphs (<f=05>1..7)
 */
function drawHudGlyph(ctx, type, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color || '#FFE800';
  ctx.strokeStyle = color || '#FFE800';
  ctx.lineWidth = 1.6;

  const iconW = size * 0.95;
  const iconH = size * 0.95;
  const topY = y - iconH * 0.85;

  if (type === '5') {
    // Bunker / Vault Door
    ctx.beginPath();
    ctx.strokeRect(x, topY, iconW, iconH);
    ctx.beginPath();
    ctx.moveTo(x + iconW / 2, topY);
    ctx.lineTo(x + iconW / 2, topY + iconH);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + iconW / 2, topY + iconH / 2, iconW * 0.22, 0, Math.PI * 2);
    ctx.stroke();
  } else if (type === '3') {
    // Super Uranium Sample (Diamond)
    ctx.beginPath();
    ctx.moveTo(x + iconW / 2, topY);
    ctx.lineTo(x + iconW, topY + iconH / 2);
    ctx.lineTo(x + iconW / 2, topY + iconH);
    ctx.lineTo(x, topY + iconH / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.stroke();
  } else if (type === '7') {
    // Rare Sample (Square)
    ctx.beginPath();
    ctx.rect(x + iconW * 0.1, topY + iconH * 0.1, iconW * 0.8, iconH * 0.8);
    ctx.fill();
    ctx.fillStyle = 'rgba(10, 12, 16, 0.85)';
    ctx.fillRect(x + iconW * 0.35, topY + iconH * 0.35, iconW * 0.3, iconH * 0.3);
  } else if (type === '1') {
    // Common Sample (Circle)
    ctx.beginPath();
    ctx.arc(x + iconW / 2, topY + iconH / 2, iconW * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.stroke();
  } else {
    ctx.fillText(type, x, y);
  }

  ctx.restore();
  return iconW + 4;
}

/**
 * Renders formatted span with support for <f=05> HUD glyphs and <f=32> Illuminate font
 */
function renderSpan(ctx, span, x, y, baseFontSize, fallbackFontWeight = 'normal') {
  const spanFontSize = Math.round(baseFontSize * span.scale);
  const isIlluminate = span.font === 32;
  const isHudFont = span.font === 5;
  const weight = span.bold ? 'bold' : fallbackFontWeight;

  ctx.font = `${weight} ${spanFontSize}px ${isIlluminate ? '"Courier New", monospace' : '"Segoe UI", sans-serif'}`;
  ctx.fillStyle = span.color;

  let curX = x;
  if (isHudFont) {
    const chars = Array.from(span.text);
    for (const ch of chars) {
      if (['1', '3', '5', '7'].includes(ch)) {
        const drawnW = drawHudGlyph(ctx, ch, curX, y, spanFontSize, span.color);
        curX += drawnW;
      } else {
        ctx.fillText(ch, curX, y);
        curX += ctx.measureText(ch).width;
      }
    }
    return curX - x;
  }

  ctx.fillText(span.text, curX, y);
  return ctx.measureText(span.text).width;
}

/**
 * Measures total rendered width of a span including glyph widths
 */
function measureSpan(ctx, span, baseFontSize) {
  const spanFontSize = Math.round(baseFontSize * span.scale);
  if (span.font === 5) {
    let totalW = 0;
    for (const ch of Array.from(span.text)) {
      if (['1', '3', '5', '7'].includes(ch)) {
        totalW += spanFontSize * 0.95 + 4;
      } else {
        totalW += ctx.measureText(ch).width;
      }
    }
    return totalW;
  }
  return ctx.measureText(span.text).width;
}
/**
 * Renders In-Game Tactical Chat HUD
 */
export function renderTacticalChat(canvas, options = {}) {
  const {
    rawMarkup = '',
    callsign = 'blackhawks',
    squadSlot = { slot: 1, color: '#FF9900' },
    memeCaption = '',
    backdrop = 'desert',
    aspectRatio = '16:9'
  } = options;

  const dims = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['16:9'];
  canvas.width = dims.width;
  canvas.height = dims.height;
  const ctx = canvas.getContext('2d');

  // 1. Backdrop
  drawBackdrop(ctx, dims.width, dims.height, backdrop);

  // 2. Meme top caption
  drawMemeCaption(ctx, dims.width, memeCaption);

  // 3. HUD chat box dimensions
  const isBanner = aspectRatio === '16:9';
  const hudWidth = isBanner ? dims.width * 0.75 : dims.width * 0.9;
  const hudHeight = isBanner ? dims.height * 0.45 : dims.height * 0.32;
  const hudX = (dims.width - hudWidth) / 2;
  const hudY = isBanner ? dims.height * 0.35 : dims.height * 0.45;

  ctx.save();
  // Translucent HUD frame
  ctx.fillStyle = 'rgba(8, 12, 16, 0.88)';
  ctx.fillRect(hudX, hudY, hudWidth, hudHeight);

  // Chamfered borders & crosshairs
  ctx.strokeStyle = '#FFE800';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(hudX, hudY, hudWidth, hudHeight);

  // Tactical corner accents
  const cornerSize = 12;
  ctx.fillStyle = '#FFE800';
  ctx.fillRect(hudX, hudY, cornerSize, 3);
  ctx.fillRect(hudX, hudY, 3, cornerSize);
  ctx.fillRect(hudX + hudWidth - cornerSize, hudY, cornerSize, 3);
  ctx.fillRect(hudX + hudWidth - 3, hudY, 3, cornerSize);
  ctx.fillRect(hudX, hudY + hudHeight - 3, cornerSize, 3);
  ctx.fillRect(hudX, hudY + hudHeight - cornerSize, 3, cornerSize);
  ctx.fillRect(hudX + hudWidth - cornerSize, hudY + hudHeight - 3, cornerSize, 3);
  ctx.fillRect(hudX + hudWidth - 3, hudY + hudHeight - cornerSize, 3, cornerSize);

  // Content area
  const paddingX = 24;
  let currentY = hudY + 36;
  const baseFontSize = isBanner ? 22 : 28;

  // Previous simulated system messages
  ctx.font = `600 ${baseFontSize - 4}px "Segoe UI", sans-serif`;
  ctx.fillStyle = '#7DF9FF';
  ctx.fillText('[DISPATCH] MAJOR ORDER ACTIVE // SECURE AUTOMATON SECTOR', hudX + paddingX, currentY);
  currentY += baseFontSize * 1.5;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('P2 SES PATRIOT: Stratagem Beacon Deployed', hudX + paddingX, currentY);
  currentY += baseFontSize * 1.8;

  // Active line: squad badge + callsign + formatted payload
  let cursorX = hudX + paddingX;

  // Squad Badge (e.g. B1)
  ctx.fillStyle = squadSlot.color || '#FF9900';
  ctx.font = `bold ${baseFontSize}px "Segoe UI", sans-serif`;
  const badgeText = `${getSquadBadge(callsign, squadSlot.slot || 1)} `;
  ctx.fillText(badgeText, cursorX, currentY);
  cursorX += ctx.measureText(badgeText).width;

  // Callsign
  ctx.fillStyle = squadSlot.color || '#FF9900';
  const callsignText = `${callsign}: `;
  ctx.fillText(callsignText, cursorX, currentY);
  cursorX += ctx.measureText(callsignText).width;

  // Formatted Spans
  // Formatted Spans
  const spans = parseMarkup(rawMarkup, '#FFFFFF');
  for (const span of spans) {
    if (span.removed || span.invisible) continue;

    const spanFontSize = Math.round(baseFontSize * span.scale);
    ctx.font = `${span.bold ? 'bold' : 'normal'} ${spanFontSize}px "Segoe UI", sans-serif`;
    const textWidth = measureSpan(ctx, span, baseFontSize);

    // Check boundary
    if (cursorX + textWidth > hudX + hudWidth - paddingX - 20) {
      // Wrap to next line
      currentY += spanFontSize * 1.35;
      cursorX = hudX + paddingX + 24;
    }

    const advance = renderSpan(ctx, span, cursorX, currentY, baseFontSize, 'normal');
    cursorX += advance;
  }

  // Scrollbar indicator on right
  const scrollTrackX = hudX + hudWidth - 14;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(scrollTrackX, hudY + 12, 4, hudHeight - 24);
  ctx.fillStyle = '#FFE800';
  ctx.fillRect(scrollTrackX, hudY + hudHeight * 0.45, 4, 36);

  // Bottom [OPEN CHAT] pill
  ctx.font = `bold ${baseFontSize - 8}px "Segoe UI", monospace`;
  ctx.fillStyle = '#FFE800';
  ctx.fillText('[ENTER] TRANSMIT MESSAGE // CHAT OPEN', hudX + paddingX, hudY + hudHeight - 16);

  ctx.restore();
}

/**
 * Renders Helldivers 2 In-Game Nameplate Card (matching Steam Guide)
 */
export function renderNameplateCard(canvas, options = {}) {
  const {
    rawMarkup = 'General Brasch<c=ffffe900>★',
    title = 'CADET',
    level = '105',
    xpCurrent = '3,252',
    xpMax = '11,000',
    squadColor = '#FF9900',
    memeCaption = '',
    backdrop = 'desert',
    aspectRatio = '16:9'
  } = options;

  const dims = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['16:9'];
  canvas.width = dims.width;
  canvas.height = dims.height;
  const ctx = canvas.getContext('2d');

  // 1. Backdrop
  drawBackdrop(ctx, dims.width, dims.height, backdrop);

  // 2. Meme top caption
  drawMemeCaption(ctx, dims.width, memeCaption);

  // 3. Nameplate dimensions
  const isBanner = aspectRatio === '16:9';
  const cardWidth = isBanner ? 660 : dims.width * 0.9;
  const cardHeight = isBanner ? 210 : 250;
  const cardX = (dims.width - cardWidth) / 2;
  const cardY = isBanner ? dims.height * 0.4 : dims.height * 0.44;

  ctx.save();
  // Card base (Helldivers authentic slate-navy backing)
  ctx.fillStyle = 'rgba(17, 24, 34, 0.94)';
  ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);

  // Shield Rank Emblem
  const shieldW = 44;
  const shieldH = 58;
  const shieldX = cardX + 32;
  const shieldY = cardY + (cardHeight - shieldH) / 2 - 4;
  drawRankShield(ctx, shieldX, shieldY, shieldW, shieldH);

  // Orange Squad Leader vertical bar
  const barX = shieldX + shieldW + 20;
  const barY = cardY + 32;
  const barH = cardHeight - 64;
  ctx.fillStyle = squadColor || '#FF9900';
  ctx.fillRect(barX, barY, 4, barH);

  // Content Area
  const contentX = barX + 18;
  const progressWidth = isBanner ? 440 : cardWidth - (contentX - cardX) - 36;

  // Formatted Player Name (Top Line)
  const nameBaseSize = isBanner ? 26 : 30;
  const nameY = cardY + 58;
  let cursorX = contentX;
  const spans = parseMarkup(rawMarkup, '#FFFFFF');

  for (const span of spans) {
    if (span.removed || span.invisible) continue;
    const advance = renderSpan(ctx, span, cursorX, nameY, nameBaseSize, '600');
    cursorX += advance;
  }

  // Player Title (CADET)
  const titleY = cardY + 98;
  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText((title || 'CADET').toUpperCase(), contentX, titleY);

  // Level & XP Numerics
  const statsY = cardY + 130;
  ctx.font = '600 15px "Segoe UI", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`Level ${level || '105'}`, contentX, statsY);

  ctx.font = '600 14px "Segoe UI", monospace';
  ctx.fillStyle = '#CBD5E1';
  ctx.textAlign = 'right';
  ctx.fillText(`${xpCurrent || '3,252'} / ${xpMax || '11,000'}`, contentX + progressWidth, statsY);
  ctx.textAlign = 'left';

  // XP Progress Bar
  const barTrackY = cardY + 142;
  ctx.fillStyle = '#2E3846';
  ctx.fillRect(contentX, barTrackY, progressWidth, 5);

  // Parse progress percentage
  const curNum = parseFloat(String(xpCurrent).replace(/[^0-9.]/g, '')) || 3252;
  const maxNum = parseFloat(String(xpMax).replace(/[^0-9.]/g, '')) || 11000;
  const fillPct = Math.min(1, Math.max(0, curNum / maxNum));
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(contentX, barTrackY, progressWidth * fillPct, 5);

  ctx.restore();
}

export const renderDestroyerCard = renderNameplateCard;

/**
 * Exports canvas as PNG Blob
 */
export function exportCanvasAsBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas blob generation failed'));
    }, 'image/png');
  });
}

/**
 * Triggers browser download of canvas image
 */
export function downloadCanvasImage(canvas, filename = 'super-earth-terminal.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copies canvas image directly to OS clipboard
 */
export async function copyCanvasToClipboard(canvas) {
  const blob = await exportCanvasAsBlob(canvas);
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob })
  ]);
}
