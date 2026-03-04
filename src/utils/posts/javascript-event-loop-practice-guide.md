---
id: 82
title: "JavaScript 事件循环实战详解：宏任务、微任务与渲染时机"
slug: "javascript-event-loop-practice-guide"
author: "ssuperjee"
date: "2024-04-18"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "事件循环"
  - "异步"
  - "实战"
excerpt: "从业务场景出发讲清事件循环：微任务队列、宏任务队列、渲染时机，以及常见时序 Bug 的定位思路。"
readTime: "10 分钟"
published: true
---

## 为什么事件循环总让人“看懂了又忘”

因为平时写业务只看到 `Promise`、`setTimeout`、`await`，但真实执行顺序由运行时调度决定。很多线上“偶发 bug”本质都是时序问题。

## 一张实用心智图

在浏览器里可以粗略记为：

1. 执行一个宏任务（例如整段 script / setTimeout 回调）
2. 清空微任务队列（Promise.then / queueMicrotask）
3. 进入渲染阶段（可能发生布局/绘制）
4. 再取下一个宏任务

**关键点**：微任务会在当前宏任务结束后立刻清空，所以大量微任务会“挤占”渲染机会。

## 高频误区

### 1) 以为 `setTimeout(fn, 0)` 会“立刻执行”

它只是把 `fn` 放到后续宏任务队列，必须等当前宏任务和微任务都跑完。

### 2) 误用 `await` 导致链路串行

很多代码里连续 `await` 多个独立请求，导致总耗时被拉长。

### 3) 在微任务里做重计算

会让 UI 卡顿，因为浏览器还没机会渲染。

## 一个典型时序案例

```js
console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
console.log('D')
```

输出是 `A D C B`，这是排查很多“日志顺序异常”的基础。

## 业务排查建议

- 先在关键节点打时序日志（入队时机、执行时机）
- 区分“数据晚到”还是“UI晚刷新”
- 重计算优先拆到 `requestAnimationFrame` 或 Worker

## 总结

真正掌握事件循环，不是背口诀，而是能在异步链路错乱时快速定位：**哪个任务、在哪个队列、为什么比预期晚（或早）执行**。