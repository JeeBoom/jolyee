---
id: 94
title: "JavaScript 性能基准测试的正确姿势"
slug: "javascript-performance-benchmark-guide"
author: "ssuperjee"
date: "2025-01-15"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "性能测试"
  - "Benchmark"
  - "工程化"
excerpt: "介绍如何做可信的 JS 性能基准测试，避免样本偏差、JIT 干扰和错误结论。"
readTime: "9 分钟"
published: true
---

## 为什么很多 benchmark 不可信

- 只跑一次就下结论
- 测试环境噪声太大
- 测到了冷启动而非稳定态

## 基本方法

- 预热（warm-up）后再采样
- 多轮执行取统计结果
- 固定运行环境（浏览器版本、CPU 状态）

## 常见误区

- 为了“赢”而改写不等价代码
- 忽视真实业务瓶颈（IO、网络、渲染）
- 只看均值，不看方差

## 代码示例

```js
function bench(name, fn, rounds = 10000) {
  fn() // warm-up
  const t0 = performance.now()
  for (let i = 0; i < rounds; i++) fn()
  const t1 = performance.now()
  console.log(`${name}: ${(t1 - t0).toFixed(2)}ms`)
}

bench('for-loop', () => {
  let s = 0
  for (let i = 0; i < 1000; i++) s += i
})
```

## 总结

基准测试的价值在于指导优化方向，不是制造“某写法永远最快”的神话。