import sharp from 'sharp';
import path from 'path';

async function encircleExactUserImage() {
  const userImgPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/.user_uploaded/media_1787384125572.png';
  const previewOutputPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/encircled_exact_preview.png';
  const publicDir = path.resolve('public');

  // 1. Create outer gray ring SVG overlay (512x512)
  const ringSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="244" fill="none" stroke="#E2E8F0" stroke-width="16"/>
    </svg>
  `);

  // 2. Resize user's exact uploaded image to 440x440
  const resizedUserImg = await sharp(userImgPath)
    .resize(440, 440, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer();

  // 3. Composite resized image inside 512x512 white canvas with outer gray ring
  const compositedBuffer = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: resizedUserImg, top: 36, left: 36 },
    { input: ringSvg, top: 0, left: 0 }
  ])
  .png()
  .toBuffer();

  // Save preview image for artifact review
  await sharp(compositedBuffer).toFile(previewOutputPath);
  console.log('Saved encircled_exact_preview.png');

  // Save to public favicon files
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

  console.log('Done encirclement!');
}

encircleExactUserImage().catch(console.error);
