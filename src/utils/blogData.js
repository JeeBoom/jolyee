// 博客文章数据管理
export const blogPosts = [
  {
    // 随机字符串
    id: 8,
    title: "Markdown 常用语法指南",
    slug: "markdown-syntax-guide",
    author: "ssuperjee",
    date: "2025-12-12",
    category: "开发笔记",
    blogCategory: "notes",
    tags: ["Markdown", "语法", "写作"],
    excerpt:
      "从来没有认认真真的去记markdown语法，考虑到后面需要长期更新博客文章所以记录一下...",
    coverImage: "/images/blog.webp",
    content: `
## 前言

从来没有认认真真的去记markdown语法 考虑到后面需要长期更新博客文章所以记录一下一些常用的语法，当个备忘录 省得到处找。

---

### 1. 常用快捷键

| 功能 | 快捷键 |
|------|--------|
| 加粗 | Ctrl + B |
| 斜体 | Ctrl + I |
| 引用 | Ctrl + Q |
| 插入链接 | Ctrl + L |
| 插入代码 | Ctrl + K |
| 插入图片 | Ctrl + G |
| 提升标题 | Ctrl + H |
| 有序列表 | Ctrl + O |
| 无序列表 | Ctrl + U |
| 横线 | Ctrl + R |
| 撤销 | Ctrl + Z |
| 重做 | Ctrl + Y |

---

### 2. 字体样式

## 2.1 粗体

\`\`\`markdown
**粗体内容**
__粗体内容__
\`\`\`

效果：**这是粗体**

## 2.2 斜体

\`\`\`markdown
*斜体内容*
_斜体内容_
\`\`\`

效果：*这是斜体*

## 2.3 删除线

\`\`\`markdown
~~删除内容~~
\`\`\`

效果：~~这是删除线~~

## 2.4 下标和上标

\`\`\`markdown
~下标~
^上标^
\`\`\`

---

### 3. 标题

Markdown 支持六级标题：

\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
\`\`\`

**注意事项：**
- \`#\` 和标题文字之间必须有空格
- 井号数量越多，标题级别越低

---

### 4. 列表

## 4.1 无序列表

\`\`\`markdown
- 项目1
* 项目2
+ 项目3
\`\`\`

效果：
- 项目1
- 项目2
- 项目3

## 4.2 有序列表

\`\`\`markdown
1. 第一项
2. 第二项
3. 第三项
\`\`\`

效果：
1. 第一项
2. 第二项
3. 第三项

## 4.3 任务列表

\`\`\`markdown
- [ ] 未完成任务
- [x] 已完成任务
\`\`\`

效果：
- [ ] 未完成任务
- [x] 已完成任务

## 4.4 多级列表

使用 Tab 键或多个空格实现缩进：

\`\`\`markdown
- 一级列表
  - 二级列表
    - 三级列表
\`\`\`

---

### 5. 引用

\`\`\`markdown
> 这是一级引用
> > 这是二级引用
\`\`\`

效果：
> 这是一级引用
> > 这是嵌套引用

---

### 6. 代码

# 6.1 行内代码

\`\`\`markdown
使用 \\\`代码\\\` 标记
\`\`\`

效果：这是 \`行内代码\` 示例

## 6.2 代码块

\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

---

### 7. 链接

## 7.1 行内链接

\`\`\`markdown
[链接文字](https://example.com "可选标题")
\`\`\`

## 7.2 自动链接

\`\`\`markdown
<https://example.com>
\`\`\`

## 7.3 参考式链接

\`\`\`markdown
[链接文字][链接标识]

[链接标识]: https://example.com "标题"
\`\`\`

---

### 8. 图片

\`\`\`markdown
![替代文字](图片地址 "可选标题")
![图片描述](图片URL#pic_center =宽x高)
\`\`\`

**说明：**
- \`#pic_center\` 可以让图片居中
- \`=宽x高\` 可以调整图片尺寸（注意前面要有空格）

---

### 9. 表格

\`\`\`markdown
| 列1 | 列2 | 列3 |
|-----|:---:|----:|
| 左对齐 | 居中 | 右对齐 |
| 内容1 | 内容2 | 内容3 |
\`\`\`

效果：

| 列1 | 列2 | 列3 |
|-----|:---:|----:|
| 左对齐 | 居中 | 右对齐 |
| 内容1 | 内容2 | 内容3 |

**对齐方式：**
- \`:---\` 左对齐（默认）
- \`:---:\` 居中对齐
- \`---:\` 右对齐

---

### 10. 分割线

\`\`\`markdown
***
---
___
\`\`\`

以上三种方式都可以创建分割线，至少需要3个符号。

---

### 11. 其他技巧

## 11.1 换行

- 使用 \`<br>\` 或 \`<br/>\` 标签强制换行
- 行末添加两个空格也可换行

## 11.2 空格和缩进

\`\`\`markdown
&nbsp;  半角空格
&ensp;  半个中文字符
&emsp;  一个中文字符
\`\`\`

## 11.3 转义字符

使用反斜杠 \`\\\` 转义特殊字符：

\`\`\`markdown
\\# 不是标题
\\* 不是列表
\\\` 不是代码
\`\`\`

## 11.4 HTML 标签

Markdown 支持部分 HTML 标签：

\`\`\`html
<kbd>Ctrl</kbd>  按键样式
<mark>高亮文本</mark>  标记文本
\`\`\`

## 11.5 注释

\`\`\`markdown
[//]: # (这是注释内容，不会显示)
\`\`\`

---

### 12. 注意事项

1. **空格规则**：多个连续空格会被合并为一个
2. **空行规则**：连续空行会被忽略成一行
3. **标记符规则**：标记符和内容之间通常不能有空格
4. **嵌套使用**：多个标记符可以嵌套，如 \`***~~文本~~***\` 实现斜体加粗带删除线

### 13. markdown插件

1. Markdown All in One
2. Markdown Preview Enhanced
---

*本文整理自常用 Markdown 语法，供日常写作参考使用*
    `,
    readTime: "8 分钟",
    views: 0,
    published: true,
  },
  {
    // 随机字符串
    id: 9,
    title: "Epic 喜加一",
    slug: "epic-free-game-gta5",
    author: "ssuperjee",
    date: "2025-12-12",
    category: "游戏推荐",
    blogCategory: "game",
    tags: ["Epic Games", "霍格沃茨之遗", "免费游戏"],
    excerpt:
      "Epic 假日特卖已开启，不仅有游戏折扣和奖励返利，更有重磅免费游戏可领，错过血亏！",
    coverImage: "/images/blog.webp",
    content: `
## Epic 假日福利提醒：免费领 3A 大作，速冲！

领取地址：https://www.epicgames.com/store
    `,
    readTime: "1 分钟",
    views: 0,
    published: true,
  },
  {
    id: 1,
    title: "我的导航站诞生记",
    slug: "my-navigation-site-journey",
    author: "ssuperjee",
    date: "2025-12-11",
    category: "随便写写",
    blogCategory: "casual",
    tags: ["前端开发", "个人项目", "导航站"],
    excerpt:
      "作为一名前端程序员，离职后的第一个项目，记录我创建这个导航站的初心与历程...",
    coverImage: "/images/blog.webp", // 可选
    content: `
### 写在前面

你好，我是 ssuperjee，旧社会的切图仔，新时代的AI指挥官。如果你正在浏览这个网站，那么很高兴与你相遇。这篇文章，我想和你分享一下开发这个导航站的初衷 。


### 需求即是创造
这个想法并非一时兴起（PS：我承认有无聊的部分😅😅😅）。因为之前作为一名前端开发，我的日常工作离不开各种工具和资源网站：

- 寻找~~设计灵感~~时（抄创意🤣），需要浏览多个设计社区
- 遇到~~技术问题~~时（抄代码🤣），要在不同的技术论坛间切换
- 查找开发工具时（抄捷径🤣），浏览器收藏夹已经乱成一团
- 看新闻、追剧、听音乐...每个需求都对应着不同的网站

浏览器书签？太混乱。  
各种导航网站？资源太多，不需要的东西也太多

**我需要一个自己清爽、实用、个性化的任意门。**


### 初心与愿景

> **为自己创造一个高效、舒适的资源管理工具。**

但是啊 但是， 你知道凡事呢就怕这个但是

没错 ，写博客一定要升华，下面是升华时间

随着开发的深入，我发现它可以承载更多：
- 可以帮助和我一样的开发者快速找到优质资源
- 可以成为我分享经验、传递价值的平台
- 可以记录我的思考、成长和生活

如果这个网站能够帮助到你，那将是对我最大的鼓励。

### 持续进化中

这个网站还在不断完善中：
- 会持续添加更多优质网站
- 会定期分享技术文章和生活随笔
- 会根据使用体验优化功能和交互
- 会倾听每一个反馈和建议

<font color=Aqua>*这不是一个完成品，而是一个持续生长的作品。*</font>
    `,
    readTime: "5 分钟",
    views: 0,
    published: true,
  },
  {
    id: 6,
    title: "VS Code 插件推荐：这些我每天都在用",
    slug: "vscode-extensions-i-use",
    author: "ssuperjee",
    date: "2025-09-30",
    category: "工具推荐",
    blogCategory: "recommend",
    tags: ["VS Code", "效率工具", "插件"],
    excerpt: "不是最全的插件列表，但都是真正在用的...",
    coverImage: "/images/blog.webp",
    content: `
前几天有人问我："VS Code 插件这么多，你都装了哪些？"

说实话，我装过很多插件，但真正每天都在用的，也就那么几个。

今天就分享一下我的插件清单。不是最全的，但都是我自己在用的。

## 必装的几个

### 1. GitHub Copilot

这个不多说了，能省不少时间。虽然生成的代码不一定完全正确，但至少能给个思路。

月费 10 美元，但我觉得值。能提升 30-40% 的效率，这钱花得不亏。

### 2. ESLint

代码规范检查。团队协作必备，能避免很多低级错误。

配置好了之后基本不用管，写代码的时候它会自动提示哪里不符合规范。保存的时候自动修复，舒服。

### 3. Prettier

代码格式化工具。保存时自动格式化，再也不用纠结缩进、换行这些问题。

和 ESLint 配合使用，效果更好。

### 4. GitLens

Git 增强工具。能看到每一行代码是谁写的，什么时候写的，提交信息是什么。

找 bug 的时候特别有用，可以追溯代码的历史。

## 前端开发相关

### 5. Auto Rename Tag

写 HTML 的时候，改了开始标签，结束标签自动跟着改。

看起来是个小功能，但真的很实用。少敲很多字。

### 6. CSS Peek

按住 Ctrl 点击 CSS 类名，可以直接跳转到样式定义。

大项目里找样式的时候很方便，不用全局搜索了。

### 7. Path Intellisense

自动补全文件路径。输入 ./ 或 ../ 的时候会提示可以导入的文件。

写 import 的时候省了不少时间。

## 提升体验的

### 8. Error Lens

把错误和警告直接显示在代码旁边，不用去看底部的问题面板。

错误一目了然，改起来也快。

### 9. Better Comments

给注释加上不同的颜色。比如 TODO 是橙色，FIXME 是红色。

代码里的注释一下子就清晰了。

### 10. indent-rainbow

给不同层级的缩进加上不同颜色。

看嵌套比较深的代码时很有用，不容易看乱。

### 11. Bracket Pair Colorizer（或者用 VS Code 自带的）

给括号配对上色。看复杂的嵌套结构时很直观。

不过新版 VS Code 已经内置了这个功能，可以不用装插件了。

## 主题和图标

### 12. One Dark Pro

我用的主题。看着舒服，对比度合适，长时间写代码眼睛不会太累。

当然，主题这事儿因人而异，找个自己喜欢的就行。

### 13. Material Icon Theme

文件图标主题。不同类型的文件有不同的图标，文件树看起来更直观。

## 其他

### 14. Live Server

做静态页面的时候，能实时预览。保存代码，浏览器自动刷新。

虽然现在大多数时候用框架自带的 dev server，但偶尔还是会用到。

### 15. Code Spell Checker

拼写检查。能识别出代码里的拼写错误。

变量命名、注释里的单词拼错了，它会提示。对英语不太好的人很友好。

## 我不装的插件

也说说哪些插件我看过但没装：

**各种花哨的动画插件** —— 好看是好看，但感觉没什么用，还可能影响性能。

**各种 AI 助手（除了 Copilot）** —— 试过几个，要么功能重复，要么不够好用。

**太多的代码片段插件** —— 装太多了反而记不住快捷键，不如自己定义几个常用的。

## 一些使用建议

**1. 别装太多**

插件越多，VS Code 启动越慢，运行也可能卡。装之前想想：这个插件是真的需要，还是看起来很酷？

**2. 定期清理**

每隔一段时间看看插件列表，把不用的卸载掉。我大概每个月会检查一次。

**3. 看评分和下载量**

装插件之前看看评分和评论。下载量特别少的插件要谨慎，可能有问题或者不再维护了。

**4. 注意插件权限**

有些插件会要求比较高的权限。装之前想想：这个插件真的需要这些权限吗？

**5. 试试内置功能**

很多功能 VS Code 其实已经内置了，不用装插件。比如括号配对、自动保存、多光标编辑等。

## 最后


每个人的工作流程不一样，插件选择也会不同。找到适合自己的，才是最重要的。

你常用哪些插件？有没有什么宝藏插件推荐？

---

*插件是为了提高效率，不是为了炫酷。*  
*少即是多，够用就好。*
    `,
    readTime: "6 分钟",
    views: 0,
    published: true,
  },
  {
    id: 7,
    title: "回忆一下童年小游戏",
    slug: "yikm-mini-games-recommendation",
    author: "ssuperjee",
    date: "2025-12-10",
    category: "网站推荐",
    blogCategory: "game",
    tags: ["小游戏", "摸鱼", "休闲"],
    excerpt: "来把魂斗罗...",
    coverImage: "/images/blog.webp",
    content: `
## 我发现

人一上年纪就喜欢回忆过去，

搞两把复古小游戏睡觉

凑个文章数量

https://www.yikm.net/

P.S. 如果你有什么好玩的摸鱼网站，欢迎在评论区分享！
    `,
    readTime: "5 分钟",
    views: 0,
    published: true,
  },
];

// 获取所有文章
export const getAllPosts = () => {
  return blogPosts.filter((post) => post.published);
};

// 根据 ID 获取文章
export const getPostById = (id) => {
  return blogPosts.find((post) => post.id === id && post.published);
};

// 根据 slug 获取文章
export const getPostBySlug = (slug) => {
  return blogPosts.find((post) => post.slug === slug && post.published);
};

// 获取最新文章
export const getLatestPosts = (limit = 5) => {
  return getAllPosts()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

// 根据分类获取文章
export const getPostsByCategory = (category) => {
  return getAllPosts().filter((post) => post.category === category);
};

// 根据标签获取文章
export const getPostsByTag = (tag) => {
  return getAllPosts().filter((post) => post.tags.includes(tag));
};
