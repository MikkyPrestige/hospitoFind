import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
     viteImagemin({
  gifsicle: { optimizationLevel: 7 },
  optipng: { optimizationLevel: 7 },
  mozjpeg: { quality: 80 },
   webp: { quality: 80 }
 })
  ],
   css: {
       preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
          additionalData: `@use "src/assets/styles/mixins" as *;\n`
         }}
        },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
  sourcemap: true
 },
})