<template>
  <section class="communities" id="front-section">
    <h2 class="section-title">前端</h2>
    <div class="cards-grid">
      <article
        v-for="community in communities"
        :key="community.name"
        class="card community-card"
        @click="handleCommunityCardClick(community)"
        @keydown.enter="handleCommunityCardClick(community)"
        tabindex="0"
        role="button"
      >
        <div class="card-header">
          <div
            v-if="community.logo"
            class="platform-icon"
            :class="community.iconClass"
          >
            <img
              :src="community.logo"
              :alt="community.name"
              class="logo-image"
              @error="handleImageError"
            />
          </div>
          <h3 class="card-title">{{ community.name }}</h3>
        </div>
        <p class="card-desc">{{ community.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLinksStore } from '../utils/linksStore'

const { addLinks } = useLinksStore()

const communities = ref([
  {
    name: "npm官网",
    desc: "JS的包管理工具",
    logo: "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png", 
    url: "https://www.npmjs.com/",
  },
  {
    name: "Can I use",
    desc: "前端 API 兼容性查询",
    logo: "https://caniuse.com/img/favicon-128.png", 
    url: "https://caniuse.com/",
  },
  {
    name: "阿里矢量图",
    desc: "iconfont是阿里巴巴打造的矢量图标库，提供下载、存储、格式转换等功能，内容丰富",
    logo: "https://www.iconfont.cn/apple-touch-icon.png", 
    url: "https://www.iconfont.cn/",
  },
  {
    name: "Fontawesome中文网",
    desc: "Font Awesome为您提供可缩放的矢量图标,您可以使用CSS所提供的所有特性对它们进行更改,包括:大小、颜色、阴影或者其它任何支持的效果",
    logo: "https://fontawesome.com.cn/favicon.ico", 
    url: "https://fontawesome.com.cn/v5",
  },
  {
    name: "Vue-admin 合集",
    desc: "海量实用的管理模板集合",
    logo: "https://img2.baidu.com/it/u=4031380424,3433940810&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=655", 
    url: "https://vue-admin.cn/admin",
  },
  {
    name: "React.js Admin 合集",
    desc: "海量实用的管理模板集合",
    logo: "https://react.dev/favicon.ico", 
    url: "https://reactjsexample.com/28-best-react-admin-dashboard-templates-in-2020/",
  },
   {
    name: "Apifox",
    desc: "API 设计、开发、测试一体化协作平台",
    logo: "https://img1.baidu.com/it/u=1172642020,3125940215&fm=253&fmt=auto&app=138&f=PNG?w=751&h=500", 
    url: "https://apifox.com/",
  },
   {
    name: "大厂面试每日一题",
    desc: "这是一个专注于前端的互联网大厂面试题的学习平台，帮助你系统性地准备技术面试。",
    logo: "https://q.shanyue.tech/favicon.ico", 
    url: "https://q.shanyue.tech/",
  },
  {
    name: "Echarts图表合集",
    desc: "Echarts Demo集",
    logo: "https://www.isqqw.com/favicon.ico", 
    url: "https://www.isqqw.com/",
  },
   {
    name: "XE 函数库工具类",
    desc: "一个纯原生 javaascript 工具类函数库。",
    logo: "https://vxeui.com/logo.png", 
    url: "https://vxetable.cn/xe-utils/#/",
  },
  {
    name: "VueUse",
    desc: "vue3 hooks 函数库",
    logo: "https://vueuse.org/apple-touch-icon.png", 
    url: "https://vueuse.org/",
  },
  {
    name: "IT - TOOLS",
    desc: "一个面向开发者及日常办公用户的多功能在线工具集合平台，核心作用是提供各类高效、便捷的实用工具",
    logo: "https://tools.u14.app/favicon.ico", 
    url: "https://tools.u14.app/",
  },
  {
    name: "React 官方",
    desc: "Facebook 开源的前端框架，现代 Web 应用开发的事实标准，组件化和声明式编程",
    logo: "https://react.dev/favicon.ico",
    url: "https://react.dev/",
  },
  {
    name: "Vue 官方",
    desc: "渐进式 JavaScript 框架，学习曲线平缓，国内使用最广泛的前端框架",
    logo: "https://img2.baidu.com/it/u=4031380424,3433940810&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=655",
    url: "https://vuejs.org/",
  },
  {
    name: "Angular 官方",
    desc: "Google 开源的全功能前端框架，适合大型企业应用开发，功能最完整",
    logo: "https://img1.baidu.com/it/u=1926454470,3407931932&fm=253&fmt=auto&app=138&f=JPEG?w=774&h=500",
    url: "https://angular.io/",
  },
  {
    name: "TypeScript 官方",
    desc: "JavaScript 的超集，提供静态类型检查，现代前端开发的标准语言",
    logo: "https://www.typescriptlang.org/favicon.ico",
    url: "https://www.typescriptlang.org/",
  },
  {
    name: "Webpack 官方",
    desc: "最流行的模块打包器，前端工程化的基础工具，几乎所有现代项目都在用",
    logo: "	https://webpack.js.org/icon-square-small.9e8aff7a67a5dd20.svg",
    url: "https://webpack.js.org/",
  },
  {
    name: "Vite 官方",
    desc: "新一代前端构建工具，极速冷启动和模块热替换，逐渐成为主流选择",
    logo: "https://vitejs.dev/logo.svg",
    url: "https://vitejs.dev/",
  },
  {
    name: "Tailwind CSS",
    desc: "实用优先的 CSS 框架，快速构建现代化界面，越来越多项目采用",
    logo: "https://tailwindcss.com/favicon.ico",
    url: "https://tailwindcss.com/",
  },
  {
    name: "Element Plus",
    desc: "基于 Vue 3 的企业级 UI 组件库，国内最流行的 Vue UI 框架",
    logo: "https://element-plus.org/favicon.ico",
    url: "https://element-plus.org/zh-CN/",
  },
  {
    name: "Ant Design",
    desc: "企业级 UI 设计体系，提供 React、Vue 等多框架版本，大厂常用",
    logo: "https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png",
    url: "https://ant.design/index-cn",
  },
  {
    name: "Next.js 官方",
    desc: "React 的全栈框架，支持服务端渲染和静态生成，快速构建 Web 应用",
    logo: "https://nextjs.org/favicon.ico",
    url: "https://nextjs.org/",
  },
  {
    name: "Nuxt.js 官方",
    desc: "Vue 的通用框架，类似 Next.js，简化 Vue 全栈开发流程",
    logo: "https://nuxt.com/icon.png",
    url: "https://nuxt.com/",
  },
  {
    name: "MDN Web Docs",
    desc: "Mozilla 维护的 Web 技术权威文档，前端开发的必查资源",
    logo: "https://developer.mozilla.org/favicon.ico",
    url: "https://developer.mozilla.org/",
  },
  {
    name: "Figma - 设计工具",
    desc: "专业的 UI/UX 设计协作工具，现代前端设计的标准工具",
    logo: "https://static.figma.com/app/icon/1/favicon.png",
    url: "https://www.figma.com/",
  },
  {
    name: "Chrome DevTools 指南",
    desc: "掌握浏览器开发者工具，前端调试和性能优化的必备技能",
    logo: "https://www.google.com/favicon.ico?gws_rd=ssl",
    url: "https://developer.chrome.com/docs/devtools/",
  },
]);

// 注册链接数据到全局store
onMounted(() => {
  addLinks(3, '前端', communities.value)
})

const handleCommunityCardClick = (community) => {
  console.log(`点击了社区: ${community.name}`);
  logUserInteraction("community", community.name);

  if (community.url) {
    window.open(community.url, "_blank");
  }
};

const logUserInteraction = (type, target) => {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] 用户交互: ${type} - ${target}`);

  try {
    const interactions =
      JSON.parse(localStorage.getItem("userInteractions")) || [];
    interactions.push({
      type,
      target,
      timestamp,
    });

    if (interactions.length > 100) {
      interactions.shift();
    }

    localStorage.setItem("userInteractions", JSON.stringify(interactions));
  } catch (e) {
    console.warn("无法访问 localStorage:", e);
  }
};

const handleImageError = (event) => {
  // 当图片加载失败时，用备用图标替换
  event.target.style.display = 'none';
  const parent = event.target.parentElement;
  const fallbackIcon = parent.querySelector('.fallback-icon');
  if (!fallbackIcon) {
    const span = document.createElement('span');
    span.className = 'fallback-icon';
    span.textContent = '🔗';
    parent.appendChild(span);
  }
};
</script>

<style scoped>
/* Styles are in main.css */
</style>
