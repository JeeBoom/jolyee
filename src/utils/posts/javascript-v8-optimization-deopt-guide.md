---
id: 117
title: "JavaScript V8 优化与反优化（deopt）实战"
slug: "javascript-v8-optimization-deopt-guide"
author: "ssuperjee"
date: "2024-09-09"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "V8"
  - "性能"
  - "进阶"
excerpt: "介绍 V8 优化常见路径与反优化触发点，帮助你写出更稳定可预测的高性能 JS 代码。"
readTime: "10 分钟"
published: true
---

## 为什么同样代码有时快有时慢

JIT 编译器会根据运行时类型和调用模式做优化，一旦假设被打破就会反优化。

## 易触发 deopt 的写法

- 对象 shape 频繁变化
- 同一函数参数类型漂移过大
- 热路径混入 try/catch 和复杂分支

## 示例

```js
function sum(arr) {
  let total = 0
  for (let i = 0; i < arr.length; i++) {
    total += arr[i]
  }
  return total
}

// 尽量保持同构数组（全 number）
console.log(sum([1, 2, 3]))
```

## 总结

性能优化不只是算法复杂度，运行时优化稳定性同样关键。