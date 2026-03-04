---
id: 112
title: "手写任务队列调度器：重试、优先级与可取消"
slug: "javascript-task-queue-scheduler-guide"
author: "ssuperjee"
date: "2025-04-17"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "任务队列"
  - "调度"
  - "工程化"
excerpt: "实现一个更接近生产可用的任务调度器，支持优先级、失败重试、取消和状态追踪。"
readTime: "10 分钟"
published: true
---

## 为什么要单独做调度层

当任务量上来后，简单 `Promise.all` 不够：你需要可控执行顺序和失败策略。

## 功能目标

- 优先级队列
- 最大并发数
- 可取消任务
- 可配置重试（指数退避）

## 设计要点

- 任务状态机：`queued/running/success/failed/cancelled`
- 调度循环与执行器解耦
- 错误分层，重试只针对可恢复错误

## 适用场景

- 批量上传
- 批量拉取
- 后台异步作业前端编排

## 代码示例

```js
class TaskScheduler {
  constructor(limit = 3) {
    this.limit = limit
    this.running = 0
    this.queue = []
  }

  add(task, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, priority, resolve, reject })
      this.queue.sort((a, b) => b.priority - a.priority)
      this.run()
    })
  }

  run() {
    while (this.running < this.limit && this.queue.length) {
      const item = this.queue.shift()
      this.running++
      Promise.resolve()
        .then(item.task)
        .then(item.resolve, item.reject)
        .finally(() => {
          this.running--
          this.run()
        })
    }
  }
}
```

## 总结

任务队列是“把异步行为工程化”的关键基建。