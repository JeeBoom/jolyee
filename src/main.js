import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 导出公共 API (可选)
window.NavigationPortal = {
  showNotification: (message, duration = 3000) => {
    const notification = document.createElement('div')
    notification.className = 'notification'
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, duration)
  },
  getInteractionHistory: () => {
    try {
      return JSON.parse(localStorage.getItem('userInteractions')) || []
    } catch (e) {
      return []
    }
  },
  clearInteractionHistory: () => {
    try {
      localStorage.removeItem('userInteractions')
      console.log('交互历史已清除')
    } catch (e) {
      console.warn('无法清除历史:', e)
    }
  }
}

app.mount('#app')
