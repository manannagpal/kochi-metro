import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generate() {
  const svgPath = path.resolve('public/favicon.svg');
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
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name}`);
  }

  // Generate high-res 512x512 favicon.png
  await sharp(svgPath)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  // Build valid multi-resolution binary ICO (32x32, 48x48, 96x96)
  const icoSizes = [32, 48, 96];
  const pngBuffers = [];
  for (const sz of icoSizes) {
    const buf = await sharp(svgPath).resize(sz, sz).png().toBuffer();
    pngBuffers.push({ size: sz, buf });
  }

  const headerSize = 6;
  const directorySize = 16 * pngBuffers.length;
  let currentOffset = headerSize + directorySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngBuffers.length, 4);

  const entries = [];
  const buffers = [];

  for (const item of pngBuffers) {
    buffers.push(item.buf);
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size, 0);
    entry.writeUInt8(item.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buf.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    entries.push(entry);
    currentOffset += item.buf.length;
  }

  const icoBuf = Buffer.concat([header, ...entries, ...buffers]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
  console.log(`Generated true binary favicon.ico (${icoBuf.length} bytes)`);
}

generate().catch(console.error);
