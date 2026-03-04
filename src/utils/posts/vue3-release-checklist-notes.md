---
id: 59
title: "Vue3 发布前检查清单沉淀笔记"
slug: "vue3-release-checklist-notes"
author: "ssuperjee"
date: "2024-10-15"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "Vue3"
  - "发布流程"
  - "质量保障"
  - "开发笔记"
excerpt: "记录从“靠经验发版”转到“清单化发版”的过程，减少遗漏项和低级线上事故。"
readTime: "7 分钟"
published: true
---

## 背景

过去发版靠口头确认，偶发出现配置漏改、埋点漏上等问题。

## 清单化内容

- 环境变量核对
- 关键页面冒烟
- 埋点字段完整性
- 回滚版本可用性
- 风险变更确认

## 实施方式

- PR 合并前自动校验一部分规则
- 人工清单只保留机器难判断项

## 复盘

清单价值不在“流程变多”，而在“把错误前移”。