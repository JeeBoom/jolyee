<template>
  <section class="communities" id="software-section">

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
          <div v-else class="platform-icon" :class="community.iconClass">
            <span class="fallback-icon">🔗</span>
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
    name: "奇迹秀工具箱",
    desc: "奇迹秀工具箱分享设计师必备设计工具及各类设计辅助神器，提供了丰富的设计辅助功能,还整合了各种主流的设计资源,让设计师在创作过程中更加高效、顺手。",
    logo: "https://www.qijishow.com/img/ico.ico",
    url: "https://www.qijishow.com/",
  },
  {
    name: "易破解 - 给你需要的内容",
    desc: "亿破姐『易破解』网站专注无流氓绿色软件分享、游戏下载、电脑技术、经验教程为一体的站点、安全、纯净、放心、十年磨一剑，不忘初心只为给你最需要的内容。",
    logo: "https://www.ypojie.com/favicon.ico",
    url: "https://www.ypojie.com/",
  },
  {
    name: "油猴插件市场",
    desc: "欢迎来到 Greasy Fork，一个专为用户脚本打造的网站。",
    logo: "https://greasyfork.org/vite/assets/blacklogo96-CxYTSM_T.png",
    url: "https://greasyfork.org/zh-CN",
  },
  {
    name: "小众软件 - 分享免费、小巧、实用、有趣、绿色的软件",
    desc: "小众软件是一个分享、体验、评测电脑软件、手机应用、互联网产品的网站",
    logo: "https://images3.appinn.com/wp-content/uploads/Appinn-icon-32.jpg",
    url: "https://www.appinn.com/",
  },
  {
    name: "AlternativeTo",
    desc: "AlternativeTo 这是一个帮助用户寻找软件替代品的知名平台,提供多语言支持包括中文界面,用户可通过搜索功能轻松发现同类应用",
    logo: "https://alternativeto.net/favicon.ico",
    url: "https://alternativeto.net/",
  },
  {
    name: "鸭先知 - 专注分享资源！",
    desc: "鸭先知（www.yxzhi.com）创办于2022年，是原资源否网站，专注于分享优质软件、技术、教程、脚本、插件等资源的综合性网站。找软件，找资源，学技术，提效率，尽在鸭先知！",
    logo: "https://www.yxzhi.com/wp-content/uploads/2023/06/favicon.png",
    url: "https://www.yxzhi.com/",
  },
  {
    name: "PS资源整合",
    desc: "windows 系列软件资源整合",
    logo: "",
    url: "https://jvhe.top/",
  },
  {
    name: "软仓",
    desc: "软仓（ruancang.net）是一个专注于提供各类专业软件下载与安装指导的资源平台，涵盖设计、办公、影视、数据分析、电子电路等多个领域。",
    logo: "",
    url: "https://www.ruancang.net/",
  },

  {
    name: "阡途应用商店",
    desc: "",
    logo: "",
    url: "http://www.tentod.com/",
  },
]);

// 注册链接数据到全局store
onMounted(() => {
  addLinks(11, '软件下载', communities.value)
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
