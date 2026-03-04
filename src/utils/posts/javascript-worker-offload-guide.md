---
id: 91
title: "JavaScript Web Worker 实战：把重计算移出主线程"
slug: "javascript-worker-offload-guide"
author: "ssuperjee"
date: "2024-07-07"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "Web Worker"
  - "性能优化"
  - "浏览器"
excerpt: "介绍如何用 Web Worker 处理重计算任务，降低主线程阻塞，提升页面交互流畅度。"
readTime: "9 分钟"
published: true
---

## 什么时候该上 Worker

- 大量数据排序、过滤、聚合
- 文本解析与格式转换
- 图像处理与压缩

主线程负责交互，Worker 负责计算，职责分离后体验明显改善。

## 基础通信模型

主线程和 Worker 通过 `postMessage` 通信，数据是结构化拷贝。

```js
// main
const worker = new Worker(new URL('./heavy.worker.js', import.meta.url))
worker.postMessage({ type: 'calc', payload: bigData })
worker.onmessage = (e) => render(e.data)
```

## 常见坑

- 传超大对象导致拷贝开销很高
- Worker 生命周期未管理，页面切换后仍在跑
- 错误处理缺失，任务失败无反馈

## 结论

Worker 不是“银弹”，但在重 CPU 场景是最有效的卡顿治理手段之一。