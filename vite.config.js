import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || (id.includes('react/') && !id.includes('react-leaflet'))) {
              return 'vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
          }
        }
      }
    }
  }
});
