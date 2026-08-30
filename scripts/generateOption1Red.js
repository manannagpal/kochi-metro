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
    const angle = isBottom 
      ? startAngle - (i * step) 
      : startAngle + (i * step);

    const rad = (angle * Math.PI) / 180;
    const x = 512 + radius * Math.sin(rad);
    const y = 512 - radius * Math.cos(rad);

    const charRotation = isBottom ? angle + 180 : angle;

    svg += `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" 
      transform="rotate(${charRotation.toFixed(2)}, ${x.toFixed(2)}, ${y.toFixed(2)})" 
      fill="${fill}" 
      font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
      font-weight="900" 
      font-size="${fontSize}" 
      text-anchor="middle" 
      dominant-baseline="central">${char === '&' ? '&amp;' : char}</text>\n`;
  });

  return svg;
}

async function generateOption1Red() {
  const artifactDir = path.resolve('C:/Users/nagpa/.gemini/antigravity/brain/63bea71c-6fac-4002-ae95-838d37ae9289');

  // Ultra-crisp rotated text
  const topTextRotated = createRotatedTextSvg('DELHI METRO ROUTE FINDER', 144, -68, 136, 19, '#FFFFFF');
  const bottomTextRotated = createRotatedTextSvg('JOURNEY PLANNER & GUIDE', 144, 62, 124, 13, '#38BDF8', true);

  const svgOption1Red = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <!-- Dark Navy Background -->
    <rect width="1024" height="1024" fill="#0B0F17"/>
    
    <!-- Red Outer Rings (Matching Delhi Metro Red #E52E2D) -->
    <circle cx="512" cy="512" r="176" fill="none" stroke="rgba(229, 46, 45, 0.35)" stroke-width="6"/>
    <circle cx="512" cy="512" r="166" fill="none" stroke="#E52E2D" stroke-width="4"/>

    <!-- Sharp Rotated Text -->
    ${topTextRotated}
    ${bottomTextRotated}

    <!-- Red Side Accent Dots -->
    <circle cx="364" cy="512" r="4.5" fill="#E52E2D"/>
    <circle cx="660" cy="512" r="4.5" fill="#E52E2D"/>

    <!-- Center White Circular Badge with Red Border -->
    <circle cx="512" cy="512" r="110" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="106" fill="none" stroke="#E52E2D" stroke-width="3"/>

    <!-- Central Red Train Logo -->
    <g transform="translate(512, 512) scale(0.44) translate(-256, -284)">
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

  await sharp(Buffer.from(svgOption1Red))
    .png({ quality: 100 })
    .toFile(path.join(artifactDir, 'splash_option1_red.png'));

  console.log('Successfully generated Option 1 Red Ring splash image!');
}

generateOption1Red().catch(console.error);
