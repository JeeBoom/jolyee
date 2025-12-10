<template>
  <section class="communities" id="communities-section">
    <h2 class="section-title">优质社区</h2>
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

const { addLinks } = useLinksStore();

const communities = ref([
  {
    name: "LINUX DO - 新的理想...",
    desc: "佬友你好，里面个个都是人才，说话又好听，氛围超好，国内数一数二的优质社区",
    logo: "https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png",
    url: "https://linux.do",
  },
  {
    name: "reddit",
    desc: "数百万用户在此聚集，讨论各自关心的话题,需科学",
    logo: "https://www.reddit.com/favicon.ico", 
    url: "https://www.reddit.com",
  },
  {
    name: "2Libra",
    desc: "「 2Libra 」，To Balance，走向平衡，一个以工作与生活平衡为核心的社区。",
    logo: "https://2libra.com/favicon.ico", 
    url: "https://2libra.com/",
  },
  {
    name: "虫部落",
    desc: "虫部落是一个纯粹的搜索知识、技术和经验分享平台，虫部落快搜、虫部落学术搜索等搜索聚合工具均为虫部落原创出品，搜索世界的乐趣，就在虫部落！",
    logo: "https://www.chongbuluo.com/static/image/common/logo-light-icon.svg", 
    url: "https://www.chongbuluo.com",
  },
  {
    name: "V2EX - 一个关于分享...",
    desc: "V2EX是一个面向程序员、极客人群的分享交流社区，需科学",
    logo: "https://www.v2ex.com/static/favicon.ico", 
    url: "https://www.v2ex.com",
  },
  {
    name: "V2EX（镜像）",
    desc: "V2EX是一个面向程序员、极客人群的分享交流社区，需科学",
    logo: "https://www.v2ex.com/static/favicon.ico", 
    url: "https://v2ex.jscdn.cn",
  },
  // {
  //   name: "SegmentFault（思否）",
  //   desc: "国内主流的技术问答与社区平台，功能类似 Stack Overflow，同时提供技术博客、专栏、课程等内容。支持提问、回答、文章投稿，还有技术招聘板块，适合开发者解决问题、分享经验和求职交流。",
  //   logo: "https://img2.baidu.com/it/u=1761179647,3217879606&fm=253&fmt=auto&app=138&f=PNG?w=500&h=750", 
  //   url: "https://segmentfault.com/",
  // },
  {
    name: "豆瓣小组",
    desc: "豆瓣小组",
    logo: "https://www.douban.com/favicon.ico", // 请填入豆瓣的 logo URL
    url: "https://www.douban.com/group",
  },
  {
    name: "吾爱破解",
    desc: "逆向破解爱好者聚集地",
    logo: "https://www.52pojie.cn/favicon.ico", // 请填入豆瓣的 logo URL
    url: "https://www.52pojie.cn/",
  },
  {
    name: "百度贴吧",
    desc: "百度贴吧是中国最大的中文交互论坛，讨论各种话题。",
    logo: "https://files.codelife.cc/itab/search/baidu.svg", // 请填入百度贴吧的 logo URL
    url: "https://tieba.baidu.com",
  },
  {
    name: "NewsNow",
    desc: "NewsNow - 实时新闻聚合阅读器，汇集全球热点新闻，提供优雅的阅读体验",
    logo: "https://newsnow.busiyi.world/icon.svg", // 请填入 NewsNow 的 logo URL
    url: "https://www.newsnow.co.uk",
  },
  {
    name: "少数派 - 高效工作、品...",
    desc: "少数派致力于更好地运用数字产品或科学方法，帮助用户提升工作效率和生活品质",
    logo: "https://cdn-static.sspai.com/favicon/sspai.ico", // 请填入少数派的 logo URL
    url: "https://sspai.com",
  },
  // {
  //   name: '稀土掘金',
  //   desc: '分享挖掘有价值的技术。',
  //   logo: '//lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg', // 请填入掘金的 logo URL
  //   url: 'https://juejin.cn'
  // },
  // {
  //   name: 'SOV2EX - 一个关于的 V2EX...',
  //   desc: 'SOV2EX，一个关于的V2EX社区版本的讨论、问答平台。',
  //   logo: '', // 请填入 SOV2EX 的 logo URL
  //   url: 'https://sov2ex.com'
  // },
  {
    name: "今日榜单",
    desc: "今日热榜汇聚全网热搜：知乎热榜、微博热搜、百度热搜、IT之家、36氪、少数派、豆瓣、小红书、百度贴吧、虎扑、虎嗅、天涯、哔哩哔哩、小众软件、抖音、吾爱破解、GitHub、技术期刊 全网热点 新闻 热词 排行榜 摸鱼神器",
    logo: "https://file.ipadown.com/tophub/assets/images/logo.png", // 请填入今日榜单的 logo URL
    url: "https://tophub.today",
  },
  {
    name: "阮一峰的个人网站",
    desc: "阮一峰的个人网站，分享编程、技术、互联网相关的文章和资源。",
    logo: "https://www.ruanyifeng.com/favicon.ico", // 请填入国网热点的 logo URL
    url: "https://www.ruanyifeng.com/",
  },
  {
    name: "码砖猿",
    desc: "各大平台热搜榜",
    logo: "https://nav.lhzzs.top/favicon_logo.ico", // 请填入码农栈的 logo URL
    url: "https://nav.lhzzs.top",
  },
  {
    name: "w2solo",
    desc: "w2solo - 独立开发者社区，专注于独立创业、产品交流与分享。",
    logo: "https://indiehackers-1251406926.cos.ap-chengdu.myqcloud.com/hackers/7cl3u.png", // 请填入 w2solo 的 logo URL
    url: "https://www.w2solo.com",
  },
  {
    name: "fshex",
    desc: "飞社-令人惊奇的创意工作者社区",
    logo: "https://fshex.com/favicon.ico", // 请填入 fshex 的 logo URL
    url: "https://www.fshex.com",
  },
  {
    name: "iSharkFly - 飞鲨",
    desc: "飞鲨",
    logo: "https://com-ossez-www-discourse.s3.dualstack.us-east-2.amazonaws.com/discourse-uploads/optimized/1X/_129430568242d1b7f853bb13ebea28b3f6af4e7_2_32x32.png", // 请填入 iSharkFly 的 logo URL
    url: "https://www.isharkfly.com",
  },
  {
    name: "虎扑",
    desc: "虎扑是以体育赛事和男性兴趣生活为主的社区网站。专注于NBA赛程、NBA录像、NBA直播、NBA资讯、球员交易、足球、英超、电竞、LPL等全部篮球足球电竞赛事，并提供虎扑步行街社区服务。",
    logo: "https://img1.baidu.com/it/u=2114272573,1667751638&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500", // 请填入虎火知的 logo URL
    url: "https://bbs.hupu.com/",
  },
  {
    name: "nodeseek",
    desc: "Nodeseek是一个适合喜欢网络开发、托管、vps/服务器和其他极客事物的人的地方",
    logo: "https://www.nodeseek.com/static/image/favicon/favicon-32x32.png", // 请填入 nodeseek 的 logo URL
    url: "https://www.nodeseek.com",
  },
  {
    name: "node社区",
    desc: "CNode - Node.js 中文社区",
    logo: "https://static2.cnodejs.org/public/images/cnode_icon_32.png", // 请填入 CNode 的 logo URL
    url: "https://cnodejs.org",
  },
  {
    name: "codenews",
    desc: "codenews 是一个专注于【技术发明创造】交流的社区",
    logo: "https://codenews.cc/favicon.ico", // 请填入 codenews 的 logo URL
    url: "https://codenews.cc",
  },
  {
    name: "中关村在线|泰格利",
    desc: "中关村手机报价搜索平台",
    logo: "https://icon.zol-img.com.cn/mainpage/2019logo/product-logo.png", // 请填入中关村在线的 logo URL
    url: "https://www.zol.com.cn",
  },
  {
    name: "摸鱼派",
    desc: "如果你也是奋斗在一线、热爱工作的苦逼青年，期待与众多鱼油聚集起来，那就加入友好的摸鱼派社区吧！",
    logo: "https://fishpi.cn/images/favicon.png?2.9.9", 
    url: "https://www.sheyupi.com",
  },
  {
    name: "OSChina（开源中国）",
    desc: "国内老牌开源社区，提供开源项目托管、技术资讯、问答社区、代码分享等服务。聚集了大量国内开源爱好者，是了解国产开源项目、参与本土开源协作的重要平台。",
    logo: "https://img0.baidu.com/it/u=3493317179,646773639&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500", 
    url: "https://www.oschina.net/",
  },
]);

// 注册链接数据到全局store
onMounted(() => {
  addLinks(0, "优质社区", communities.value);
});

const handleCommunityCardClick = (community) => {
  console.log(`点击了社区: ${community.name}`);
  logUserInteraction("community", community.name);

  if (community.url) {
    window.open(community.url, "_blank");
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
