---
id: 105
title: "手写轻量模板引擎：从字符串解析到函数生成"
slug: "javascript-handwrite-template-engine-guide"
author: "ssuperjee"
date: "2025-05-26"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "模板引擎"
  - "编译"
excerpt: "通过一个迷你模板引擎理解模板编译原理：词法切分、表达式替换、渲染函数生成与安全边界。"
readTime: "10 分钟"
published: true
---

## 为什么写模板引擎

为了理解“模板 -> 可执行渲染函数”的核心路径，这对理解 Vue/React 编译思想很有帮助。

## 简化实现步骤

1. 切分文本与表达式片段
2. 把表达式转换为可执行代码段
3. 生成渲染函数并执行得到最终字符串

## 风险提醒

- 动态执行表达式有注入风险
- 不可信模板必须做白名单限制
- 生产场景建议使用成熟模板引擎

## 学习价值

你会更理解编译型框架为何性能更好，以及运行时和编译时各自的取舍。

## 代码示例

```js
function render(tpl, data) {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    return key in data ? String(data[key]) : ''
  })
}

const out = render('Hello {{name}}, age={{age}}', { name: 'Tom', age: 18 })
console.log(out)
```

## 总结

手写模板引擎是非常高价值的“原理练习题”，能串起解析、编译和执行三个阶段。