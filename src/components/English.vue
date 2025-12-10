<template>
  <section class="communities" id="english-section">
    <h2 class="section-title">英语</h2>
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
          <div v-if="community.logo" class="platform-icon" :class="community.iconClass">
            <img :src="community.logo" :alt="community.name" class="logo-image" @error="handleImageError" />
          </div>
          <h3 class="card-title">{{ community.name }}</h3>
        </div>
        <p class="card-desc">{{ community.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useLinksStore } from '../utils/linksStore'
const { addLinks } = useLinksStore()

const communities = ref([
  {
    name: '有道翻译',
    desc: '有道翻译提供即时免费的中文、英语、日语、韩语、法语、德语、俄语、西班牙语、葡萄牙语、越南语、印尼语、意大利语、荷兰语、泰语全文翻译、网页翻译、文档翻译、PDF翻译、DOC翻译、PPT翻译、人工翻译、同传等服务。',
    logo: 'https://ydlunacommon-cdn.nosdn.127.net/31cf4b56e6c0b3af668aa079de1a898c.png', 
    url: 'https://fanyi.youdao.com/'
  },
  {
    name: '巴别英语 - 英语听力练习,看美剧学英语',
    desc: '看美剧和TED演讲练习英语听力和口语，海量免费资源，单句复读、灵活中英字幕设置等专为英语学习设计的功能',
    logo: 'https://www.babelabc.com/favicon.ico', 
    url: 'https://www.babelabc.com/'
  },
   {
    name: '经典英文名著小说 - 与经典邂逅，与英语共舞',
    desc: '看美剧和TED演讲练习英语听力和口语，海量免费资源，单句复读、灵活中英字幕设置等专为英语学习设计的功能',
    logo: 'https://bookyell.com/asset/images/favicon.png', 
    url: 'https://bookyell.com/'
  },
   {
    name: 'FreeMdict Forum - 英语论坛',
    desc: 'MDX MDD 免费 下载 技术交流 学习资料',
    logo: 'https://forumcdn.freemdict.com/uploads/default/optimized/1X/2180ed6a0534a9290a33abd13226859a832f6207_2_32x32.png', 
    url: 'https://forum.freemdict.com/'
  },
])

// 注册链接数据到全局store
onMounted(() => {
  addLinks(9, '英语', communities.value)
})

const handleCommunityCardClick = (community) => {
  console.log(`点击了社区: ${community.name}`)
  logUserInteraction('community', community.name)
  
  if (community.url) {
    window.open(community.url, '_blank')
  }
}

const logUserInteraction = (type, target) => {
  const timestamp = new Date().toLocaleString()
  console.log(`[${timestamp}] 用户交互: ${type} - ${target}`)

  try {
    const interactions = JSON.parse(localStorage.getItem('userInteractions')) || []
    interactions.push({
      type,
      target,
      timestamp
    })

    if (interactions.length > 100) {
      interactions.shift()
    }

    localStorage.setItem('userInteractions', JSON.stringify(interactions))
  } catch (e) {
    console.warn('无法访问 localStorage:', e)
  }
}
</script>

<style scoped>
/* Styles are in main.css */
</style>
