---
id: 63
title: "Vue3 watch 调度机制与清理策略详解"
slug: "vue3-watch-scheduler-cleanup-guide"
author: "ssuperjee"
date: "2024-06-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "watch"
  - "调度"
  - "进阶"
excerpt: "深入讲解 watch/watchEffect 的执行时机、flush 选项、竞态清理和异步副作用管理。"
readTime: "10 分钟"
published: true
---

## watch 为什么经常出问题

因为它本质是“副作用调度器”，不是简单回调。时机错一点，就会出现闪烁、旧数据覆盖、新旧状态混乱。

## 三个关键选项

- `flush: 'pre'`：组件更新前执行（默认）
- `flush: 'post'`：DOM 更新后执行，适合读取真实 DOM
- `flush: 'sync'`：同步执行，慎用，可能放大触发频率

## 异步竞态的标准写法

```ts
import { watch, ref } from 'vue'

const keyword = ref('')
const result = ref<any[]>([])

watch(keyword, async (value, _, onCleanup) => {
  let cancelled = false
  onCleanup(() => {
    cancelled = true
  })

  const data = await fetch(`/api/search?q=${encodeURIComponent(value)}`).then(r => r.json())
  if (!cancelled) result.value = data
})
```

`onCleanup` 是解决旧请求覆盖新结果的核心。

## watchEffect 何时用

- 依赖很多且动态变化：`watchEffect` 更省心
- 依赖明确且需精细控制：`watch` 更稳

## 业务建议

- 输入联想、远程校验等场景一律加防抖
- 同一数据不要同时被多个 watch 写回
- 复杂场景优先抽成 composable，避免页面 watch 泛滥

## 总结

watch 的重点不是“监听到了”，而是“在正确时机、以可取消方式执行副作用”。