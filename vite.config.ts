import { defineConfig } from 'vite';

export default defineConfig({
  base: '/azeroth/', // Update this to match your GitHub repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
}); 