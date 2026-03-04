---
id: 109
title: "手写 Array.prototype.reduce：聚合模型与边界处理"
slug: "javascript-handwrite-reduce-guide"
author: "ssuperjee"
date: "2024-10-03"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "reduce"
  - "数组"
excerpt: "从规范语义出发手写 reduce，并解释初始值、省略空洞项和 thisArg 等常见细节。"
readTime: "9 分钟"
published: true
---

## reduce 的价值

reduce 是“把序列折叠成一个结果”的统一抽象，统计、分组、扁平化都能表达。

## 手写关键点

- 处理 `initialValue` 是否传入
- 跳过稀疏数组空洞
- 回调参数顺序 `(acc, cur, index, array)`

## 典型实现思路

1. 校验 this 和回调类型
2. 确定起始累加值和起始索引
3. 迭代并更新累加器

## 常见坑

- 空数组且无初始值应抛错
- 误把 forEach 当 reduce 用，返回值丢失

## 代码示例

```js
Array.prototype.myReduce = function (cb, initialValue) {
  const arr = this
  let i = 0
  let acc = initialValue

  if (acc === undefined) {
    while (i < arr.length && !(i in arr)) i++
    if (i >= arr.length) throw new TypeError('Reduce of empty array')
    acc = arr[i++]
  }

  for (; i < arr.length; i++) {
    if (!(i in arr)) continue
    acc = cb(acc, arr[i], i, arr)
  }
  return acc
}
```

## 总结

理解 reduce 后，很多“多步循环”都能抽象成可复用的数据变换管道。