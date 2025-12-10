<template>
  <section class="search-engines">
    <h2 class="section-title">搜索引擎</h2>
    <div class="cards-grid">
      <article 
        v-for="engine in searchEngines" 
        :key="engine.name"
        class="card search-card"
        @click="handleSearchEngineClick(engine)"
        @keydown.enter="handleSearchEngineClick(engine)"
        tabindex="0"
        role="button"
      >
        <div class="card-icon">
          <span :class="['icon', engine.iconClass]">{{ engine.icon }}</span>
        </div>
        <h3 class="card-title">{{ engine.name }}</h3>
        <p class="card-desc">{{ engine.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useLinksStore } from '../utils/linksStore'
const { addLinks } = useLinksStore()

const searchEngines = ref([
  {
    name: 'Google',
    icon: 'G',
    iconClass: 'icon-google',
    desc: 'Google搜索',
    url: 'https://www.google.com'
  },
  {
    name: 'Yandex - fast Intern...',
    icon: 'Y',
    iconClass: 'icon-yandex',
    desc: 'Yandex是俄罗斯最大的搜索引擎。搜索、图片、新闻——一切尽在Yandex。',
    url: 'https://yandex.com'
  },
  {
    name: '搜索 - Microsoft 的版',
    icon: 'b',
    iconClass: 'icon-bing',
    desc: '使用 Microsoft 必应搜索体验，获得更多 AI 功能，将搜索转换成效率，助力学习。查询功能。',
    url: 'https://www.bing.com'
  }
])

const handleSearchEngineClick = (engine) => {
  window.open(engine.url, '_blank')
  logUserInteraction('search_engine', engine.name)
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
