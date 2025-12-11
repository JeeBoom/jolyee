<template>
  <div class="scroll-buttons">
    <!-- 回到顶部按钮 -->
    <transition name="slide-fade">
      <button 
        v-if="isVisible"
        class="back-to-top"
        @click="scrollToTop"
        aria-label="返回顶部"
        title="返回顶部"
      >
        <span>⬆</span>
      </button>
    </transition>
    
    <!-- 回到底部按钮 -->
    <transition name="slide-fade">
      <button 
        v-if="isVisible"
        class="back-to-bottom"
        @click="scrollToBottom"
        aria-label="滑到底部"
        title="滑到底部"
      >
        <span>⬇</span>
      </button>
    </transition>
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
/* 进入和离开动画 */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.4s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
