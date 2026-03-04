---
id: 100
title: "手写 EventBus：发布订阅模型与内存安全"
slug: "javascript-handwrite-event-bus-guide"
author: "ssuperjee"
date: "2024-07-02"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "发布订阅"
  - "架构"
excerpt: "从零实现一个可用 EventBus，并重点讨论 once、off、异常隔离与监听泄漏治理。"
readTime: "9 分钟"
published: true
---

## 最小能力清单

一个可用 EventBus 至少要支持：

- `on(event, handler)`
- `emit(event, payload)`
- `off(event, handler)`
- `once(event, handler)`

## 数据结构

通常使用 `Map<string, Set<Function>>` 管理事件与监听器集合。

## 常见问题

- 监听器不释放导致内存泄漏
- 事件回调抛错影响其它订阅者
- 同名事件过多导致调用链难追踪

## 工程改进

- `emit` 内对每个 handler 做 try/catch
- 提供调试模式输出事件调用日志
- 对高频事件增加节流层

## 代码示例

```js
class Bus {
  constructor() { this.events = new Map() }
  on(type, fn) {
    if (!this.events.has(type)) this.events.set(type, new Set())
    this.events.get(type).add(fn)
  }
  once(type, fn) {
    const wrap = (payload) => {
      fn(payload)
      this.off(type, wrap)
    }
    this.on(type, wrap)
  }
  off(type, fn) { this.events.get(type)?.delete(fn) }
  emit(type, payload) { this.events.get(type)?.forEach((fn) => fn(payload)) }
}
```

## 总结

EventBus 适合解耦，但不能滥用；跨模块通信建议配合明确事件命名规范。