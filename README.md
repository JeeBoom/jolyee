# 导航中心 - Vue3 版本


## 功能列表

- 搜索引擎快速访问（Google、Yandex、Bing）
- 优质社区导航（28+ 个社区）
- 返回顶部按钮
- 用户交互追踪
- 暗黑主题支持
- 无障碍支持

## 快速开始

### 1. 安装依赖

```bash
cd vue3
npm install
```

### 2. 运行开发服务器

```bash
npm run dev
```

应用将自动在浏览器中打开，地址为 http://localhost:5173

### 3. 构建生产版本

```bash
npm run build
```

生产文件将输出到 `dist/` 目录

## 项目结构

```
vue3/
├── src/
│   ├── components/
│   │   ├── Header.vue           # 页眉和导航
│   │   ├── SearchEngines.vue    # 搜索引擎卡片
│   │   ├── Communities.vue      # 社区卡片
│   │   ├── BackToTop.vue        # 返回顶部按钮
│   │   └── Footer.vue           # 页脚
│   ├── styles/
│   │   └── main.css             # 全局样式
│   ├── App.vue                  # 根组件
│   └── main.js                  # 应用入口
├── index.html                   # HTML 入口
├── vite.config.js              # Vite 配置
├── package.json                # 项目依赖
└── README.md                   # 本文件
```

## 浏览器支持

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)

## 许可证

MIT

## 联系方式

如有问题或建议，欢迎反馈！
