import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function perfectCenter() {
  const redEmblemPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/.user_uploaded/media_1787384125572.png';
  const previewPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/perfect_centered_preview.png';

  // 1. Trim all uneven outer white space from the red emblem image to get exact pixel bounding box
  const trimmedBuffer = await sharp(redEmblemPath)
    .trim({ threshold: 15 })
    .toBuffer();

  const trimmedMeta = await sharp(trimmedBuffer).metadata();
  console.log('Trimmed dimensions:', trimmedMeta.width, trimmedMeta.height);

  // Resize trimmed red emblem to exact 440x440 square
  const squareRedEmblem = await sharp(trimmedBuffer)
    .resize(440, 440, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer();

  // 2. Light gray ring overlay (r=234, center at 256, 256)
  const ringSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="234" fill="none" stroke="#E2E8F0" stroke-width="14"/>
    </svg>
  `);

  // 3. Composite squareRedEmblem at exact mathematical center: (512 - 440)/2 = 36
  const compositedBuffer = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: squareRedEmblem, top: 36, left: 36 },
    { input: ringSvg, top: 0, left: 0 }
  ])
  .png()
  .toBuffer();

  await sharp(compositedBuffer).toFile(previewPath);
  console.log('Saved perfect_centered_preview.png');

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

  await sharp(compositedBuffer)
    .resize(48, 48)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Built perfectly centered favicons!');
}

perfectCenter().catch(console.error);
