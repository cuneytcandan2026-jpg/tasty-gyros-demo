/**
 * Post-build: GitHub Pages needs a 404.html for deep links, and .nojekyll so
 * hashed asset folders are served. Vite already copies public/.nojekyll; this
 * just guarantees both exist.
 */
import { copyFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist');

await copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'));

try {
  await access(path.join(dist, '.nojekyll'), constants.F_OK);
} catch {
  await writeFile(path.join(dist, '.nojekyll'), '');
}

console.log('postbuild: wrote dist/404.html and ensured dist/.nojekyll');
