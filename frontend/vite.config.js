import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// On cPanel the React app is served from public_html/ and the PHP API
// lives at public_html/api/. So /api/* must be relative to the same origin.
// In dev (npm run dev), Vite proxies /api → your local PHP server.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Keep asset filenames stable-ish so old browsers don't cache forever.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
