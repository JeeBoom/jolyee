---
id: 88
title: "JavaScript 跨域通信策略详解：CORS、postMessage 与代理"
slug: "javascript-cross-origin-strategy-guide"
author: "ssuperjee"
date: "2025-04-09"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "跨域"
  - "CORS"
  - "网络"
excerpt: "从工程实践角度梳理跨域方案选择：何时用 CORS、何时用 postMessage、何时走反向代理。"
readTime: "10 分钟"
published: true
---

## 为什么跨域问题总反复出现

因为不同业务场景对跨域的要求完全不同：接口调用、页面通信、认证凭据、历史兼容都不一样。

## 方案地图

- CORS：主流接口调用方案
- 反向代理：前端开发环境与网关统一入口
- postMessage：窗口/iframe 间通信
- JSONP：历史兼容场景（受限明显）

## 关键边界

- 带 cookie 的跨域要处理 `withCredentials` 与服务端 `Access-Control-Allow-Credentials`
- preflight 失败优先看 OPTIONS 响应
- postMessage 必须校验 `origin`

## 排查清单

- 请求是否真正命中目标域名
- 响应头是否完整
- 浏览器控制台错误类型是网络、协议还是业务

## 代码示例

```js
// postMessage 通信示意
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://trusted.example.com') return
  console.log('receive:', e.data)
})

iframe.contentWindow.postMessage({ type: 'PING' }, 'https://trusted.example.com')
```

## 总结

跨域不是单一技术点，而是“浏览器安全模型 + 网关策略 + 业务认证”的协作问题。