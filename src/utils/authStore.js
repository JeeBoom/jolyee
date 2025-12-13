import { ref, computed } from 'vue'
import { supabase } from '../config/supabase'

// 用户状态管理（从 Supabase 同步）
const user = ref(null)
const isLoggedIn = computed(() => !!user.value)

// 宠物状态管理
const petData = ref(null)

// 登出（调用 Supabase）
const logout = async () => {
  await supabase.auth.signOut()
  user.value = null
  petData.value = null
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

// 同步 Supabase 认证状态
const syncSupabaseAuth = async () => {
  try {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (supabaseUser) {
      // 如果 Supabase 已登录，同步到 authStore
      user.value = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
        provider: supabaseUser.app_metadata?.provider || 'email'
      }
      loadPetData()
    }
  } catch (error) {
    console.warn('同步 Supabase 认证失败:', error)
  }
}

// 监听 Supabase 认证状态变化
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    user.value = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
      provider: session.user.app_metadata?.provider || 'email'
    }
    loadPetData()
  } else if (event === 'SIGNED_OUT') {
    user.value = null
    petData.value = null
  }
})

// 初始化时从 Supabase 加载用户
syncSupabaseAuth()

export const useAuth = () => {
  return {
    user,
    isLoggedIn,
    logout,
    petData,
    savePetData,
    getPetData
  }
}
