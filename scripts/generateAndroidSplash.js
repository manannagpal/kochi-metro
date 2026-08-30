import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateSplashScreens() {
  const iconSource = path.resolve('public/icon-512.png');
  const resDir = path.resolve('android/app/src/main/res');

  const targets = [
    { folder: 'drawable', width: 480, height: 800, iconSize: 280 },
    { folder: 'drawable-port-mdpi', width: 320, height: 480, iconSize: 200 },
    { folder: 'drawable-port-hdpi', width: 480, height: 800, iconSize: 280 },
    { folder: 'drawable-port-xhdpi', width: 640, height: 960, iconSize: 380 },
    { folder: 'drawable-port-xxhdpi', width: 960, height: 1440, iconSize: 560 },
    { folder: 'drawable-port-xxxhdpi', width: 1280, height: 1920, iconSize: 760 },

    { folder: 'drawable-land-mdpi', width: 480, height: 320, iconSize: 180 },
    { folder: 'drawable-land-hdpi', width: 800, height: 480, iconSize: 280 },
    { folder: 'drawable-land-xhdpi', width: 960, height: 640, iconSize: 360 },
    { folder: 'drawable-land-xxhdpi', width: 1440, height: 960, iconSize: 520 },
    { folder: 'drawable-land-xxxhdpi', width: 1920, height: 1280, iconSize: 680 }
  ];

  for (const t of targets) {
    const targetFolder = path.join(resDir, t.folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // Render resized icon with rounded squircle mask
    const cornerRadius = Math.round(t.iconSize * 0.22);
    const squircleSvg = Buffer.from(
      `<svg width="${t.iconSize}" height="${t.iconSize}"><rect x="0" y="0" width="${t.iconSize}" height="${t.iconSize}" rx="${cornerRadius}" ry="${cornerRadius}" fill="#fff"/></svg>`
    );

    const iconBuffer = await sharp(iconSource)
      .resize(t.iconSize, t.iconSize)
      .composite([{ input: squircleSvg, blend: 'dest-in' }])
      .toFormat('png')
      .toBuffer();

    // Composite centered on pure black background (#000000)
    const splashBuffer = await sharp({
      create: {
        width: t.width,
        height: t.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
    .composite([
      {
        input: iconBuffer,
        left: Math.round((t.width - t.iconSize) / 2),
        top: Math.round((t.height - t.iconSize) / 2)
      }
    ])
    .png()
    .toBuffer();

    const destFile = path.join(targetFolder, 'splash.png');
    fs.writeFileSync(destFile, splashBuffer);
    console.log(`Generated large app-icon splash screen: ${t.folder}/splash.png (${t.iconSize}px icon)`);
  }
}

generateSplashScreens().catch(console.error);
