/**
 * AnalyticsRise — Canonical Triangular AR Brand Asset Generator
 * Generates the official master vector SVG and all favicon/icon derivatives.
 * 
 * Brand Geometry:
 * - Upward Ascension Triangle / Mountain Silhouette (Rise)
 * - Pure Geometric Vector "AR" Monogram integrated into the triangle (No <text> tags)
 * - Official Cyan/Blue Cyber Gradient: #00E5FF to #4FC3F7 with #05070B dark contrast
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Canonical Master SVG Artwork Content
const MASTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="arMasterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF" />
      <stop offset="50%" stop-color="#4FC3F7" />
      <stop offset="100%" stop-color="#0070F3" />
    </linearGradient>
    <linearGradient id="arMasterBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF" />
      <stop offset="60%" stop-color="#4FC3F7" />
      <stop offset="100%" stop-color="#00D4FF" />
    </linearGradient>
    <filter id="arMasterGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#00E5FF" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Triangular Ascension Badge Body -->
  <path
    d="M 50 7 C 52.2 7 54.2 8.3 55.3 10.3 L 92.3 78.7 C 93.8 81.5 91.8 85 88.6 85 L 11.4 85 C 8.2 85 6.2 81.5 7.7 78.7 L 44.7 10.3 C 45.8 8.3 47.8 7 50 7 Z"
    fill="url(#arMasterGrad)"
    stroke="url(#arMasterBorderGrad)"
    stroke-width="2.5"
    stroke-linejoin="round"
    filter="url(#arMasterGlow)"
  />

  <!-- High-Precision Integrated Geometric 'AR' Vector Monogram -->
  <g fill="#05070B" fill-rule="evenodd">
    <!-- Letter 'A' Outer & Inner Counter (Compound Path) -->
    <path
      d="M 37.5 30 L 44.5 30 L 52.5 72 L 44.5 72 L 42.2 60 L 32.8 60 L 30.5 72 L 23 72 Z M 37.5 40 L 34.4 53.5 L 40.6 53.5 Z"
    />

    <!-- Letter 'R' Outer & Inner Loop Counter (Compound Path) -->
    <path
      d="M 54.5 30 L 68 30 C 74.5 30 78 34 78 40.5 C 78 45.5 75 48.8 70.2 50.2 L 78.5 72 L 69.8 72 L 62.5 52 L 61.5 52 L 61.5 72 L 54.5 72 Z M 61.5 36.5 L 61.5 46.5 L 67.2 46.5 C 70.2 46.5 71.8 45 71.8 41.5 C 71.8 38 70.2 36.5 67.2 36.5 Z"
    />
  </g>
</svg>`;

// Favicon Optimized SVG (Slightly bolder stroke for 16px-32px clarity)
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="arFavGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF" />
      <stop offset="100%" stop-color="#4FC3F7" />
    </linearGradient>
  </defs>
  <path
    d="M 50 6 C 52.5 6 54.8 7.5 56 9.8 L 94 79.2 C 95.5 82 93.5 86 90 86 L 10 86 C 6.5 86 4.5 82 6 79.2 L 44 9.8 C 45.2 7.5 47.5 6 50 6 Z"
    fill="url(#arFavGrad)"
    stroke="#00E5FF"
    stroke-width="2"
    stroke-linejoin="round"
  />
  <g fill="#05070B" fill-rule="evenodd">
    <path d="M 37.5 28 L 44.5 28 L 52.5 72 L 44.5 72 L 42.2 60 L 32.8 60 L 30.5 72 L 23 72 Z M 37.5 38.5 L 34.4 53.5 L 40.6 53.5 Z" />
    <path d="M 54.5 28 L 68 28 C 74.5 28 78 32 78 39 C 78 44.5 75 48 70.2 49.5 L 78.5 72 L 69.8 72 L 62.5 51.5 L 61.5 51.5 L 61.5 72 L 54.5 72 Z M 61.5 35 L 61.5 45.5 L 67.2 45.5 C 70.2 45.5 71.8 44 71.8 40.2 C 71.8 36.5 70.2 35 67.2 35 Z" />
  </g>
</svg>`;

// PNG Encoding Utilities
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
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(6, 9);
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdr);

  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    scanlines[y * (1 + width * 4)] = 0;
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

// Point in Triangle Test
function pointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
  const d1 = (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
  const d2 = (px - x3) * (y2 - y3) - (x2 - x3) * (py - y3);
  const d3 = (px - x1) * (y3 - y1) - (x3 - x1) * (py - y1);
  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(hasNeg && hasPos);
}

// Point in Polygon Test
function pointInPolygon(px, py, vertices) {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i][0], yi = vertices[i][1];
    const xj = vertices[j][0], yj = vertices[j][1];
    const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Check if pixel falls inside the geometric 'AR' vector paths (scaled to [0, size])
function pointInARMonogram(px, py, size) {
  const scale = size / 100;
  const nx = px / scale;
  const ny = py / scale;

  // 'A' Outer Body Polygon
  const aOuter = [
    [37.5, 28], [44.5, 28], [52.5, 72], [44.5, 72],
    [42.2, 60], [32.8, 60], [30.5, 72], [23, 72]
  ];
  // 'A' Inner Hole Polygon
  const aHole = [
    [37.5, 38.5], [34.4, 53.5], [40.6, 53.5]
  ];

  if (pointInPolygon(nx, ny, aOuter) && !pointInPolygon(nx, ny, aHole)) {
    return true;
  }

  // 'R' Outer Body Polygon (Approximated piecewise Bezier)
  const rOuter = [
    [54.5, 28], [68, 28], [74, 30], [77.5, 34], [78, 39],
    [77, 44], [74, 47.5], [70.2, 49.5], [78.5, 72], [69.8, 72],
    [62.5, 51.5], [61.5, 51.5], [61.5, 72], [54.5, 72]
  ];
  // 'R' Inner Hole Polygon
  const rHole = [
    [61.5, 35], [66.5, 35], [70, 36.5], [71.5, 39], [71.5, 41],
    [70, 43.5], [66.5, 45.5], [61.5, 45.5]
  ];

  if (pointInPolygon(nx, ny, rOuter) && !pointInPolygon(nx, ny, rHole)) {
    return true;
  }

  return false;
}

/**
 * Render rasterized triangular AR PNG
 */
function renderRasterLogo(size) {
  const buffer = Buffer.alloc(size * size * 4);

  // Scaled triangle vertices
  const ax = size * 0.50, ay = size * 0.06;
  const bx = size * 0.94, by = size * 0.86;
  const cx = size * 0.06, cy = size * 0.86;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const px = x + 0.5;
      const py = y + 0.5;

      const inTriangle = pointInTriangle(px, py, ax, ay, bx, by, cx, cy);

      if (!inTriangle) {
        // Transparent outside
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
        continue;
      }

      const inAR = pointInARMonogram(px, py, size);

      if (inAR) {
        // Dark contrast internal monogram: #05070B (5, 7, 11)
        buffer[idx] = 5;
        buffer[idx + 1] = 7;
        buffer[idx + 2] = 11;
        buffer[idx + 3] = 255;
      } else {
        // Cyan-to-Sky Blue gradient fill
        const t = (x + y) / (size * 2);
        const rGrad = Math.round(0 * (1 - t) + 79 * t);
        const gGrad = Math.round(229 * (1 - t) + 195 * t);
        const bGrad = Math.round(255 * (1 - t) + 247 * t);

        buffer[idx] = rGrad;
        buffer[idx + 1] = gGrad;
        buffer[idx + 2] = bGrad;
        buffer[idx + 3] = 255;
      }
    }
  }

  return createPNG(size, height = size, buffer);
}

/**
 * Generate ICO file from 16x16 and 32x32 PNG buffers
 */
function createICO(pngBuffers) {
  const numImages = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(numImages, 4);

  const dirEntries = [];
  let currentOffset = 6 + (16 * numImages);

  pngBuffers.forEach(({ size, buffer }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Color count
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(currentOffset, 12); // File offset

    dirEntries.push(entry);
    currentOffset += buffer.length;
  });

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map(p => p.buffer)]);
}

// Target Paths
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const logoDir = path.join(publicDir, 'assets', 'logo');
const appDir = path.join(projectRoot, 'app');

fs.mkdirSync(logoDir, { recursive: true });

console.log('Generating Canonical Master Brand Assets...');

// 1. Master SVG
const masterSvgPath = path.join(logoDir, 'ar-triangle-master.svg');
fs.writeFileSync(masterSvgPath, MASTER_SVG);
console.log(`✓ Generated ${masterSvgPath}`);

// 2. Default SVG Logo & Favicon SVG
const defaultSvgPath = path.join(logoDir, 'ar-triangle-logo.svg');
fs.writeFileSync(defaultSvgPath, MASTER_SVG);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), FAVICON_SVG);
fs.writeFileSync(path.join(logoDir, 'favicon.svg'), FAVICON_SVG);
console.log(`✓ Generated favicon.svg in public/ and public/assets/logo/`);

// 3. PNG Dimensions Suite
const png16 = renderRasterLogo(16);
const png32 = renderRasterLogo(32);
const png64 = renderRasterLogo(64);
const png180 = renderRasterLogo(180);
const png192 = renderRasterLogo(192);
const png512 = renderRasterLogo(512);

fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
fs.writeFileSync(path.join(logoDir, 'favicon-16x16.png'), png16);

fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
fs.writeFileSync(path.join(logoDir, 'favicon-32x32.png'), png32);

fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), png192);
fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), png512);

fs.writeFileSync(path.join(publicDir, 'ar-triangle-logo.png'), png512);
fs.writeFileSync(path.join(logoDir, 'ar-triangle-logo.png'), png512);
console.log(`✓ Generated full PNG resolution suite (16x16 -> 512x512)`);

// 4. Multi-Resolution ICO Files
const icoBuffer = createICO([
  { size: 16, buffer: png16 },
  { size: 32, buffer: png32 },
]);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(logoDir, 'favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
console.log(`✓ Generated favicon.ico in public/, public/assets/logo/, and app/favicon.ico`);

console.log('Brand Asset Generation Complete!');
