<template>
  <section class="communities" id="it-section">
    <h2 class="section-title">IT平台</h2>
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
    name: "Github",
    desc: "一个面向开源及私有软件项目的托管平台",
    logo: "https://github.com/favicon.ico", 
    url: "https://github.com/",
  },
  {
    name: "码云",
    desc: "一个面向开源及私有软件项目的托管平台",
    logo: "https://img1.baidu.com/it/u=2703861377,3432194255&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500", 
    url: "https://gitee.com/",
  },
  {
    name: "稀土掘金",
    desc: "分享挖掘有价值的技术。",
    logo: "//lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg", // 请填入掘金的 logo URL
    url: "https://juejin.cn",
  },
  {
    name: "CSDN",
    desc: "CSDN是全球知名中文IT技术交流平台,创建于1999年,包含原创博客、精品问答、职业培训、技术论坛、资源下载等产品服务,提供原创、优质、完整内容的专业IT技术开发社区",
    logo: "https://blog.csdn.net/favicon.ico", // 请填入 reddit 的 logo URL
    url: "https://blog.csdn.net/",
  },
  {
    name: "Stack Overflow",
    desc: "全球最大的技术问答网站",
    logo: "https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png?v=c78bd457575a", // 请填入掘金的 logo URL
    url: "https://stackoverflow.com/",
  },
  {
    name: "博客园",
    desc: "博客园是一个面向开发者的知识分享社区",
    logo: "https://www.cnblogs.com/images/logo.svg?v=2SMrXdIvlZwVoB1akyXm38WIKuTHVqvGD0CweV-B6cY", // 请填入摄鱼派的 logo URL
    url: "https://2libra.com/",
  },
]);

// 注册链接数据到全局store
onMounted(() => {
  addLinks(1, 'IT平台', communities.value)
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
