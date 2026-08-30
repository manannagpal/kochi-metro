import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateTightRingOnExactImage() {
  const userImgPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/.user_uploaded/media_1787384125572.png';
  const previewPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/tight_exact_ring_preview.png';

  // 1. Resize exact user image to 456x456 (filling the inner circle space)
  const redEmblemCore = await sharp(userImgPath)
    .resize(456, 456, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer();

  // 2. Draw tight light gray ring at r=236, stroke-width=12 (inner edge at 230, right next to red circle at 228)
  const tightRingSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="236" fill="none" stroke="#E2E8F0" stroke-width="12"/>
    </svg>
  `);

  // 3. Composite resized image with tight gray ring
  const compositedBuffer = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: redEmblemCore, top: 28, left: 28 },
    { input: tightRingSvg, top: 0, left: 0 }
  ])
  .png()
  .toBuffer();

  await sharp(compositedBuffer).toFile(previewPath);
  console.log('Saved tight_exact_ring_preview.png');

  // Build all public favicons
  const publicDir = path.resolve('public');
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
  }

  // Generate favicon.ico
  await sharp(compositedBuffer)
    .resize(48, 48)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Built all favicons with tight gray ring!');
}

generateTightRingOnExactImage().catch(console.error);
