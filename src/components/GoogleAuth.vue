<template>
  <div class="google-auth">
    <!-- 未登录状态 -->
    <button v-if="!isLoggedIn" class="login-btn" @click="handleLogin" title="Google 登录">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <!-- <span>登录</span> -->
    </button>

    <!-- 已登录状态 -->
    <div v-else class="user-menu">
      <div class="user-avatar" @click="toggleMenu">
        <img :src="user.picture" :alt="user.name" />
      </div>
      
      <!-- 用户下拉菜单 -->
      <transition name="fade">
        <div v-if="showMenu" class="user-dropdown" @click.stop>
          <div class="user-info">
            <img :src="user.picture" :alt="user.name" class="dropdown-avatar" />
            <div class="user-details">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-email">{{ user.email }}</div>
            </div>
          </div>
          <div class="menu-divider"></div>
          <button class="menu-item" @click="handleLogout">
            <span class="menu-icon">🚪</span>
            <span>退出登录</span>
          </button>
        </div>
      </transition>
    </div>

    <!-- 点击外部关闭菜单 -->
    <div v-if="showMenu" class="menu-overlay" @click="closeMenu"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../utils/authStore'

const { user, isLoggedIn, saveUser, logout } = useAuth()
const showMenu = ref(false)

// Google Client ID - 需要替换为你的实际 Client ID
const GOOGLE_CLIENT_ID = '1074739388889-q5oidlmi1gtp5g62so2kmviq1nln2fus.apps.googleusercontent.com'

// 初始化 Google Sign-In
const initGoogleSignIn = () => {
  if (window.google) {
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      })
      console.log('Google Sign-In 初始化成功')
      console.log('Client ID:', GOOGLE_CLIENT_ID)
      console.log('当前域名:', window.location.origin)
    } catch (error) {
      console.error('Google Sign-In 初始化失败:', error)
      showNotification('Google 登录初始化失败：' + error.message, 'error')
    }
  } else {
    console.error('Google Sign-In 库未加载')
  }
}

// 处理 Google 登录响应
const handleCredentialResponse = (response) => {
  try {
    // 解码 JWT token
    const payload = JSON.parse(atob(response.credential.split('.')[1]))
    
    const userData = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      loginTime: new Date().toISOString()
    }
    
    saveUser(userData)
    
    // 显示登录成功提示
    showNotification('登录成功！', 'success')
  } catch (error) {
    console.error('登录失败:', error)
    showNotification('登录失败，请重试', 'error')
  }
}

// 处理登录按钮点击
const handleLogin = () => {
  console.log('点击登录按钮')
  
  if (window.google) {
    try {
      // 创建隐藏的容器和按钮
      const hiddenContainer = document.createElement('div')
      hiddenContainer.style.cssText = 'position: absolute; left: -9999px; top: -9999px;'
      const buttonDiv = document.createElement('div')
      hiddenContainer.appendChild(buttonDiv)
      document.body.appendChild(hiddenContainer)
      
      // 渲染 Google 登录按钮
      window.google.accounts.id.renderButton(
        buttonDiv,
        {
          theme: 'outline',
          size: 'large'
        }
      )
      
      // 等待按钮渲染完成后自动点击
      setTimeout(() => {
        const googleButton = buttonDiv.querySelector('div[role="button"]')
        if (googleButton) {
          console.log('自动触发 Google 登录')
          googleButton.click()
          // 清理隐藏的容器
          setTimeout(() => hiddenContainer.remove(), 1000)
        } else {
          console.error('未找到 Google 登录按钮')
          hiddenContainer.remove()
          showNotification('登录初始化失败，请重试', 'error')
        }
      }, 100)
      
    } catch (error) {
      console.error('登录失败:', error)
      showNotification('登录失败：' + error.message, 'error')
    }
  } else {
    console.error('Google Sign-In 库未加载')
    showNotification('Google 登录服务加载失败，请刷新页面重试', 'error')
  }
}

// 处理登出
const handleLogout = () => {
  logout()
  closeMenu()
  showNotification('已退出登录', 'info')
}

// 切换菜单
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// 关闭菜单
const closeMenu = () => {
  showMenu.value = false
}

// 显示通知
const showNotification = (message, type = 'info') => {
  // 简单的通知实现
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    font-size: 14px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// 加载 Google Sign-In 脚本
const loadGoogleScript = () => {
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = () => {
    console.log('Google Sign-In 脚本加载成功')
    initGoogleSignIn()
  }
  script.onerror = () => {
    console.error('Google Sign-In 脚本加载失败')
    showNotification('无法连接到 Google 服务，请检查网络或使用 VPN', 'error')
  }
  document.head.appendChild(script)
}

onMounted(() => {
  loadGoogleScript()
})

onUnmounted(() => {
  // 清理
  if (showMenu.value) {
    closeMenu()
  }
})
</script>

<style scoped>
.google-auth {
  position: relative;
}

/* 登录按钮 */
.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  border-radius: 100px;
  background: white;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.login-btn:hover {
  background: #f8f9fa;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

html[data-theme="dark"] .login-btn {
  background: var(--bg-secondary);
  border-color: var(--border-color);
}

html[data-theme="dark"] .login-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 用户菜单 */
.user-menu {
  position: relative;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid var(--primary-color);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 下拉菜单 */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 260px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border-color);
  overflow: hidden;
  z-index: 1000;
}

html[data-theme="dark"] .user-dropdown {
  background: var(--bg-secondary);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.menu-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0 12px;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.menu-item:hover {
  background: var(--bg-secondary);
}

html[data-theme="dark"] .menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  font-size: 18px;
}

/* 遮罩层 */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 响应式 */
@media (max-width: 768px) {
  .login-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .login-btn svg {
    width: 16px;
    height: 16px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .user-dropdown {
    min-width: 240px;
  }

  .dropdown-avatar {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .login-btn span {
    display: none;
  }

  .login-btn {
    padding: 8px;
  }

  .user-dropdown {
    right: -10px;
    min-width: 220px;
  }
}
</style>

<style>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100px);
  }
}
</style>
