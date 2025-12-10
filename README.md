# 导航中心 - Vue3 版本

这是 HTML5 导航中心的 Vue3 重构版本，具有完全相同的功能和设计。

## 功能特性

✨ **完全复刻** - 与 HTML5 版本完全相同的功能和外观
🎨 **现代化** - 使用 Vue3 Composition API 构建
⚡ **高性能** - 基于 Vite 构建工具，开发体验极佳
📱 **响应式** - 完美适配各种屏幕尺寸
🎯 **交互追踪** - 记录用户交互数据到 localStorage

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

## 与 HTML5 版本的对比

### 相同点
- ✅ 完全相同的视觉设计和布局
- ✅ 相同的功能和交互
- ✅ 相同的样式和响应式设计
- ✅ 相同的搜索引擎和社区数据

### 改进点
- 🎯 使用 Vue3 Composition API，代码更清晰
- ⚡ Vite 开发服务器，热更新速度更快
- 📦 组件化架构，代码复用性更高
- 🔧 更容易维护和扩展
- 🎨 支持更灵活的主题定制

## 使用 API

### 显示通知

```javascript
window.NavigationPortal.showNotification('这是一个通知')
```

### 获取交互历史

```javascript
const history = window.NavigationPortal.getInteractionHistory()
console.log(history)
```

### 清除交互历史

```javascript
window.NavigationPortal.clearInteractionHistory()
```

## 浏览器支持

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)

## 许可证

MIT

## 联系方式

如有问题或建议，欢迎反馈！
