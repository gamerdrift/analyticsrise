const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crcData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  chunk.writeUInt32BE(crc32(crcData), 8 + len);
  return chunk;
}

function createPNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw Scanlines: 1 filter byte (0) + width*4 per row
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    scanlines[y * (1 + width * 4)] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = y * (1 + width * 4) + 1 + x * 4;
      scanlines[dstIdx] = rgbaBuffer[srcIdx];
      scanlines[dstIdx + 1] = rgbaBuffer[srcIdx + 1];
      scanlines[dstIdx + 2] = rgbaBuffer[srcIdx + 2];
      scanlines[dstIdx + 3] = rgbaBuffer[srcIdx + 3];
    }
  }

  const idatData = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', idatData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Letter rasterization matrix for "A" and "R"
const letterA = [
  "   ######   ",
  "  ########  ",
  "  ##    ##  ",
  " ##      ## ",
  " ##      ## ",
  " ##      ## ",
  " ########## ",
  " ########## ",
  " ##      ## ",
  " ##      ## ",
  " ##      ## ",
  " ##      ## "
];

const letterR = [
  " #######    ",
  " ########   ",
  " ##    ###  ",
  " ##    ###  ",
  " ########   ",
  " #######    ",
  " ##   ###   ",
  " ##    ###  ",
  " ##     ##  ",
  " ##     ### ",
  " ##      ## ",
  " ##      ## "
];

function renderARLogo(size) {
  const buffer = Buffer.alloc(size * size * 4);
  const cornerRadius = size * 0.22;

  // AR box: glowing neon cyan #00E5FF (0, 229, 255) to #4FC3F7 (79, 195, 247)
  const pad = Math.floor(size * 0.08);
  const innerSize = size - pad * 2;
  const innerRadius = innerSize * 0.20;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Outer bounding check for rounded icon
      let inOuter = true;
      const ox = Math.min(x, size - 1 - x);
      const oy = Math.min(y, size - 1 - y);
      if (ox < cornerRadius && oy < cornerRadius) {
        const dist = Math.hypot(cornerRadius - ox, cornerRadius - oy);
        if (dist > cornerRadius) {
          inOuter = false;
        }
      }

      if (!inOuter) {
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
        continue;
      }

      // Check inner AR badge
      const ix = x - pad;
      const iy = y - pad;
      let inInner = false;
      if (ix >= 0 && ix < innerSize && iy >= 0 && iy < innerSize) {
        const cx = Math.min(ix, innerSize - 1 - ix);
        const cy = Math.min(iy, innerSize - 1 - iy);
        if (cx >= innerRadius || cy >= innerRadius || Math.hypot(innerRadius - cx, innerRadius - cy) <= innerRadius) {
          inInner = true;
        }
      }

      if (inInner) {
        // Gradient from top-left (#00E5FF) to bottom-right (#4FC3F7)
        const t = (ix + iy) / (innerSize * 2);
        const rGrad = Math.round(0 * (1 - t) + 79 * t);
        const gGrad = Math.round(229 * (1 - t) + 195 * t);
        const bGrad = Math.round(255 * (1 - t) + 247 * t);

        // Render letter text 'AR' in deep black (#05070B)
        const textMarginX = Math.floor(innerSize * 0.14);
        const textMarginY = Math.floor(innerSize * 0.22);
        const textW = innerSize - textMarginX * 2;
        const textH = innerSize - textMarginY * 2;

        let isText = false;
        if (ix >= textMarginX && ix < innerSize - textMarginX && iy >= textMarginY && iy < innerSize - textMarginY) {
          const relX = (ix - textMarginX) / textW; // 0 to 1
          const relY = (iy - textMarginY) / textH; // 0 to 1

          if (relX < 0.48) {
            // Letter A
            const aGridX = Math.floor((relX / 0.48) * 12);
            const aGridY = Math.floor(relY * 12);
            if (aGridY >= 0 && aGridY < letterA.length && aGridX >= 0 && aGridX < 12) {
              if (letterA[aGridY][aGridX] === '#') isText = true;
            }
          } else if (relX > 0.52) {
            // Letter R
            const rGridX = Math.floor(((relX - 0.52) / 0.48) * 12);
            const rGridY = Math.floor(relY * 12);
            if (rGridY >= 0 && rGridY < letterR.length && rGridX >= 0 && rGridX < 12) {
              if (letterR[rGridY][rGridX] === '#') isText = true;
            }
          }
        }

        if (isText) {
          // Dark contrast text #05070B
          buffer[idx] = 5;
          buffer[idx + 1] = 7;
          buffer[idx + 2] = 11;
          buffer[idx + 3] = 255;
        } else {
          // Cyan gradient background
          buffer[idx] = rGrad;
          buffer[idx + 1] = gGrad;
          buffer[idx + 2] = bGrad;
          buffer[idx + 3] = 255;
        }
      } else {
        // Outer platform dark boundary #05070B
        buffer[idx] = 5;
        buffer[idx + 1] = 7;
        buffer[idx + 2] = 11;
        buffer[idx + 3] = 255;
      }
    }
  }

  return createPNG(size, size, buffer);
}

function createICO(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let offset = 6 + (16 * count);
  const dirEntries = [];
  const imageBuffers = [];

  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);

    dirEntries.push(entry);
    imageBuffers.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating official AnalyticsRise favicon and app icon assets...');

const png16 = renderARLogo(16);
const png32 = renderARLogo(32);
const png48 = renderARLogo(48);
const png180 = renderARLogo(180);
const png192 = renderARLogo(192);
const png512 = renderARLogo(512);

fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), png192);
fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), png512);

const icoBuffer = createICO([
  { size: 16, buffer: png16 },
  { size: 32, buffer: png32 },
  { size: 48, buffer: png48 }
]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

// Also create app/favicon.ico for Next.js app directory conventions
const appDir = path.join(__dirname, '..', 'app');
if (fs.existsSync(appDir)) {
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
}

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="arGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF" />
      <stop offset="100%" stop-color="#4FC3F7" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#05070B" />
  <rect x="8" y="8" width="84" height="84" rx="16" fill="url(#arGrad)" />
  <text x="50" y="62" font-family="'Orbitron', 'Inter', -apple-system, sans-serif" font-weight="900" font-size="44" fill="#05070B" text-anchor="middle" letter-spacing="-3">AR</text>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

console.log('Favicon generation completed successfully:');
console.log('- public/favicon.ico (16x16, 32x32, 48x48)');
console.log('- public/favicon-16x16.png');
console.log('- public/favicon-32x32.png');
console.log('- public/apple-touch-icon.png (180x180)');
console.log('- public/android-chrome-192x192.png');
console.log('- public/android-chrome-512x512.png');
console.log('- public/favicon.svg');
console.log('- app/favicon.ico');
