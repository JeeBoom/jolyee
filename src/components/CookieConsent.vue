<template>
  <transition name="cookie-fade">
    <div v-if="showBanner" class="cookie-consent-banner">
      <div class="cookie-content">
        <div class="cookie-icon">🍪</div>
        <div class="cookie-text">
          <h3>Cookie 使用说明</h3>
          <p>
            我们使用 Cookie 和类似技术来改善您的浏览体验，提供个性化内容和广告（包括 Google AdSense）。
            继续使用本网站即表示您同意我们的 
            <router-link to="/privacy" class="policy-link">隐私政策</router-link> 和 
            <router-link to="/terms" class="policy-link">服务条款</router-link>。
          </p>
        </div>
        <div class="cookie-actions">
          <button @click="acceptCookies" class="btn-accept">接受</button>
          <button @click="rejectCookies" class="btn-reject">拒绝</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showBanner = ref(false)

const acceptCookies = () => {
  localStorage.setItem('cookieConsent', 'accepted')
  showBanner.value = false
  // 这里可以初始化 Google AdSense 或其他追踪代码
  console.log('Cookie consent accepted')
}

const rejectCookies = () => {
  localStorage.setItem('cookieConsent', 'rejected')
  showBanner.value = false
  console.log('Cookie consent rejected')
}

onMounted(() => {
  // 检查用户是否已经做出选择
  const consent = localStorage.getItem('cookieConsent')
  if (!consent) {
    // 延迟1秒显示，避免太突兀
    setTimeout(() => {
      showBanner.value = true
    }, 1000)
  }
})
</script>

<style scoped>
.cookie-consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background: var(--bg-primary);
  border-top: 2px solid var(--primary-color);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
}

.cookie-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.cookie-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.cookie-text {
  flex: 1;
  min-width: 300px;
}

.cookie-text h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.cookie-text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.policy-link {
  color: var(--primary-color);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease;
}

.policy-link:hover {
  color: var(--secondary-color);
}

.cookie-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.btn-accept,
.btn-reject {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-accept {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-accept:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
}

.btn-reject {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-reject:hover {
  background: var(--bg-hover);
  border-color: var(--primary-color);
}

/* 动画效果 */
.cookie-fade-enter-active,
.cookie-fade-leave-active {
  transition: all 0.4s ease;
}

.cookie-fade-enter-from,
.cookie-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 深色模式 */
html[data-theme="dark"] .cookie-consent-banner {
  background: var(--bg-secondary);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .cookie-consent-banner {
    padding: 15px;
  }

  .cookie-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .cookie-icon {
    font-size: 36px;
  }

  .cookie-text {
    min-width: auto;
  }

  .cookie-text h3 {
    font-size: 1rem;
  }

  .cookie-text p {
    font-size: 0.85rem;
  }

  .cookie-actions {
    width: 100%;
    justify-content: stretch;
  }

  .btn-accept,
  .btn-reject {
    flex: 1;
    padding: 10px 16px;
    font-size: 0.85rem;
  }
}
</style>
