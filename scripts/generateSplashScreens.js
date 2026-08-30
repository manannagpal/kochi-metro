import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateSplashScreens() {
  const resDir = path.resolve('android/app/src/main/res');

  // Create an SVG optimized for Android 12+ Splash Mask (everything scaled inside r=175px safe-zone)
  const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <!-- Dark Background -->
    <rect width="1024" height="1024" fill="#0B0F17"/>
    
    <!-- Outer Decorative Ring (radius 175) -->
    <circle cx="512" cy="512" r="176" fill="none" stroke="rgba(37, 99, 235, 0.35)" stroke-width="4"/>
    <circle cx="512" cy="512" r="166" fill="none" stroke="#2563EB" stroke-width="3"/>

    <!-- Circular Text Paths for "DELHI METRO ROUTE FINDER" within safe zone -->
    <defs>
      <!-- Top Arc Path for Circular Text (radius 148) -->
      <path id="topTextCirclePath" d="M 364, 512 A 148,148 0 1,1 660,512" />
      <!-- Bottom Arc Path for Subtitle -->
      <path id="bottomTextCirclePath" d="M 660, 512 A 148,148 0 0,1 364,512" />
    </defs>

    <!-- Curved Circular Top Text -->
    <text fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="16" letter-spacing="2">
      <textPath href="#topTextCirclePath" startOffset="50%" text-anchor="middle">
        DELHI METRO ROUTE FINDER
      </textPath>
    </text>

    <!-- Side Dots -->
    <circle cx="360" cy="512" r="3" fill="#38BDF8"/>
    <circle cx="664" cy="512" r="3" fill="#38BDF8"/>

    <!-- Curved Circular Bottom Subtitle -->
    <text fill="#38BDF8" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" letter-spacing="1.5">
      <textPath href="#bottomTextCirclePath" startOffset="50%" text-anchor="middle">
        JOURNEY PLANNER &amp; GUIDE
      </textPath>
    </text>

    <!-- Center White Circular Badge (radius 112) -->
    <circle cx="512" cy="512" r="112" fill="#FFFFFF"/>
    <circle cx="512" cy="512" r="108" fill="none" stroke="#E2E8F0" stroke-width="2"/>

    <!-- Central Red Train Logo (Scaled down 0.46x inside white badge) -->
    <g transform="translate(512, 512) scale(0.46) translate(-256, -284)">
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

  const splashDefs = [
    // Default & Drawable Root
    { folder: 'drawable', width: 1024, height: 1024 },
    
    // Portrait Orientations
    { folder: 'drawable-port-mdpi', width: 320, height: 480 },
    { folder: 'drawable-port-hdpi', width: 480, height: 800 },
    { folder: 'drawable-port-xhdpi', width: 720, height: 1280 },
    { folder: 'drawable-port-xxhdpi', width: 960, height: 1600 },
    { folder: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },

    // Landscape Orientations
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

    console.log(`Generated safe-zone splash.png for ${folder} (${width}x${height})`);
  }

  console.log('Successfully generated all Android 12+ safe-zone splash screen assets!');
}

generateSplashScreens().catch(console.error);
