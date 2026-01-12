import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Qtickets API requests during development
      '/qtickets-api': {
        target: 'https://qtickets.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/qtickets-api/, '/api/rest/v1'),
        headers: {
          'Authorization': 'Bearer b2XdRH8Uxj1vCFb7lKKQZHTLWlCUNCZ1',
        },
      },
    },
  },
})
