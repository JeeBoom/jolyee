---
id: 84
title: "JavaScript this 绑定机制深挖：调用点决定一切"
slug: "javascript-this-binding-deep-dive"
author: "ssuperjee"
date: "2024-08-08"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "this"
  - "函数"
  - "基础进阶"
excerpt: "系统梳理 this 的四种绑定规则与高频陷阱，结合业务代码讲清为什么 this 经常“变来变去”。"
readTime: "9 分钟"
published: true
---

## 一句话结论

`this` 不是在定义函数时决定，而是在**调用时**根据调用点决定。

## 四种核心规则

1. 默认绑定：独立函数调用（严格模式下是 `undefined`）
2. 隐式绑定：`obj.fn()`，`this` 指向 `obj`
3. 显式绑定：`call/apply/bind`
4. `new` 绑定：构造调用时 `this` 绑定新对象

## 常见坑

### 回调丢失 this

```js
const obj = {
  x: 1,
  getX() { return this.x }
}
setTimeout(obj.getX, 0) // undefined
```

### 箭头函数误用

箭头函数没有自己的 `this`，会捕获外层上下文。

## 业务建议

- 类方法传递给回调前先 `bind`
- 对需要词法 `this` 的场景用箭头函数
- ESLint 打开 no-invalid-this / class-methods-use-this 等规则

## 总结

this 相关问题多数不复杂，难的是代码层级一深就看不到“调用点”。排查时先还原调用路径。