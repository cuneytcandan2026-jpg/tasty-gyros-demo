import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works on any GitHub Pages path
// (https://<user>.github.io/<repo>/) as well as a custom domain.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 2048,
  },
});
