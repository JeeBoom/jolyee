<template>
  <section class="communities" id="ai-section">
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
import { logUserInteraction } from '../utils/syncService'

const { addLinks } = useLinksStore()

const communities = ref([
  {
    name: "ChatGpt",
    desc: "最强chatgpt,需科学",
    logo: "https://pic.rmb.bdstatic.com/bjh/21b3bc839c7f75e0d4ff305a226da8332224.jpeg", 
    url: "https://chatgpt.com/",
  },
  {
    name: "DeepSeek",
    desc: "深度求索（DeepSeek）助力编程代码开发、创意写作、文件处理等任务，支持文件上传及长文本对话，随时为您提供高效的AI支持。",
    logo: "https://chat.deepseek.com/favicon.svg", 
    url: "https://chat.deepseek.com/",
  },
  {
    name: "豆包AI",
    desc: "豆包是字节跳动公司基于云雀模型开发的AI工具，提供聊天机器人、写作助手以及英语学习助手等功能，它可以回答各种问题并进行对话，帮助人们获取信息，支持网页 Web 平台, Windows/macOS 电脑版客户端，iOS 以及安卓平台。",
    logo: "https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/web/logo-icon.png", 
    url: "https://www.doubao.com/chat/",
  },
  {
    name: "Kimi.AI",
    desc: "国内的免费大模型 Kimi Chat，很强大",
    logo: "https://statics.moonshot.cn/kimi-chat/favicon.ico", 
    url: "https://kimi.moonshot.cn/",
  },
  {
    name: "智谱AI开放平台",
    desc: "智谱大模型开放平台-新一代国产自主通用AI大模型开放平台，是国内大模型排名前列的大模型网站，研发了多款LLM模型，多模态视觉模型产品，致力于将AI产品技术与行业场景双轮驱动的中国先进的认知智能技术和千行百业应用相结合，构建更高精度、高效率、通用化的AI开发新模式和企业级解决方案，实现智谱大模型的产业化，将AI的好处带给每个人。",
    logo: "https://bigmodel.cn/img/icons/favicon-32x32.png", 
    url: "https://bigmodel.cn/",
  },
  {
    name: "文心一言",
    desc: "百度全新一代知识增强大语言模型，文心大模型家族的新成员，能够与人对话互动、回答问题、协助创作，高效便捷地帮助人们获取信息、知识和灵感。",
    logo: "https://nlp-eb.cdn.bcebos.com/logo/favicon.ico", 
    url: "https://yiyan.baidu.com/",
  },

  {
    name: "扣子空间",
    desc: "精通各项技能的「通用实习生」，各行各业的「领域专家」，任你选择",
    logo: "https://sf-coze-web-cdn.coze.com/obj/coze-web-us/obric/coze/favicon.1970.png", 
    url: "https://www.coze.cn/",
  },
  {
    name: "通义千问",
    desc: "阿里免费大模型 非常好用！！！",
    logo: "https://img.alicdn.com/imgextra/i4/O1CN01FOwagl1XBpyVA2QVy_!!6000000002886-2-tps-512-512.png", 
    url: "https://tongyi.aliyun.com/qianwen/",
  },
    {
    name: "木瓜AI",
    desc: "丰富的内置AI工具，涵盖文本生成、图像生成、代码生成等多种功能，满足不同用户的需求。",
    logo: "https://www.mooko.ai/favicon.ico", 
    url: "https://www.papayagpt.com/",
  },
  {
    name: "Beautiful.ai（PPT）",
    desc: "创建专业演示文稿的更快方法",
    logo: "https://global-uploads.webflow.com/59deb588800ae30001ec19c9/5d4891e0e260e3c1bc37b100_beautiful%20ai%20favicon%20%20blue%20square.png", 
    url: "https://www.beautiful.ai/",
  },
  {
    name: "非猪ai导航",
    desc: "ai导航-非猪ai导航,一起用ai工具集箱指南网站吧!让你秒变飞猪的人工智能研究所,收集国内外aigc软件服务网址导航",
    logo: "https://feizhuke.com/zhufav.png", 
    url: "https://feizhuke.com/",
  },
  {
    name: "AI 工具集",
    desc: "AI工具集导航官网收录了国内外数百个AI工具，包括AI写作工具、AI图像生成和背景移除、AI视频制作、AI音频转录、AI辅助编程、AI音乐生成、AI绘画设计、AI对话聊天等AI工具集合大全，以及AI学习开发的常用网站、框架和模型，帮助你加入人工智能浪潮，自动化高效完成任务！",
    logo: "https://ai-bot.cn/wp-content/uploads/2023/03/ai-bot-square-logo.png", 
    url: "https://ai-bot.cn/",
  },
  {
    name: "免费ChatGPT站点集合",
    desc: "Free ChatGPT Site List",
    logo: "https://github.com/favicon.ico", 
    url: "https://chatgpt.com/",
  },
]);

// 注册链接数据到全局store
onMounted(() => {
  addLinks(2, 'AI工具', communities.value)
})

const handleCommunityCardClick = (community) => {
  console.log(`点击了社区: ${community.name}`);
  logUserInteraction("ai", community.name, community.url);

  if (community.url) {
    window.open(community.url, "_blank");
  }
};

</script>

<style scoped>
/* Styles are in main.css */
</style>
