---
id: 74
title: "Vue3 + Pinia 领域化 Store 设计实践"
slug: "vue3-pinia-domain-store-guide"
author: "ssuperjee"
date: "2024-07-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "Pinia"
  - "状态管理"
  - "进阶"
excerpt: "讲解中大型项目中 Pinia 的领域拆分、依赖边界和跨 store 协作模式，避免状态泥球化。"
readTime: "10 分钟"
published: true
---

## 为什么会变成“状态泥球”

随着业务增长，很多团队把所有状态堆进一个大 store，维护成本快速上升。

## 领域化拆分思路

- 用户域：登录态、资料、权限
- 订单域：列表、详情、筛选条件
- UI 域：主题、侧栏、全局弹层

## 关键约束

- store 只关心本域状态
- 跨域调用通过明确 action，不直接读写内部字段
- 网络请求建议放 service 层，store 负责状态落地

## 常见坑

- 循环依赖：A store 依赖 B，B 又回调 A
- store 中塞入过多临时 UI 状态
- action 副作用过多，难测难排查

## 总结

Pinia 设计的核心不是“分几个文件”，而是领域边界清晰、依赖方向单向。