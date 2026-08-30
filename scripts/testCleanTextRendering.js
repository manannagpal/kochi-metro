import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function testCleanText() {
  const artifactDir = path.resolve('C:/Users/nagpa/.gemini/antigravity/brain/63bea71c-6fac-4002-ae95-838d37ae9289');

  // --- DESIGN A: Ultra Clean Straight Horizontal Text (100% Crisp, No garbled rotation) ---
  const svgDesignA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <rect width="1024" height="1024" fill="#0B0F17"/>
    
    <!-- Red Outer Ring -->
    <circle cx="512" cy="512" r="176" fill="none" stroke="rgba(229, 46, 45, 0.35)" stroke-width="6"/>
    <circle cx="512" cy="512" r="166" fill="none" stroke="#E52E2D" stroke-width="4"/>

    <!-- Top Crisp Text -->
    <text x="512" y="380" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="900" font-size="24" letter-spacing="4" text-anchor="middle">DELHI METRO</text>

    <!-- Center White Badge with Red Border -->
    <circle cx="512" cy="512" r="95" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="91" fill="none" stroke="#E52E2D" stroke-width="3"/>

    <!-- Central Red Train Logo -->
    <g transform="translate(512, 512) scale(0.38) translate(-256, -284)">
      <rect x="116" y="96" width="280" height="300" rx="70" fill="#E52E2D"/>
      <rect x="156" y="136" width="200" height="120" rx="30" fill="#FFFFFF"/>
      <rect x="156" y="280" width="200" height="24" rx="6" fill="#FFFFFF"/>
      <circle cx="186" cy="344" r="20" fill="#FFFFFF"/>
      <circle cx="326" cy="344" r="20" fill="#FFFFFF"/>
      <path d="M 160 416 L 100 456 M 352 416 L 412 456 M 130 440 L 382 440" stroke="#E52E2D" stroke-width="32" stroke-linecap="round"/>
    </g>

    <!-- Bottom Pill Badge with Red Border -->
    <rect x="352" y="628" width="320" height="38" rx="19" fill="#E52E2D"/>
    <text x="512" y="652" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="800" font-size="15" letter-spacing="3" text-anchor="middle">ROUTE FINDER</text>
  </svg>`;

  // --- DESIGN B: Arched Text using pure SVG text with standard Arial (no rotation transforms) ---
  const svgDesignB = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <rect width="1024" height="1024" fill="#0B0F17"/>
    
    <circle cx="512" cy="512" r="176" fill="none" stroke="rgba(229, 46, 45, 0.35)" stroke-width="6"/>
    <circle cx="512" cy="512" r="166" fill="none" stroke="#E52E2D" stroke-width="4"/>

    <!-- Pure SVG Arc TextPath with explicit Arial font -->
    <defs>
      <path id="arcTop" d="M 352, 512 A 160,160 0 1,1 672,512" />
      <path id="arcBottom" d="M 672, 512 A 160,160 0 0,1 352,512" />
    </defs>

    <text fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="900" font-size="18" letter-spacing="3">
      <textPath href="#arcTop" startOffset="50%" text-anchor="middle">DELHI METRO</textPath>
    </text>

    <text fill="#38BDF8" font-family="Arial, sans-serif" font-weight="800" font-size="15" letter-spacing="2">
      <textPath href="#arcBottom" startOffset="50%" text-anchor="middle">ROUTE FINDER</textPath>
    </text>

    <circle cx="512" cy="512" r="100" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="96" fill="none" stroke="#E52E2D" stroke-width="3"/>

    <g transform="translate(512, 512) scale(0.40) translate(-256, -284)">
      <rect x="116" y="96" width="280" height="300" rx="70" fill="#E52E2D"/>
      <rect x="156" y="136" width="200" height="120" rx="30" fill="#FFFFFF"/>
      <rect x="156" y="280" width="200" height="24" rx="6" fill="#FFFFFF"/>
      <circle cx="186" cy="344" r="20" fill="#FFFFFF"/>
      <circle cx="326" cy="344" r="20" fill="#FFFFFF"/>
      <path d="M 160 416 L 100 456 M 352 416 L 412 456 M 130 440 L 382 440" stroke="#E52E2D" stroke-width="32" stroke-linecap="round"/>
    </g>
  </svg>`;

  await sharp(Buffer.from(svgDesignA)).png().toFile(path.join(artifactDir, 'clean_text_designA.png'));
  await sharp(Buffer.from(svgDesignB)).png().toFile(path.join(artifactDir, 'clean_text_designB.png'));

  console.log('Successfully generated clean text previews A and B!');
}

testCleanText().catch(console.error);
