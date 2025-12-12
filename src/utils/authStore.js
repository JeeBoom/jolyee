import { ref, computed } from 'vue'

// 用户状态管理
const user = ref(null)
const isLoggedIn = computed(() => !!user.value)

// 宠物状态管理
const petData = ref(null)

// 从 localStorage 恢复用户信息
const loadUser = () => {
  try {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      // 加载用户的宠物数据
      loadPetData()
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 保存用户信息
const saveUser = (userData) => {
  user.value = userData
  localStorage.setItem('user', JSON.stringify(userData))
  // 加载该用户的宠物数据
  loadPetData()
}

// 登出
const logout = () => {
  user.value = null
  petData.value = null
  localStorage.removeItem('user')
}

// 加载宠物数据
const loadPetData = () => {
  if (!user.value) {
    petData.value = null
    return
  }
  
  try {
    const key = `petData_${user.value.id}`
    const saved = localStorage.getItem(key)
    if (saved) {
      petData.value = JSON.parse(saved)
    } else {
      // 初始化默认宠物数据
      petData.value = {
        petType: 0,
        isVisible: true,
        mood: 50,
        hunger: 50,
        energy: 100,
        position: { x: 100, y: 100 },
        isFollowing: true
      }
    }
  } catch (error) {
    console.error('加载宠物数据失败:', error)
  }
}

// 保存宠物数据
const savePetData = (data) => {
  if (!user.value) return
  
  petData.value = data
  const key = `petData_${user.value.id}`
  localStorage.setItem(key, JSON.stringify(data))
}

// 获取宠物数据
const getPetData = () => {
  return petData.value
}

// 初始化时加载用户
loadUser()

export const useAuth = () => {
  return {
    user,
    isLoggedIn,
    saveUser,
    logout,
    loadUser,
    petData,
    savePetData,
    getPetData
  }
}
