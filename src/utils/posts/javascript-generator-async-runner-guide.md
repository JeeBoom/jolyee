---
id: 114
title: "JavaScript Generator 与 Async Runner 实战"
slug: "javascript-generator-async-runner-guide"
author: "ssuperjee"
date: "2024-02-22"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "Generator"
  - "异步"
  - "进阶"
excerpt: "通过手写 async runner 理解 Generator 如何驱动异步流程，帮助理解 async/await 的底层思想。"
readTime: "10 分钟"
published: true
---

## 为什么学这个

理解 Generator + Promise 的协作方式后，`async/await` 的执行模型会更清晰。

## 核心代码

```js
function run(genFn) {
  const it = genFn()

  function step(nextFn, arg) {
    let result
    try {
      result = nextFn.call(it, arg)
    } catch (err) {
      return Promise.reject(err)
    }

    const { value, done } = result
    if (done) return Promise.resolve(value)

    return Promise.resolve(value).then(
      (val) => step(it.next, val),
      (err) => step(it.throw, err)
    )
  }

  return step(it.next)
}

run(function* () {
  const a = yield Promise.resolve(1)
  const b = yield Promise.resolve(2)
  return a + b
}).then(console.log)
```

## 总结

Generator 不只是语法特性，它是“可暂停函数 + 外部驱动器”的组合。