---
id: 116
title: "JavaScript 模块系统对比：CommonJS 与 ESM 深入"
slug: "javascript-module-system-commonjs-esm-guide"
author: "ssuperjee"
date: "2024-06-21"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "模块化"
  - "CommonJS"
  - "ESM"
excerpt: "深入对比 CJS 与 ESM 在加载时机、导出语义和循环依赖处理上的差异，附可运行示例。"
readTime: "9 分钟"
published: true
---

## 关键差异

- CJS：运行时加载，值拷贝语义
- ESM：静态分析，实时绑定语义

## 示例：ESM 实时绑定

```js
// counter.mjs
export let count = 0
export function inc() { count++ }

// app.mjs
import { count, inc } from './counter.mjs'
console.log(count) // 0
inc()
console.log(count) // 1
```

## 循环依赖建议

- 拆分公共依赖模块
- 降低模块初始化副作用
- 避免 import 时立即执行重逻辑

## 总结

理解模块语义差异，能显著降低构建与运行时的“玄学问题”。