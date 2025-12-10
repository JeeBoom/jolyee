<template>
  <section class="communities" id="news-section">
    <h2 class="section-title">新闻资讯</h2>
    <div class="cards-grid">
      <article
        v-for="news in newsList"
        :key="news.name"
        class="card community-card"
        @click="handleNewsCardClick(news)"
        @keydown.enter="handleNewsCardClick(news)"
        tabindex="0"
        role="button"
      >
        <div class="card-header">
          <div v-if="news.logo" class="platform-icon" :class="news.iconClass">
            <img
              :src="news.logo"
              :alt="news.name"
              class="logo-image"
              @error="handleImageError"
            />
          </div>
          <div v-else class="platform-icon" :class="news.iconClass">
            <span class="fallback-icon">📰</span>
          </div>
          <h3 class="card-title">{{ news.name }}</h3>
        </div>
        <p class="card-desc">{{ news.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLinksStore } from "../utils/linksStore";

const { addLinks } = useLinksStore();

const newsList = ref([
  {
    name: "新华网",
    desc: "中国国家通讯社新华社主办的综合新闻信息服务门户网站",
    logo: "https://www.news.cn/favicon.ico",
    url: "https://www.news.cn/",
  },
  {
    name: "人民网",
    desc: "人民日报社控股的网络媒体，提供权威时政新闻与资讯",
    logo: "https://www.people.com.cn/favicon.ico",
    url: "https://www.people.com.cn/",
  },
  {
    name: "央视网",
    desc: "中央广播电视总台主办，提供视频新闻与直播服务",
    logo: "https://www.cctv.com/favicon.ico",
    url: "https://www.cctv.com/",
  },
  {
    name: "澎湃新闻",
    desc: "专注时政与思想的新闻平台，深度报道与评论",
    logo: "https://www.thepaper.cn/favicon.ico",
    url: "https://www.thepaper.cn/",
  },
  {
    name: "界面新闻",
    desc: "财经商业新闻网站，提供深度商业资讯",
    logo: "https://www.jiemian.com/favicon.ico",
    url: "https://www.jiemian.com/",
  },
  {
    name: "今日头条",
    desc: "个性化推荐资讯平台，汇聚各类新闻内容",
    logo: "https://www.toutiao.com/favicon.ico",
    url: "https://www.toutiao.com/",
  },
  {
    name: "腾讯新闻",
    desc: "腾讯旗下新闻资讯平台，覆盖时事热点与娱乐资讯",
    logo: "https://img1.baidu.com/it/u=2174410819,2866497518&fm=253&fmt=auto&app=138&f=PNG?w=410&h=410",
    url: "https://news.qq.com/",
  },
  {
    name: "网易新闻",
    desc: "网易旗下新闻门户，提供多元化新闻内容",
    logo: "https://news.163.com/favicon.ico",
    url: "https://news.163.com/",
  },
  {
    name: "新浪新闻",
    desc: "新浪门户网站新闻频道，实时更新热点新闻",
    logo: "https://news.sina.com.cn/favicon.ico",
    url: "https://news.sina.com.cn/",
  },
  {
    name: "搜狐新闻",
    desc: "搜狐旗下新闻资讯平台，多领域新闻覆盖",
    logo: "https://news.sohu.com/favicon.ico",
    url: "https://news.sohu.com/",
  },
  {
    name: "财新网",
    desc: "专业财经新闻媒体，提供深度财经报道",
    logo: "https://www.caixin.com/favicon.ico",
    url: "https://www.caixin.com/",
  },
  {
    name: "第一财经",
    desc: "上海广播电视台旗下财经媒体，专注经济金融",
    logo: "https://www.yicai.com/favicon.ico",
    url: "https://www.yicai.com/",
  },
  {
    name: "36氪",
    desc: "专注科技创业的信息服务平台，创投资讯",
    logo: "https://36kr.com/favicon.ico",
    url: "https://36kr.com/",
  },
  {
    name: "虎嗅网",
    desc: "聚合优质创新信息与人群的新媒体平台",
    logo: "https://www.huxiu.com/favicon.ico",
    url: "https://www.huxiu.com/",
  },
  {
    name: "钛媒体",
    desc: "TMT领域创新资讯平台，科技商业内容",
    logo: "https://www.tmtpost.com/favicon.ico",
    url: "https://www.tmtpost.com/",
  },
  {
    name: "BBC中文",
    desc: "英国广播公司中文网，国际新闻视角",
    logo: "https://www.bbc.com/favicon.ico",
    url: "https://www.bbc.com/zhongwen/simp",
  },
  {
    name: "纽约时报中文网",
    desc: "国际视野的中文新闻与深度报道",
    logo: "https://cn.nytimes.com/favicon.ico",
    url: "https://cn.nytimes.com/",
  },
  {
    name: "Reuters 路透社",
    desc: "全球知名通讯社，提供国际新闻与市场资讯",
    logo: "https://www.reuters.com/favicon.ico",
    url: "https://www.reuters.com/",
  },
]);

const handleNewsCardClick = (news) => {
  console.log(`点击了新闻: ${news.name}`);
  logUserInteraction("news", news.name);

  if (news.url) {
    window.open(news.url, "_blank");
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
    span.textContent = "📰";
    parent.appendChild(span);
  }
};

const logUserInteraction = (type, target) => {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] 用户交互: ${type} - ${target}`);

  try {
    const interactions = JSON.parse(localStorage.getItem("userInteractions")) || [];
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

onMounted(() => {
  addLinks(3, "新闻资讯", newsList.value);
});
</script>

<style scoped>
/* Styles are in main.css */
</style>
