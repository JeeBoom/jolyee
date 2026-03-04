---
id: 87
title: "JavaScript sendBeacon 可靠性实践：页面卸载埋点不丢失"
slug: "javascript-sendbeacon-reliability-guide"
author: "ssuperjee"
date: "2025-02-16"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "sendBeacon"
  - "埋点"
  - "可靠性"
excerpt: "讲解页面关闭/跳转场景下埋点丢失问题，比较 sendBeacon 与 fetch keepalive 的边界与实践。"
readTime: "9 分钟"
published: true
---

## 线上问题

用户跳转很快时，关键埋点上报丢失，统计数据偏低。

## 为什么普通请求不稳定

页面卸载阶段，浏览器可能直接终止异步请求。

## 方案对比

- `navigator.sendBeacon`：适合小体积、无需响应的上报
- `fetch(..., { keepalive: true })`：更灵活，但兼容和体积限制要关注

## 实践建议

- 上报 payload 保持小而稳定
- 做客户端队列与失败补偿
- 服务端做幂等去重（事件 ID）

## 代码示例

```js
function reportEvent(event) {
  const body = JSON.stringify({
    id: crypto.randomUUID(),
    ts: Date.now(),
    ...event,
  })

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' })
    return navigator.sendBeacon('/api/track', blob)
  }

  return fetch('/api/track', {
    method: 'POST',
    body,
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

## 总结

埋点可靠性的关键不是“发出去”，而是“能追踪是否真正入库”。