---
id: 108
title: "手写 instanceof：原型链查找机制详解"
slug: "javascript-handwrite-instanceof-guide"
author: "ssuperjee"
date: "2024-08-26"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "instanceof"
  - "原型链"
excerpt: "通过手写 instanceof 理解原型链查找过程，并讨论跨 iframe 与 Symbol.hasInstance 等边界。"
readTime: "9 分钟"
published: true
---

## 核心判断逻辑

`a instanceof B` 本质是看 `B.prototype` 是否出现在 `a` 的原型链上。

## 手写实现

```js
function myInstanceof(obj, Ctor) {
  if (obj == null || (typeof obj !== 'object' && typeof obj !== 'function')) return false
  let proto = Object.getPrototypeOf(obj)
  while (proto) {
    if (proto === Ctor.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
```

## 需要知道的边界

- 基本类型直接返回 false（除装箱对象）
- 跨 iframe 场景原型链不同，可能导致判断异常
- 构造函数可通过 `Symbol.hasInstance` 自定义行为

## 总结

`instanceof` 不看“构造函数名”，只看原型链关系。