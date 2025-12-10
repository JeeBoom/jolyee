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
    logo: "https://img0.baidu.com/it/u=3777764509,3826402974&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=657", 
    url: "https://www.iconfont.cn/",
  },
  {
    name: "Fontawesome中文网",
    desc: "Font Awesome为您提供可缩放的矢量图标,您可以使用CSS所提供的所有特性对它们进行更改,包括:大小、颜色、阴影或者其它任何支持的效果",
    logo: "", 
    url: "https://fontawesome.com.cn/v5",
  },
  {
    name: "Vue-admin 合集",
    desc: "海量实用的管理模板集合",
    logo: "https://img2.baidu.com/it/u=4031380424,3433940810&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=655", 
    url: "https://vue-admin.cn/admin",
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
    logo: "https://static.shanyue.tech/images/23-06-21/clipboard-2282.daa749.webp", 
    url: "https://q.shanyue.tech/",
  },
  {
    name: "Echarts图表合集",
    desc: "Echarts Demo集",
    logo: "", 
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
    logo: "https://img2.baidu.com/it/u=1938770148,3486449529&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500", 
    url: "https://vueuse.org/",
  },
   {
    name: "IT - TOOLS",
    desc: "一个面向开发者及日常办公用户的多功能在线工具集合平台，核心作用是提供各类高效、便捷的实用工具，覆盖编码加密、格式转换、数据处理、开发辅助、日常计算等多个场景，无需本地安装软件即可快速完成相关操作，提升工作效率。",
    logo: "", 
    url: "https://tools.u14.app/",
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
</script>

<style scoped>
/* Styles are in main.css */
</style>
