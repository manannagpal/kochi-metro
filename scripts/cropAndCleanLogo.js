import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function cropAndClean() {
  const screenshotPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/.user_uploaded/media_1787385595700.png';
  const previewPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/clean_circle_emblem_preview.png';
  const publicDir = path.resolve('public');

  const meta = await sharp(screenshotPath).metadata();
  console.log('Original dimensions:', meta.width, meta.height);

  // Crop inside the outer rounded-square card line
  const cropLeft = Math.round(meta.width * 0.05);
  const cropTop = Math.round(meta.height * 0.05);
  const cropWidth = Math.round(meta.width * 0.90);
  const cropHeight = Math.round(meta.height * 0.90);

  // Crop out card border, then render onto crisp 512x512 white background
  const cleanedBuffer = await sharp(screenshotPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  // Save clean preview image for artifact review
  await sharp(cleanedBuffer).toFile(previewPath);
  console.log('Saved clean_circle_emblem_preview.png');

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
    await sharp(cleanedBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name}`);
  }

  // Generate favicon.ico
  await sharp(cleanedBuffer)
    .resize(48, 48)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Generated clean favicon.ico');
}

cropAndClean().catch(console.error);
