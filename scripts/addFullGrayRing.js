import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function addFullGrayRing() {
  const redEmblemPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/.user_uploaded/media_1787384125572.png';
  const previewPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/full_gray_ring_preview.png';
  const publicDir = path.resolve('public');

  // 1. Create a complete, 360-degree light gray circular ring overlay (512x512)
  const fullGrayRingSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="234" fill="none" stroke="#E2E8F0" stroke-width="14"/>
    </svg>
  `);

  // 2. Resize exact red emblem to 442x442 (so its outer edge r=221 sits right inside r=234 ring!)
  const resizedRedEmblem = await sharp(redEmblemPath)
    .resize(442, 442, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer();

  // 3. Composite on white 512x512 canvas
  const compositedBuffer = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: resizedRedEmblem, top: 35, left: 35 },
    { input: fullGrayRingSvg, top: 0, left: 0 }
  ])
  .png()
  .toBuffer();

  // Save preview image for artifact review
  await sharp(compositedBuffer).toFile(previewPath);
  console.log('Saved full_gray_ring_preview.png');

  // Build all public favicons
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

  console.log('Generated full gray ring favicons!');
}

addFullGrayRing().catch(console.error);
