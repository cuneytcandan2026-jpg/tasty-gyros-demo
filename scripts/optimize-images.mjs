/**
 * Image pipeline for the Tasty Gyros demo.
 *
 * Reads the original brand photography from scripts/source/ (downloaded from the
 * live tastygyros.co.uk site for this private demo) and produces optimised,
 * responsive WebP renditions in src/assets/images/, plus favicons and the social
 * share image in public/.
 *
 * Run: npm run optimize:images
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC = path.join(root, 'scripts', 'source');
const OUT = path.join(root, 'src', 'assets', 'images');
const PUB = path.join(root, 'public');

const DEEP = '#082B55';

/** width sets by role (sources from the live site top out ~1280px wide) */
const TILE = [400, 800];
const WIDE = [640, 1024, 1400];
const ARCH = [520, 780, 1040];

/**
 * Each entry: source file, output basename, width list, and optional pre-crop
 * (sharp extract region) or cover box { w, h, position }.
 *
 * Every crop below is a framing decision only — nothing is retouched, recoloured
 * or composited, so each dish still looks exactly as Tasty Gyros photographed it.
 */
const MANIFEST = [
  // --- Hero: the flagship chicken gyros, cropped upright for the arch panel ---
  { in: 'chicken-gyros-wrap.jpg', out: 'hero-gyros', widths: ARCH, extract: { left: 300, top: 40, width: 660, height: 825 } },

  // --- Showcase: three large products, squared up so they scale hard ---
  { in: 'chicken-gyros-wrap.jpg', out: 'show-chicken-gyros', widths: TILE, extract: { left: 250, top: 100, width: 760, height: 760 } },
  { in: 'halloumi-souvlaki-wrap.png', out: 'show-halloumi', widths: TILE, cover: { w: 900, h: 900, position: 'centre' } },
  { in: 'vegan-gyros-wrap.jpg', out: 'show-vegan-gyros', widths: TILE, cover: { w: 900, h: 900, position: 'centre' } },
  // Bowl: cropped in tight on the food, which also leaves the burnt-in "NEW"
  // sticker (an unverifiable promo claim) out of frame.
  { in: 'gyros-bowl.png', out: 'show-gyros-bowl', widths: TILE, extract: { left: 118, top: 62, width: 630, height: 630 } },

  // --- Standout feature: the gyros box, full width ---
  { in: 'chicken-gyros-box.jpg', out: 'feature-gyros-box', widths: WIDE, extract: { left: 140, top: 120, width: 1010, height: 632 } },

  // --- Brand story: real team photography ---
  { in: 'staff-gyros-portrait.jpg', out: 'story-team', widths: [520, 900, 1200], cover: { w: 1000, h: 1240, position: 'top' }, lift: false },

  // --- Gallery: an editorial mix of squares and uprights ---
  { in: 'mixed-meat-wrap.jpg', out: 'gal-mixed-wrap', widths: TILE, cover: { w: 1000, h: 1000, position: 'centre' } },
  { in: 'greek-salad.jpg', out: 'gal-greek-salad', widths: TILE, cover: { w: 1000, h: 1000, position: 'centre' } },
  { in: 'lamb-skewer-wrap.jpg', out: 'gal-lamb-wrap', widths: TILE, cover: { w: 1000, h: 1000, position: 'centre' } },
  { in: 'tg-salad.jpg', out: 'gal-feta-salad', widths: TILE, cover: { w: 1000, h: 1000, position: 'centre' } },
  { in: 'chicken-gyros-box.jpg', out: 'gal-gyros-box', widths: TILE, cover: { w: 1000, h: 1000, position: 'centre' } },
  { in: 'chicken-souvlaki-wrap.jpg', out: 'gal-souvlaki-wrap', widths: TILE, cover: { w: 1000, h: 1000, position: 'centre' } },
  { in: 'staff-gyros-portrait.jpg', out: 'gal-team', widths: [400, 800], cover: { w: 1000, h: 1250, position: 'top' }, lift: false },

  // --- Locations: no branch/storefront photography exists in the brand assets,
  // so each branch is paired with a real dish rather than a stand-in facade. ---
  { in: 'chicken-gyros-wrap-meal.jpg', out: 'loc-enfield', widths: TILE, cover: { w: 1000, h: 750, position: 'centre' } },
  { in: 'halloumi-wrap-meal.jpg', out: 'loc-notting-hill', widths: TILE, cover: { w: 1000, h: 750, position: 'centre' } },
];


/**
 * Clean up the studio sweep.
 *
 * Tasty Gyros shoot on a white sweep, but it reaches the file as a vignetted,
 * faintly warm grey (~215 in the corners, ~245 in the middle, and warmer still
 * on the halloumi shot). Multiplied into a warm page ground that was tolerable;
 * sitting on a white card it reads as dirt, so it has to come out properly.
 *
 * The correction is deliberately confined to the backdrop. A flood fill from
 * the frame edges collects only the bright, near-neutral pixels that are
 * actually connected to the border — which is what keeps the white paper
 * wrapper out of it, bright and neutral though it is, because the food encloses
 * it. Inside that mask a per-channel white-point stretch takes the sweep to a
 * clean neutral white; the dish's own cast shadow is stretched by the same
 * factor, so it survives as a shadow rather than being erased.
 *
 * Nothing outside the mask is touched, so not one pixel of the food is altered.
 */
const SWEEP_FLOOR = 168; /* darkest backdrop tone the fill will still cross */
const SWEEP_SAT = 34; /* above this much colour a pixel is food, not backdrop */
const SWEEP_PCT = 0.88; /* percentile of the mask taken as "this is white" */
const SWEEP_SHADOW = 0.82; /* below this share of white, a cell is shadow, not sweep */

/** 4-connected flood fill inward from every border pixel that reads as sweep. */
function sweepMask(data, W, H) {
  const mask = new Uint8Array(W * H);
  const isSweep = (i) => {
    const o = i * 4;
    if (data[o + 3] < 250) return false;
    const r = data[o], g = data[o + 1], b = data[o + 2];
    const mx = Math.max(r, g, b);
    return mx - Math.min(r, g, b) <= SWEEP_SAT && mx >= SWEEP_FLOOR;
  };

  const stack = [];
  const push = (i) => {
    if (!mask[i] && isSweep(i)) {
      mask[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < W; x++) {
    push(x);
    push((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    push(y * W);
    push(y * W + W - 1);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % W;
    if (x > 0) push(i - 1);
    if (x < W - 1) push(i + 1);
    if (i >= W) push(i - W);
    if (i < W * (H - 1)) push(i + W);
  }
  return mask;
}

/** Grow the mask by a pixel, then soften it, so the boundary picks up no halo. */
function feather(mask, W, H) {
  const a = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (
        mask[i] ||
        (x > 0 && mask[i - 1]) ||
        (x < W - 1 && mask[i + 1]) ||
        (y > 0 && mask[i - W]) ||
        (y < H - 1 && mask[i + W])
      ) {
        a[i] = 1;
      }
    }
  }
  // Two separable 3-tap passes — roughly a small gaussian, enough to hide the seam.
  const tmp = new Float32Array(W * H);
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const l = x > 0 ? a[i - 1] : a[i];
        const r = x < W - 1 ? a[i + 1] : a[i];
        tmp[i] = (l + 2 * a[i] + r) / 4;
      }
    }
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        const i = y * W + x;
        const u = y > 0 ? tmp[i - W] : tmp[i];
        const d = y < H - 1 ? tmp[i + W] : tmp[i];
        a[i] = (u + 2 * tmp[i] + d) / 4;
      }
    }
  }
  return a;
}

/**
 * Estimate the sweep's illumination as a coarse per-channel field.
 *
 * A single white point cannot flatten this backdrop: it is vignetted, running
 * ~215 at the corners against ~250 in the middle. So the sweep is measured cell
 * by cell instead. A cell only counts as a reading if its bright end is close
 * to the global sweep white — which is what keeps the dish's cast shadow out of
 * the model, so the shadow is preserved instead of being flat-fielded away.
 * Cells with no reading (shadow, or mostly food) are filled in from their
 * neighbours, then the whole grid is smoothed and sampled bilinearly.
 */
function sweepField(data, mask, W, H, globalWhite) {
  const cell = Math.max(16, Math.round(Math.min(W, H) / 24));
  const gw = Math.ceil(W / cell);
  const gh = Math.ceil(H / cell);
  const field = [new Float32Array(gw * gh), new Float32Array(gw * gh), new Float32Array(gw * gh)];
  const known = new Uint8Array(gw * gh);
  const floor = globalWhite.map((w) => w * SWEEP_SHADOW);

  const hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      hist.forEach((h) => h.fill(0));
      let n = 0;
      const y1 = Math.min(H, (gy + 1) * cell);
      const x1 = Math.min(W, (gx + 1) * cell);
      for (let y = gy * cell; y < y1; y++) {
        for (let x = gx * cell; x < x1; x++) {
          const i = y * W + x;
          if (!mask[i]) continue;
          const o = i * 4;
          hist[0][data[o]]++;
          hist[1][data[o + 1]]++;
          hist[2][data[o + 2]]++;
          n++;
        }
      }
      const g = gy * gw + gx;
      if (n < cell * cell * 0.12) continue;

      const p90 = hist.map((h) => {
        let seen = 0;
        for (let v = 0; v < 256; v++) {
          seen += h[v];
          if (seen >= n * 0.9) return v;
        }
        return 255;
      });
      // Too dark at its bright end to be lit sweep — that is shadow, skip it.
      if (p90.some((v, c) => v < floor[c])) continue;

      known[g] = 1;
      for (let c = 0; c < 3; c++) field[c][g] = p90[c];
    }
  }

  // Diffuse the readings outward into the cells that had none.
  for (let pass = 0; pass < gw + gh && known.some((k) => !k); pass++) {
    const next = Uint8Array.from(known);
    for (let gy = 0; gy < gh; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        const g = gy * gw + gx;
        if (known[g]) continue;
        const sum = [0, 0, 0];
        let n = 0;
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          const ng = ny * gw + nx;
          if (!known[ng]) continue;
          for (let c = 0; c < 3; c++) sum[c] += field[c][ng];
          n++;
        }
        if (!n) continue;
        for (let c = 0; c < 3; c++) field[c][g] = sum[c] / n;
        next[g] = 1;
      }
    }
    known.set(next);
  }
  for (let g = 0; g < known.length; g++) {
    if (!known[g]) for (let c = 0; c < 3; c++) field[c][g] = globalWhite[c];
  }

  // Smooth so the correction cannot introduce cell-shaped banding.
  const tmp = new Float32Array(gw * gh);
  for (let c = 0; c < 3; c++) {
    for (let pass = 0; pass < 3; pass++) {
      const f = field[c];
      for (let gy = 0; gy < gh; gy++) {
        for (let gx = 0; gx < gw; gx++) {
          const g = gy * gw + gx;
          const l = gx > 0 ? f[g - 1] : f[g];
          const r = gx < gw - 1 ? f[g + 1] : f[g];
          tmp[g] = (l + 2 * f[g] + r) / 4;
        }
      }
      for (let gx = 0; gx < gw; gx++) {
        for (let gy = 0; gy < gh; gy++) {
          const g = gy * gw + gx;
          const u = gy > 0 ? tmp[g - gw] : tmp[g];
          const d = gy < gh - 1 ? tmp[g + gw] : tmp[g];
          f[g] = (u + 2 * tmp[g] + d) / 4;
        }
      }
    }
  }

  /** Bilinear sample of the field at a pixel, per channel. */
  return (x, y, c) => {
    const fx = Math.min(gw - 1.0001, Math.max(0, x / cell - 0.5));
    const fy = Math.min(gh - 1.0001, Math.max(0, y / cell - 0.5));
    const gx = Math.floor(fx);
    const gy = Math.floor(fy);
    const tx = fx - gx;
    const ty = fy - gy;
    const f = field[c];
    const a = f[gy * gw + gx];
    const b = f[gy * gw + gx + 1];
    const d = f[(gy + 1) * gw + gx];
    const e = f[(gy + 1) * gw + gx + 1];
    return Math.max(120, a * (1 - tx) * (1 - ty) + b * tx * (1 - ty) + d * (1 - tx) * ty + e * tx * ty);
  };
}

async function liftSweep(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;

  const mask = sweepMask(data, W, H);

  const hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
  let n = 0;
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const o = i * 4;
    hist[0][data[o]]++;
    hist[1][data[o + 1]]++;
    hist[2][data[o + 2]]++;
    n++;
  }
  // Too little backdrop to measure means this is not a sweep shot — leave it be.
  if (n < W * H * 0.02) return input;

  // Global white point, read off the backdrop itself so a warm sweep comes back
  // neutral rather than merely brighter. It also sets the shadow cut-off below.
  const globalWhite = hist.map((h) => {
    let seen = 0;
    for (let v = 0; v < 256; v++) {
      seen += h[v];
      if (seen >= n * SWEEP_PCT) return Math.max(v, 1);
    }
    return 255;
  });

  const at = sweepField(data, mask, W, H, globalWhite);
  const alpha = feather(mask, W, H);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const t = alpha[i];
      if (t <= 0.002) continue;
      const o = i * 4;
      for (let c = 0; c < 3; c++) {
        const v = data[o + c];
        const lifted = Math.min(255, (v * 255) / at(x, y, c));
        data[o + c] = v + (lifted - v) * t;
      }
    }
  }

  return sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toBuffer();
}

const positionMap = {
  top: 'top',
  centre: 'centre',
  center: 'centre',
};

async function run() {
  if (!existsSync(SRC)) {
    console.error(`Missing source folder: ${SRC}`);
    process.exit(1);
  }
  // Start clean so stale renditions can never drift out of sync with the manifest.
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const manifestOut = {};

  for (const item of MANIFEST) {
    const inPath = path.join(SRC, item.in);
    if (!existsSync(inPath)) {
      console.warn(`  ! skipping ${item.out} — source ${item.in} not found`);
      continue;
    }
    let buf = await readFile(inPath);
    if (item.lift !== false) buf = await liftSweep(buf);
    const renditions = [];
    const seenWidths = new Set();

    for (const w of item.widths) {
      let img = sharp(buf, { failOn: 'none' }).rotate();

      if (item.extract) img = img.extract(item.extract);

      if (item.cover) {
        const ratio = item.cover.w / item.cover.h;
        img = img.resize({
          width: w,
          height: Math.round(w / ratio),
          fit: 'cover',
          position: positionMap[item.cover.position] || 'centre',
        });
      } else {
        img = img.resize({ width: w, withoutEnlargement: true });
      }

      const { data, info } = await img
        .webp({ quality: 74, effort: 5 })
        .toBuffer({ resolveWithObject: true });

      // Name the file by the ACTUAL output width so it always matches the manifest.
      if (seenWidths.has(info.width)) continue;
      seenWidths.add(info.width);

      const outName = `${item.out}-${info.width}.webp`;
      await writeFile(path.join(OUT, outName), data);
      renditions.push({ src: outName, w: info.width, h: info.height });
      console.log(`  ✓ ${outName}  ${info.width}x${info.height}  ${(data.length / 1024).toFixed(0)}KB`);
    }

    const largest = renditions[renditions.length - 1];
    manifestOut[item.out] = {
      widths: renditions.map((r) => r.w),
      aspect: `${largest.w} / ${largest.h}`,
      w: largest.w,
      h: largest.h,
    };
  }

  await writeFile(
    path.join(OUT, 'manifest.json'),
    JSON.stringify(manifestOut, null, 2) + '\n',
  );
  console.log('  ✓ manifest.json');

  await buildFavicons();
  await buildOgImage();

  console.log('\nDone.');
}

async function buildFavicons() {
  const logo = path.join(SRC, 'logo-spit.png');
  if (!existsSync(logo)) {
    console.warn('  ! logo-spit.png missing — favicons not rebuilt');
    return;
  }
  for (const size of [32, 180, 192, 512]) {
    const pad = Math.round(size * 0.16);
    const mark = await sharp(await readFile(logo))
      .resize({ width: size - pad * 2, height: size - pad * 2, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    const name = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`;
    await sharp({
      create: { width: size, height: size, channels: 4, background: DEEP },
    })
      .composite([{ input: mark, gravity: 'centre' }])
      .png()
      .toFile(path.join(PUB, name));
    console.log(`  ✓ ${name}`);
  }
}

async function buildOgImage() {
  const wrap = path.join(SRC, 'chicken-gyros-wrap.jpg');
  const logo = path.join(SRC, 'logo-spit.png');
  const W = 1200;
  const H = 630;

  const base = sharp({
    create: { width: W, height: H, channels: 4, background: DEEP },
  });

  const layers = [];

  if (existsSync(wrap)) {
    const photo = await sharp(await readFile(wrap))
      .resize({ width: 560, height: H, fit: 'cover', position: 'centre' })
      .toBuffer();
    layers.push({ input: photo, left: W - 560, top: 0 });
    // navy feather over the seam
    const feather = Buffer.from(
      `<svg width="200" height="${H}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${DEEP}"/><stop offset="1" stop-color="${DEEP}" stop-opacity="0"/></linearGradient></defs><rect width="200" height="${H}" fill="url(#g)"/></svg>`,
    );
    layers.push({ input: feather, left: W - 560, top: 0 });
  }

  if (existsSync(logo)) {
    const mark = await sharp(await readFile(logo)).resize({ height: 96 }).toBuffer();
    layers.push({ input: mark, left: 80, top: 74 });
  }

  const text = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title { fill:#FFFDF7; font-family:'Segoe UI',Arial,sans-serif; font-weight:800; font-size:74px; }
        .sub { fill:#F7EEDB; font-family:'Segoe UI',Arial,sans-serif; font-weight:500; font-size:30px; }
        .url { fill:#7FB2E5; font-family:'Segoe UI',Arial,sans-serif; font-weight:600; font-size:22px; letter-spacing:2px; }
      </style>
      <text x="80" y="270" class="title">Tasty Gyros</text>
      <text x="80" y="330" class="title">London</text>
      <text x="80" y="400" class="sub">Authentic Greek street food in</text>
      <text x="80" y="440" class="sub">Enfield Town &amp; Notting Hill Gate</text>
      <text x="80" y="545" class="url">TASTYGYROS.CO.UK</text>
    </svg>`,
  );
  layers.push({ input: text, left: 0, top: 0 });

  await base.composite(layers).jpeg({ quality: 82 }).toFile(path.join(PUB, 'og-image.jpg'));
  console.log('  ✓ og-image.jpg');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
