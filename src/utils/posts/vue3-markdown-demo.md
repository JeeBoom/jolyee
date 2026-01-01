---
title: 使用 Markdown 发布博客（示例）
slug: vue3-markdown-demo
author: ssuperjee
date: 2026-01-01
category: 前端技术
blogCategory: frontend
tags:
  - Markdown
  - 博客
  - Vue3
excerpt: 这是一个示例，演示如何通过在 src/utils/posts 下编写 Markdown 就能上线博客。
readTime: 3 分钟
published: true
---

## 写在前面

现在你只需要在 `src/utils/posts/` 里新增一个 `.md` 文件，并写好前置属性 (frontmatter)，就能出现在博客列表中。

## 必填前置属性

- `title`：文章标题
- `slug`：URL 唯一标识（字母/数字/中划线）
- `date`：发布日期 `YYYY-MM-DD`
- `category`：展示分类文案，例如「前端技术」
- `blogCategory`：用于筛选的分类标识，例如 `frontend`/`notes`

## 可选前置属性

- `tags`：标签数组
- `coverImage`：封面图 URL
- `excerpt`：摘要
- `readTime`：阅读时长文案
- `published`：布尔值，控制是否展示

## 正文写法

正文直接使用标准 Markdown 语法，支持表格、代码块、列表、引用等。你可以继续添加更多段落与标题。