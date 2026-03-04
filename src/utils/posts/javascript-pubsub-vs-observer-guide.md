---
id: 111
title: "发布订阅 vs 观察者模式：JavaScript 场景化落地"
slug: "javascript-pubsub-vs-observer-guide"
author: "ssuperjee"
date: "2025-02-12"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "设计模式"
  - "发布订阅"
  - "观察者"
excerpt: "通过代码对比发布订阅与观察者模式的依赖关系和适用场景，避免概念混用。"
readTime: "9 分钟"
published: true
---

## 最常见误解

很多资料把发布订阅和观察者当同一件事，实际它们的耦合关系不同。

## 核心区别

- 观察者：被观察对象直接维护观察者列表（耦合更强）
- 发布订阅：通过事件中心中转（发布者和订阅者解耦）

## 选型建议

- 单对象状态变更通知：观察者足够
- 跨模块事件通信：发布订阅更合适

## 实战提醒

- 事件名规范化，避免冲突
- 订阅方生命周期结束必须退订
- 高并发事件要配合节流

## 代码示例

```js
class EventBus {
  constructor() { this.map = new Map() }
  on(type, fn) {
    if (!this.map.has(type)) this.map.set(type, new Set())
    this.map.get(type).add(fn)
  }
  emit(type, payload) {
    this.map.get(type)?.forEach((fn) => fn(payload))
  }
  off(type, fn) {
    this.map.get(type)?.delete(fn)
  }
}
```

## 总结

模式没有高低，关键看依赖方向是否符合你的系统边界。