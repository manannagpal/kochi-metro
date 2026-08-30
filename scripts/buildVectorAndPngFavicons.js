import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function buildVectorAndPngFavicons() {
  const redEmblemPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/.user_uploaded/media_1787384125572.png';
  const publicDir = path.resolve('public');

  // 1. Trim uneven outer padding from red emblem source
  const trimmedBuffer = await sharp(redEmblemPath)
    .trim({ threshold: 15 })
    .toBuffer();

  // 2. Resize trimmed red emblem to 440x440 square
  const squareRedEmblem = await sharp(trimmedBuffer)
    .resize(440, 440, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer();

  // 3. SVG overlay for tight concentric gray ring (r=234)
  const ringSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="234" fill="none" stroke="#E2E8F0" stroke-width="14"/>
    </svg>
  `);

  // 4. Composite concentric emblem PNG (512x512)
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

  // 5. Generate base64 string for SVG embedding
  const base64Png = compositedBuffer.toString('base64');
  const embeddedSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="512" height="512">
  <image width="512" height="512" href="data:image/png;base64,${base64Png}"/>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), embeddedSvgContent, 'utf8');
  console.log('Generated public/favicon.svg with embedded base64 image!');

  // 6. Build all PNG resolutions
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

  console.log('Built all PNG/ICO/SVG favicons perfectly!');
}

buildVectorAndPngFavicons().catch(console.error);
