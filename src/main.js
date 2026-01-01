import { createApp } from 'vue'
import Root from './Root.vue'
import router from './router'
import { supabase } from './config/supabase'

// 处理 OAuth 回调
const initApp = async () => {
  // 检查是否是 OAuth 回调
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const accessToken = hashParams.get('access_token')
  
  if (accessToken) {
    console.log('🔄 检测到 OAuth 回调，等待 Supabase 处理会话...')
    // 等待 Supabase 自动处理 URL 中的认证参数
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      if (data.session) {
        console.log('✅ OAuth 会话已建立:', data.session.user.email)
        // 清除 URL 中的 hash 参数
        window.history.replaceState(null, '', window.location.pathname)
      }
    } catch (error) {
      console.error('❌ OAuth 回调处理失败:', error)
    }
  }

  // 创建并挂载应用
  const app = createApp(Root)
  
  // 使用路由
  app.use(router)

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
}

// 启动应用
initApp()
