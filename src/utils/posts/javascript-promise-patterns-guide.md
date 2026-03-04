---
id: 83
title: "JavaScript Promise 进阶模式：并发控制、超时取消与错误分层"
slug: "javascript-promise-patterns-guide"
author: "ssuperjee"
date: "2024-06-12"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "Promise"
  - "并发控制"
  - "进阶"
excerpt: "围绕真实接口场景讲 Promise 进阶用法：并发池、超时封装、失败重试和错误分层处理。"
readTime: "10 分钟"
published: true
---

## 为什么只会 `Promise.all` 不够

业务里常见需求是：

- 限制并发，防止打爆后端
- 请求超时自动失败
- 部分失败可容忍，整体不中断

这些都需要在 Promise 之上做策略层。

## 并发池思路

一次只跑 N 个任务，前一个完成后补下一个。

```js
async function runPool(tasks, limit = 3) {
  const ret = []
  const executing = []

  for (const task of tasks) {
    const p = Promise.resolve().then(task)
    ret.push(p)

    if (limit <= tasks.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= limit) {
        await Promise.race(executing)
      }
    }
  }

  return Promise.allSettled(ret)
}
```

## 超时封装

用 `Promise.race` 把业务请求和超时 Promise 竞争。

## 错误分层

建议区分：

- 网络层错误（超时、断网）
- 协议层错误（HTTP 状态码）
- 业务层错误（code 非 0）

这样埋点和告警才有价值。

## 总结

Promise 的进阶不是语法技巧，而是**异步策略设计**：如何在不稳定网络里保证体验和可观测性。