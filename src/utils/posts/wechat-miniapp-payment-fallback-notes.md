---
id: 49
title: "微信小程序支付失败补偿机制实战记录"
slug: "wechat-miniapp-payment-fallback-notes"
author: "ssuperjee"
date: "2024-07-29"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "微信小程序"
  - "支付"
  - "稳定性"
  - "开发笔记"
excerpt: "记录一次支付成功但前端状态未更新的问题处理，重点是结果兜底、轮询补偿和幂等设计。"
readTime: "8 分钟"
published: true
---

## 线上问题

用户已完成支付，但页面仍显示“待支付”，引发大量客服工单。

## 排查后确认

- 前端回调只依赖 `requestPayment` 返回
- 网络抖动时回调结果丢失
- 订单状态更新缺少幂等校验

## 处理方案

- 支付完成后主动查询订单状态
- 增加短轮询补偿，直到状态稳定或超时
- 订单接口幂等化，避免重复更新

## 复盘

支付链路必须假设“回调不可靠”，以服务端最终状态为准。