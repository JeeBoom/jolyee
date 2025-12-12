import { ref, computed } from 'vue'

// 用户状态管理
const user = ref(null)
const isLoggedIn = computed(() => !!user.value)

// 从 localStorage 恢复用户信息
const loadUser = () => {
  try {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 保存用户信息
const saveUser = (userData) => {
  user.value = userData
  localStorage.setItem('user', JSON.stringify(userData))
}

// 登出
const logout = () => {
  user.value = null
  localStorage.removeItem('user')
}

// 初始化时加载用户
loadUser()

export const useAuth = () => {
  return {
    user,
    isLoggedIn,
    saveUser,
    logout,
    loadUser
  }
}
