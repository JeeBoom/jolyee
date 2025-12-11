import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    publicDir: 'public',
    // 性能优化配置
    rollupOptions: {
      output: {
        // 手动分包，将大的依赖单独打包
        manualChunks: {
          'vue-vendor': ['vue'],
          'components': [
            './src/components/Communities.vue',
            './src/components/IT.vue',
            './src/components/AI.vue'
          ]
        }
      }
    },
    // 启用 gzip 压缩提示
    reportCompressedSize: true,
    // chunk 大小警告的限制（kb）
    chunkSizeWarningLimit: 1000,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 使用 esbuild 压缩（更快，无需额外依赖）
    minify: 'esbuild'
  }
})
