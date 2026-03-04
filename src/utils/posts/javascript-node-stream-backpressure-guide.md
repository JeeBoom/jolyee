---
id: 90
title: "JavaScript/Node Stream 背压机制实战"
slug: "javascript-node-stream-backpressure-guide"
author: "ssuperjee"
date: "2024-05-09"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "Node.js"
  - "Stream"
  - "性能"
excerpt: "讲解 Node Stream 的背压机制，为什么 write 返回 false、何时等待 drain，以及如何避免内存暴涨。"
readTime: "10 分钟"
published: true
---

## 现象

文件处理中吞吐不稳定，内存不断上涨，最终进程被系统杀掉。

## 核心原因

生产速度大于消费速度，但上游还在持续写入，导致缓冲区膨胀。

## 关键机制

- `writable.write(chunk)` 返回 `false`：说明缓冲区接近阈值
- 需要等待 `drain` 事件再继续写

```js
if (!writable.write(chunk)) {
  await new Promise((resolve) => writable.once('drain', resolve))
}
```

## 实战建议

- 尽量用 `pipeline` 管道化处理，减少手写出错
- 监控处理速率和内存占用
- 大文件场景分块处理，不要整文件读入

## 总结

Stream 优化的核心不是“快写”，而是“稳写”：保证上下游节奏一致。