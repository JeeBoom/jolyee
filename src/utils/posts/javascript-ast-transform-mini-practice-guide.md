---
id: 113
title: "JavaScript AST 小实践：从解析到代码转换"
slug: "javascript-ast-transform-mini-practice-guide"
author: "ssuperjee"
date: "2025-06-28"
category: "前端技术"
blogCategory: "frontend"
tags:
  - "JavaScript"
  - "AST"
  - "编译原理"
  - "进阶"
excerpt: "用一个小型 AST 转换练习串起 parser/traverse/generate 三步，理解代码改写工具的底层流程。"
readTime: "10 分钟"
published: true
---

## 为什么前端也要懂 AST

代码规范修复、自动重构、埋点注入、国际化提取都离不开 AST。

## 最小流程

1. `parse`：源码 -> 抽象语法树
2. `traverse`：遍历节点并识别目标结构
3. `generate`：修改后 AST -> 新代码

## 一个微型例子

把所有 `var` 声明转换为 `let`（示意性，不涉及所有语义边界）。

## 实战边界

- 不是所有语法都能无损替换
- 转换前要定义“哪些文件、哪些场景允许改”
- 代码格式与注释保留要额外关注

## 代码示例

```js
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'

const ast = parse('var a = 1;')
traverse(ast, {
  VariableDeclaration(path) {
    if (path.node.kind === 'var') path.node.kind = 'let'
  },
})
console.log(generate(ast).code) // let a = 1;
```

## 总结

AST 是前端工程自动化的核心能力，掌握后很多重复工作都能工具化。