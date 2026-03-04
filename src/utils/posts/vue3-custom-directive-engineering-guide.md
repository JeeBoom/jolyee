---
id: 70
title: "Vue3 自定义指令工程化实践"
slug: "vue3-custom-directive-engineering-guide"
author: "ssuperjee"
date: "2025-04-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "自定义指令"
  - "工程化"
  - "进阶"
excerpt: "深入讲解自定义指令在权限、埋点、拖拽等场景中的实现模式和生命周期管理。"
readTime: "9 分钟"
published: true
---

## 指令适合做什么

当逻辑直接依赖 DOM 行为（焦点、可见性、权限按钮移除等），指令比组件封装更自然。

## 生命周期钩子

- `mounted`：初始化 DOM 行为
- `updated`：响应绑定值变化
- `unmounted`：清理事件与观察器

## 示例：点击外部关闭

```ts
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    const handler = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value?.()
    }
    ;(el as any).__out__ = handler
    document.addEventListener('click', handler)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', (el as any).__out__)
  },
}
```

## 常见坑

- 事件监听忘记解绑
- 指令职责过重，夹杂业务流程
- SSR 环境直接访问 document/window

## 总结

指令要保持“轻且专注”，处理 DOM 细节，不承载复杂业务。