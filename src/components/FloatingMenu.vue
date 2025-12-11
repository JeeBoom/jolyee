<template>
  <div class="floating-menu" @mouseenter="isExpanded = true" @mouseleave="isExpanded = false">
    <Transition name="toggle-fade">
      <div v-if="!isExpanded" class="floating-menu-toggle">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="menu-icon">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/>
        </svg>
      </div>
    </Transition>
    <Transition name="menu-fade">
      <nav v-if="isExpanded" class="floating-menu-list">
        <a
          v-for="(section, index) in sections"
          :key="index"
          :href="`#section-${index}`"
          class="floating-menu-item"
          @click.prevent="scrollToSection(index)"
        >
          <span class="menu-icon-emoji">{{ section.icon }}</span>
          <span class="menu-text">{{ section.title }}</span>
        </a>
      </nav>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  sections: {
    type: Array,
    required: true
  }
})

const isExpanded = ref(false)

const scrollToSection = (index) => {
  const element = document.querySelector(`#section-${index}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.floating-menu {
  position: fixed;
  right: 20px;
  top: 28%;
  transform: translateY(-50%);
  z-index: 100;
}

.floating-menu-toggle {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  cursor: pointer;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

html[data-theme="dark"] .floating-menu-toggle {
  background: rgba(42, 42, 42, 0.95);
  border-color: var(--border-color);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.floating-menu-toggle:hover {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-lg);
  transform: scale(1.05);
}

html[data-theme="dark"] .floating-menu-toggle:hover {
  background: rgba(50, 50, 50, 0.98);
}

.floating-menu-toggle .menu-icon {
  width: 20px;
  height: 20px;
  color: #333;
  transition: color 0.3s ease;
}

html[data-theme="dark"] .floating-menu-toggle .menu-icon {
  color: #e0e0e0;
}

.floating-menu:hover .floating-menu-toggle .menu-icon {
  color: #007bff;
}

html[data-theme="dark"] .floating-menu:hover .floating-menu-toggle .menu-icon {
  color: #00b0ff;
}

.floating-menu-list {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  width: auto;
  min-width: 140px;
  padding: 8px 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

/* Vue Transition 动画 */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.menu-fade-enter-from {
  opacity: 0;
  transform: translateX(10px) scale(0.95);
}

.menu-fade-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.menu-fade-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.menu-fade-leave-to {
  opacity: 0;
  transform: translateX(10px) scale(0.95);
}

/* 按钮淡入淡出动画 */
.toggle-fade-enter-active,
.toggle-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toggle-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.toggle-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}

.toggle-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.toggle-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

html[data-theme="dark"] .floating-menu-list {
  background: rgba(42, 42, 42, 0.95);
  border-color: var(--border-color);
}

.floating-menu-list::-webkit-scrollbar {
  width: 4px;
}

.floating-menu-list::-webkit-scrollbar-track {
  background: transparent;
}

.floating-menu-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.floating-menu-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.floating-menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: #333;
  font-size: 12px;
  white-space: nowrap;
  border: none;
  background: transparent;
  width: 100%;
  border-left: 3px solid transparent;
}

html[data-theme="dark"] .floating-menu-item {
  color: #d0d0d0;
}

.floating-menu-item:hover {
  background: rgba(0, 122, 204, 0.08);
  border-left-color: #007bff;
  color: #007bff;
}

html[data-theme="dark"] .floating-menu-item:hover {
  background: rgba(0, 176, 255, 0.2);
  border-left-color: #00b0ff;
  color: #00b0ff;
}

.floating-menu-item:active {
  transform: scale(0.98);
}

.menu-icon-emoji {
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
  width: 20px;
  min-width: 20px;
}

.menu-text {
  font-weight: 500;
  letter-spacing: 0.3px;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-menu {
    right: 10px;
    min-width: 45px;
  }

  .floating-menu-toggle {
    width: 36px;
    height: 36px;
  }

  .floating-menu-toggle .menu-icon {
    width: 18px;
    height: 18px;
  }

  .floating-menu-item {
    padding: 8px 10px;
    font-size: 11px;
    gap: 6px;
  }

  .menu-icon-emoji {
    font-size: 14px;
  }
}
</style>
