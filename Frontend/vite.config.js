import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // We exclude lucide-react because it has 1400+ icons which can slow down 
    // or even crash the dependency pre-bundling in some environments.
    exclude: ['lucide-react'],
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'axios'
    ]
  },
  server: {
    port: 5173,
    strictPort: true,
  }
})
