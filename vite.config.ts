import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteImagemin from 'vite-plugin-imagemin'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
       registerType: 'autoUpdate',
       workbox: {
         globPatterns: ['**/*.{js,css,ico,png,svg,webp,jpg,jpeg,gif,woff2}'],
         runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
             urlPattern: /^https:\/\/hospitofind-server\.onrender\.com\/api\/.*/i,
             handler: 'NetworkFirst',
             options: {
               cacheName: 'api-cache',
               expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
               networkTimeoutSeconds: 10,
               cacheableResponse: { statuses: [0, 200] },
             },
           },
         {
          urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif|ico)(\?.*)?$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'image-cache',
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] },
            fetchOptions: { mode: 'no-cors' },
        },
      },
         ],
       },
       manifest: {
         name: 'HospitoFind',
         short_name: 'HospitoFind',
         description: 'AI‑powered hospital discovery platform',
         theme_color: '#08299b',
         background_color: '#ffffff',
         display: 'standalone',
         icons: [
           { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
           { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
         ],
       },
     }),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      webp: { quality: 80 }
    })
  ],
  preview: {
    port: 5173,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${path.resolve(__dirname, 'src/assets/styles/mixins').replace(/\\/g, '/')}" as *;\n`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true
  },
});
