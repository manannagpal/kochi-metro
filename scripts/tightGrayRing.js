import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateTightGrayRing() {
  const screenshotPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/.user_uploaded/media_1787385595700.png';
  const previewPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/tight_gray_ring_preview.png';
  const publicDir = path.resolve('public');

  const meta = await sharp(screenshotPath).metadata();

  // Crop tight around the red circle emblem inside the screenshot
  const cropLeft = Math.round(meta.width * 0.14);
  const cropTop = Math.round(meta.height * 0.14);
  const cropWidth = Math.round(meta.width * 0.72);
  const cropHeight = Math.round(meta.height * 0.72);

  // Resize red emblem core to 430x430 inside a 512x512 canvas
  const redEmblemCore = await sharp(screenshotPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .resize(430, 430, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer();

  // Draw light gray ring tightly around the red emblem (r = 226)
  const tightRingSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="226" fill="none" stroke="#E2E8F0" stroke-width="12"/>
    </svg>
  `);

  // Composite red emblem with tight outer gray ring on white canvas
  const compositedBuffer = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: redEmblemCore, top: 41, left: 41 },
    { input: tightRingSvg, top: 0, left: 0 }
  ])
  .png()
  .toBuffer();

  // Save preview image for artifact review
  await sharp(compositedBuffer).toFile(previewPath);
  console.log('Saved tight_gray_ring_preview.png');

  // Regenerate all public favicons
  const sizes = [
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'favicon-144x144.png', size: 144 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 }
  ];

  for (const { name, size } of sizes) {
    await sharp(compositedBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name}`);
  }

  // Generate favicon.ico
  await sharp(compositedBuffer)
    .resize(48, 48)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Generated tight favicon.ico');
}

generateTightGrayRing().catch(console.error);
