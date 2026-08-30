import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function createRotatedTextSvg(text, radius, startAngle, totalArcAngle, fontSize, fill, isBottom = false) {
  const chars = text.split('');
  const numChars = chars.length;
  if (numChars === 0) return '';

  const step = totalArcAngle / (numChars - 1 || 1);
  let svg = '';

  chars.forEach((char, i) => {
    // calculate angle for each letter
    const angle = isBottom 
      ? startAngle - (i * step) 
      : startAngle + (i * step);

    const rad = (angle * Math.PI) / 180;
    const x = 512 + radius * Math.sin(rad);
    const y = 512 - radius * Math.cos(rad);

    // Rotate text element towards tangent
    const charRotation = isBottom ? angle + 180 : angle;

    svg += `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" 
      transform="rotate(${charRotation.toFixed(2)}, ${x.toFixed(2)}, ${y.toFixed(2)})" 
      fill="${fill}" 
      font-family="Arial, Helvetica, sans-serif" 
      font-weight="900" 
      font-size="${fontSize}" 
      text-anchor="middle" 
      dominant-baseline="central">${char === '&' ? '&amp;' : char}</text>\n`;
  });

  return svg;
}

async function generateVariations() {
  const artifactDir = path.resolve('C:/Users/nagpa/.gemini/antigravity/brain/63bea71c-6fac-4002-ae95-838d37ae9289');

  // --- VARIATION 1: Arched Letter-by-Letter Rotated Circular Text ---
  const topTextRotated = createRotatedTextSvg('DELHI METRO ROUTE FINDER', 142, -65, 130, 16, '#FFFFFF');
  const bottomTextRotated = createRotatedTextSvg('JOURNEY PLANNER & GUIDE', 142, 60, 120, 12, '#38BDF8', true);

  const svgVar1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <rect width="1024" height="1024" fill="#0B0F17"/>
    <circle cx="512" cy="512" r="170" fill="none" stroke="rgba(37, 99, 235, 0.4)" stroke-width="4"/>
    <circle cx="512" cy="512" r="160" fill="none" stroke="#2563EB" stroke-width="3"/>
    
    ${topTextRotated}
    ${bottomTextRotated}

    <circle cx="366" cy="512" r="4" fill="#38BDF8"/>
    <circle cx="658" cy="512" r="4" fill="#38BDF8"/>

    <circle cx="512" cy="512" r="110" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="106" fill="none" stroke="#E2E8F0" stroke-width="2"/>

    <g transform="translate(512, 512) scale(0.44) translate(-256, -284)">
      <rect x="116" y="96" width="280" height="300" rx="70" fill="#E52E2D"/>
      <rect x="156" y="136" width="200" height="120" rx="30" fill="#FFFFFF"/>
      <rect x="156" y="280" width="200" height="24" rx="6" fill="#FFFFFF"/>
      <circle cx="186" cy="344" r="20" fill="#FFFFFF"/>
      <circle cx="326" cy="344" r="20" fill="#FFFFFF"/>
      <path d="M 160 416 L 100 456 M 352 416 L 412 456 M 130 440 L 382 440" stroke="#E52E2D" stroke-width="32" stroke-linecap="round"/>
    </g>
  </svg>`;

  // --- VARIATION 2: Clean Stacked Header & Pill Badge (Modern UI) ---
  const svgVar2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <rect width="1024" height="1024" fill="#0B0F17"/>
    
    <!-- Top Header Text -->
    <text x="512" y="375" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="22" letter-spacing="3" text-anchor="middle">DELHI METRO</text>
    
    <!-- Center Train Badge -->
    <circle cx="512" cy="512" r="100" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="95" fill="none" stroke="#E52E2D" stroke-width="3"/>

    <g transform="translate(512, 512) scale(0.40) translate(-256, -284)">
      <rect x="116" y="96" width="280" height="300" rx="70" fill="#E52E2D"/>
      <rect x="156" y="136" width="200" height="120" rx="30" fill="#FFFFFF"/>
      <rect x="156" y="280" width="200" height="24" rx="6" fill="#FFFFFF"/>
      <circle cx="186" cy="344" r="20" fill="#FFFFFF"/>
      <circle cx="326" cy="344" r="20" fill="#FFFFFF"/>
      <path d="M 160 416 L 100 456 M 352 416 L 412 456 M 130 440 L 382 440" stroke="#E52E2D" stroke-width="32" stroke-linecap="round"/>
    </g>

    <!-- Bottom Pill Badge -->
    <rect x="362" y="632" width="300" height="36" rx="18" fill="#2563EB"/>
    <text x="512" y="655" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="14" letter-spacing="2" text-anchor="middle">ROUTE FINDER</text>
  </svg>`;

  // --- VARIATION 3: Double Ring Badge with Clear Horizontal Text ---
  const svgVar3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <rect width="1024" height="1024" fill="#0B0F17"/>

    <!-- Outer Glow Circle -->
    <circle cx="512" cy="512" r="160" fill="#1E293B" stroke="#2563EB" stroke-width="4"/>

    <!-- Center White Badge -->
    <circle cx="512" cy="480" r="85" fill="#FFFFFF"/>

    <g transform="translate(512, 480) scale(0.35) translate(-256, -284)">
      <rect x="116" y="96" width="280" height="300" rx="70" fill="#E52E2D"/>
      <rect x="156" y="136" width="200" height="120" rx="30" fill="#FFFFFF"/>
      <rect x="156" y="280" width="200" height="24" rx="6" fill="#FFFFFF"/>
      <circle cx="186" cy="344" r="20" fill="#FFFFFF"/>
      <circle cx="326" cy="344" r="20" fill="#FFFFFF"/>
      <path d="M 160 416 L 100 456 M 352 416 L 412 456 M 130 440 L 382 440" stroke="#E52E2D" stroke-width="32" stroke-linecap="round"/>
    </g>

    <!-- Bottom Embedded Text -->
    <text x="512" y="605" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="15" letter-spacing="2" text-anchor="middle">DELHI METRO</text>
    <text x="512" y="628" fill="#38BDF8" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="12" letter-spacing="1.5" text-anchor="middle">ROUTE FINDER</text>
  </svg>`;

  await sharp(Buffer.from(svgVar1)).png().toFile(path.join(artifactDir, 'splash_var1.png'));
  await sharp(Buffer.from(svgVar2)).png().toFile(path.join(artifactDir, 'splash_var2.png'));
  await sharp(Buffer.from(svgVar3)).png().toFile(path.join(artifactDir, 'splash_var3.png'));

  console.log('Successfully generated splash variations!');
}

generateVariations().catch(console.error);
