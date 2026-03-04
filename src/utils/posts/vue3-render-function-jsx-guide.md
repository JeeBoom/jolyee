---
id: 71
title: "Vue3 渲染函数与 JSX 进阶实战"
slug: "vue3-render-function-jsx-guide"
author: "ssuperjee"
date: "2025-05-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "JSX"
  - "渲染函数"
  - "进阶"
excerpt: "讲解何时使用渲染函数/JSX，如何在高动态 UI 场景下提升表达力并控制性能。"
readTime: "10 分钟"
published: true
---

## 什么时候模板不够用

- 动态列配置表格
- 配置驱动表单
- 插槽组合规则非常复杂

这些场景下，渲染函数或 JSX 往往更清晰。

## 核心优势

- 逻辑表达更灵活（循环、条件、函数组合）
- 高阶组件封装更自然
- 对动态结构的类型推导更直接

## 示例

```ts
import { h, defineComponent } from 'vue'

export default defineComponent({
  props: { rows: { type: Array, required: true } },
  setup(props) {
    return () => h('ul', props.rows.map((r: any) => h('li', r.name)))
  },
})
```

## 风险与建议

- 可读性下降：团队需统一写法
- JSX 里副作用混入：要保持纯渲染
- 过度抽象：配置层太复杂反而难维护

## 总结

渲染函数/JSX 不是替代模板，而是解决高动态复杂视图的专用工具。