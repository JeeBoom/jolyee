---
id: 107
title: "手写 new 操作符：构造流程与原型链接"
slug: "javascript-handwrite-new-operator-guide"
author: "ssuperjee"
date: "2024-06-18"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "手写原理"
  - "new"
  - "原型"
excerpt: "拆解 new 的执行步骤：创建对象、连接原型、绑定 this、返回实例或显式返回对象。"
readTime: "9 分钟"
published: true
---

## new 到底做了什么

`new Fn(args)` 可以拆成四步：

1. 创建一个空对象
2. 把空对象的原型指向 `Fn.prototype`
3. 以该对象作为 `this` 执行构造函数
4. 若构造函数返回对象则返回它，否则返回步骤 1 的对象

## 手写版本

```js
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype)
  const ret = Ctor.apply(obj, args)
  return ret !== null && (typeof ret === 'object' || typeof ret === 'function')
    ? ret
    : obj
}
```

## 常见误区

- 忽视构造函数显式返回对象
- 把 `__proto__` 当成通用方案（建议 `Object.create`）
- 不了解 `class` 语法糖背后仍是构造 + 原型

## 总结

掌握 `new` 能帮助你理解实例化、原型链和 class 的底层一致性。