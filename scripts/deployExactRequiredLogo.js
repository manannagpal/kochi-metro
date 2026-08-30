import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function deployRequiredLogo() {
  const requiredImgPath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/.user_uploaded/media_1787385595700.png';
  const publicDir = path.resolve('public');

  if (!fs.existsSync(requiredImgPath)) {
    console.error('Required logo image not found:', requiredImgPath);
    process.exit(1);
  }

  // 1. Process image to 512x512 PNG with clean white background
  const base512Buffer = await sharp(requiredImgPath)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

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
    await sharp(base512Buffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name} from required Screenshot 2`);
  }

  // Generate favicon.ico
  await sharp(base512Buffer)
    .resize(48, 48)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Generated favicon.ico from required Screenshot 2');
}

deployRequiredLogo().catch(console.error);
