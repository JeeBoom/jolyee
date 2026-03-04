---
id: 103
title: "手写 LRU 缓存：Map + 双向链表实现详解"
slug: "javascript-handwrite-lru-cache-guide"
author: "ssuperjee"
date: "2025-01-10"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "LRU"
  - "数据结构"
excerpt: "从淘汰策略出发实现一个 O(1) 的 LRU Cache，并讨论前端缓存场景中的实际应用。"
readTime: "10 分钟"
published: true
---

## 为什么是 LRU

在固定容量下，优先淘汰“最近最少使用”数据，适合高频读、有限内存场景。

## 结构选择

- `Map`：O(1) 查找 key
- 双向链表：O(1) 移动节点到头部、淘汰尾部

## 核心操作

- `get(key)`：命中后节点移到头部
- `put(key, value)`：新增或更新，超容时淘汰尾节点

## 前端场景

- 接口短期缓存
- 图片元信息缓存
- 复杂计算结果缓存

## 代码示例

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.map = new Map()
  }
  get(key) {
    if (!this.map.has(key)) return -1
    const val = this.map.get(key)
    this.map.delete(key)
    this.map.set(key, val)
    return val
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key)
    this.map.set(key, value)
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value
      this.map.delete(oldest)
    }
  }
}
```

## 总结

手写 LRU 的关键不在语法，而在“数据结构协同”与复杂度控制。