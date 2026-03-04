---
id: 73
title: "Vue3 路由级数据预取与导航中断详解"
slug: "vue3-router-data-prefetch-guide"
author: "ssuperjee"
date: "2024-05-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "Vue Router"
  - "数据预取"
  - "进阶"
excerpt: "深入讲解路由切换前的数据预取、取消请求和错误兜底，提升页面切换体验与一致性。"
readTime: "9 分钟"
published: true
---

## 为什么要做路由级预取

页面进入后再请求，用户会先看到空壳。预取能把“等待”前置，降低感知延迟。

## 典型做法

- 在路由守卫或页面 setup 中触发预取
- 配合 loading 状态展示过渡
- 导航中断时取消旧请求

## 关键难点

- 用户快速切页造成请求竞态
- 预取失败后的回退策略
- 多接口并发时的局部可用性

## 建议

- 关键数据 `await`，非关键数据 `allSettled`
- 为每次导航生成 request token
- 切换路由时统一 cancel 旧请求

## 总结

预取不是“提前请求”这么简单，重点是让请求和导航生命周期保持一致。