---
id: 56
title: "优惠券核销幂等处理记录：重复点击与重复请求"
slug: "frontend-coupon-redeem-idempotency-notes"
author: "ssuperjee"
date: "2025-04-22"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "前端前沿"
  - "幂等"
  - "优惠券"
  - "开发笔记"
excerpt: "记录核销按钮重复点击导致重复请求的问题，前后端协同实现幂等约束与交互保护。"
readTime: "7 分钟"
published: true
---

## 现象

网络抖动时用户会连续点击核销按钮，造成重复请求和状态混乱。

## 修复策略

- 前端按钮进入 loading 锁定，禁止重入
- 请求携带幂等键（requestId）
- 后端返回“已处理”时前端按成功态兜底展示

## 结果

重复核销工单大幅减少，页面状态一致性明显提升。

## 复盘

交互防重只是第一层，真正可靠的是端到端幂等机制。