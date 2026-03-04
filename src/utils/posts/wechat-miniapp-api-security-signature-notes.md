---
id: 51
title: "微信小程序接口签名与防重放实践笔记"
slug: "wechat-miniapp-api-security-signature-notes"
author: "ssuperjee"
date: "2025-06-19"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "微信小程序"
  - "接口安全"
  - "签名"
  - "开发笔记"
excerpt: "记录接口被恶意重放后的修复过程：签名机制、时间窗校验、nonce 防复用与日志追踪。"
readTime: "8 分钟"
published: true
---

## 事件背景

某接口出现异常频次请求，排查后发现存在重放风险。

## 处理思路

- 请求加签：路径 + 参数 + 时间戳 + nonce
- 服务端校验时间窗，超时请求拒绝
- nonce 入库短期去重，防止重复使用

## 前端侧约束

- 签名逻辑集中封装，避免页面各自实现
- 统一时钟偏差处理
- 关键失败码上报，便于追查

## 复盘

安全能力要做成“默认生效”，而不是靠业务页面自觉接入。