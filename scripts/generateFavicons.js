import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateFavicons() {
  const sourcePath = fs.existsSync(path.resolve('public/app-icon-source.jpg'))
    ? path.resolve('public/app-icon-source.jpg')
    : path.resolve('public/app-icon-source.png');
  const publicDir = path.resolve('public');
  const distDir = path.resolve('dist');

  if (!fs.existsSync(sourcePath)) {
    console.error('Source icon not found:', sourcePath);
    process.exit(1);
  }

  console.log('Processing master image from:', sourcePath);
  const rawObj = await sharp(sourcePath).raw().toBuffer({ resolveWithObject: true });
  const { data, info } = rawObj;
  const { width, height } = info;

  // 1. Flood fill from corners to isolate outer white background
  const visited = new Uint8Array(width * height);
  const queue = [0, width - 1, (height - 1) * width, height * width - 1];
  for (const q of queue) visited[q] = 1;

  while (queue.length > 0) {
    const idx = queue.pop();
    const x = idx % width;
    const y = Math.floor(idx / width);

    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (!visited[nidx]) {
          const rgbIdx = nidx * 3;
          // Background is near white (R, G, B all > 240)
          if (data[rgbIdx] > 240 && data[rgbIdx + 1] > 240 && data[rgbIdx + 2] > 240) {
            visited[nidx] = 1;
            queue.push(nidx);
          }
        }
      }
    }
  }

  // 2. Build RGBA buffer with clean transparent background
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * 3;
    const d = i * 4;
    if (visited[i]) {
      rgba[d] = 253;
      rgba[d + 1] = 211;
      rgba[d + 2] = 2;
      rgba[d + 3] = 0;
    } else {
      rgba[d] = data[s];
      rgba[d + 1] = data[s + 1];
      rgba[d + 2] = data[s + 2];
      rgba[d + 3] = 255;
    }
  }

  // 3. Smooth anti-aliased edge transition & remove any white fringe
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (!visited[idx]) {
        const hasVisitedNeighbor =
          visited[idx - 1] || visited[idx + 1] || visited[idx - width] || visited[idx + width];
        if (hasVisitedNeighbor) {
          const bVal = data[idx * 3 + 2];
          if (bVal > 6) {
            const alpha = Math.max(0, Math.min(255, Math.round(((254 - bVal) / 248) * 255)));
            rgba[idx * 4 + 3] = alpha;
            rgba[idx * 4] = 253;
            rgba[idx * 4 + 1] = 211;
            rgba[idx * 4 + 2] = 2;
          }
        }
      }
    }
  }

  // 4. Crop to exact squircle bounding box (786x786 from x:119, y:119)
  const exactCrop = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract({ left: 119, top: 119, width: 786, height: 786 })
    .png()
    .toBuffer();

  // 5. Place onto 512x512 transparent canvas with 16px safe margin (480x480 squircle)
  const masterSquircle512 = await sharp(exactCrop)
    .resize(480, 480)
    .png()
    .toBuffer();

  const master512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{ input: masterSquircle512, top: 16, left: 16 }])
  .png()
  .toBuffer();

  // 6. Build SVG with embedded high-res base64 image
  const base64Png = master512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="512" height="512">
  <image width="512" height="512" href="data:image/png;base64,${base64Png}"/>
</svg>\n`;

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  console.log('Generated public/favicon.svg');

  // 7. Generate all PNG resolutions
  const sizes = [
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'favicon-144x144.png', size: 144 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'favicon.png', size: 512 }
  ];

  for (const { name, size } of sizes) {
    await sharp(master512)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated public/${name} (${size}x${size})`);
  }

  // 8. Build valid multi-resolution binary ICO (16x16, 32x32, 48x48, 96x96)
  const icoSizes = [16, 32, 48, 96];
  const pngBuffers = [];
  for (const sz of icoSizes) {
    const buf = await sharp(master512).resize(sz, sz).png().toBuffer();
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
  console.log(`Generated true binary public/favicon.ico (${icoBuf.length} bytes)`);

  // 9. Sync to dist/ if dist exists
  if (fs.existsSync(distDir)) {
    const filesToSync = [
      'favicon.ico',
      'favicon.svg',
      'favicon.png',
      ...sizes.map(s => s.name)
    ];
    for (const f of filesToSync) {
      const srcFile = path.join(publicDir, f);
      const destFile = path.join(distDir, f);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
      }
    }
    console.log('Synced all favicons to dist/');
  }

  console.log('All favicons successfully generated!');
}

generateFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
