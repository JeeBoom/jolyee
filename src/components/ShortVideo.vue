<template>
  <section class="short-video" id="short-video-section">
    <div class="cards-grid">
      <article
        v-for="video in videoList"
        :key="video.name"
        class="card community-card"
        @click="handleVideoCardClick(video)"
        @keydown.enter="handleVideoCardClick(video)"
        tabindex="0"
        role="button"
      >
        <div class="card-header">
          <div class="platform-icon">
            <img
              :src="video.logo"
              :alt="video.name"
              class="logo-image"
              @error="handleImageError"
            />
          </div>
          <h3 class="card-title">{{ video.name }}</h3>
        </div>
        <p class="card-desc">{{ video.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLinksStore } from "../utils/linksStore";
import { logUserInteraction } from '../utils/syncService';

const { addLinks } = useLinksStore();

const videoList = ref([
  {
    name: "抖音",
    desc: "记录美好生活",
    logo: "https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico",
    url: "https://www.douyin.com/",
  },
  {
    name: "YouTube Shorts",
    desc: "短视频平台",
    logo: "https://www.youtube.com/favicon.ico?next_url=https%3A%2F%2Fwww.youtube.com%2F",
    url: "https://www.youtube.com/shorts",
  },
  {
    name: "快手",
    desc: "拥抱每一种生活",
    logo: "https://www.kuaishou.com/favicon.ico	",
    url: "https://www.kuaishou.com/",
  },
  {
    name: "小红书",
    desc: "标记我的生活",
    logo: "https://www.xiaohongshu.com/favicon.ico",
    url: "https://www.xiaohongshu.com/",
  },
  {
    name: "TikTok",
    desc: "Make Your Day",
    logo: "	https://www.tiktok.com/favicon.ico",
    url: "https://www.tiktok.com/",
  },

  {
    name: "西瓜视频",
    desc: "点亮对生活的好奇心",
    logo: "	https://www.ixigua.com/favicon.ico",
    url: "https://www.ixigua.com/",
  },
  {
    name: "Instagram Reels",
    desc: "Instagram 短视频",
    logo: "https://static.cdninstagram.com/rsrc.php/v3/yR/r/lam-fZmwmvn.png",
    url: "https://www.instagram.com/reels/",
  },
  {
    name: "好看视频",
    desc: "轻松有收获",
    logo: "https://www.haokan.com/favicon.ico",
    url: "https://haokan.baidu.com/",
  },
  {
    name: "微博视频",
    desc: "随时随地发现新鲜事",
    logo: "https://weibo.com/favicon.ico",
    url: "https://weibo.com/tv/home",
  },
  {
    name: "梨视频",
    desc: "中国领先的资讯短视频平台",
    logo: "	https://page.pearvideo.com/webres/img/favicon.ico	",
    url: "https://www.pearvideo.com/",
  },
]);

// 注册链接到全局store，索引4（购物平台之后）
onMounted(() => {
  addLinks(4, "短视频", videoList.value);
});

const handleVideoCardClick = (ShortVideo) => {
  console.log(`点击了短视频平台: ${ShortVideo.name}`);
  logUserInteraction("community", ShortVideo.name, ShortVideo.url);
  if (ShortVideo.url) {
    window.open(ShortVideo.url, "_blank");
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
    span.textContent = "🎥";
    parent.appendChild(span);
  }
};
</script>

<style scoped>
/* Styles are in main.css */
</style>
