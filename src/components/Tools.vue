<template>
  <section class="communities" id="tools-section">
    <!-- 分类介绍 -->
    <div class="category-intro">
      <h2 class="category-intro-title">开发工具精选</h2>
      <p class="category-intro-desc">
        精选开发者必备的效率工具和在线服务。包括代码编辑器、版本控制、项目管理、API测试、
        性能分析、代码格式化、正则表达式测试等各类实用工具。从Visual Studio Code、Git到Postman、
        Chrome DevTools，从本地开发环境到云端协作平台，这里汇集了能够显著提升开发效率的利器。
        每个工具都有详细的使用说明和应用场景介绍，帮助开发者快速上手，优化工作流程，
        让开发过程更加高效便捷。
      </p>
    </div>

    <div class="cards-grid">
      <article
        v-for="tool in tools"
        :key="tool.name"
        class="card community-card"
        @click="handleToolCardClick(tool)"
        @keydown.enter="handleToolCardClick(tool)"
        tabindex="0"
        role="button"
      >
        <div class="card-header">
          <div v-if="tool.logo" class="platform-icon" :class="tool.iconClass">
            <img
              :src="tool.logo"
              :alt="tool.name"
              class="logo-image"
              @error="handleImageError"
            />
          </div>
          <div v-else class="platform-icon" :class="tool.iconClass">
            <span class="fallback-icon">🔧</span>
          </div>
          <h3 class="card-title">{{ tool.name }}</h3>
        </div>
        <p class="card-desc">{{ tool.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLinksStore } from "../utils/linksStore";
import { logUserInteraction } from '../utils/syncService';

const { addLinks } = useLinksStore();

const tools = ref([
  {
    name: "IT-TOOLS",
    desc: "面向开发者的多功能在线工具集合，覆盖编码加密、格式转换、数据处理等场景",
    logo: "https://tools.u14.app/favicon.ico",
    url: "https://tools.u14.app/",
  },
  {
    name: "菜鸟工具",
    desc: "提供在线代码编辑、编译、运行、格式转换等工具，学习编程的好帮手",
    logo: "https://www.runoob.com/favicon.ico",
    url: "https://www.runoob.com/",
  },
  {
    name: "JSON 在线格式化",
    desc: "快速格式化和验证 JSON 数据，支持压缩和美化",
    logo: "https://www.json.cn/favicon.ico",
    url: "https://www.json.cn/",
  },
  {
    name: "正则表达式在线测试",
    desc: "在线测试和学习正则表达式，支持多种编程语言",
    logo: "https://regex101.com/favicon.ico",
    url: "https://regex101.com/",
  },
  {
    name: "Favicon Finder",
    desc: "查找任意网站的 Favicon 图标",
    logo: "https://www.postman.com/favicon.ico",
    url: "https://favicons.teamtailor-cdn.com/",
  },
  {
    name: "在线 PS - Photopea",
    desc: "在线图片编辑工具，功能类似 Photoshop",
    logo: "https://www.photopea.com/promo/icon512.png",
    url: "https://www.photopea.com/",
  },
  {
    name: "TinyPNG 图片压缩",
    desc: "在线图片无损压缩工具，支持 PNG 和 JPG",
    logo: "https://tinypng.com/images/apple-touch-icon.png",
    url: "https://tinypng.com/",
  },
  {
    name: "在线 Markdown 编辑器",
    desc: "实时预览的 Markdown 编辑工具，支持导出 HTML 和 PDF",
    logo: "https://www.mdnice.com/favicon.ico",
    url: "https://www.mdnice.com/",
  },
  {
    name: "Bejson",
    desc: "拥有一切你需要的文件转换工具！",
    logo: "https://www.bejson.com/favicon.ico",
    url: "https://www.bejson.com/",
  },
  {
    name: "AI消除图片内容 - 无需登录",
    desc: "先进的AI图片文字移除工具，能在数秒内帮您清理照片、图形和文档。只需上传您的图片，即可清除不需要的文字、水印或标志。100%免费，在线使用，无需注册账户。",
    logo: "https://magiceraser.org/favicon.ico",
    url: "https://magiceraser.org/zh/remove-text-from-image/",
  },
  {
    name: "Swagger Editor",
    desc: "在线编辑和预览 OpenAPI/Swagger 文档",
    logo: "https://editor.swagger.io/favicon-32x32.png",
    url: "https://editor.swagger.io/",
  },
  {
    name: "LeetCode",
    desc: "在线算法题库和编程练习平台，提升编程能力",
    logo: "https://leetcode.com/favicon.ico",
    url: "https://leetcode.com/",
  },
  {
    name: "HackerRank",
    desc: "编程竞赛和技能测试平台，包含各种难度的编程挑战",
    logo: "https://www.hackerrank.com/favicon.ico",
    url: "https://www.hackerrank.com/",
  },
  {
    name: "CodePen",
    desc: "前端代码在线编写、分享和展示平台",
    logo: "https://codepen.io/favicon.ico",
    url: "https://codepen.io/",
  },
  {
    name: "草料二维码",
    desc: "专业的二维码生成和管理平台，支持多种二维码类型",
    logo: "https://cli.im/favicon.ico",
    url: "https://cli.im/",
  },
  {
    name: "中国色",
    desc: "传统中国色彩库，包含大量配色方案和色值信息",
    logo: "https://www.zhongguose.com/favicon.ico",
    url: "https://www.zhongguose.com/",
  },
  {
    name: "Adobe Color",
    desc: "Adobe 官方配色工具，快速生成和谐的调色板",
    logo: "https://color.adobe.com/favicon.ico",
    url: "https://color.adobe.com/",
  },
  {
    name: "反应时间测试工具",
    desc: "测测你的反应速度有多快！",
    logo: "https://sotool.net/static/favicon.ico",
    url: "https://sotool.net/reaction",
  },
  {
    name: "Excalidraw",
    desc: "虚拟白板工具，用于绘制图表、流程图和原型",
    logo: "https://excalidraw.com/favicon.ico",
    url: "https://excalidraw.com/",
  },
  {
    name: "ProcessOn",
    desc: "国内免费的在线作图工具，支持流程图、思维导图等多种图形",
    logo: "https://www.processon.com/favicon.ico",
    url: "https://www.processon.com/",
  },
]);

const handleToolCardClick = (tool) => {
  console.log(`点击了工具: ${tool.name}`);
  logUserInteraction("tool", tool.name, tool.url);

  if (tool.url) {
    window.open(tool.url, "_blank");
  }
};

const handleImageError = (event) => {
  // 当图片加载失败时，用备用图标替换
  event.target.style.display = "none";
  const parent = event.target.parentElement;
  const fallbackIcon = parent.querySelector(".fallback-icon");
  if (!fallbackIcon) {
    const span = document.createElement("span");
    span.className = "fallback-icon";
    span.textContent = "🔧";
    parent.appendChild(span);
  }
};


onMounted(() => {
  addLinks(8, "工具合集", tools.value);
});
</script>

<style scoped>
/* Styles are in main.css */
</style>
