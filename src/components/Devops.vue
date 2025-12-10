<template>
  <section class="communities" id="devops-section">
    <h2 class="section-title">运维/测试</h2>
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
import { ref,onMounted } from 'vue'
import { useLinksStore } from '../utils/linksStore'

const { addLinks } = useLinksStore()
const communities = ref([
  {
    name: '测试之家',
    desc: '测试之家（TesterHome）由一线测试工程师发起和运营，社区的主旨是公益，开源，分享，落地',
    logo: 'https://testerhome.com/photo/favicon.png', 
    url: 'https://testerhome.com/'
  },
   {
    name: '爱测-测试人社区',
    desc: '爱测-测试人社区隶属于测吧（北京）科技有限公司，是一个软件测试爱好者的技术交流社区，主要做：软件测试、软件测试入门、自动化测试、 性能测试、测试开发、接口测试、测试开发培训 、自动化测试培训、  python自动化测试、java自动化测试、测试教程、全栈测试、测试面试题、appium 、selenium 、jmeter、jenkins、 loadrunner、测试平台、 开源测试',
    logo: '', 
    url: 'https://testerhome.com/'
  },
])

// 注册链接数据到全局store
onMounted(() => {
  addLinks(5, '测试运维', communities.value)
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
