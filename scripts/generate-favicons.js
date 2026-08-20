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

// Check point inside triangle defined by (x1, y1), (x2, y2), (x3, y3)
function pointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
  const d1 = (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
  const d2 = (px - x3) * (y2 - y3) - (x2 - x3) * (py - y3);
  const d3 = (px - x1) * (y3 - y1) - (x3 - x1) * (py - y1);
  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(hasNeg && hasPos);
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

/**
 * Render Triangular AR Logo to PNG buffer
 * Features:
 * - Equilateral/Isosceles upward-pointing rounded Triangle
 * - Glowing Neon Cyan (#00E5FF) to Sky Blue (#4FC3F7) gradient frame / fill
 * - AR lettering positioned inside the triangle
 */
function renderTriangularARLogo(size) {
  const buffer = Buffer.alloc(size * size * 4);

  // Triangle coordinates normalized to [0, size]
  // Apex: (size * 0.50, size * 0.08)
  // Bottom-Right: (size * 0.94, size * 0.90)
  // Bottom-Left: (size * 0.06, size * 0.90)
  const ax = size * 0.50, ay = size * 0.08;
  const bx = size * 0.94, by = size * 0.90;
  const cx = size * 0.06, cy = size * 0.90;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      const inOuterTriangle = pointInTriangle(x + 0.5, y + 0.5, ax, ay, bx, by, cx, cy);

      if (!inOuterTriangle) {
        // Transparent outside triangle
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
        continue;
      }

      // Cyan to Blue Gradient: #00E5FF (0, 229, 255) to #4FC3F7 (79, 195, 247)
      const t = (x + y) / (size * 2);
      const rGrad = Math.round(0 * (1 - t) + 79 * t);
      const gGrad = Math.round(229 * (1 - t) + 195 * t);
      const bGrad = Math.round(255 * (1 - t) + 247 * t);

      // Check for AR text inside the lower/middle portion of the triangle
      const textTop = size * 0.38;
      const textBottom = size * 0.82;
      const textLeft = size * 0.22;
      const textRight = size * 0.78;
      const textW = textRight - textLeft;
      const textH = textBottom - textTop;

      let isText = false;
      if (x >= textLeft && x < textRight && y >= textTop && y < textBottom) {
        const relX = (x - textLeft) / textW; // 0 to 1
        const relY = (y - textTop) / textH;  // 0 to 1

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
        // High-contrast deep dark text #05070B inside glowing triangle
        buffer[idx] = 5;
        buffer[idx + 1] = 7;
        buffer[idx + 2] = 11;
        buffer[idx + 3] = 255;
      } else {
        // Glowing cyan-to-blue gradient fill
        buffer[idx] = rGrad;
        buffer[idx + 1] = gGrad;
        buffer[idx + 2] = bGrad;
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

// Generate the official SVG markup for the Triangular AR Logo
function getTriangularLogoSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="arGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF" />
      <stop offset="100%" stop-color="#4FC3F7" />
    </linearGradient>
    <linearGradient id="arBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF" />
      <stop offset="50%" stop-color="#4FC3F7" />
      <stop offset="100%" stop-color="#0070F3" />
    </linearGradient>
    <filter id="arGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#00E5FF" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Triangular Frame Body -->
  <path
    d="M 50 8 L 93 84 C 94.8 87.2 92.5 91 88.8 91 L 11.2 91 C 7.5 91 5.2 87.2 7.0 84 Z"
    fill="url(#arGrad)"
    stroke="url(#arBorderGrad)"
    stroke-width="2"
    filter="url(#arGlow)"
  />

  <!-- High-Contrast Geometric AR Mark Inside Triangle -->
  <text
    x="50"
    y="70"
    font-family="'Orbitron', 'Inter', -apple-system, sans-serif"
    font-weight="900"
    font-size="38"
    fill="#05070B"
    text-anchor="middle"
    letter-spacing="-2.5"
  >AR</text>
</svg>`;
}

// Export files to public/ and public/assets/logo/
const publicDir = path.join(__dirname, '..', 'public');
const logoDir = path.join(publicDir, 'assets', 'logo');
const appDir = path.join(__dirname, '..', 'app');

if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

console.log('Generating Official AnalyticsRise Triangular AR Logo and Favicon Suite...');

const png16 = renderTriangularARLogo(16);
const png32 = renderTriangularARLogo(32);
const png48 = renderTriangularARLogo(48);
const png180 = renderTriangularARLogo(180);
const png192 = renderTriangularARLogo(192);
const png512 = renderTriangularARLogo(512);

const icoBuffer = createICO([
  { size: 16, buffer: png16 },
  { size: 32, buffer: png32 },
  { size: 48, buffer: png48 }
]);

const svgContent = getTriangularLogoSVG();

// 1. Write to public/
fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), png192);
fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

// 2. Write to public/assets/logo/
fs.writeFileSync(path.join(logoDir, 'ar-triangle-logo.svg'), svgContent);
fs.writeFileSync(path.join(logoDir, 'ar-triangle-logo.png'), png512);
fs.writeFileSync(path.join(logoDir, 'favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(logoDir, 'favicon.svg'), svgContent);
fs.writeFileSync(path.join(logoDir, 'favicon-16x16.png'), png16);
fs.writeFileSync(path.join(logoDir, 'favicon-32x32.png'), png32);
fs.writeFileSync(path.join(logoDir, 'apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(logoDir, 'android-chrome-192x192.png'), png192);
fs.writeFileSync(path.join(logoDir, 'android-chrome-512x512.png'), png512);

// 3. Write to app/favicon.ico
if (fs.existsSync(appDir)) {
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
}

console.log('✅ Generated all Triangular AR Logo and Favicon Suite assets successfully!');
