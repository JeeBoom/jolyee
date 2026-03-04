---
id: 115
title: "JavaScript Proxy 手写迷你响应式系统"
slug: "javascript-proxy-reactive-mini-guide"
author: "ssuperjee"
date: "2024-04-28"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "Proxy"
  - "响应式"
  - "手写原理"
excerpt: "用 Proxy + 依赖收集实现迷你响应式系统，帮助理解现代前端框架的数据驱动更新机制。"
readTime: "10 分钟"
published: true
---

## 目标

实现最小能力：

- 读取属性时收集依赖
- 修改属性时触发依赖

## 核心代码

```js
const bucket = new WeakMap()
let activeEffect = null

function effect(fn) {
  activeEffect = fn
  fn()
  activeEffect = null
}

function track(target, key) {
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) bucket.set(target, (depsMap = new Map()))
  let deps = depsMap.get(key)
  if (!deps) depsMap.set(key, (deps = new Set()))
  deps.add(activeEffect)
}

function trigger(target, key) {
  const depsMap = bucket.get(target)
  const deps = depsMap?.get(key)
  deps?.forEach((fn) => fn())
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, val) {
      target[key] = val
      trigger(target, key)
      return true
    },
  })
}
```

## 总结

这套最小实现能帮你快速建立“依赖收集与触发更新”的底层直觉。