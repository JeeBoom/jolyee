# 前端截图方案：html2canvas vs dom-to-image

## 简介

在现代Web应用开发中，经常需要实现截图功能，比如：
- 保存页面内容为图片
- 生成分享卡片
- 导出报表为图片
- 记录用户操作界面

本文介绍两个主流的前端截图库：**html2canvas** 和 **dom-to-image**，分析它们的优缺点和使用场景。

### html2canvas

**html2canvas** 是一个使用 JavaScript 将 DOM 节点转换为 Canvas 的库，通过 Canvas 2D API 绘制页面内容，最后导出为图片。

### 安装

```bash
npm install html2canvas
# 或
yarn add html2canvas
# 或
pnpm add html2canvas
```

### 基础用法

```javascript
import html2canvas from 'html2canvas';

// 基础截图
const element = document.getElementById('capture');
html2canvas(element).then(canvas => {
  const image = canvas.toDataURL('image/png');
  // 下载或展示图片
  const link = document.createElement('a');
  link.href = image;
  link.download = 'screenshot.png';
  link.click();
});
```

### 常用配置选项

```javascript
html2canvas(element, {
  // 输出分辨率
  scale: 2,
  
  // 超时时间（毫秒）
  timeout: 10000,
  
  // 允许跨域图片
  allowTaint: true,
  useCORS: true,
  
  // 背景颜色
  backgroundColor: '#ffffff',
  
  // 日志输出
  logging: false,
  
  // Canvas 宽高
  width: 800,
  height: 600,
  
  // 代理 URL（用于跨域请求）
  proxy: 'http://example.com/proxy',
  
  // 字体加载延迟
  windowHeight: 1080,
  windowWidth: 1920
}).then(canvas => {
  const image = canvas.toDataURL('image/png');
});
```

### Vue 3 中的使用示例

```vue
<template>
  <div>
    <div id="capture-area" class="content">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <img :src="imageUrl" alt="preview" />
    </div>
    
    <button @click="takeScreenshot">下载截图</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import html2canvas from 'html2canvas';

const title = ref('我的内容');
const description = ref('这是一个示例内容');
const imageUrl = ref('https://example.com/image.png');

const takeScreenshot = async () => {
  try {
    const element = document.getElementById('capture-area');
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `screenshot-${Date.now()}.png`;
    link.click();
  } catch (error) {
    console.error('截图失败:', error);
  }
};
</script>

<style scoped>
.content {
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
```

### 高级用法

#### 1. **截图 + 转 PDF**

```javascript
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

async function downloadPDF() {
  const element = document.getElementById('capture');
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new jsPDF();
  const imgWidth = 210; // A4 宽度
  const pageHeight = 297; // A4 高度
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  let heightLeft = imgHeight;
  let position = 0;
  
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
  
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  
  pdf.save('download.pdf');
}
```

#### 2. **处理 SVG 和特殊字体**

```javascript
const canvas = await html2canvas(element, {
  useCORS: true,
  allowTaint: true,
  // 预加载字体
  fontFamilyWhitelist: ['Arial', 'Microsoft YaHei'],
  // 处理 SVG
  svgRendering: true,
});
```

#### 3. **指定截图区域和尺寸**

```javascript
const canvas = await html2canvas(element, {
  x: 0,
  y: 0,
  width: 800,
  height: 600,
  scale: 2,
});
```

### 优点

✅ **功能完整**：支持大多数 CSS 样式（包括 flexbox、grid）  
✅ **社区活跃**：npm 周下载量超过 100 万  
✅ **配置灵活**：提供大量自定义选项  
✅ **跨域支持**：可配置跨域图片处理  
✅ **文档完善**：官方文档详细、示例丰富  

### 缺点

❌ **性能一般**：处理大型或复杂页面时较慢  
❌ **CSS 支持不完全**：某些高级 CSS 特性可能不支持  
❌ **中文字体问题**：需要特殊处理中文字体  
❌ **包体积较大**：约 150KB（未压缩）  

### dom-to-image

**dom-to-image** 是一个轻量级库，将 DOM 节点转换为 SVG URI 或 PNG 图片。相比 html2canvas，它更小巧、速度更快。

### 安装

```bash
npm install dom-to-image
# 或
yarn add dom-to-image
# 或
pnpm add dom-to-image
```

### 基础用法

```javascript
import domtoimage from 'dom-to-image';

// 转换为 PNG
domtoimage.toPng(document.getElementById('my-node'))
  .then(dataUrl => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'screenshot.png';
    link.click();
  })
  .catch(error => {
    console.error('截图失败:', error);
  });
```

### 主要方法

#### 1. **toPng - 导出为 PNG**

```javascript
domtoimage.toPng(node)
  .then(dataUrl => {
    // 使用 dataUrl
  });
```

#### 2. **toJpeg - 导出为 JPEG**

```javascript
domtoimage.toJpeg(node, { quality: 0.95 })
  .then(dataUrl => {
    // 使用 dataUrl
  });
```

#### 3. **toSvg - 导出为 SVG**

```javascript
domtoimage.toSvg(node)
  .then(dataUrl => {
    // SVG 格式，可以无损缩放
  });
```

#### 4. **toBlob - 导出为 Blob**

```javascript
domtoimage.toBlob(node)
  .then(blob => {
    // 上传或保存 Blob
  });
```

### Vue 3 使用示例

```vue
<template>
  <div>
    <div id="share-card" class="card">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
      <p class="author">by {{ author }}</p>
    </div>
    
    <button @click="exportPng">导出 PNG</button>
    <button @click="exportSvg">导出 SVG</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import domtoimage from 'dom-to-image';

const title = ref('分享卡片');
const content = ref('这是一个精美的分享卡片');
const author = ref('张三');

const exportPng = async () => {
  try {
    const node = document.getElementById('share-card');
    const dataUrl = await domtoimage.toPng(node);
    downloadImage(dataUrl, 'share-card.png');
  } catch (error) {
    console.error('导出 PNG 失败:', error);
  }
};

const exportSvg = async () => {
  try {
    const node = document.getElementById('share-card');
    const dataUrl = await domtoimage.toSvg(node);
    downloadImage(dataUrl, 'share-card.svg');
  } catch (error) {
    console.error('导出 SVG 失败:', error);
  }
};

const downloadImage = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
};
</script>

<style scoped>
.card {
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  margin: 20px 0;
}

.card h2 {
  margin: 0 0 15px 0;
  font-size: 24px;
}

.card p {
  margin: 10px 0;
  font-size: 14px;
}

.author {
  margin-top: 20px;
  text-align: right;
  opacity: 0.8;
}

button {
  margin: 10px 5px;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #764ba2;
}
</style>
```

### 处理跨域问题

```javascript
// 需要配置 CORS 代理
domtoimage.toPng(node, {
  // 方案1：使用 crossOrigin
  cacheBust: true,
})
.then(dataUrl => {
  // 如果跨域，可能需要使用代理
})
.catch(error => {
  // 处理错误
});

// 方案2：预加载图片并设置 crossOrigin
const images = document.querySelectorAll('img');
images.forEach(img => {
  img.setAttribute('crossOrigin', 'anonymous');
});
```

### 优点

✅ **轻量级**：包体积约 25KB（未压缩）  
✅ **速度快**：基于 SVG 渲染，性能更好  
✅ **简单易用**：API 简洁直观  
✅ **多格式支持**：支持 PNG、JPEG、SVG、Blob  
✅ **无依赖**：不依赖其他库  

### 缺点

❌ **CSS 支持有限**：某些复杂样式可能不支持  
❌ **社区相对较小**：npm 周下载量约 20 万  
❌ **跨域限制**：跨域图片处理较复杂  
❌ **中文字体问题**：需要处理中文字体加载  

## 详细对比

| 特性 | html2canvas | dom-to-image |
|------|-------------|--------------|
| **包体积** | 150KB | 25KB |
| **性能** | 一般 | 快速 |
| **CSS 支持** | 较完整 | 有限 |
| **跨域处理** | 内置支持 | 需要配置 |
| **中文字体** | 需要处理 | 需要处理 |
| **社区活跃度** | 高 | 中等 |
| **学习曲线** | 一般 | 简单 |
| **渲染方式** | Canvas | SVG |
| **导出格式** | PNG、JPEG | PNG、JPEG、SVG、Blob |
| **文档完善度** | 优秀 | 良好 |

## 使用场景建议

### 选择 html2canvas

- ✅ 需要完整的 CSS 支持
- ✅ 处理复杂的页面布局
- ✅ 需要丰富的配置选项
- ✅ 团队已有使用经验

**典型场景**：
- 完整页面截图
- 报表导出
- 页面内容保存

### 选择 dom-to-image

- ✅ 需要轻量级解决方案
- ✅ 追求更快的性能
- ✅ 截图内容相对简单
- ✅ 需要 SVG 格式

**典型场景**：
- 分享卡片生成
- 社交媒体分享图
- 简单组件截图
- UI 元素导出

## 实战最佳实践

### 1. **处理中文字体**

```javascript
// 预加载字体
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// 使用后再截图
setTimeout(() => {
  html2canvas(element);
}, 1000);
```

### 2. **处理高分屏**

```javascript
const scale = window.devicePixelRatio || 1;

html2canvas(element, {
  scale: scale * 2, // 提高分辨率
});
```

### 3. **显示加载状态**

```vue
<template>
  <div>
    <button @click="screenshot" :disabled="loading">
      {{ loading ? '截图中...' : '下载截图' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import html2canvas from 'html2canvas';

const loading = ref(false);

const screenshot = async () => {
  loading.value = true;
  try {
    const canvas = await html2canvas(document.getElementById('content'));
    const image = canvas.toDataURL('image/png');
    // 处理图片...
  } catch (error) {
    console.error('截图失败:', error);
  } finally {
    loading.value = false;
  }
};
</script>
```

### 4. **错误处理和重试**

```javascript
async function takeScreenshotWithRetry(element, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await html2canvas(element);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 5. **上传到服务器**

```javascript
async function uploadScreenshot(element) {
  const canvas = await html2canvas(element);
  
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'screenshot.png');
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  }, 'image/png');
}
```

## 性能优化技巧

1. **减少 DOM 复杂度**：删除不必要的元素再截图
2. **禁用动画**：在截图前关闭 CSS 动画
3. **优化图片**：使用压缩后的图片
4. **按需加载**：只在需要时才调用截图函数
5. **使用 Web Worker**：在后台线程处理截图

```javascript
// 禁用动画
element.style.animation = 'none';
element.style.transition = 'none';

const canvas = await html2canvas(element);

// 恢复动画
element.style.animation = '';
element.style.transition = '';
```

## 总结

| 工具 | 适用场景 |
|------|---------|
| **html2canvas** | 完整页面、复杂布局、需要精细控制 |
| **dom-to-image** | 轻量级、快速、简单组件、分享卡片 |

**建议**：
- 企业应用、后台管理系统 → **html2canvas**
- 分享功能、轻量组件 → **dom-to-image**
- 小项目初期 → **先用 html2canvas**，后期优化时考虑 **dom-to-image**

## 相关资源

- [html2canvas 官网](https://html2canvas.hertzen.com/)
- [html2canvas GitHub](https://github.com/niklasvh/html2canvas)
- [dom-to-image GitHub](https://github.com/tsayen/dom-to-image)
- [Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [SVG 基础](https://developer.mozilla.org/zh-CN/docs/Web/SVG)

---

*最后更新：2026 年 1 月*