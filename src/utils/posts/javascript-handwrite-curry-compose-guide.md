---
id: 102
title: "手写柯里化与函数组合：函数式工具的工程落地"
slug: "javascript-handwrite-curry-compose-guide"
author: "ssuperjee"
date: "2024-11-22"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "柯里化"
  - "函数式"
excerpt: "讲解 curry/compose 的实现细节、参数占位符支持与业务中可读性权衡。"
readTime: "9 分钟"
published: true
---

## 先说价值

柯里化让函数更可复用，组合让流程更可读，但过度函数式也会提高团队理解成本。

## 柯里化核心

根据目标函数参数个数持续收集参数，直到满足再执行。

## 组合核心

`compose(f, g, h)(x)` 等价 `f(g(h(x)))`。

## 实战注意

- 处理可变参数函数时要定义清晰终止条件
- 是否支持占位符（如 `_`）要提前约定
- 调试时建议保留中间步骤日志

## 代码示例

```js
function curry(fn, ...args) {
  return args.length >= fn.length
    ? fn(...args)
    : (...rest) => curry(fn, ...args, ...rest)
}

const add3 = (a, b, c) => a + b + c
const curried = curry(add3)
console.log(curried(1)(2)(3))
```

## 总结

函数式工具适合做“数据流变换层”，不适合把所有业务逻辑都函数式化。