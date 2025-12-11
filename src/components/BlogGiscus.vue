<template>
  <div class="blog-giscus-container">
    <div class="comment-header">
      <h3>💬 评论区</h3>
      <p class="comment-desc">欢迎留下你的想法和见解</p>
    </div>
    <div class="giscus"></div>
  </div>
</template>

<script setup>
import { onMounted, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  repo: {
    type: String,
    default: 'JeeBoom/jolyee'
  },
  repoId: {
    type: String,
    default: 'R_kgDOQmB3Qg'
  },
  category: {
    type: String,
    default: 'General'
  },
  categoryId: {
    type: String,
    default: 'DIC_kwDOQmB3Qs4Czp2o'
  },
  // 文章的唯一标识，用于区分不同文章的评论
  articleId: {
    type: [String, Number],
    default: ''
  }
})

let observer = null

// 获取当前主题
const getTheme = () => {
  return document.documentElement.getAttribute('data-theme') === 'dark' 
    ? 'dark' 
    : 'light'
}

// 加载 Giscus
const loadGiscus = () => {
  const container = document.querySelector('.blog-giscus-container .giscus')
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
  // 使用 specific 映射模式，这样每篇文章都有独立的评论区
  script.setAttribute('data-mapping', 'specific')
  script.setAttribute('data-term', `blog-${props.articleId}`)
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

// 更新 Giscus 主题
const updateGiscusTheme = () => {
  const iframe = document.querySelector('.blog-giscus-container .giscus-frame')
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: getTheme() } } },
      'https://giscus.app'
    )
  }
}

onMounted(() => {
  // 延迟加载，确保 DOM 已经准备好
  setTimeout(() => {
    loadGiscus()
  }, 300)

  // 监听主题切换
  observer = new MutationObserver((mutations) => {
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

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})

// 监听文章 ID 变化，重新加载评论
watch(() => props.articleId, () => {
  if (props.articleId) {
    setTimeout(loadGiscus, 100)
  }
})
</script>

<style scoped>
.blog-giscus-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.comment-header {
  margin-bottom: 2rem;
}

.comment-header h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.comment-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.giscus {
  width: 100%;
}

/* 响应式 */
:deep(.giscus-frame) {
  max-width: 100%;
}

@media (max-width: 768px) {
  .blog-giscus-container {
    margin-top: 2rem;
    padding-top: 1.5rem;
  }

  .comment-header h3 {
    font-size: 1.3rem;
  }
}
</style>
