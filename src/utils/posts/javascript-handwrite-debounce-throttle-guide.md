---
id: 101
title: "手写防抖与节流：从实现到边界行为"
slug: "javascript-handwrite-debounce-throttle-guide"
author: "ssuperjee"
date: "2024-09-05"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "防抖"
  - "节流"
excerpt: "详细拆解 debounce/throttle 的实现差异，并处理 leading/trailing、cancel/flush 等实战需求。"
readTime: "9 分钟"
published: true
---

## 核心区别

- 防抖：事件结束后一段时间才触发（适合输入搜索）
- 节流：固定间隔最多触发一次（适合滚动、拖拽）

## 高阶需求

真实业务里通常需要：

- `leading`：首次立即触发
- `trailing`：结束后补一次
- `cancel`：手动取消
- `flush`：立刻执行待触发任务

## 实战坑点

- this 与参数丢失
- 组件卸载未 cancel
- 定时器漂移导致触发不稳定

## 经验

没有“绝对最优参数”，要按交互预期调节等待时间。

## 代码示例

```js
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

function throttle(fn, wait = 300) {
  let prev = 0
  return function (...args) {
    const now = Date.now()
    if (now - prev >= wait) {
      prev = now
      fn.apply(this, args)
    }
  }
}
```

## 总结

手写防抖/节流的重点不是几十行代码，而是对触发语义的精确定义。