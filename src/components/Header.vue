<template>
  <header class="site-header">
    <!-- 所有顶部按钮容器 -->
    <div class="header-buttons">
      <!-- Supabase 用户认证 -->
      <button
        v-if="!user"
        class="header-btn"
        @click="openAuthModal"
        title="登录同步数据"
      >
        <svg t="1765636937329" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5465" width="16" height="16"><path d="M506.075809 546.976206c-145.260076 0-263.436846-118.16774-263.436846-263.418785 0-145.260076 118.17677-263.436846 263.436846-263.436846 145.260076 0 263.436846 118.16774 263.436846 263.436846C769.512655 428.799436 651.335885 546.976206 506.075809 546.976206zM506.075809 76.996419c-113.896181 0-206.561002 92.664821-206.561002 206.561002S392.179628 490.100362 506.075809 490.100362c113.905212 0 206.561002-92.646759 206.561002-206.54294S619.981021 76.996419 506.075809 76.996419z" p-id="5466" fill="#ffffff"></path><path d="M514.754388 621.191146c-250.902125 0-455.024817 174.88103-455.024817 389.840656l28.437922 0c0-199.607302 190.991939-361.411765 426.586895-361.411765s426.586895 161.804462 426.586895 361.411765l20.156698 0 8.281224 0C969.788235 796.072176 765.647482 621.191146 514.754388 621.191146z" p-id="5467" fill="#ffffff"></path><path d="M514.754388 678.057959c219.547262 0 398.148973 149.360049 398.148973 332.964812l28.437922 0c0-199.607302-190.991939-361.411765-426.586895-361.411765S88.167493 811.4245 88.167493 1011.031802l28.437922 0C116.605415 827.427039 295.207126 678.057959 514.754388 678.057959z" p-id="5468" fill="#ffffff"></path></svg>
      </button>
      <div v-else class="user-menu">
        <button
          class="header-btn user-btn"
          @click="toggleUserMenu"
          :title="user.email"
        >
          <img 
            v-if="userAvatar" 
            :src="userAvatar" 
            class="user-avatar"
            :alt="user.email"
          />
          <span v-else class="user-icon">😊</span>
        </button>
        <div v-if="showUserMenu" class="user-dropdown">
          <div class="user-info">
            <span class="user-email">{{ user.email }}</span>
          </div>
          <button @click="openUserStats" class="menu-item">
            📊 我的足迹
          </button>
          <button @click="handleSync" class="menu-item">
            🔄 同步数据
          </button>
          <button @click="handleSignOut" class="menu-item">
            🚪 退出登录
          </button>
        </div>
      </div>
      
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

       <!-- 搜索框 -->
      <SearchBar :all-links="allLinks" />
    </div>

    <!-- 认证弹窗 -->
    <AuthModal ref="authModalRef" @auth-success="handleAuthSuccess" />
    
    <!-- 用户统计弹窗 -->
    <UserStats ref="userStatsRef" />

    <!-- 同步状态提示 -->
    <div v-if="isSyncing" class="sync-loading-overlay">
      <div class="sync-loading-spinner"></div>
      <p>同步中...</p>
    </div>
    <div v-if="syncMessage" class="sync-message">
      {{ syncMessage }}
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import SearchBar from './SearchBar.vue'
import AuthModal from './AuthModal.vue'
import UserStats from './UserStats.vue'
import { getCurrentUser, syncFromCloud, syncLocalToCloud, signOut } from '../utils/syncService'
import { supabase } from '../config/supabase'

defineProps({
  allLinks: {
    type: Array,
    default: () => []
  }
})

defineEmits(['open-shortcuts'])

const isDark = ref(false)
const user = ref(null)
const showUserMenu = ref(false)
const authModalRef = ref(null)
const userStatsRef = ref(null)
const isSyncing = ref(false)
const syncMessage = ref('')

// 获取用户头像
const userAvatar = computed(() => {
  if (!user.value) return null
  return user.value.user_metadata?.avatar_url || null
})

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
    // 根据时间自动判断深色模式（18:00-06:00 为深色模式）
    const hour = new Date().getHours()
    isDark.value = hour >= 18 || hour < 6
  }
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

// 用户认证相关
const openAuthModal = () => {
  authModalRef.value?.openModal()
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleAuthSuccess = async (authUser) => {
  user.value = authUser
  showUserMenu.value = false
  
  // 登录成功后：1. 上传本地历史到云端，2. 下载云端数据
  const uploadResult = await syncLocalToCloud()
  const downloadResult = await syncFromCloud()
  
  let message = '登录成功！'
  if (uploadResult?.count > 0) {
    message += `\n✅ 已上传 ${uploadResult.count} 条本地记录`
  }
  if (downloadResult?.success) {
    message += `\n📥 ${downloadResult.message}`
  }
  alert(message)
}

const openUserStats = () => {
  showUserMenu.value = false
  userStatsRef.value?.openStats()
}

const handleSync = async () => {
  showUserMenu.value = false
  isSyncing.value = true
  syncMessage.value = ''

  const result = await syncFromCloud()

  isSyncing.value = false
  syncMessage.value = result.message

  setTimeout(() => {
    syncMessage.value = ''
  }, 3000); // 3秒后隐藏提示
}

const handleSignOut = async () => {
  await signOut();
  user.value = null;
  showUserMenu.value = false;

  syncMessage.value = '已退出登录';

  setTimeout(() => {
    syncMessage.value = '';
  }, 3000); // 3秒后隐藏提示
}

// 检查用户登录状态
const checkUser = async () => {
  user.value = await getCurrentUser()
}

// 监听认证状态变化
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 Auth state changed:', event, 'Session:', session)
  if (event === 'SIGNED_IN') {
    user.value = session?.user || null
    console.log('✅ User signed in:', user.value)
  } else if (event === 'SIGNED_OUT') {
    user.value = null
    console.log('👋 User signed out')
  }
})

const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.user-menu');
  if (userMenu && !userMenu.contains(event.target)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  loadTheme()
  checkUser()
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 100px;
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
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

/* 用户菜单 */
.user-menu {
  position: relative;
}

.user-btn {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 10000;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.user-icon {
  font-size: 20px;
  line-height: 1;
  display: block;
}

.user-info {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 8px;
}

.user-email {
  font-size: 12px;
  color: var(--text-secondary);
  word-break: break-all;
}

.menu-item {
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  text-align: left;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  display: block;
}

.menu-item:hover {
  background: var(--bg-hover);
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
  /* background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%) !important;
  border: 2px solid var(--primary-color) !important; */
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
    display: none;
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
    display: none;
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

/* 同步状态提示样式 */
.sync-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.sync-loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.sync-loading-overlay p {
  margin-top: 16px;
  color: white;
  font-size: 16px;
}

.sync-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10001;
}
</style>
