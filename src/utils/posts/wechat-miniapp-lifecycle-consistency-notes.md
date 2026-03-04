---
id: 48
title: "微信小程序生命周期与数据一致性排查笔记"
slug: "wechat-miniapp-lifecycle-consistency-notes"
author: "ssuperjee"
date: "2024-12-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "微信小程序"
  - "生命周期"
  - "数据一致性"
  - "开发笔记"
excerpt: "记录 onLoad/onShow 并发触发下的数据错乱问题，沉淀页面初始化和回流更新的统一策略。"
readTime: "7 分钟"
published: true
---

## 现象

页面首开和返回时数据来源不一致，偶发显示旧数据。

## 根因

- `onLoad` 和 `onShow` 都在拉同一批数据
- 回流时没有区分“需要刷新”和“只恢复 UI”
- 请求返回顺序不稳定，旧响应覆盖新状态

## 修复

- 页面初始化和回流刷新拆成两个函数
- 用请求序号控制响应生效顺序
- 只在必要场景触发刷新

## 复盘

生命周期不是调用顺序问题，本质是状态机设计问题。