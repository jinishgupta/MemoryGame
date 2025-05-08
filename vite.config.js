import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ghPagesPlugin from './src/vite-plugin-gh-pages'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ghPagesPlugin()
  ],
  base: '/MemoryGame/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
})
