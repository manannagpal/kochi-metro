import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateDesignAFinal() {
  const artifactDir = path.resolve('C:/Users/nagpa/.gemini/antigravity/brain/63bea71c-6fac-4002-ae95-838d37ae9289');
  const resDir = path.resolve('android/app/src/main/res');

  // Ultra-crisp Design A SVG (Uses standard SVG <text> elements rendered flawlessly by librsvg)
  const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <!-- Dark Navy Background -->
    <rect width="1024" height="1024" fill="#0B0F17"/>
    
    <!-- Red Outer Rings (Matching Delhi Metro Red #E52E2D) -->
    <circle cx="512" cy="512" r="176" fill="none" stroke="rgba(229, 46, 45, 0.35)" stroke-width="6"/>
    <circle cx="512" cy="512" r="166" fill="none" stroke="#E52E2D" stroke-width="4"/>

    <!-- Top Bold White Header Text -->
    <text x="512" y="375" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" letter-spacing="4" text-anchor="middle">DELHI METRO</text>

    <!-- Center White Circular Badge with Red Border -->
    <circle cx="512" cy="512" r="95" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="91" fill="none" stroke="#E52E2D" stroke-width="3"/>

    <!-- Central Red Train Logo -->
    <g transform="translate(512, 512) scale(0.38) translate(-256, -284)">
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

    <!-- Bottom Red Pill Badge -->
    <rect x="342" y="626" width="340" height="42" rx="21" fill="#E52E2D"/>
    <!-- Bottom White Subtitle Text -->
    <text x="512" y="653" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="16" letter-spacing="3" text-anchor="middle">ROUTE FINDER</text>
  </svg>`;

  const splashBuf = Buffer.from(splashSvg);

  // Save preview image to artifact dir
  await sharp(splashBuf).png({ quality: 100 }).toFile(path.join(artifactDir, 'splash_designA_final.png'));

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

  console.log('Successfully generated final Design A splash screen assets across all densities!');
}

generateDesignAFinal().catch(console.error);
