import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

   optimizeDeps: {
    include: ['jwt-decode'],  // Forzamos a Vite a preprocesar jwt-decode
  },
})
