---
id: 79
title: "Vue3 SSR 与 Hydration 一致性问题详解"
slug: "vue3-ssr-hydration-consistency-guide"
author: "ssuperjee"
date: "2025-05-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "SSR"
  - "Hydration"
  - "进阶"
excerpt: "系统分析 Vue3 SSR 常见 hydration mismatch 根因，并给出可落地的一致性治理方案。"
readTime: "10 分钟"
published: true
---

## 典型报错场景

服务端渲染没问题，但客户端激活时报 mismatch，页面会闪动甚至重渲染。

## 根因分类

- 非确定性数据（随机值、当前时间）
- 客户端专属对象提前访问
- 服务端与客户端数据源不一致

## 解决思路

- 保证首屏数据可复现
- 非确定性逻辑放 `onMounted`
- 时间和格式统一由同一来源提供

## 工程建议

- 建立 SSR 页面清单，逐页校验
- 对关键组件加一致性断言
- 发布前跑 hydration 告警扫描

## 总结

SSR 的本质是“同一输入得到同一输出”，一致性优先于技巧。