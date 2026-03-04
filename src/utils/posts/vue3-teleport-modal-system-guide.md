---
id: 69
title: "Vue3 Teleport 构建弹层系统详解"
slug: "vue3-teleport-modal-system-guide"
author: "ssuperjee"
date: "2025-03-01"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "Teleport"
  - "弹层系统"
  - "进阶"
excerpt: "从层级管理、滚动锁、焦点控制和可访问性出发，讲清 Teleport 在复杂弹层体系中的实践。"
readTime: "9 分钟"
published: true
---

## 为什么需要 Teleport

弹层如果直接挂在业务节点内，容易被 `overflow/z-index/transform` 影响。

Teleport 让弹层渲染到统一容器，层级控制更稳定。

## 关键实践

- 全局弹层根节点统一管理
- 打开弹层时锁定 body 滚动
- 关闭时恢复焦点到触发源

## 示例

```vue
<Teleport to="#modal-root">
  <MyDialog v-if="visible" />
</Teleport>
```

## 常见坑

- 多弹层叠加没有层级管理
- ESC、点击遮罩、路由切换关闭策略不一致
- 无障碍属性（aria）缺失

## 总结

Teleport 解决的是“渲染位置”，完整弹层体系还需要状态机和交互规范。