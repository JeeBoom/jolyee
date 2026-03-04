---
id: 86
title: "JavaScript 沙箱机制实践：动态执行代码的安全边界"
slug: "javascript-sandbox-security-guide"
author: "ssuperjee"
date: "2024-12-05"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "沙箱"
  - "安全"
  - "进阶"
excerpt: "围绕低代码与规则引擎场景，讲解 JS 沙箱的基本设计思路、能力限制与逃逸风险防护。"
readTime: "10 分钟"
published: true
---

## 场景背景

很多系统都希望“动态执行用户配置逻辑”，例如公式计算、规则脚本、低代码表达式。这时安全边界是第一优先级。

## 常见误区

- 直接 `eval/new Function` 执行外部输入
- 以为删掉几个全局对象就安全
- 没有限制执行时间和资源占用

## 基础防护思路

1. 能不用动态执行就不用
2. 必须执行时，做能力白名单
3. 隔离上下文（iframe/worker/vm）
4. 加超时与中断机制

## 最小能力模型

- 只暴露必要 API（例如数学函数、日期格式化）
- 禁止访问 `window/document/localStorage`
- 输入输出都做 schema 校验

## 现实提醒

前端沙箱很难做到“绝对安全”，核心逻辑和关键校验仍应放在后端。

## 代码示例

```js
function runInSandbox(expression, context = {}) {
  const allowList = {
    Math,
    Number,
    String,
    ...context,
  }

  const keys = Object.keys(allowList)
  const values = Object.values(allowList)
  const fn = new Function(...keys, `'use strict'; return (${expression})`)
  return fn(...values)
}

console.log(runInSandbox('Math.max(a, b)', { a: 3, b: 7 }))
```

## 总结

沙箱设计不是一个函数，而是一整套策略：**最小权限 + 运行隔离 + 资源限制 + 审计日志**。