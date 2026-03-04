---
id: 62
title: "Vue3 响应式核心详解：track/trigger 到业务性能优化"
slug: "vue3-reactivity-track-trigger-guide"
author: "ssuperjee"
date: "2024-04-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "响应式"
  - "Reactivity"
  - "进阶"
excerpt: "系统梳理 Vue3 响应式底层机制，从 track/trigger 到实际业务中的依赖控制与性能优化。"
readTime: "10 分钟"
published: true
---

## 为什么要理解这一层

Vue3 写起来很顺手，但复杂页面一旦卡顿，最终都要回到“谁在收集依赖、谁在触发更新”这两个问题。

## 核心机制

Vue3 通过 `Proxy` 拦截对象读写：

- 读取时 `track(target, key)`：记录当前副作用函数依赖了哪个字段
- 写入时 `trigger(target, key)`：找到依赖这个字段的副作用并触发

你可以把它理解成一张依赖图：字段变化 -> 精准通知对应副作用。

## 常见误区

### 1) 深层对象无节制响应式化

大对象或深树结构全部响应式化，会带来额外依赖追踪成本。

建议：

- 大结构优先 `shallowRef`
- 第三方实例、静态常量用 `markRaw`
- 只让真正会变化的数据进入响应式系统

### 2) 不必要的“整对象替换”

频繁替换整个对象会触发大量下游更新，尤其是列表和表单场景。

建议局部更新字段，减少无效触发。

## 实战示例

```ts
import { reactive, shallowRef, markRaw } from 'vue'

const state = reactive({
  filter: { keyword: '', status: 'all' },
  list: [] as any[],
})

const bigSchema = shallowRef<any>(null)
const chartInstance = markRaw({})

function updateKeyword(keyword: string) {
  state.filter.keyword = keyword
}
```

这段代码的关键点是：高频变化和低频重对象分开处理。

## 排查卡顿时的检查清单

- 哪个字段变化最频繁
- 这个字段关联了多少 `computed/watch/component render`
- 是否可以把某部分数据改成浅响应式

## 总结

响应式不是“越多越好”，而是“足够且精准”。掌握 `track/trigger` 思维后，性能问题会更容易定位。