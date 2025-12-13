import { supabase, isSupabaseConfigured } from '../config/supabase'

/**
 * 用户访问记录同步工具
 * 支持本地存储和 Supabase 云端存储
 */

// 获取当前登录用户
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 记录用户交互（智能存储：已登录优先云端，未登录使用本地）
export const logUserInteraction = async (type, target, url = '') => {
  const timestamp = new Date().toISOString()
  const interaction = {
    type,
    target,
    url,
    timestamp,
  }

  // 检查用户登录状态
  let isLoggedIn = false
  if (isSupabaseConfigured()) {
    try {
      const user = await getCurrentUser()
      if (user) {
        isLoggedIn = true
        // 已登录：优先保存到云端
        await saveToSupabase(interaction, user.id)
        console.log('✅ 已保存到云端')
      }
    } catch (error) {
      console.warn('云端保存失败，使用本地存储:', error)
    }
  }

  // 无论是否登录，都保存到本地作为缓存/备份
  saveToLocalStorage(interaction)
  if (!isLoggedIn) {
    console.log('📦 已保存到本地（未登录）')
  }

  return interaction
}

// 保存到本地存储
const saveToLocalStorage = (interaction) => {
  try {
    const interactions = JSON.parse(localStorage.getItem('userInteractions')) || []
    interactions.push(interaction)

    // 只保留最近 100 条记录
    if (interactions.length > 100) {
      interactions.shift()
    }

    localStorage.setItem('userInteractions', JSON.stringify(interactions))
  } catch (e) {
    console.warn('无法访问 localStorage:', e)
  }
}

// 保存到 Supabase
const saveToSupabase = async (interaction, userId) => {
  const { error } = await supabase
    .from('user_interactions')
    .insert([
      {
        user_id: userId,
        type: interaction.type,
        target: interaction.target,
        url: interaction.url,
        created_at: interaction.timestamp,
      }
    ])

  if (error) throw error
}

// 从 Supabase 同步数据到本地
export const syncFromCloud = async () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase 未配置')
    return { success: false, message: 'Supabase 未配置' }
  }

  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: '用户未登录' }
    }

    // 获取用户的云端数据（最近 100 条）
    const { data, error } = await supabase
      .from('user_interactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    // 转换为本地格式并保存
    const interactions = data.map(item => ({
      type: item.type,
      target: item.target,
      url: item.url,
      timestamp: item.created_at,
    }))

    localStorage.setItem('userInteractions', JSON.stringify(interactions))

    return { 
      success: true, 
      message: `成功同步 ${interactions.length} 条记录`,
      count: interactions.length 
    }
  } catch (error) {
    console.error('同步失败:', error)
    return { success: false, message: error.message }
  }
}

// 获取用户的访问统计
export const getUserStats = async () => {
  // 先从本地获取
  const localInteractions = JSON.parse(localStorage.getItem('userInteractions')) || []
  
  // 如果已登录，合并云端数据
  if (isSupabaseConfigured()) {
    try {
      const user = await getCurrentUser()
      if (user) {
        const { data, error } = await supabase
          .from('user_interactions')
          .select('target, type, url')
          .eq('user_id', user.id)

        if (!error && data) {
          // 统计访问次数
          const stats = {}
          
          ;[...localInteractions, ...data].forEach(item => {
            const key = item.target
            if (!stats[key]) {
              stats[key] = {
                name: item.target,
                type: item.type,
                url: item.url,
                count: 0
              }
            }
            stats[key].count++
          })

          // 转换为数组并排序
          return Object.values(stats)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10) // 返回前10个最常访问的网站
        }
      }
    } catch (error) {
      console.warn('获取云端统计失败:', error)
    }
  }

  // 如果没有云端数据，只返回本地统计
  const stats = {}
  localInteractions.forEach(item => {
    const key = item.target
    if (!stats[key]) {
      stats[key] = {
        name: item.target,
        type: item.type,
        url: item.url || '',
        count: 0
      }
    }
    stats[key].count++
  })

  return Object.values(stats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

// 清除所有数据
export const clearAllData = async () => {
  // 清除本地
  localStorage.removeItem('userInteractions')

  // 如果已登录，清除云端
  if (isSupabaseConfigured()) {
    try {
      const user = await getCurrentUser()
      if (user) {
        await supabase
          .from('user_interactions')
          .delete()
          .eq('user_id', user.id)
      }
    } catch (error) {
      console.warn('清除云端数据失败:', error)
    }
  }
}

// 登出
export const signOut = async () => {
  await supabase.auth.signOut()
}

// 登录后：将本地历史同步到云端（去重）
export const syncLocalToCloud = async () => {
  if (!isSupabaseConfigured()) return

  try {
    const user = await getCurrentUser()
    if (!user) return

    // 获取本地历史
    const localData = JSON.parse(localStorage.getItem('userInteractions') || '[]')
    if (localData.length === 0) {
      console.log('📦 本地无历史记录')
      return
    }

    // 获取云端已有数据（用于去重）
    const { data: cloudData } = await supabase
      .from('user_interactions')
      .select('*')
      .eq('user_id', user.id)

    const cloudTimestamps = new Set(cloudData?.map(item => item.created_at) || [])

    // 过滤出云端没有的记录
    const newRecords = localData
      .filter(item => !cloudTimestamps.has(item.timestamp))
      .map(item => ({
        user_id: user.id,
        type: item.type,
        target: item.target,
        url: item.url,
        created_at: item.timestamp
      }))

    if (newRecords.length > 0) {
      const { error } = await supabase
        .from('user_interactions')
        .insert(newRecords)

      if (error) throw error
      console.log(`✅ 已上传 ${newRecords.length} 条本地记录到云端`)
      return { success: true, count: newRecords.length }
    } else {
      console.log('✅ 本地记录已全部同步到云端')
      return { success: true, count: 0 }
    }
  } catch (error) {
    console.error('❌ 同步本地历史到云端失败:', error)
    return { success: false, error }
  }
}
