import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import opentype from 'opentype.js';

const artifactDir = 'C:/Users/nagpa/.gemini/antigravity/brain/be48ac08-7670-4773-90b3-1f2d915e3140';

const fontPath = 'C:/Windows/Fonts/arialbd.ttf';
const fontBuffer = fs.readFileSync(fontPath);
const font = opentype.parse(fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength));

function createCircularVectorTextPath(text, radius, totalArcDeg, fontSize, fill, fontObj) {
  const chars = text.split('');
  const numChars = chars.length;
  if (numChars === 0) return '';

  const fontScale = (1 / fontObj.unitsPerEm) * fontSize;
  const charWidths = chars.map(c => fontObj.charToGlyph(c).advanceWidth * fontScale * 1.12);
  const totalWidth = charWidths.reduce((a, b) => a + b, 0);

  let currentArcPos = 0;
  let pathsSvg = '';

  chars.forEach((char, i) => {
    const cWidth = charWidths[i];
    const charCenter = currentArcPos + cWidth / 2;
    currentArcPos += cWidth;

    const fraction = totalWidth > 0 ? charCenter / totalWidth : i / (numChars - 1 || 1);
    const angleDeg = (-totalArcDeg / 2) + (fraction * totalArcDeg);

    const rad = (angleDeg * Math.PI) / 180;
    const cx = 512 + radius * Math.sin(rad);
    const cy = 512 - radius * Math.cos(rad);

    const glyph = fontObj.charToGlyph(char);
    const glyphPath = glyph.getPath(-cWidth / (2 * fontScale * 1.12), (fontSize / 3) / fontScale, fontObj.unitsPerEm);
    const pathData = glyphPath.toPathData(3);

    if (pathData && pathData.trim().length > 0) {
      pathsSvg += `<g transform="translate(${cx.toFixed(2)}, ${cy.toFixed(2)}) rotate(${angleDeg.toFixed(2)}) scale(${fontScale.toFixed(4)})">
        <path d="${pathData}" fill="${fill}" />
      </g>\n`;
    }
  });

  return pathsSvg;
}

// Generate 3 SVG variants
function getLogoSvg(scaleMultiplier = 1) {
  const radiusText = 230 * scaleMultiplier;
  const fontSizeText = 24 * scaleMultiplier;
  const topText = createCircularVectorTextPath('DELHI METRO ROUTE FINDER', radiusText, 145, fontSizeText, '#FFFFFF', font);

  const rOuter = 280 * scaleMultiplier;
  const rInner = 264 * scaleMultiplier;
  const rBadge = 170 * scaleMultiplier;
  const rBadgeBorder = 164 * scaleMultiplier;
  const trainScale = 0.68 * scaleMultiplier;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <circle cx="512" cy="512" r="${rOuter}" fill="none" stroke="rgba(229, 46, 45, 0.35)" stroke-width="${9 * scaleMultiplier}"/>
    <circle cx="512" cy="512" r="${rInner}" fill="none" stroke="#E52E2D" stroke-width="${6 * scaleMultiplier}"/>
    ${topText}
    <circle cx="512" cy="512" r="${rBadge}" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="${rBadgeBorder}" fill="none" stroke="#E52E2D" stroke-width="${4 * scaleMultiplier}"/>
    <g transform="translate(512, 512) scale(${trainScale}) translate(-256, -284)">
      <rect x="116" y="96" width="280" height="300" rx="70" fill="#E52E2D"/>
      <rect x="156" y="136" width="200" height="120" rx="30" fill="#FFFFFF"/>
      <rect x="156" y="280" width="200" height="24" rx="6" fill="#FFFFFF"/>
      <circle cx="186" cy="344" r="20" fill="#FFFFFF"/>
      <circle cx="326" cy="344" r="20" fill="#FFFFFF"/>
      <path d="M 160 416 L 100 456 M 352 416 L 412 456 M 130 440 L 382 440" stroke="#E52E2D" stroke-width="32" stroke-linecap="round"/>
    </g>
  </svg>`;
}

// Render phone preview mockup (1080x2400 portrait phone screen)
async function renderPhoneMockup(logoSvg, logoWidthPercent, bgGradient, outputPath) {
  const phoneWidth = 1080;
  const phoneHeight = 2400;
  const logoDimension = Math.round(phoneWidth * (logoWidthPercent / 100));

  const logoPngBuffer = await sharp(Buffer.from(logoSvg))
    .resize(logoDimension, logoDimension)
    .toBuffer();

  let bgSvg = '';
  if (bgGradient) {
    bgSvg = `<svg width="${phoneWidth}" height="${phoneHeight}">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#000000" />
        </radialGradient>
      </defs>
      <rect width="${phoneWidth}" height="${phoneHeight}" fill="url(#bg)" />
    </svg>`;
  } else {
    bgSvg = `<svg width="${phoneWidth}" height="${phoneHeight}">
      <rect width="${phoneWidth}" height="${phoneHeight}" fill="#000000" />
    </svg>`;
  }

  const left = Math.round((phoneWidth - logoDimension) / 2);
  const top = Math.round((phoneHeight - logoDimension) / 2);

  await sharp(Buffer.from(bgSvg))
    .composite([{ input: logoPngBuffer, left, top }])
    .png()
    .toFile(outputPath);

  console.log(`Saved phone mockup preview: ${outputPath}`);
}

async function run() {
  // Option 1: Large Centered Logo (75% Screen Width, Pure Black BG)
  await renderPhoneMockup(getLogoSvg(1.2), 75, false, path.join(artifactDir, 'splash_option1_large.png'));

  // Option 2: Extra Large Full Screen Fit (88% Screen Width, Pure Black BG)
  await renderPhoneMockup(getLogoSvg(1.4), 88, false, path.join(artifactDir, 'splash_option2_xlarge.png'));

  // Option 3: Modern Card Badge (78% Screen Width, Dark Radial Gradient BG)
  await renderPhoneMockup(getLogoSvg(1.25), 78, true, path.join(artifactDir, 'splash_option3_gradient.png'));
}

run().catch(console.error);
