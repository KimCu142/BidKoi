import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis'
  },
  build: {
    outDir: 'dist', // Thư mục đầu ra sau khi build
  }
})
