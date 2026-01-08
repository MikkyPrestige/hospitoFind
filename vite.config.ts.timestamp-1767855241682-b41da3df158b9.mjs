// vite.config.ts
import { defineConfig } from "file:///C:/Users/Mikky/OneDrive/Desktop/AltSchool/capstone-project/hospitoFind-client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Mikky/OneDrive/Desktop/AltSchool/capstone-project/hospitoFind-client/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import viteImagemin from "file:///C:/Users/Mikky/OneDrive/Desktop/AltSchool/capstone-project/hospitoFind-client/node_modules/vite-plugin-imagemin/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\Mikky\\OneDrive\\Desktop\\AltSchool\\capstone-project\\hospitoFind-client";
var vite_config_default = defineConfig({
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
        api: "modern-compiler",
        silenceDeprecations: ["legacy-js-api"],
        additionalData: `@use "src/assets/styles/mixins" as *;
`
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNaWtreVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXEFsdFNjaG9vbFxcXFxjYXBzdG9uZS1wcm9qZWN0XFxcXGhvc3BpdG9GaW5kLWNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTWlra3lcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxBbHRTY2hvb2xcXFxcY2Fwc3RvbmUtcHJvamVjdFxcXFxob3NwaXRvRmluZC1jbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL01pa2t5L09uZURyaXZlL0Rlc2t0b3AvQWx0U2Nob29sL2NhcHN0b25lLXByb2plY3QvaG9zcGl0b0ZpbmQtY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgdml0ZUltYWdlbWluIGZyb20gJ3ZpdGUtcGx1Z2luLWltYWdlbWluJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgIHZpdGVJbWFnZW1pbih7XHJcbiAgZ2lmc2ljbGU6IHsgb3B0aW1pemF0aW9uTGV2ZWw6IDcgfSxcclxuICBvcHRpcG5nOiB7IG9wdGltaXphdGlvbkxldmVsOiA3IH0sXHJcbiAgbW96anBlZzogeyBxdWFsaXR5OiA4MCB9LFxyXG4gICB3ZWJwOiB7IHF1YWxpdHk6IDgwIH1cclxuIH0pXHJcbiAgXSxcclxuICAgY3NzOiB7XHJcbiAgICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcclxuICAgICAgICAgIHNpbGVuY2VEZXByZWNhdGlvbnM6IFsnbGVnYWN5LWpzLWFwaSddLFxyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAdXNlIFwic3JjL2Fzc2V0cy9zdHlsZXMvbWl4aW5zXCIgYXMgKjtcXG5gXHJcbiAgICAgICAgIH19XHJcbiAgICAgICAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgc291cmNlbWFwOiB0cnVlXHJcbiB9LFxyXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBeWEsU0FBUyxvQkFBb0I7QUFDdGMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGtCQUFrQjtBQUh6QixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTCxhQUFhO0FBQUEsTUFDaEIsVUFBVSxFQUFFLG1CQUFtQixFQUFFO0FBQUEsTUFDakMsU0FBUyxFQUFFLG1CQUFtQixFQUFFO0FBQUEsTUFDaEMsU0FBUyxFQUFFLFNBQVMsR0FBRztBQUFBLE1BQ3RCLE1BQU0sRUFBRSxTQUFTLEdBQUc7QUFBQSxJQUN0QixDQUFDO0FBQUEsRUFDQTtBQUFBLEVBQ0MsS0FBSztBQUFBLElBQ0QscUJBQXFCO0FBQUEsTUFDcEIsTUFBTTtBQUFBLFFBQ0osS0FBSztBQUFBLFFBQ0wscUJBQXFCLENBQUMsZUFBZTtBQUFBLFFBQ3JDLGdCQUFnQjtBQUFBO0FBQUEsTUFDakI7QUFBQSxJQUFDO0FBQUEsRUFDRjtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ1AsV0FBVztBQUFBLEVBQ1o7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
