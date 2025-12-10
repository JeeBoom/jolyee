<template>
  <!-- 二维码模态框 -->
  <transition name="qr-modal">
    <div v-if="isOpen" class="qr-modal-overlay" @click="close">
      <div class="qr-modal" @click.stop>
        <!-- 关闭按钮 -->
        <button class="qr-close" @click="close" title="关闭">✕</button>

        <!-- 二维码内容 -->
        <div class="qr-content">
          <h3 class="qr-title">{{ title }}</h3>
          <div class="qr-image-wrapper">
            <!-- 如果有真实二维码图片，显示图片；否则显示占位符 -->
            <img 
              v-if="qrImage" 
              :src="qrImage" 
              :alt="title"
              class="qr-image"
            />
            <div v-else class="qr-placeholder">
              <p>📱 {{ title }}</p>
              <p class="qr-placeholder-text">请扫描二维码进行支付</p>
              <p class="qr-placeholder-hint">（请替换为实际二维码图片）</p>
            </div>
          </div>
          <!-- <p class="qr-tip">扫描二维码即可支付</p> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '支付'
  },
  qrImage: {
    type: String,
    default: ''
  }
})

const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

// 暴露方法给父组件使用
defineExpose({
  open,
  close
})
</script>

<style scoped>
.qr-modal-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10002;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.qr-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.3s ease;
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
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.qr-close {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 32px;
  height: 32px;
  background: rgba(102, 126, 234, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.qr-close:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

.qr-content {
  text-align: center;
}

.qr-title {
  margin: 0 0 20px 0;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
}

.qr-image-wrapper {
  margin: 20px 0;
  padding: 15px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 2px dashed var(--primary-color);
}

.qr-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 4px;
}

.qr-placeholder {
  padding: 40px 20px;
  color: var(--text-secondary);
}

.qr-placeholder p {
  margin: 10px 0;
}

.qr-placeholder-text {
  font-size: 0.9rem;
}

.qr-placeholder-hint {
  font-size: 0.75rem;
  opacity: 0.7;
  font-style: italic;
}

.qr-tip {
  margin: 15px 0 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
  opacity: 0.8;
}

/* 动画过渡 */
.qr-modal-enter-active,
.qr-modal-leave-active {
  transition: opacity 0.3s ease;
}

.qr-modal-enter-from,
.qr-modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .qr-modal {
    max-width: 85vw;
    padding: 20px;
  }

  .qr-image-wrapper {
    padding: 10px;
  }
}
</style>
