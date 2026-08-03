import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // ORG-3: @/ maps to src/ — avoids brittle ../../ chains throughout the codebase
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // GOV-2 (FI-GOV2-A): the compliance read-model is served by the gateway (8082 — its configured
      // server.port; the dashboard read APIs are on 8090), not the dashboard.
      '/api/governance': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
