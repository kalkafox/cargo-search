import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          autocomplete: [
            '@algolia/autocomplete-js',
            '@algolia/autocomplete-theme-classic',
          ],
        },
      },
    },
  },
})
