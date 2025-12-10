<template>
  <section class="communities" id="backend-section">
    <h2 class="section-title">后端</h2>
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
            <img :src="community.logo" :alt="community.name" class="logo-image" />
          </div>
          <h3 class="card-title">{{ community.name }}</h3>
        </div>
        <p class="card-desc">{{ community.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLinksStore } from '../utils/linksStore'

const { addLinks } = useLinksStore()

const communities = ref([
  {
    name: 'Java 面试指南 | JavaGuide',
    desc: '「Java学习 + 面试指南」一份涵盖大部分 Java 程序员所需要掌握的核心知识。准备 Java 面试，首选 JavaGuide！',
    logo: 'https://javaguide.cn/favicon.ico', 
    url: 'https://javaguide.cn/'
  },
   {
    name: '面试鸭',
    desc: '面试鸭 - 程序员求职面试刷题神器，高频编程题目免费刷',
    logo: 'https://www.mianshiya.com/favicon.ico', 
    url: 'https://www.mianshiya.com/'
  },
   {
    name: '小林coding',
    desc: '图解计算机网络、操作系统、计算机组成、MySQL、Redis，让天下没有难懂的八股文！',
    logo: 'https://cdn.xiaolincoding.com/icon.webp', 
    url: 'https://xiaolincoding.com/'
  },
   {
    name: 'CS自学指南',
    desc: 'CS自学指南',
    logo: 'https://csdiy.wiki/images/favicon.ico', 
    url: 'https://csdiy.wiki/'
  },
   {
    name: '书栈网',
    desc: '书栈网，IT程序员互联网开源编程书籍阅读分享，囊括小程序、前端、后端、移动端、云计算、大数据、区块链、机器学习、人工智能和面试笔试等相关书籍，助你【码】力十足！',
    logo: 'https://www.bookstack.cn/favicon.ico', 
    url: 'https://bgithub.xyz/cosen1024/Java-Interview/blob/main/README.md'
  },
])

// 注册链接数据到全局store
onMounted(() => {
  addLinks(4, '后端', communities.value)
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
