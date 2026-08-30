import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function buildTightCombinedMaster() {
  const userImgPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/.user_uploaded/media_1787386043090.png';
  const previewPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/tight_combined_master_preview.png';
  const publicDir = path.resolve('public');

  if (!fs.existsSync(userImgPath)) {
    console.error('User image not found:', userImgPath);
    process.exit(1);
  }

  // Render directly on 512x512 crisp white canvas
  const masterBuffer = await sharp(userImgPath)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  // Save preview image for artifact review
  await sharp(masterBuffer).toFile(previewPath);
  console.log('Saved tight_combined_master_preview.png');

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
    await sharp(masterBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name}`);
  }

  // Generate favicon.ico
  await sharp(masterBuffer)
    .resize(48, 48)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Generated favicon.ico');
}

buildTightCombinedMaster().catch(console.error);
