<template>
  <header class="site-header">
    <!-- 所有顶部按钮容器 -->
    <div class="header-buttons">
      <!-- 搜索框 -->
      <SearchBar :sections="sections" :all-links="allLinks" />
      
      <!-- 快捷键帮助 -->
      <button
        class="header-btn"
        @click="$emit('open-shortcuts')"
        title="快捷键帮助 (?)"
      >
        ⌨️
      </button>
      
      <!-- 主题切换 -->
      <button
        class="header-btn"
        @click="toggleTheme"
        :title="`切换到${isDark ? '亮' : '暗'}色模式 (Ctrl+K)`"
      >
        <span v-if="isDark">☀️</span>
        <span v-else>🌙</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SearchBar from './SearchBar.vue'

defineProps({
  sections: {
    type: Array,
    default: () => []
  },
  allLinks: {
    type: Array,
    default: () => []
  }
})

defineEmits(['open-shortcuts'])

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const loadTheme = () => {
  const saved = localStorage.getItem('theme')
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    // 检测系统主题
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  loadTheme()
})
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9995 !important;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 80px;
  padding-right: 20px;
  pointer-events: none;
  background: transparent;
}

.site-header > * {
  pointer-events: auto;
}

/* 按钮容器 - 统一管理所有顶部按钮 */
.header-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

/* 统一的按钮样式 */
.header-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color) !important;
  background: var(--bg-secondary) !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  font-size: 1.2rem;
  transition: all 0.3s ease !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 !important;
  margin: 0 !important;
}

.header-btn:hover {
  background: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  transform: rotate(20deg) scale(1.1);
}

.header-btn:active {
  transform: scale(0.95);
}

/* SearchBar 组件样式覆盖 - 确保一致性 */
:deep(.search-btn) {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%) !important;
  border: 2px solid var(--primary-color) !important;
  flex-shrink: 0;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.search-btn:hover) {
  transform: scale(1.1) !important;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
  border-color: var(--secondary-color) !important;
}

/* 移动设备适配 */
@media (max-width: 768px) {
  .site-header {
    padding-right: 80px;
  }

  .header-buttons {
    gap: 8px;
  }

  .header-btn,
  :deep(.search-btn) {
    width: 36px !important;
    height: 36px !important;
    font-size: 1rem;
  }
}

/* 超小屏幕 */
@media (max-width: 480px) {
  .site-header {
    padding-right: 70px;
  }

  .header-buttons {
    gap: 6px;
  }

  .header-btn,
  :deep(.search-btn) {
    width: 32px !important;
    height: 32px !important;
    border-width: 1px !important;
    font-size: 0.9rem;
  }
}
</style>
