---
id: 96
title: "JavaScript 内存快照排查指南：从怀疑到定位"
slug: "javascript-memory-snapshot-debug-guide"
author: "ssuperjee"
date: "2025-05-18"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "内存泄漏"
  - "调试"
  - "Chrome DevTools"
excerpt: "介绍使用内存快照定位泄漏的实战流程：基线快照、对比快照、保留路径分析与修复验证。"
readTime: "9 分钟"
published: true
---

## 排查流程

1. 进入目标页面并执行固定操作
2. 拍基线快照
3. 重复操作后拍第二张快照
4. 对比增长对象与 Retainers 路径

## 常见泄漏来源

- 未解绑事件监听
- 定时器未清理
- 全局缓存无上限
- 闭包意外持有 DOM

## 修复后验证

修完不要只看“体感更快”，要重复同样脚本再次对比快照，确认对象可回收。

## 代码示例

```js
// 排查时可先构造“可控泄漏”样本对照
const leaks = []

function createLeak() {
  const big = new Array(10000).fill({ x: 'memory' })
  leaks.push(() => big.length)
}

function clearLeak() {
  leaks.length = 0
}
```

## 总结

内存排查是证据驱动，不要靠猜。快照对比 + 引用链分析是最稳路径。