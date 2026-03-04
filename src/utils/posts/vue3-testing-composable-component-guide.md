---
id: 80
title: "Vue3 组合函数与组件测试实战指南"
slug: "vue3-testing-composable-component-guide"
author: "ssuperjee"
date: "2025-07-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "测试"
  - "Composition API"
  - "进阶"
excerpt: "讲解 Vue3 项目中组合函数和组件测试的分层策略，覆盖异步、依赖注入和副作用验证。"
readTime: "9 分钟"
published: true
---

## 测试为什么常常写不下去

因为边界不清：既想测 UI，又想测网络，又想测状态，最后变成难维护的大集成测试。

## 分层策略

- 组合函数：重点测输入输出和副作用
- 组件：重点测交互与渲染结果
- 页面：只保留关键流程冒烟测试

## 关键技巧

- 把外部依赖（请求、时间、存储）抽成可 mock 模块
- 异步测试使用稳定等待策略
- 避免过度依赖内部实现细节

## 常见坑

- 测试直接依赖真实网络
- 断言写在实现细节上，重构后全红
- 副作用清理不彻底导致用例互相污染

## 总结

Vue3 测试的目标不是覆盖率数字，而是给重构提供安全网。