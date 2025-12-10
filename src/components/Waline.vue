<template>
  <div class="disqus-container">
    <div id="disqus_thread"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  shortname: {
    type: String,
    default: 'https-jolyee-net' // 你的 Disqus shortname
  }
})

onMounted(() => {
  // Disqus 配置
  window.disqus_config = function () {
    this.page.url = window.location.href
    this.page.identifier = window.location.pathname
    this.page.title = document.title
  }

  // 异步加载 Disqus 脚本
  if (document.getElementById('disqus-script')) {
    // 脚本已加载，重新重置评论
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true
      })
    }
  } else {
    // 加载 Disqus 脚本
    const script = document.createElement('script')
    script.id = 'disqus-script'
    script.src = `https://${props.shortname}.disqus.com/embed.js`
    script.async = true
    script.setAttribute('data-timestamp', new Date().getTime())
    
    script.onload = () => {
      console.log('Disqus script loaded successfully')
    }
    
    script.onerror = () => {
      console.error('Failed to load Disqus script')
    }
    
    document.body.appendChild(script)
  }
})

</script>

<style scoped>
.disqus-container {
  max-width: 100%;
  margin-top: 3rem;
  padding: 2rem 0;
  /* border-top: 1px solid var(--border-color); */
}

:deep(#disqus_thread) {
  color: var(--text-primary);
}

/* Disqus iframe 响应式 */
:deep(iframe) {
  max-width: 100%;
}

:deep(.disqus-footer--refresh){
  display: none !important;
}
:deep(.disqus-footer__wrapper .disqus-footer__wrapper--refresh){
  display: none !important;
}

/* 隐藏 "What do you think?" 文字 */
/* :deep(.disqus-text-post-close-box){
  display: none !important;
}
:deep(.disqus-post-close-box){
  display: none !important;
}
:deep(.disqus-iframe-container .disqus-iframe-container-inner .disqus-container .disqus-header){
  display: none !important;
}
:deep(h3 a[href*="disqus"]) {
  display: none !important;
} */
</style>

