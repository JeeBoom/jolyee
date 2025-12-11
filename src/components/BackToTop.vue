<template>
  <div class="scroll-buttons">
    <!-- 回到顶部按钮 -->
    <button 
      :class="['back-to-top', { show: isVisible }]"
      @click="scrollToTop"
      aria-label="返回顶部"
      title="返回顶部"
    >
      <span>⬆</span>
    </button>
    
    <!-- 回到底部按钮 -->
    <button 
      :class="['back-to-bottom', { show: isVisible }]"
      @click="scrollToBottom"
      aria-label="滑到底部"
      title="滑到底部"
    >
      <span>⬇</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const handleScroll = () => {
  // 只要不在顶部就显示按钮
  isVisible.value = window.scrollY > 50
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Styles are in main.css */
</style>
