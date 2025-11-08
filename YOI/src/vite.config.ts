import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    dedupe: ['three', '@react-three/fiber', '@react-three/drei']
  },
  
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    esbuildOptions: {
      // Suppress warnings during optimization
      logLevel: 'error'
    }
  },
  
  server: {
    fs: {
      strict: false
    },
    hmr: {
      overlay: false,
      // Reduce HMR activity to prevent Figma devtools spam
      timeout: 30000
    }
  },
  
  build: {
    sourcemap: false,
    // Improve chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
  
  // Suppress build warnings
  logLevel: 'error'
});
