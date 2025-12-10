<template>
  <Teleport to="body">
    <!-- 快捷键帮助模态框 -->
    <Transition name="fade">
      <div v-if="isOpen" class="shortcuts-overlay" @click.self="closeModal">
        <div class="shortcuts-modal">
          <!-- 头部 -->
          <div class="shortcuts-header">
            <h2>⌨️ 快捷键帮助</h2>
            <button class="close-btn" @click="closeModal" title="关闭(ESC)">
              ✕
            </button>
          </div>

          <!-- 快捷键列表 -->
          <div class="shortcuts-list">
            <div v-for="(shortcut, key) in shortcuts" :key="key" class="shortcut-item">
              <div class="shortcut-keys">
                <span v-if="shortcut.ctrl" class="key">Ctrl</span>
                <span v-if="shortcut.ctrl" class="plus">+</span>
                <span class="key">{{ formatKey(shortcut.key) }}</span>
              </div>
              <div class="shortcut-description">{{ shortcut.description }}</div>
            </div>
          </div>

          <!-- 底部提示 -->
          <div class="shortcuts-footer">
            <p>💡 按下 <span class="key">ESC</span> 关闭此帮助</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { shortcuts, setupKeyboardShortcuts } from '../utils/keyboardShortcuts'

const isOpen = ref(false)
let removeListener = null

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const formatKey = (key) => {
  const keyMap = {
    's': 'S',
    'b': 'B',
    'k': 'K',
    't': 'T',
    '?': '?',
    'f': 'F',
    'd': 'D',
    'Escape': 'ESC'
  }
  return keyMap[key] || key
}

// 将 openModal 暴露给父组件
defineExpose({
  openModal,
  closeModal
})

onMounted(() => {
  // 设置全局快捷键
  removeListener = setupKeyboardShortcuts((e) => {
    // 显示帮助: ?
    if (e.key === '?') {
      e.preventDefault()
      openModal()
    }
    // 关闭帮助: ESC
    if (e.key === 'Escape' && isOpen.value) {
      e.preventDefault()
      closeModal()
    }
  })
})

onUnmounted(() => {
  if (removeListener) {
    removeListener()
  }
})
</script>

<style scoped>
.shortcuts-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  animation: fadeIn 0.3s ease;
}

.shortcuts-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  width: 90%;
  animation: slideUp 0.3s ease;
}

.shortcuts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid var(--border-color);
}

.shortcuts-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--text-primary);
}

.shortcuts-list {
  padding: 24px;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.shortcut-item:last-child {
  border-bottom: none;
}

.shortcut-keys {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.key {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 4px 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 32px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.plus {
  color: var(--text-secondary);
  margin: 0 4px;
}

.shortcut-description {
  color: var(--text-secondary);
  flex: 1;
  margin-left: 20px;
}

.shortcuts-footer {
  padding: 16px 24px;
  background: rgba(102, 126, 234, 0.05);
  border-top: 1px solid var(--border-color);
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.shortcuts-footer p {
  margin: 0;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .shortcuts-modal {
    width: 95%;
    max-height: 90vh;
  }

  .shortcuts-header {
    padding: 16px;
  }

  .shortcuts-header h2 {
    font-size: 1.2rem;
  }

  .shortcuts-list {
    padding: 16px;
  }

  .shortcut-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .shortcut-description {
    margin-left: 0;
  }
}
</style>
