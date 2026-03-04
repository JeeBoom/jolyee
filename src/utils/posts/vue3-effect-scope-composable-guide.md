---
id: 64
title: "Vue3 effectScope 实战：让组合函数真正可控可回收"
slug: "vue3-effect-scope-composable-guide"
author: "ssuperjee"
date: "2024-08-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "effectScope"
  - "Composition API"
  - "进阶"
excerpt: "讲清 effectScope 的价值：批量管理副作用、手动回收资源、避免组合函数隐性泄漏。"
readTime: "9 分钟"
published: true
---

## 背景

组合函数复用很方便，但很多项目会出现“页面卸载了，副作用还在跑”的问题。

## effectScope 的作用

把 `computed/watch/watchEffect` 等副作用收拢到一个作用域，作用域 stop 后统一销毁。

## 示例

```ts
import { effectScope, ref, watch } from 'vue'

export function usePolling() {
  const scope = effectScope()
  const enabled = ref(false)

  scope.run(() => {
    watch(enabled, (v) => {
      if (v) {
        // start polling
      }
    })
  })

  return {
    enabled,
    dispose: () => scope.stop(),
  }
}
```

## 适合场景

- 可开关的功能模块（轮询、订阅、临时缓存）
- 页面外复用逻辑（不完全依赖组件生命周期）
- 需要“显式销毁”的高级 composable

## 常见坑

- 只在页面卸载时回收，不支持中途关闭
- 多实例 composable 没有独立作用域
- 副作用分散创建，无法统一 stop

## 总结

`effectScope` 是组合函数工程化的重要能力：让副作用可见、可控、可释放。