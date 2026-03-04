---
id: 89
title: "JavaScript 本地存储一致性实践：Cookie、localStorage、IndexedDB"
slug: "javascript-storage-consistency-guide"
author: "ssuperjee"
date: "2025-06-03"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "localStorage"
  - "IndexedDB"
  - "一致性"
excerpt: "系统比较浏览器本地存储方案，并给出多标签页一致性、版本迁移和数据失效的工程实践。"
readTime: "10 分钟"
published: true
---

## 存储选型速记

- Cookie：小体积、随请求发送，适合会话标识
- localStorage：同步 API，简单键值，容量有限
- IndexedDB：异步、结构化、容量更大

## 真实难点

- 多标签页并发写入覆盖
- 版本升级后旧数据结构不兼容
- 长期缓存导致脏数据

## 工程策略

- 增加 `version` 和 `updatedAt`
- 存储层统一封装读写与迁移
- 跨标签页用 `storage` 事件做同步
- 高价值数据保留服务端兜底校验

## 安全提醒

敏感信息尽量不落本地；必须落地时，至少做过期与最小化存储。

## 代码示例

```js
const KEY = 'user_profile_v2'

function saveProfile(data) {
  const payload = {
    version: 2,
    updatedAt: Date.now(),
    data,
  }
  localStorage.setItem(KEY, JSON.stringify(payload))
}

function loadProfile() {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  const parsed = JSON.parse(raw)
  if (parsed.version !== 2) return null
  return parsed.data
}

window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    console.log('profile changed in another tab')
  }
})
```

## 总结

本地存储的关键不是“能存”，而是“存得可迁移、可同步、可失效”。