---
id: 72
title: "Vue3 动态路由与权限控制进阶指南"
slug: "vue3-router-dynamic-permission-guide"
author: "ssuperjee"
date: "2024-03-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "Vue Router"
  - "权限"
  - "进阶"
excerpt: "系统讲解动态路由加载、权限校验、首刷恢复和白名单设计，避免常见守卫循环问题。"
readTime: "10 分钟"
published: true
---

## 核心目标

在保证安全边界的前提下，实现：

- 用户只看到有权限的页面
- 刷新后路由可恢复
- 守卫逻辑不死循环

## 推荐流程

1. 登录后拉取权限树
2. 权限树转换为路由记录
3. `addRoute` 动态注册
4. 首次注册后 `replace` 当前路由

## 守卫设计要点

- 白名单页尽早放行
- 用户信息初始化只做一次
- 未授权路由统一跳 403/404，不要隐式吞掉

## 常见坑

- 动态路由注册晚于首次导航
- 后端菜单组件路径不稳定
- token 有但权限未初始化导致抖动跳转

## 总结

权限路由的难点不是 API，而是状态时序与初始化边界。