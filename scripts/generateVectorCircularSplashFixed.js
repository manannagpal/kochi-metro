import opentype from 'opentype.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateCompleteCircleSplash() {
  const artifactDir = path.resolve('C:/Users/nagpa/.gemini/antigravity/brain/63bea71c-6fac-4002-ae95-838d37ae9289');
  const resDir = path.resolve('android/app/src/main/res');

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

  // Vector Text: Radius 138px, 14.5px bold font (138 deg arc) -> Fits strictly inside safe-zone
  const topVectorText = createCircularVectorTextPath('DELHI METRO ROUTE FINDER', 138, 138, 14.5, '#FFFFFF');

  // SVG with Dark Navy Background #0B0F17 matching styles.xml windowSplashScreenBackground seamlessly!
  const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <!-- Dark Navy Background #0B0F17 (Seamless with phone screen!) -->
    <rect width="1024" height="1024" fill="#0B0F17"/>

    <!-- Complete Outer Red Rings (Radius 172px - 100% inside Android 12+ safe-zone, ZERO CLIPPING!) -->
    <circle cx="512" cy="512" r="172" fill="none" stroke="rgba(229, 46, 45, 0.35)" stroke-width="6"/>
    <circle cx="512" cy="512" r="162" fill="none" stroke="#E52E2D" stroke-width="4"/>

    <!-- PURE VECTOR CIRCULAR TEXT -->
    ${topVectorText}

    <!-- Center White Badge (Radius 106px) -->
    <circle cx="512" cy="512" r="106" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="102" fill="none" stroke="#E52E2D" stroke-width="3"/>

    <!-- Central Red Train Logo -->
    <g transform="translate(512, 512) scale(0.42) translate(-256, -284)">
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

  // Save preview image to artifact dir
  await sharp(splashBuf).png({ quality: 100 }).toFile(path.join(artifactDir, 'complete_circle_splash_final.png'));

  // Sync generateVectorCircularSplashFixed.js
  fs.writeFileSync(path.resolve('scripts/generateVectorCircularSplashFixed.js'), fs.readFileSync(path.resolve('scripts/generateVectorCircularSplash.js')));

  // Generate all Android drawable splash files
  const splashDefs = [
    { folder: 'drawable', width: 1024, height: 1024 },
    { folder: 'drawable-port-mdpi', width: 320, height: 480 },
    { folder: 'drawable-port-hdpi', width: 480, height: 800 },
    { folder: 'drawable-port-xhdpi', width: 720, height: 1280 },
    { folder: 'drawable-port-xxhdpi', width: 960, height: 1600 },
    { folder: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },
    { folder: 'drawable-land-mdpi', width: 480, height: 320 },
    { folder: 'drawable-land-hdpi', width: 800, height: 480 },
    { folder: 'drawable-land-xhdpi', width: 1280, height: 720 },
    { folder: 'drawable-land-xxhdpi', width: 1600, height: 960 },
    { folder: 'drawable-land-xxxhdpi', width: 1920, height: 1280 }
  ];

  for (const { folder, width, height } of splashDefs) {
    const targetDir = path.join(resDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    await sharp(splashBuf)
      .resize(width, height, { fit: 'cover' })
      .toFormat('png')
      .toFile(path.join(targetDir, 'splash.png'));
  }

  console.log('Successfully generated complete un-cropped circular splash screen across all densities!');
}

generateCompleteCircleSplash().catch(console.error);
