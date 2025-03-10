import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip certain warnings
        if (warning.code === 'THIS_IS_UNDEFINED') return
        if (warning.code === 'CIRCULAR_DEPENDENCY') return
        
        // Use default for everything else
        warn(warning)
      }
    }
  },
  logLevel: 'error', // Only show errors, not warnings
})
