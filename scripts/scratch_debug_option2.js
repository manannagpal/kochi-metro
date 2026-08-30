import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import opentype from 'opentype.js';

const fontPath = 'C:/Windows/Fonts/arialbd.ttf';
const fontBuffer = fs.readFileSync(fontPath);
const font = opentype.parse(fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength));

function createCircularTextSvg(text, radius, fontSize, fill) {
  const chars = text.split('');
  const fontScale = (1 / font.unitsPerEm) * fontSize;
  
  // Calculate exact glyph widths using opentype.js
  const charWidths = chars.map(c => font.charToGlyph(c).advanceWidth * fontScale);
  const totalWidth = charWidths.reduce((a, b) => a + b, 0);

  // Total arc angle in radians = totalWidth / radius
  const totalArcRad = totalWidth / radius;
  const startAngleRad = -totalArcRad / 2;

  let currentPos = 0;
  let pathsSvg = '';

  chars.forEach((char, i) => {
    const cWidth = charWidths[i];
    const charCenterPos = currentPos + cWidth / 2;
    currentPos += cWidth;

    // Angle of this character along the circle (0 = top 12 o'clock)
    const angleRad = startAngleRad + (charCenterPos / radius);
    const angleDeg = (angleRad * 180) / Math.PI;

    // Center coordinates for character (center of SVG is 512, 512)
    const cx = 512 + radius * Math.sin(angleRad);
    const cy = 512 - radius * Math.cos(angleRad);

    const glyph = font.charToGlyph(char);
    const glyphPath = glyph.getPath(-cWidth / 2, fontSize * 0.35, fontSize);
    const pathData = glyphPath.toPathData(3);

    if (pathData && pathData.trim().length > 0) {
      pathsSvg += `<g transform="translate(${cx.toFixed(2)}, ${cy.toFixed(2)}) rotate(${angleDeg.toFixed(2)})">
        <path d="${pathData}" fill="${fill}" />
      </g>\n`;
    }
  });

  return pathsSvg;
}

const artifactDir = 'C:/Users/nagpa/.gemini/antigravity/brain/be48ac08-7670-4773-90b3-1f2d915e3140';

// Option 2 Fixed: Scale 1.35 so everything fits with zero clipping, perfect letter spacing
function getFixedOption2Svg() {
  const scaleMultiplier = 1.32;
  const radiusText = 245;
  const fontSizeText = 38;
  const topText = createCircularTextSvg('DELHI METRO ROUTE FINDER', radiusText, fontSizeText, '#FFFFFF');

  const rOuter = 295;
  const rInner = 280;
  const rBadge = 180;
  const rBadgeBorder = 174;
  const trainScale = 0.72;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720" width="720" height="720">
    <g transform="translate(48, 48)">
      <!-- Outer Rings -->
      <circle cx="360" cy="360" r="${rOuter}" fill="none" stroke="rgba(229, 46, 45, 0.4)" stroke-width="10"/>
      <circle cx="360" cy="360" r="${rInner}" fill="none" stroke="#E52E2D" stroke-width="7"/>

      <!-- Circular Vector Text -->
      <g transform="translate(-152, -152)">
        ${topText}
      </g>

      <!-- Center White Badge -->
      <circle cx="360" cy="360" r="${rBadge}" fill="#FFFFFF"/>
      <circle cx="360" cy="360" r="${rBadgeBorder}" fill="none" stroke="#E52E2D" stroke-width="5"/>

      <!-- Central Red Train Logo -->
      <g transform="translate(360, 360) scale(${trainScale}) translate(-256, -284)">
        <rect x="116" y="96" width="280" height="300" rx="70" fill="#E52E2D"/>
        <rect x="156" y="136" width="200" height="120" rx="30" fill="#FFFFFF"/>
        <rect x="156" y="280" width="200" height="24" rx="6" fill="#FFFFFF"/>
        <circle cx="186" cy="344" r="20" fill="#FFFFFF"/>
        <circle cx="326" cy="344" r="20" fill="#FFFFFF"/>
        <path d="M 160 416 L 100 456 M 352 416 L 412 456 M 130 440 L 382 440" stroke="#E52E2D" stroke-width="32" stroke-linecap="round"/>
      </g>
    </g>
  </svg>`;
}

async function testFixedOption2() {
  const svg = getFixedOption2Svg();
  const phoneWidth = 1080;
  const phoneHeight = 2400;
  const logoDimension = 950; // ~88% of screen width

  const logoPngBuffer = await sharp(Buffer.from(svg))
    .resize(logoDimension, logoDimension)
    .toBuffer();

  const bgSvg = `<svg width="${phoneWidth}" height="${phoneHeight}">
    <rect width="${phoneWidth}" height="${phoneHeight}" fill="#000000" />
  </svg>`;

  const left = Math.round((phoneWidth - logoDimension) / 2);
  const top = Math.round((phoneHeight - logoDimension) / 2);

  const outputPath = path.join(artifactDir, 'option2_fixed_preview.png');
  await sharp(Buffer.from(bgSvg))
    .composite([{ input: logoPngBuffer, left, top }])
    .png()
    .toFile(outputPath);

  console.log(`Saved fixed Option 2 preview: ${outputPath}`);
}

testFixedOption2().catch(console.error);
