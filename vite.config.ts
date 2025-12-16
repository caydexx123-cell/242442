import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env.API_KEY': JSON.stringify("AIzaSyBsJ1uNr_InFO8bE74UiPXVhbtOW-k8X_0")
  }
});