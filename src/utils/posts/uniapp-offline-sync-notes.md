---
id: 50
title: "uni-app 离线缓存与数据同步笔记"
slug: "uniapp-offline-sync-notes"
author: "ssuperjee"
date: "2025-05-08"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "uni-app"
  - "离线缓存"
  - "数据同步"
  - "开发笔记"
excerpt: "记录弱网场景下页面可用性优化：离线读缓存、恢复后增量同步、冲突处理策略。"
readTime: "7 分钟"
published: true
---

## 背景

现场网络不稳定，页面经常打不开，用户体验很差。

## 目标

- 离线时仍能看到最近一次数据
- 网络恢复后自动同步
- 避免旧数据覆盖新数据

## 实现

- 本地缓存加时间戳和版本号
- 恢复网络后按更新时间增量拉取
- 冲突字段按服务端时间为准

## 复盘

离线能力不是“多存一份数据”，核心是同步规则清晰。