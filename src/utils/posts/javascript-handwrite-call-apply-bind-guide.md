---
id: 106
title: "手写 call/apply/bind：函数 this 绑定底层实现"
slug: "javascript-handwrite-call-apply-bind-guide"
author: "ssuperjee"
date: "2024-04-09"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "call"
  - "bind"
excerpt: "从 this 绑定规则出发手写 call/apply/bind，覆盖参数传递、构造调用与边界行为。"
readTime: "10 分钟"
published: true
---

## 要解决的核心问题

`call/apply/bind` 本质是“控制函数执行时的 this 指向与参数传递方式”。

## call/apply 手写思路

1. 把目标函数临时挂到 context 对象上
2. 执行并传入参数
3. 删除临时属性并返回结果

## bind 额外难点

- 需要返回一个新函数
- 支持预置参数（偏函数）
- 作为构造函数调用时，`this` 应该指向新实例而不是绑定对象

## 常见坑

- context 为 `null/undefined` 的处理
- 原始值装箱问题（如字符串、数字）
- bind 后函数原型链和 `instanceof` 行为

## 代码示例

```js
Function.prototype.myCall = function (context, ...args) {
  const ctx = context == null ? globalThis : Object(context)
  const key = Symbol('fn')
  ctx[key] = this
  const ret = ctx[key](...args)
  delete ctx[key]
  return ret
}
```

## 总结

这题的价值在于串起 this 绑定规则与函数对象行为，不只是 API 模仿。