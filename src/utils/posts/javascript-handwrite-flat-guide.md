---
id: 110
title: "手写数组扁平化 flat：递归、栈模拟与性能比较"
slug: "javascript-handwrite-flat-guide"
author: "ssuperjee"
date: "2024-12-14"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "flat"
  - "数组"
excerpt: "对比递归与显式栈两种 flat 实现，讨论深层嵌套、深度参数和性能稳定性。"
readTime: "9 分钟"
published: true
---

## 问题定义

把嵌套数组按指定深度展开，`depth = Infinity` 时完全扁平。

## 递归实现优点与风险

优点是直观；风险是极深数组可能触发调用栈限制。

## 栈模拟实现

使用显式栈保存待处理项，可避免深递归风险，更适合极端输入。

## 关键边界

- 非数组元素保持原样
- 稀疏数组空位行为与原生保持一致需额外处理
- depth 为 0 时应返回浅拷贝

## 代码示例

```js
function myFlat(arr, depth = 1) {
  if (depth <= 0) return arr.slice()
  const ret = []
  for (const item of arr) {
    if (Array.isArray(item)) {
      ret.push(...myFlat(item, depth - 1))
    } else {
      ret.push(item)
    }
  }
  return ret
}
```

## 总结

手写 flat 的意义在于理解“深度控制 + 遍历策略”如何影响可用性和性能。