import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add Node.js polyfills for dfinity packages
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
      globals: {
        Buffer: true,
        process: true
      }
    })
  ],
  cacheDir: './.vite',
  server: {
    host: '0.0.0.0',
    port: 4000,
    strictPort: false,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@dfinity/agent': path.resolve(__dirname, 'node_modules/@dfinity/agent/lib/esm'),
      '@dfinity/identity': path.resolve(__dirname, 'node_modules/@dfinity/identity/lib/esm'),
      '@dfinity/principal': path.resolve(__dirname, 'node_modules/@dfinity/principal/lib/esm'),
      '@dfinity/candid': path.resolve(__dirname, 'node_modules/@dfinity/candid/lib/esm')
    }
  },
  optimizeDeps: {
    include: ['@dfinity/agent', '@dfinity/identity', '@dfinity/principal', '@dfinity/candid']
  }
})
