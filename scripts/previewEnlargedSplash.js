import opentype from 'opentype.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateEnlargedSplashPreview() {
  const artifactDir = path.resolve('C:/Users/nagpa/.gemini/antigravity/brain/63bea71c-6fac-4002-ae95-838d37ae9289');

  const fontPath = 'C:/Windows/Fonts/arialbd.ttf';
  if (!fs.existsSync(fontPath)) {
    throw new Error('Arial Bold font not found at ' + fontPath);
  }
  
  const fontBuffer = fs.readFileSync(fontPath);
  const font = opentype.parse(fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength));

  function createCircularVectorTextPath(text, radius, totalArcDeg, fontSize, fill) {
    const chars = text.split('');
    const numChars = chars.length;
    if (numChars === 0) return '';

    const fontScale = (1 / font.unitsPerEm) * fontSize;
    const charWidths = chars.map(c => font.charToGlyph(c).advanceWidth * fontScale * 1.12);
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

      const rotationDeg = angleDeg;

      const glyph = font.charToGlyph(char);
      const glyphPath = glyph.getPath(-cWidth / (2 * fontScale * 1.12), (fontSize / 3) / fontScale, font.unitsPerEm);
      const pathData = glyphPath.toPathData(3);

      if (pathData && pathData.trim().length > 0) {
        pathsSvg += `<g transform="translate(${cx.toFixed(2)}, ${cy.toFixed(2)}) rotate(${rotationDeg.toFixed(2)}) scale(${fontScale.toFixed(4)})">
          <path d="${pathData}" fill="${fill}" />
        </g>\n`;
      }
    });

    return pathsSvg;
  }

  // Enlarged Circular Text: Radius 230px, 24px bold font (145 deg arc)
  const topVectorText = createCircularVectorTextPath('DELHI METRO ROUTE FINDER', 230, 145, 24, '#FFFFFF');

  // SVG with TRANSPARENT background (NO square box border!)
  const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <!-- Transparent Background (No Square Box!) -->

    <!-- Enlarged Red Outer Rings (Radius 280px vs old 176px - 60% LARGER!) -->
    <circle cx="512" cy="512" r="280" fill="none" stroke="rgba(229, 46, 45, 0.35)" stroke-width="9"/>
    <circle cx="512" cy="512" r="264" fill="none" stroke="#E52E2D" stroke-width="6"/>

    <!-- PURE VECTOR CIRCULAR TEXT (Enlarged White Text) -->
    ${topVectorText}

    <!-- Enlarged Center White Badge (Radius 170px vs old 110px - 55% LARGER!) -->
    <circle cx="512" cy="512" r="170" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="164" fill="none" stroke="#E52E2D" stroke-width="4"/>

    <!-- Enlarged Central Red Train Logo (Scale 0.68 vs old 0.44 - 55% LARGER!) -->
    <g transform="translate(512, 512) scale(0.68) translate(-256, -284)">
      <!-- Red Metro Body -->
      <rect x="116" y="96" width="280" height="300" rx="70" fill="#E52E2D"/>
      <!-- Windshield -->
      <rect x="156" y="136" width="200" height="120" rx="30" fill="#FFFFFF"/>
      <!-- Front Grill Strip -->
      <rect x="156" y="280" width="200" height="24" rx="6" fill="#FFFFFF"/>
      <!-- Headlights -->
      <circle cx="186" cy="344" r="20" fill="#FFFFFF"/>
      <circle cx="326" cy="344" r="20" fill="#FFFFFF"/>
      <!-- Metro Track Legs -->
      <path d="M 160 416 L 100 456 M 352 416 L 412 456 M 130 440 L 382 440" stroke="#E52E2D" stroke-width="32" stroke-linecap="round"/>
    </g>
  </svg>`;

  const splashBuf = Buffer.from(splashSvg);

  // Render on dark navy canvas to preview how it looks on full phone screen
  const phoneMockupSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <rect width="1024" height="1024" fill="#0B0F17"/>
    ${splashSvg.replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">', '').replace('</svg>', '')}
  </svg>`;

  await sharp(Buffer.from(phoneMockupSvg)).png({ quality: 100 }).toFile(path.join(artifactDir, 'enlarged_splash_preview.png'));

  console.log('Generated enlarged splash preview successfully!');
}

generateEnlargedSplashPreview().catch(console.error);
