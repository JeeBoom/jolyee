<template>
  <button 
    :class="['back-to-top', { show: isVisible }]"
    @click="handleClick"
    :aria-label="buttonLabel"
    :title="buttonLabel"
  >
    <span>{{ buttonIcon }}</span>
  </button>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0)
const isVisible = ref(false)
const docHeight = ref(0)

// 判断是否超过页面一半高度
const isPastHalfway = computed(() => {
  const totalScrollableHeight = docHeight.value - window.innerHeight
  return scrollY.value > totalScrollableHeight / 2
})

// 动态设置按钮文字和图标
const buttonLabel = computed(() => {
  return isPastHalfway.value ? '返回顶部' : '滑到底部'
})

const buttonIcon = computed(() => {
  return isPastHalfway.value ? '⬆' : '⬇'
})

const handleScroll = () => {
  scrollY.value = window.scrollY
  docHeight.value = document.documentElement.scrollHeight
  // 只要不在顶部就显示按钮
  isVisible.value = scrollY.value > 50
}

const handleClick = () => {
  if (isPastHalfway.value) {
    // 如果超过一半，回到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  } else {
    // 如果未超过一半，滚到底部
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  // 初始化高度
  docHeight.value = document.documentElement.scrollHeight
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Styles are in main.css */
</style>
