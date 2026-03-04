---
id: 97
title: "JavaScript AbortController 实战：取消无效请求"
slug: "javascript-abortcontroller-request-guide"
author: "ssuperjee"
date: "2025-07-21"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "AbortController"
  - "网络请求"
  - "异步"
excerpt: "讲解如何用 AbortController 取消过期请求，避免搜索联想、页面切换等场景的数据竞态覆盖。"
readTime: "8 分钟"
published: true
---

## 典型问题

用户快速输入搜索词时，旧请求晚返回覆盖新结果。

## 推荐写法

```js
let controller = null

async function search(keyword) {
  controller?.abort()
  controller = new AbortController()

  const res = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`, {
    signal: controller.signal,
  })
  return res.json()
}
```

## 注意点

- 取消请求不等于接口失败，要区分异常类型
- 页面卸载时统一 abort 当前请求
- 与防抖配合效果更好

## 总结

AbortController 是处理异步竞态最直接的工具，特别适合高频交互场景。