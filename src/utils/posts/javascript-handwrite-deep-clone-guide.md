---
id: 99
title: "手写深拷贝进阶：循环引用、特殊对象与性能权衡"
slug: "javascript-handwrite-deep-clone-guide"
author: "ssuperjee"
date: "2024-05-15"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "深拷贝"
  - "进阶"
excerpt: "深拷贝不仅是递归对象，本文系统处理 Map/Set/Date/RegExp、循环引用和函数引用边界。"
readTime: "10 分钟"
published: true
---

## 为什么 `JSON.parse(JSON.stringify())` 不够

它会丢失：

- `Date`、`RegExp`、`Map`、`Set`
- `undefined`、`Symbol`、函数
- 循环引用结构（直接报错）

## 实现思路

- 基础类型直接返回
- 复杂对象按构造类型分支处理
- 用 `WeakMap` 记录已拷贝对象，解决循环引用

## 关键边界

- 函数通常保留引用而不是“克隆函数体”
- 原型链是否保留取决于业务目标
- 超大对象深拷贝可能产生明显性能成本

## 实战建议

- 状态管理场景优先不可变更新而非全量深拷贝
- 深拷贝只用于“隔离副作用”必要路径
- 对性能敏感场景做基准测试再选策略

## 代码示例

```js
function deepClone(input, wm = new WeakMap()) {
  if (input === null || typeof input !== 'object') return input
  if (wm.has(input)) return wm.get(input)

  const out = Array.isArray(input) ? [] : {}
  wm.set(input, out)

  Reflect.ownKeys(input).forEach((key) => {
    out[key] = deepClone(input[key], wm)
  })
  return out
}
```

## 总结

深拷贝不是 API 题，而是“数据模型 + 语义边界 + 性能”的平衡题。