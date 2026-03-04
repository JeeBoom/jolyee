---
id: 98
title: "手写 Promise/A+ 核心实现：状态机与 then 链式解析"
slug: "javascript-handwrite-promise-a-plus-guide"
author: "ssuperjee"
date: "2024-03-08"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "Promise"
  - "进阶"
excerpt: "从 Promise/A+ 规范出发，拆解状态流转、then 返回值解析、微任务调度与错误穿透。"
readTime: "11 分钟"
published: true
---

## 先明确目标

手写 Promise 不是为了替代原生，而是为了吃透三个核心问题：

- 状态为什么只能单向变化
- then 为什么可以链式调用
- 返回 Promise/thenable 时为什么要“递归解析”

## 最小状态机

Promise 只有三种状态：

- `pending`
- `fulfilled`
- `rejected`

且 `pending -> fulfilled/rejected` 后不可逆。

## then 链式关键

`then` 必须返回一个新 Promise（记为 `promise2`），并根据回调返回值 `x` 执行解析流程：

- `x` 是普通值：直接 resolve
- `x` 是 Promise/thenable：递归“吸收”其最终状态
- 回调抛错：reject

## 高频坑点

- 忘记异步调度回调（规范要求 then 回调异步执行）
- 同一个 thenable 多次 resolve/reject 未做防重
- 循环引用未检测（`promise2 === x`）

## 代码示例

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.fulfilled = []
    this.rejected = []
    const resolve = (v) => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'
      this.value = v
      queueMicrotask(() => this.fulfilled.forEach((fn) => fn(v)))
    }
    const reject = (e) => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.value = e
      queueMicrotask(() => this.rejected.forEach((fn) => fn(e)))
    }
    try { executor(resolve, reject) } catch (e) { reject(e) }
  }
}
```

## 学习收获

写完后你会更清楚 `async/await` 背后的 Promise 链式本质，也更容易排查复杂异步 bug。