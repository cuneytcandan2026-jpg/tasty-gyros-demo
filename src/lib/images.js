import manifest from '../assets/images/manifest.json';

// Eagerly collect every generated rendition as a URL keyed by filename.
const files = import.meta.glob('../assets/images/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

const byName = {};
for (const [filePath, url] of Object.entries(files)) {
  byName[filePath.split('/').pop()] = url; // e.g. dish-gyros-bowl-800.webp
}

/**
 * Build responsive <img> props for a manifest entry.
 * @param {string} key   manifest key, e.g. "dish-gyros-bowl"
 * @param {string} sizes the `sizes` attribute
 */
export function img(key, sizes = '100vw') {
  const entry = manifest[key];
  if (!entry) throw new Error(`Unknown image key: ${key}`);

  const available = entry.widths
    .map((w) => ({ w, url: byName[`${key}-${w}.webp`] }))
    .filter((r) => Boolean(r.url));

  if (available.length === 0) {
    throw new Error(`No rendition files found for image key: ${key}`);
  }

  const largest = available[available.length - 1];
  return {
    src: largest.url,
    srcSet: available.map((r) => `${r.url} ${r.w}w`).join(', '),
    sizes,
    width: entry.w,
    height: entry.h,
    style: { aspectRatio: entry.aspect },
  };
}
