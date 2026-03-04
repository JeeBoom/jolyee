---
id: 104
title: "手写并发调度器：限制并发与任务队列管理"
slug: "javascript-handwrite-concurrency-scheduler-guide"
author: "ssuperjee"
date: "2025-03-20"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "并发控制"
  - "调度器"
excerpt: "实现一个可用的并发调度器，支持并发上限、任务排队、失败隔离与完成回调。"
readTime: "10 分钟"
published: true
---

## 背景

批量请求、批量文件处理时，如果不限制并发，很容易触发超时或后端限流。

## 调度器核心

- 维护等待队列
- 维护运行中任务数
- 有空位就拉起新任务
- 任务完成后继续消费队列

## 进阶能力

- 支持任务优先级
- 支持取消排队任务
- 失败任务可配置重试

## 实战收益

- 服务更稳定
- 前端错误率下降
- 用户感知更平滑

## 代码示例

```js
function createScheduler(limit = 2) {
  let running = 0
  const queue = []

  const run = () => {
    while (running < limit && queue.length) {
      const { task, resolve, reject } = queue.shift()
      running++
      Promise.resolve()
        .then(task)
        .then(resolve, reject)
        .finally(() => {
          running--
          run()
        })
    }
  }

  return (task) => new Promise((resolve, reject) => {
    queue.push({ task, resolve, reject })
    run()
  })
}
```

## 总结

并发调度器是高并发前端场景的基础设施，值得沉淀为通用工具。