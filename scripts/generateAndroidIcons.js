import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function updateAppIcons() {
  const svgPath = path.resolve('public/favicon.svg');
  const resDir = path.resolve('android/app/src/main/res');

  // SVG foreground logo without background rect, scaled to 60% safe-zone
  const foregroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g transform="translate(256, 256) scale(0.60) translate(-256, -284)">
    <rect x="116" y="96" width="280" height="300" rx="70" fill="#E52E2D"/>
    <rect x="156" y="136" width="200" height="120" rx="30" fill="#FFFFFF"/>
    <rect x="156" y="280" width="200" height="24" rx="6" fill="#FFFFFF"/>
    <circle cx="186" cy="344" r="20" fill="#FFFFFF"/>
    <circle cx="326" cy="344" r="20" fill="#FFFFFF"/>
    <path d="M 160 416 L 100 456 M 352 416 L 412 456 M 130 440 L 382 440" stroke="#E52E2D" stroke-width="32" stroke-linecap="round"/>
  </g>
</svg>`;

  const mipmapDefs = [
    { folder: 'mipmap-mdpi', size: 48, adaptiveSize: 108 },
    { folder: 'mipmap-hdpi', size: 72, adaptiveSize: 162 },
    { folder: 'mipmap-xhdpi', size: 96, adaptiveSize: 216 },
    { folder: 'mipmap-xxhdpi', size: 144, adaptiveSize: 324 },
    { folder: 'mipmap-xxxhdpi', size: 192, adaptiveSize: 432 }
  ];

  for (const { folder, size, adaptiveSize } of mipmapDefs) {
    const folderPath = path.join(resDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // 1. Standard Legacy Icon (white squircle background with padded logo)
    await sharp(svgPath)
      .resize(size, size)
      .toFormat('png')
      .toFile(path.join(folderPath, 'ic_launcher.png'));

    // 2. Round Legacy Icon
    const radius = Math.round(size / 2);
    const circleSvg = Buffer.from(`<svg><circle cx="${radius}" cy="${radius}" r="${radius}" fill="#fff"/></svg>`);

    await sharp(svgPath)
      .resize(size, size)
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .toFormat('png')
      .toFile(path.join(folderPath, 'ic_launcher_round.png'));

    // 3. Adaptive Foreground Icon (108dp base canvas, transparent background, safe-zone scaled)
    await sharp(Buffer.from(foregroundSvg))
      .resize(adaptiveSize, adaptiveSize)
      .toFormat('png')
      .toFile(path.join(folderPath, 'ic_launcher_foreground.png'));

    console.log(`Generated Android icons for ${folder}: legacy=${size}x${size}, adaptive=${adaptiveSize}x${adaptiveSize}`);
  }

  console.log('Successfully updated all Android app launcher icons with safe-zone padding!');
}

updateAppIcons().catch(console.error);
