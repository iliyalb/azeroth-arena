import { defineConfig } from 'vite';

export default defineConfig({
  base: '/azeroth-arena/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
}); 