/**
 * Super Earth Terminal - HTML5 Canvas Meme & Tactical HUD Renderer
 * Procedural drawing with zero external image asset dependencies
 */

import { parseMarkup } from '../parser/markup.js';

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
 * Procedural Super Earth Golden Insignia
 */
function drawSuperEarthEmblem(ctx, cx, cy, size = 48) {
  ctx.save();
  ctx.translate(cx, cy);

  // Outer ring
  ctx.strokeStyle = '#FFE800';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.85, 0, Math.PI * 2);
  ctx.stroke();

  // Wings
  ctx.fillStyle = '#FFE800';
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.6);
  ctx.lineTo(size * 0.8, -size * 0.2);
  ctx.lineTo(size * 0.5, size * 0.2);
  ctx.lineTo(0, size * 0.05);
  ctx.lineTo(-size * 0.5, size * 0.2);
  ctx.lineTo(-size * 0.8, -size * 0.2);
  ctx.closePath();
  ctx.fill();

  // Skull cutout
  ctx.fillStyle = '#0A0C10';
  ctx.beginPath();
  ctx.arc(0, -size * 0.15, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-size * 0.15, -size * 0.15, size * 0.3, size * 0.4);

  // Skull eyes
  ctx.fillStyle = '#FFE800';
  ctx.fillRect(-size * 0.1, -size * 0.18, size * 0.07, size * 0.07);
  ctx.fillRect(size * 0.03, -size * 0.18, size * 0.07, size * 0.07);

  ctx.restore();
}

/**
 * Renders In-Game Tactical Chat HUD
 */
export function renderTacticalChat(canvas, options = {}) {
  const {
    rawMarkup = '',
    callsign = 'fishy_gaming__',
    squadSlot = { id: 'b1', name: 'B1', color: '#FF9900' },
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
  const badgeText = `${squadSlot.name || 'B1'} `;
  ctx.fillText(badgeText, cursorX, currentY);
  cursorX += ctx.measureText(badgeText).width;

  // Callsign
  ctx.fillStyle = squadSlot.color || '#FF9900';
  const callsignText = `${callsign}: `;
  ctx.fillText(callsignText, cursorX, currentY);
  cursorX += ctx.measureText(callsignText).width;

  // Formatted Spans
  const spans = parseMarkup(rawMarkup, '#FFFFFF');
  for (const span of spans) {
    if (span.removed || span.invisible) continue;

    const spanFontSize = Math.round(baseFontSize * span.scale);
    ctx.font = `${span.bold ? 'bold' : 'normal'} ${spanFontSize}px "Segoe UI", sans-serif`;
    ctx.fillStyle = span.color;

    // Check boundary
    const textWidth = ctx.measureText(span.text).width;
    if (cursorX + textWidth > hudX + hudWidth - paddingX - 20) {
      // Wrap to next line
      currentY += spanFontSize * 1.3;
      cursorX = hudX + paddingX + 24;
    }

    ctx.fillText(span.text, cursorX, currentY);
    cursorX += textWidth;
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
 * Renders Helldivers 2 Super Destroyer / Lobby Player Card
 */
export function renderDestroyerCard(canvas, options = {}) {
  const {
    rawMarkup = 'General Brasch<c=ffffe900>★',
    shipName = 'SES PATRIOT OF FREEDOM',
    rankTitle = 'STAR MARSHAL',
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

  // 3. Destroyer Card dimensions
  const isBanner = aspectRatio === '16:9';
  const cardWidth = isBanner ? dims.width * 0.65 : dims.width * 0.88;
  const cardHeight = isBanner ? dims.height * 0.42 : dims.height * 0.28;
  const cardX = (dims.width - cardWidth) / 2;
  const cardY = isBanner ? dims.height * 0.38 : dims.height * 0.45;

  ctx.save();
  // Card base
  ctx.fillStyle = 'rgba(10, 14, 20, 0.92)';
  ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

  // Tactical border
  ctx.strokeStyle = '#FFE800';
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);

  // Top header stripe with Super Earth Yellow
  ctx.fillStyle = '#FFE800';
  ctx.fillRect(cardX, cardY, cardWidth, 6);

  // Draw Super Earth Emblem on left
  const emblemSize = isBanner ? 44 : 52;
  const emblemX = cardX + emblemSize + 28;
  const emblemY = cardY + cardHeight / 2;
  drawSuperEarthEmblem(ctx, emblemX, emblemY, emblemSize);

  // Text Content Left Offset
  const contentX = emblemX + emblemSize + 24;
  let textY = cardY + (isBanner ? 48 : 56);
  const baseFontSize = isBanner ? 20 : 24;

  // Ship Title (SES PATRIOT OF FREEDOM)
  ctx.font = `bold ${baseFontSize - 4}px "Segoe UI", sans-serif`;
  ctx.fillStyle = '#7DF9FF';
  ctx.fillText(shipName.toUpperCase(), contentX, textY);
  textY += baseFontSize * 1.4;

  // Rank Title
  ctx.font = `600 ${baseFontSize - 6}px "Segoe UI", monospace`;
  ctx.fillStyle = 'rgba(255, 232, 0, 0.85)';
  ctx.fillText(`RANK // ${rankTitle.toUpperCase()}`, contentX, textY);
  textY += baseFontSize * 1.8;

  // Active Formatted Player Name
  let cursorX = contentX;
  const nameBaseSize = isBanner ? 32 : 38;
  const spans = parseMarkup(rawMarkup, '#FFFFFF');

  for (const span of spans) {
    if (span.removed || span.invisible) continue;

    const spanFontSize = Math.round(nameBaseSize * span.scale);
    ctx.font = `${span.bold ? 'bold' : '600'} ${spanFontSize}px "Segoe UI", sans-serif`;
    ctx.fillStyle = span.color;

    ctx.fillText(span.text, cursorX, textY);
    cursorX += ctx.measureText(span.text).width;
  }

  // Footer status bar
  textY = cardY + cardHeight - 18;
  ctx.font = `bold ${baseFontSize - 8}px "Segoe UI", monospace`;
  ctx.fillStyle = '#52FF3B';
  ctx.fillText('STATUS: SUPER DESTROYER BRIDGE // READY FOR DROP', contentX, textY);

  ctx.restore();
}

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
