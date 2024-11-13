import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis'
  },
  build: {
    outDir: 'build', // Đổi từ 'dist' thành 'build' để phù hợp với Vercel
  }
})
