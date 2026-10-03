import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    assetsDir: '',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: 'dev.html',
      output: {
        assetFileNames: asset => asset.names?.some(n => n.endsWith('.css')) ? 'style.css' : '[name][extname]',
        entryFileNames: 'app.js',
        chunkFileNames: '[name]-bundle.js'
      }
    }
  }
});
