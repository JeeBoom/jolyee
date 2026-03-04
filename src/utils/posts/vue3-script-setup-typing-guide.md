---
id: 65
title: "Vue3 script setup 类型体操实战：props/emits/model"
slug: "vue3-script-setup-typing-guide"
author: "ssuperjee"
date: "2024-10-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "TypeScript"
  - "script setup"
  - "进阶"
excerpt: "围绕 defineProps、defineEmits、defineModel 的类型约束实践，提升组件接口稳定性与可维护性。"
readTime: "10 分钟"
published: true
---

## 为什么这个点重要

组件库规模上来后，最怕“调用方怎么传都能过，运行时才炸”。类型约束就是第一道防线。

## 关键实践

### 1) props 用类型声明而非弱校验

```ts
interface Props {
  pageSize?: number
  keyword: string
}
const props = withDefaults(defineProps<Props>(), {
  pageSize: 20,
})
```

### 2) emits 明确事件签名

```ts
const emit = defineEmits<{
  (e: 'submit', payload: { id: string; name: string }): void
  (e: 'cancel'): void
}>()
```

### 3) defineModel 约束双向绑定

```ts
const model = defineModel<string>({ required: true })
```

## 常见坑

- 事件名字符串拼错，调用侧无提示
- `any` 泛滥导致类型保护失效
- 泛型组件没有导出约束，二次封装后类型丢失

## 总结

Vue3 + TS 的价值不在“写着好看”，而在于让组件接口变成可编译校验的契约。