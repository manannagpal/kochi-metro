import opentype from 'opentype.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function previewNoOuterCircleSplash() {
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
    const charWidths = chars.map(c => font.charToGlyph(c).advanceWidth * fontScale * 1.10);
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
      const glyphPath = glyph.getPath(-cWidth / (2 * fontScale * 1.10), (fontSize / 3) / fontScale, font.unitsPerEm);
      const pathData = glyphPath.toPathData(3);

      if (pathData && pathData.trim().length > 0) {
        pathsSvg += `<g transform="translate(${cx.toFixed(2)}, ${cy.toFixed(2)}) rotate(${rotationDeg.toFixed(2)}) scale(${fontScale.toFixed(4)})">
          <path d="${pathData}" fill="${fill}" />
        </g>\n`;
      }
    });

    return pathsSvg;
  }

  // Vector Text: Radius 276px, 29px bold font
  const topVectorText = createCircularVectorTextPath('DELHI METRO ROUTE FINDER', 276, 138, 29, '#FFFFFF');

  // Clean SVG: Most outer translucent ring REMOVED!
  // Crisp Solid Red Ring (Radius 324px)
  // Center White Badge (Radius 212px)
  // Red Metro Train Logo (Scale 0.84)
  const cleanSplashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <!-- Dark Navy Background #0B0F17 -->
    <rect width="1024" height="1024" fill="#0B0F17"/>

    <!-- Outer Solid Red Ring (Radius 324px = 648px diameter) - Most outer translucent ring REMOVED -->
    <circle cx="512" cy="512" r="324" fill="none" stroke="#E52E2D" stroke-width="8"/>

    <!-- CIRCULAR VECTOR TEXT -->
    ${topVectorText}

    <!-- Center White Badge (Radius 212px) -->
    <circle cx="512" cy="512" r="212" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="204" fill="none" stroke="#E52E2D" stroke-width="6"/>

    <!-- Central Red Train Logo -->
    <g transform="translate(512, 512) scale(0.84) translate(-256, -284)">
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

  const buf = Buffer.from(cleanSplashSvg);
  await sharp(buf).png({ quality: 100 }).toFile(path.join(artifactDir, 'no_outer_circle_preview.png'));

  console.log('Successfully generated preview with outer circle removed!');
}

previewNoOuterCircleSplash().catch(console.error);
