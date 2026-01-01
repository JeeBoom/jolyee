---
id: 16
title: "Vite 常用插件：从开发效率到产物分析"
slug: "vite-top-plugins"
author: "ssuperjee"
date: "2026-01-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vite"
  - "插件"
  - "工程化"
excerpt: "精挑 Vite 项目里最常用、最实用的 10 个插件，涵盖自动按需、SVG、Mock、压缩、分析、PWA 等日常刚需场景。"
readTime: "9 分钟"
published: true
---

## 选型原则

- 高频刚需：常见于实际业务，不是噱头。
- 维护活跃：近半年有更新，下载量高。
- 与 Vue 生态契合：支持 Vue/TS/组件自动导入等。

## 1) unplugin-auto-import

- 自动导入 Vue/Pinia/VueUse 等 API，避免到处写 import。
- 配合 ESLint 需生成 dts 并让 linter 识别。

## 2) unplugin-vue-components

- 组件按需注册，支持 Element Plus、Ant Design Vue、Naive UI 等解析器。
- 减少手工 import，避免全量引入导致体积膨胀。

## 3) @vitejs/plugin-vue / @vitejs/plugin-vue-jsx

- Vue 必备；如需 JSX/TSX 则加入 vue-jsx。
- 记得在 tsconfig/volar 里同步开启 jsx 支持。

## 4) vite-plugin-svg-icons

- 将本地 SVG 生成 symbol sprite，按需注入，避免多次网络请求。
- 常与 Icon 组件封装搭配，提升可维护性。

## 5) vite-plugin-svgr（或 @svgr/core inlined）

- 将 SVG 转 React/Vue 组件（在 Vue 场景多用 svg-sprite，上述 4 足够；跨栈或混合时用 svgr）。

## 6) vite-plugin-mock / mockjs 集成

- 本地/CI 可开 mock server，脱离后端也能联调；支持 prod off。
- 推荐通过 env 开关，避免生产打包携带 mock 代码。

## 7) rollup-plugin-visualizer

- 生成 treemap/sunburst 分析包体，定位大依赖与重复引入。
- 将生成步骤加入 build 后钩子，产出 stats.html 便于回溯。

## 8) vite-plugin-compression

- 构建时生成 gzip/br 预压文件，配合 nginx/静态托管开启按需发送。
- 避免双重压缩：只生成，不在 dev serve。

## 9) @vitejs/plugin-legacy

- 需要兼容旧浏览器（如需 ES5/低版 iOS）时启用，自动注入 polyfill + systemjs。
- 谨慎开启，会增加构建时间与产物体积；按需开启。

## 10) vite-plugin-pwa

- 快速添加 Service Worker、缓存策略与 manifest；支持自动生成图标。
- 适合内容/工具类站点做离线体验；记得处理版本更新提示。

## 11) unplugin-icons（加分项）

- 动态按需加载 icon 集（Iconify），零 HTTP 请求，自动安装子集。

## 使用示例（核心几项）

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    visualizer({ filename: 'dist/stats.html', template: 'treemap' }),
  ],
})
```

## 组合建议

- Vue 项目默认三件套：plugin-vue + auto-import + components。
- 有本地图标就加 svg-icons；做数据看板加 visualizer；需要压缩加 compression。
- 旧设备兼容才加 legacy；离线需求再上 PWA。

把这 10 个常用插件组合起来，能覆盖 80% 的 Vite 实战场景，减少重复配置，同时保持包体与构建可观测。
