<template>
  <section class="communities" id="movie-section">

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
import { useLinksStore } from "../utils/linksStore";
import { logUserInteraction } from '../utils/syncService';
const { addLinks } = useLinksStore();

const communities = ref([
  {
    name: "腾讯视频",
    desc: "腾讯视频是在线视频平台，拥有流行内容和专业的媒体运营能力，是聚合热播影视、综艺娱乐、体育赛事、新闻资讯等为一体的综合视频内容平台",
    logo: "https://v.qq.com/favicon.ico",
    url: "https://v.qq.com/",
  },
  {
    name: "YouTube",
    desc: "在 YouTube 上畅享您喜爱的视频和音乐，上传原创内容并与亲朋好友和全世界观众分享您的视频。",
    logo: "https://www.youtube.com/s/desktop/014dbbed/img/favicon_48x48.png",
    url: "https://www.youtube.com/",
  },
  {
    name: "哔哩哔哩",
    desc: "哔哩哔哩（bilibili.com)是国内知名的视频弹幕网站，这里有及时的动漫新番，活跃的ACG氛围，有创意的Up主。大家可以在这里找到许多欢乐。",
    logo: "https://www.bilibili.com/favicon.ico",
    url: "https://www.bilibili.com/",
  },
  {
    name: "AcFun",
    desc: "AcFun（A站）是中国大陆知名的弹幕视频分享网站，成立于2007年，主要面向二次元文化爱好者，提供动画、漫画、游戏、音乐等多种类型的视频内容。",
    logo: "https://www.acfun.cn/favicon.ico",
    url: "https://www.acfun.cn/",
  },
  {
    name: "爱奇艺",
    desc: "爱奇艺是中国领先的在线视频网站，提供海量正版高清影视剧、综艺、动漫、娱乐、体育等视频内容，以及原创自制节目。",
    logo: "https://www.iqiyi.com/favicon.ico",
    url: "https://www.iqiyi.com/",
  },
   {
    name: "ACG - 二次元资源导航",
    desc: "ACG - 二次元资源导航，收录了大量优质的二次元资源网站，涵盖动画、漫画、轻小说、游戏等多个类别，帮助用户快速找到所需的二次元内容。",
    logo: "https://www.acgdh.cc/favicon.ico",
    url: "https://www.acgdh.cc/",
  },
  {
    name: "动漫世界",
    desc: "人的悲欢本不相通我只觉得他们吵闹。",
    logo: "https://nav.acgsq.com/favicon.ico",
    url: "https://nav.acgsq.com/",
  },
  {
    name: "硬核指南-影视资源导航",
    desc: "硬核指南-影视资源导航，收录了大量优质的影视资源网站，涵盖电影、电视剧、综艺、动漫等多个类别，帮助用户快速找到所需的影视内容。",
    logo: "https://yinghezhinan.com/statics/images/logo-white.webp",
    url: "https://yinghezhinan.com/",
  },
  {
    name: "HBO",
    desc: "HBO 是美国有线电视网络，提供丰富的影视剧、纪录片、综艺节目等内容，旗下拥有众多知名影视作品和原创剧集。",
    logo: "https://www.hbo.com/favicon.ico",
    url: "https://www.hbo.com/",
  },
  {
    name: "爱迪影视 - 最新韩剧,韩国电视剧,美剧,日剧,爱迪影院,在线1080P",
    desc: "爱迪影视分享4K资源,1080P高清,Netflix奈菲最新电影,韩剧,日剧,电视剧,欧美剧,动漫等在线观看。",
    logo: "https://static.aidicdn.com/img/favicon.png",
    url: "https://adys.tv/",
  },
  {
    name: "影猫仓库",
    desc: "免费观第一站！",
    logo: "https://ymck.pro/upload/site/20230825-1/5c00fbcfb4ff0737d3c8320d30b2d1de.png",
    url: "https://adys.tv/",
  },
  {
    name: "最新最热门短剧 - 短剧派",
    desc: "💥 16000+部短剧，短剧网站、短剧流媒体、短片平台 | 全网资源最全 | 更新最快 | 免费短剧 📺 一站式短剧平台，聚合最新付费&免费短剧，极速更新，不容错过！",
    logo: "https://www.duanjupai.com/favicon.ico",
    url: "https://www.duanjupai.com/",
  },
]);

// 注册链接数据到全局store
onMounted(() => {
  addLinks(9, "影视资源", communities.value);
});

const handleCommunityCardClick = (community) => {
  console.log(`点击了社区: ${community.name}`);
  logUserInteraction("community", community.name, community.url);

  if (community.url) {
    window.open(community.url, "_blank");
  }
};

</script>

<style scoped>
/* Styles are in main.css */
</style>
