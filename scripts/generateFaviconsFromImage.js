import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateFromMasterImage() {
  const masterImagePath = 'C:/Users/nagpa/.gemini/antigravity/brain/42c9d96f-0ec2-4ffd-9737-04414aa652f6/dmrc_style_sample2_1787380104900.jpg';
  const publicDir = path.resolve('public');

  if (!fs.existsSync(masterImagePath)) {
    console.error('Master image not found:', masterImagePath);
    process.exit(1);
  }

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
    await sharp(masterImagePath)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name} from master image Sample 2`);
  }

  // Copy 48x48 PNG to favicon.ico
  await sharp(masterImagePath)
    .resize(48, 48)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico from master image Sample 2');
}

generateFromMasterImage().catch(console.error);
