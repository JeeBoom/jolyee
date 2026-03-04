---
id: 68
title: "Vue3 keep-alive 缓存策略进阶指南"
slug: "vue3-keepalive-strategy-guide"
author: "ssuperjee"
date: "2025-02-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "keep-alive"
  - "缓存"
  - "进阶"
excerpt: "系统讲解 keep-alive 的 include/exclude/max 策略、激活生命周期和业务失效机制。"
readTime: "9 分钟"
published: true
---

## keep-alive 不是一键提速

缓存能省重建成本，但会增加状态管理复杂度和内存占用。

## 核心能力

- `include/exclude`：按组件名控制缓存范围
- `max`：限制缓存数量，防止无限增长
- `onActivated/onDeactivated`：处理页面恢复与暂停

## 业务常见策略

- 列表页缓存：回到列表保留滚动位置
- 详情页不缓存：保证数据实时
- 关键条件变化时手动失效缓存

## 常见坑

- 组件名不稳定，导致 include 不生效
- 缓存页内定时器/订阅未暂停
- 业务状态变了但缓存页没刷新

## 总结

要先定义“哪些页面值得缓存”，再使用 keep-alive，而不是全量套上。