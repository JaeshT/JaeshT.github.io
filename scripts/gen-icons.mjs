// Generates PWA icons as PNGs with zero dependencies (Node built-in zlib only).
// Theme: a private-equity "J-curve" on a dark tile. Regenerate with: node scripts/gen-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = new URL('../public/icons/', import.meta.url);
mkdirSync(OUT, { recursive: true });

// ---- minimal PNG encoder (RGBA, filter 0 per scanline) ----
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // raw scanlines with filter byte 0
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- draw the icon ----
function hex(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
const BG = hex('#0f1115');
const TILE = hex('#181b22');
const ACCENT = hex('#5b8cff');
const GREEN = hex('#36d399');

function draw(size, { maskable = false } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const set = (x, y, [r, g, b], a = 255) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    // simple alpha-over
    const ia = a / 255;
    buf[i] = buf[i] * (1 - ia) + r * ia;
    buf[i + 1] = buf[i + 1] * (1 - ia) + g * ia;
    buf[i + 2] = buf[i + 2] * (1 - ia) + b * ia;
    buf[i + 3] = 255;
  };

  // background fill
  for (let i = 0; i < size * size; i++) {
    buf[i * 4] = BG[0];
    buf[i * 4 + 1] = BG[1];
    buf[i * 4 + 2] = BG[2];
    buf[i * 4 + 3] = 255;
  }

  // rounded tile (smaller inset for maskable so it survives icon masking)
  const inset = maskable ? Math.round(size * 0.16) : Math.round(size * 0.08);
  const radius = Math.round(size * 0.2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inX = x >= inset && x < size - inset;
      const inY = y >= inset && y < size - inset;
      if (!inX || !inY) continue;
      // rounded corners
      const lx = inset + radius, rx = size - inset - radius;
      const ty = inset + radius, by = size - inset - radius;
      let inside = true;
      const cx = x < lx ? lx : x > rx ? rx : x;
      const cy = y < ty ? ty : y > by ? by : y;
      if ((x < lx || x > rx) && (y < ty || y > by)) {
        const d = Math.hypot(x - cx, y - cy);
        inside = d <= radius;
      }
      if (inside) set(x, y, TILE);
    }
  }

  // J-curve: dips below zero then rises — plotted across the tile interior
  const pad = inset + Math.round(size * 0.14);
  const w = size - 2 * pad;
  const baseY = pad + Math.round(w * 0.42); // "zero" line
  const thickness = Math.max(2, Math.round(size * 0.035));
  const pts = 600;
  for (let i = 0; i <= pts; i++) {
    const t = i / pts; // 0..1 along x
    const x = Math.round(pad + t * w);
    // J shape: start ~0, dip to trough ~0.35, rise above
    const dip = -1.9 * Math.exp(-Math.pow((t - 0.28) / 0.18, 2));
    const rise = 2.6 * Math.pow(Math.max(0, t - 0.18), 1.5);
    const val = dip + rise; // negative then strongly positive
    const y = Math.round(baseY - val * (w * 0.16));
    const color = val >= 0 ? GREEN : ACCENT;
    for (let dy = -thickness; dy <= thickness; dy++) {
      for (let dx = -thickness; dx <= thickness; dx++) {
        if (dx * dx + dy * dy <= thickness * thickness) set(x + dx, y + dy, color);
      }
    }
  }
  // baseline (zero) tick line, faint
  for (let x = pad; x < pad + w; x += 1) set(x, baseY, [80, 86, 96]);

  return encodePNG(size, size, buf);
}

const targets = [
  ['icon-192.png', 192, {}],
  ['icon-512.png', 512, {}],
  ['maskable-512.png', 512, { maskable: true }],
  ['apple-touch-icon-180.png', 180, { maskable: true }],
  ['favicon-32.png', 32, {}],
];
for (const [name, size, opts] of targets) {
  writeFileSync(new URL(name, OUT), draw(size, opts));
  console.log('wrote', name);
}
