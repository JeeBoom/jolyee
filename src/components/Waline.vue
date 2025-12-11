<template>
  <div class="giscus-container">
    <div class="giscus"></div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'

const props = defineProps({
  repo: {
    type: String,
    default: 'JeeBoom/jolyee' // 你的 GitHub 仓库 owner/repo
  },
  repoId: {
    type: String,
    default: 'R_kgDOQmB3Qg' // 从 giscus.app 获取
  },
  category: {
    type: String,
    default: 'General' // Discussions 分类
  },
  categoryId: {
    type: String,
    default: 'DIC_kwDOQmB3Qs4Czp2o' // 从 giscus.app 获取
  }
})

// 获取当前主题
const getTheme = () => {
  return document.documentElement.getAttribute('data-theme') === 'dark' 
    ? 'dark' 
    : 'light'
}

// 加载 Giscus
const loadGiscus = () => {
  const container = document.querySelector('.giscus')
  if (!container) return

  // 清空容器
  container.innerHTML = ''

  // 创建 script 标签
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', props.repo)
  script.setAttribute('data-repo-id', props.repoId)
  script.setAttribute('data-category', props.category)
  script.setAttribute('data-category-id', props.categoryId)
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', getTheme())
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')
  script.crossOrigin = 'anonymous'
  script.async = true

  container.appendChild(script)
}

// 监听主题变化
const updateGiscusTheme = () => {
  const iframe = document.querySelector('.giscus-frame')
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: getTheme() } } },
      'https://giscus.app'
    )
  }
}

onMounted(() => {
  loadGiscus()

  // 监听主题切换
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        setTimeout(updateGiscusTheme, 100)
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })
})

</script>

<style scoped>
.giscus-container {
  max-width: 100%;
  margin-top: 3rem;
  padding: 2rem 0;
}

.giscus {
  width: 100%;
}

/* 响应式 */
:deep(.giscus-frame) {
  max-width: 100%;
}
</style>

