<template>
  <div class="pet-companion-wrapper">
    <!-- 宠物主体 -->
    <div v-if="isVisible" class="pet-companion">
      <div 
        class="pet"
        :class="[currentState, { 'dragging': isDragging }]"
        :style="{ left: petX + 'px', top: petY + 'px' }"
        @mousedown="startDrag"
        @touchstart="startTouchDrag"
        @click="handleClick"
        @contextmenu.prevent="toggleMenu"
      >
        <!-- 宠物图标 -->
        <div class="pet-body">
          <img 
            v-if="currentPet.image" 
            :src="currentPet.image" 
            :alt="currentPet.name"
            class="pet-image"
          />
          <span v-else class="pet-emoji">{{ currentPet.emoji }}</span>
        </div>
        
        <!-- 状态图标 -->
        <div v-if="showStateIcon" class="state-icon">{{ stateIcon }}</div>
        
        <!-- 思考泡泡 -->
        <div v-if="thought" class="thought-bubble">{{ thought }}</div>
        
        <!-- 状态栏 -->
        <div class="pet-status-bar">
          <div class="status-item" :title="`心情: ${mood}`">
            <span class="status-icon">😊</span>
            <div class="status-bar">
              <div class="status-fill mood" :style="{ width: mood + '%' }"></div>
            </div>
          </div>
          <div class="status-item" :title="`饥饿: ${hunger}`">
            <span class="status-icon">🍖</span>
            <div class="status-bar">
              <div class="status-fill hunger" :style="{ width: (100 - hunger) + '%' }"></div>
            </div>
          </div>
          <div class="status-item" :title="`能量: ${energy}`">
            <span class="status-icon">⚡</span>
            <div class="status-bar">
              <div class="status-fill energy" :style="{ width: energy + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右键菜单 -->
      <div 
        v-if="showMenu" 
        class="pet-menu"
        :style="{ left: menuX + 'px', top: menuY + 'px' }"
      >
        <div class="menu-status">
          <div class="menu-status-title">{{ currentPet.name }}</div>
          <div class="menu-status-item">
            <span>😊 心情</span>
            <span class="status-value" :class="{ low: mood < 30 }">{{ Math.round(mood) }}</span>
          </div>
          <div class="menu-status-item">
            <span>🍖 饥饿</span>
            <span class="status-value" :class="{ low: hunger > 70 }">{{ Math.round(hunger) }}</span>
          </div>
          <div class="menu-status-item">
            <span>⚡ 能量</span>
            <span class="status-value" :class="{ low: energy < 30 }">{{ Math.round(energy) }}</span>
          </div>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item" @click="feedPet">🍖 喂食</div>
        <div class="menu-item" @click="playWithPet">🎾 玩耍</div>
        <div class="menu-item" @click="petPet">👋 抚摸</div>
        <div class="menu-divider"></div>
        <div class="menu-item" @click="toggleFollow">{{ isFollowing ? '⏸️ 停止跟随' : '▶️ 恢复跟随' }}</div>
        <div class="menu-item" @click="changePetType">🔄 换宠物</div>
        <div class="menu-item" @click="hidePet">👻 隐藏 (Ctrl+P)</div>
      </div>
    </div>

    <!-- 唤出按钮 -->
    <button 
      v-if="!isVisible"
      class="show-pet-button"
      @click="showPet"
      :title="isLoggedIn ? '显示宠物伴侣 (Ctrl+P)' : '显示宠物伴侣 (登录后可保存状态)'"
    >
      🐾
    </button>
    
    <!-- 宠物选择器 -->
    <transition name="selector-fade">
      <div v-if="showPetSelector" class="pet-selector-overlay" @click="showPetSelector = false">
        <div class="pet-selector" @click.stop>
          <div class="selector-header">
            <h3>选择你的宠物伴侣</h3>
            <button class="selector-close" @click="showPetSelector = false">✕</button>
          </div>
          <div class="selector-grid">
            <div 
              v-for="(pet, index) in petTypes" 
              :key="index"
              class="pet-option"
              :class="{ active: index === currentPetIndex }"
              @click="selectPet(index)"
            >
              <div class="pet-preview">
                <img v-if="pet.image" :src="pet.image" :alt="pet.name" />
                <span v-else class="pet-preview-emoji">{{ pet.emoji }}</span>
              </div>
              <div class="pet-name">{{ pet.name }}</div>
              <div v-if="index === currentPetIndex" class="current-badge">当前</div>
              <div v-if="pet.isCustom" class="custom-badge">自定义</div>
              <!-- 删除按钮（仅自定义宠物） -->
              <button 
                v-if="pet.isCustom" 
                class="delete-pet-btn"
                @click.stop="deleteCustomPet(index)"
                title="删除此宠物"
              >
                🗑️
              </button>
            </div>
            
            <!-- 上传自定义宠物（仅登录用户可见） -->
            <div 
              v-if="isLoggedIn"
              class="pet-option upload-option" 
              @click="triggerUpload"
            >
              <div class="pet-preview">
                <span class="upload-icon">➕</span>
              </div>
              <div class="pet-name">上传GIF</div>
            </div>
            
            <!-- 未登录提示 -->
            <div 
              v-else
              class="pet-option upload-option disabled" 
              @click="showThought('登录后可上传专属宠物哦~')"
            >
              <div class="pet-preview">
                <span class="upload-icon">🔒</span>
              </div>
              <div class="pet-name">登录后上传</div>
            </div>
          </div>
          <input 
            ref="fileInput" 
            type="file" 
            accept=".gif,image/gif" 
            style="display: none" 
            @change="handleUploadPet"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuth } from '../utils/authStore'

// 获取用户认证状态
const { isLoggedIn, user, petData, savePetData, getPetData } = useAuth()

// 默认宠物类型
const defaultPets = [
  { name: '噜噜~', emoji: '🦫', image: '/images/lulu.gif', sound: '噜噜~' },
  { name: '小刘鸭~', emoji: '🦆', image: '/images/xly2.gif', sound: '小刘鸭~' },
  { name: '小黄鸭~', emoji: '🦆', image: '/images/pkq.gif', sound: '小黄鸭~' },
  { name: '派大星~', emoji: '🦆', image: '/images/pdx.gif', sound: '派大星~' },
  { name: '机器猫~', emoji: '👧', image: '/images/jiqimao.gif', sound: '机器猫~' },
]

// 自定义宠物
const customPets = ref([])

// 合并所有宠物类型（默认 + 自定义）
const petTypes = computed(() => [...defaultPets, ...customPets.value])

// 状态
const isVisible = ref(false)
const currentPetIndex = ref(0)
const currentState = ref('idle') // idle, walking, sleeping, eating, playing, happy
const petX = ref(100)
const petY = ref(100)
const isDragging = ref(false)
const showMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const thought = ref('')
const showStateIcon = ref(false)
const isFollowing = ref(false)
const showPetSelector = ref(false)

// 鼠标位置
const mouseX = ref(0)
const mouseY = ref(0)
const lastMouseMoveTime = ref(Date.now())

// 拖拽相关
const dragStartX = ref(0)
const dragStartY = ref(0)
const petStartX = ref(0)
const petStartY = ref(0)

// 情绪值
const mood = ref(50)
const hunger = ref(50)
const energy = ref(100)

// 计算属性
const currentPet = computed(() => petTypes.value[currentPetIndex.value])

const stateIcon = computed(() => {
  switch(currentState.value) {
    case 'sleeping': return '💤'
    case 'eating': return '😋'
    case 'playing': return '🎉'
    case 'happy': return '❤️'
    default: return ''
  }
})

// 跟随鼠标
const followMouse = () => {
  if (!isFollowing.value || isDragging.value || currentState.value === 'sleeping' || showMenu.value) return
  
  const dx = mouseX.value - petX.value - 25
  const dy = mouseY.value - petY.value - 25
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // 如果距离太近就不动
  if (distance < 100) {
    if (currentState.value === 'walking') {
      currentState.value = 'idle'
    }
    return
  }
  
  // 使用缓动函数实现更平滑的跟随
  // 距离越远，速度越快，自然减速
  const easingFactor = 0.08 // 缓动系数（0-1之间）
  const moveX = dx * easingFactor
  const moveY = dy * easingFactor
  
  petX.value += moveX
  petY.value += moveY
  
  // 限制在窗口内
  petX.value = Math.max(0, Math.min(window.innerWidth - 60, petX.value))
  petY.value = Math.max(0, Math.min(window.innerHeight - 60, petY.value))
  
  if (currentState.value !== 'walking') {
    currentState.value = 'walking'
  }
}

// 鼠标移动处理
const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  lastMouseMoveTime.value = Date.now()
  
  if (isDragging.value) {
    petX.value = petStartX.value + e.clientX - dragStartX.value
    petY.value = petStartY.value + e.clientY - dragStartY.value
    
    // 限制在窗口内
    petX.value = Math.max(0, Math.min(window.innerWidth - 60, petX.value))
    petY.value = Math.max(0, Math.min(window.innerHeight - 60, petY.value))
  }
}

// 触摸移动处理
const handleTouchMove = (e) => {
  if (!isDragging.value) return
  
  e.preventDefault() // 阻止页面滚动
  
  const touch = e.touches[0]
  mouseX.value = touch.clientX
  mouseY.value = touch.clientY
  lastMouseMoveTime.value = Date.now()
  
  petX.value = petStartX.value + touch.clientX - dragStartX.value
  petY.value = petStartY.value + touch.clientY - dragStartY.value
  
  // 限制在窗口内
  petX.value = Math.max(0, Math.min(window.innerWidth - 60, petX.value))
  petY.value = Math.max(0, Math.min(window.innerHeight - 60, petY.value))
}

// 开始拖拽
const startDrag = (e) => {
  if (e.button !== 0) return // 只响应左键
  
  isDragging.value = true
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  petStartX.value = petX.value
  petStartY.value = petY.value
  currentState.value = 'idle'
}

// 触摸开始拖拽
const startTouchDrag = (e) => {
  const touch = e.touches[0]
  
  isDragging.value = true
  dragStartX.value = touch.clientX
  dragStartY.value = touch.clientY
  petStartX.value = petX.value
  petStartY.value = petY.value
  currentState.value = 'idle'
  
  // 阻止默认的长按菜单和页面滚动
  e.preventDefault()
}

// 结束拖拽
const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    showThought('你想带我去哪？')
  }
}

// 触摸结束处理
const endTouchDrag = () => {
  endDrag()
}

// 点击宠物
const handleClick = (e) => {
  if (isDragging.value) return
  e.stopPropagation()
  
  currentState.value = 'happy'
  showStateIcon.value = true
  
  setTimeout(() => {
    currentState.value = 'idle'
    showStateIcon.value = false
  }, 1000)
  
  const sounds = ['😊', '开心~', '嘿嘿', '好的！']
  showThought(sounds[Math.floor(Math.random() * sounds.length)])
  
  mood.value = Math.min(100, mood.value + 5)
}

// 显示菜单
const toggleMenu = (e) => {
  showMenu.value = !showMenu.value
  
  if (showMenu.value) {
    // 菜单尺寸（估计值）
    const menuWidth = 180
    const menuHeight = 250
    
    // 计算菜单位置，确保不超出屏幕
    let x = e.clientX
    let y = e.clientY
    
    // 如果右侧空间不够，显示在左侧
    if (x + menuWidth > window.innerWidth) {
      x = e.clientX - menuWidth
    }
    
    // 如果底部空间不够，显示在上方
    if (y + menuHeight > window.innerHeight) {
      y = e.clientY - menuHeight
    }
    
    // 确保不超出左边和顶部
    x = Math.max(10, x)
    y = Math.max(10, y)
    
    menuX.value = x
    menuY.value = y
  }
}

// 喂食
const feedPet = () => {
  showMenu.value = false
  currentState.value = 'eating'
  showStateIcon.value = true
  
  if (!isLoggedIn.value) {
    showThought('好吃！')
  } 
  
  hunger.value = Math.max(0, hunger.value - 30)
  mood.value = Math.min(100, mood.value + 10)
  
  setTimeout(() => {
    currentState.value = 'idle'
    showStateIcon.value = false
  }, 2000)
}

// 玩耍
const playWithPet = () => {
  showMenu.value = false
  currentState.value = 'playing'
  showStateIcon.value = true
  
  if (!isLoggedIn.value) {
    showThought('真开心！')
  }
  
  mood.value = Math.min(100, mood.value + 5)
  energy.value = Math.max(0, energy.value - 20)
  
  // 随机跳跃
  const jumpCount = 3
  let jumped = 0
  const jumpInterval = setInterval(() => {
    petY.value -= 30
    setTimeout(() => {
      petY.value += 30
    }, 200)
    jumped++
    if (jumped >= jumpCount) {
      clearInterval(jumpInterval)
      setTimeout(() => {
        currentState.value = 'idle'
        showStateIcon.value = false
      }, 500)
    }
  }, 600)
}

// 抚摸
const petPet = () => {
  showMenu.value = false
  currentState.value = 'happy'
  showStateIcon.value = true
  
  if (!isLoggedIn.value) {
    showThought(currentPet.value.sound)
  } else {
    showThought(currentPet.value.sound)
  }
  
  mood.value = Math.min(100, mood.value + 5)
  
  setTimeout(() => {
    currentState.value = 'idle'
    showStateIcon.value = false
  }, 1500)
}

// 打开宠物选择器
const changePetType = () => {
  showMenu.value = false
  showPetSelector.value = true
}

// 选择宠物
const selectPet = (index) => {
  showPetSelector.value = false
  currentPetIndex.value = index
  
  if (!isLoggedIn.value) {
    showThought('嗨！是我~ ')
  } else {
    showThought('嗨！是我~')
  }
  
  // 立即保存（会自动触发watch保存）
  savePetState()
}

// 删除自定义宠物
const deleteCustomPet = (index) => {
  if (!isLoggedIn.value) {
    showThought('登录后才能删除自定义宠物哦~')
    return
  }
  
  // 计算在customPets数组中的索引（需要减去默认宠物数量）
  const defaultPetsCount = 5
  const customIndex = index - defaultPetsCount
  
  if (customIndex < 0 || customIndex >= customPets.value.length) return
  
  // 确认删除
  if (!confirm(`确定要删除 "${petTypes.value[index].name}" 吗？`)) return
  
  // 如果删除的是当前选中的宠物，切换到第一个宠物
  if (index === currentPetIndex.value) {
    currentPetIndex.value = 0
    showThought('换个伙伴陪你~')
  } else if (index < currentPetIndex.value) {
    // 如果删除的宠物在当前宠物之前，需要调整索引
    currentPetIndex.value--
  }
  
  // 从数组中删除
  customPets.value.splice(customIndex, 1)
  
  // 保存到localStorage
  saveCustomPets()
  
  showThought('再见啦~')
}

// 文件输入引用
const fileInput = ref(null)

// 触发文件上传
const triggerUpload = () => {
  if (!isLoggedIn.value) {
    showThought('登录后才能上传专属宠物哦~')
    return
  }
  fileInput.value?.click()
}

// 处理宠物图片上传
const handleUploadPet = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  if (!isLoggedIn.value) {
    showThought('登录后才能上传专属宠物哦~')
    event.target.value = ''
    return
  }
  
  // 验证文件类型
  if (file.type !== 'image/gif') {
    showThought('只能上传GIF图片哦~')
    return
  }
  
  // 验证文件大小（限制为5MB）
  if (file.size > 5 * 1024 * 1024) {
    showThought('图片太大啦，请选择5MB以下的GIF')
    return
  }
  
  // 读取文件为base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64Image = e.target?.result
    if (!base64Image) return
    
    // 添加到自定义宠物列表
    const customPet = {
      name: file.name.replace('.gif', ''),
      emoji: '🐾',
      image: base64Image,
      sound: '喵~',
      isCustom: true
    }
    
    customPets.value.push(customPet)
    
    // 保存自定义宠物到用户数据
    saveCustomPets()
    
    // 自动选择新上传的宠物
    const newIndex = petTypes.value.length - 1
    selectPet(newIndex)
    
    showThought('新伙伴加入啦！')
  }
  
  reader.readAsDataURL(file)
  
  // 清空输入框，允许重复上传同一文件
  event.target.value = ''
}

// 保存自定义宠物
const saveCustomPets = () => {
  if (!isLoggedIn.value) return
  
  const key = `customPets_${user.value?.id || 'guest'}`
  localStorage.setItem(key, JSON.stringify(customPets.value))
}

// 加载自定义宠物
const loadCustomPets = () => {
  if (!isLoggedIn.value) return
  
  try {
    const key = `customPets_${user.value?.id || 'guest'}`
    const saved = localStorage.getItem(key)
    if (saved) {
      customPets.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('加载自定义宠物失败:', error)
  }
}

// 切换跟随状态
const toggleFollow = () => {
  showMenu.value = false
  isFollowing.value = !isFollowing.value
  if (isFollowing.value) {
    showThought('我来啦~')
  } else {
    showThought('好的，我在这里等你')
    currentState.value = 'idle'
  }
}

// 隐藏宠物
const hidePet = () => {
  showMenu.value = false
  isVisible.value = false
  // 会自动触发watch保存
}

// 显示宠物
const showPet = () => {
  isVisible.value = true
  // 会自动触发watch保存
  setTimeout(() => {
    showThought('我回来啦！')
  }, 100)
}

// 显示想法
const showThought = (text) => {
  thought.value = text
  setTimeout(() => {
    thought.value = ''
  }, 2000)
}

// 快捷键处理
const handleKeydown = (e) => {
  // Ctrl+P 切换宠物显示/隐藏
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
    e.preventDefault()
    if (isVisible.value) {
      hidePet()
    } else {
      showPet()
    }
  }
}

// 自动行为
const autoAction = () => {
  const now = Date.now()
  const timeSinceMouseMove = now - lastMouseMoveTime.value
  
  // 如果鼠标3秒没动，进入睡眠
  if (timeSinceMouseMove > 3000 && currentState.value !== 'sleeping' && !isDragging.value) {
    currentState.value = 'sleeping'
    showStateIcon.value = true
    showThought('ZZZ...')
  } else if (timeSinceMouseMove < 1000 && currentState.value === 'sleeping') {
    currentState.value = 'idle'
    showStateIcon.value = false
    showThought('唔？')
  }
  
  // 随机想法
  if (Math.random() < 0.002 && currentState.value === 'idle' && !thought.value) {
    const thoughts = ['...', '想吃的', '好无聊', '今天天气真好', '主人在干嘛？']
    showThought(thoughts[Math.floor(Math.random() * thoughts.length)])
  }
  
  // 饥饿值：模拟人类两餐间隔（约6小时从0到100）
  // 6小时 = 21600秒，60帧/秒 = 1,296,000帧
  // 100 / 1,296,000 ≈ 0.000077
  hunger.value = Math.min(100, hunger.value + 0.000077)
  
  // 心情值：每3分钟自动-1（睡觉时不变化）
  // 3分钟 = 180秒，60帧/秒 = 10,800帧
  // -1 / 10,800 ≈ -0.000093
  if (currentState.value !== 'sleeping' && mood.value > 0) {
    mood.value = Math.max(0, mood.value - 0.000093)
  }
  
  // 能量值：根据心情和饥饿计算（0-100）
  // 能量 = (心情 + (100 - 饥饿)) / 2
  // 心情好且不饿时能量高，心情差或很饿时能量低
  const moodFactor = mood.value
  const hungerFactor = 100 - hunger.value
  energy.value = (moodFactor + hungerFactor) / 2
}

// 游戏循环
let animationFrame
const gameLoop = () => {
  followMouse()
  autoAction()
  animationFrame = requestAnimationFrame(gameLoop)
}

// 加载宠物数据
const loadPetState = () => {
  // 加载自定义宠物
  loadCustomPets()
  
  if (isLoggedIn.value && petData.value) {
    // 从用户账号加载宠物数据
    const data = getPetData()
    if (data) {
      currentPetIndex.value = data.petType || 0
      isVisible.value = data.isVisible !== false
      mood.value = data.mood || 50
      hunger.value = data.hunger || 50
      energy.value = data.energy || 100
      isFollowing.value = data.isFollowing !== false
      if (data.position) {
        petX.value = data.position.x || window.innerWidth - 150
        petY.value = data.position.y || window.innerHeight - 150
      }
    }
  } else {
    // 未登录时使用localStorage（本地数据）
    const savedVisible = localStorage.getItem('petCompanionVisible')
    if (savedVisible === 'false') {
      isVisible.value = false
    }
    
    const savedPetType = localStorage.getItem('petCompanionType')
    if (savedPetType) {
      currentPetIndex.value = parseInt(savedPetType) || 0
    }
  }
  
  // 确保初始位置
  if (!petX.value || petX.value < 0) {
    petX.value = window.innerWidth - 150
  }
  if (!petY.value || petY.value < 0) {
    petY.value = window.innerHeight - 150
  }
}

// 保存宠物数据
const savePetState = () => {
  const data = {
    petType: currentPetIndex.value,
    isVisible: isVisible.value,
    mood: mood.value,
    hunger: hunger.value,
    energy: energy.value,
    position: { x: petX.value, y: petY.value },
    isFollowing: isFollowing.value
  }
  
  if (isLoggedIn.value) {
    // 保存到用户账号
    savePetData(data)
  } else {
    // 保存到localStorage（本地）
    localStorage.setItem('petCompanionVisible', isVisible.value.toString())
    localStorage.setItem('petCompanionType', currentPetIndex.value.toString())
  }
}

// 监听用户登录状态变化
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    // 用户登录后，加载云端数据
    loadPetState()
    if (isVisible.value) {
      setTimeout(() => {
        showThought('主人回来啦！现在可以保存状态啦~')
      }, 500)
    }
  } else {
    // 用户登出后，提示但不隐藏宠物
    if (isVisible.value) {
      setTimeout(() => {
        showThought('登录后可以保存我的状态哦~')
      }, 500)
    }
  }
})

// 监听宠物状态变化，自动保存（仅登录用户）
watch([currentPetIndex, isVisible, mood, hunger, energy, petX, petY, isFollowing], () => {
  if (isLoggedIn.value) {
    savePetState()
  } else {
    // 未登录用户只保存可见性到本地
    localStorage.setItem('petCompanionVisible', isVisible.value.toString())
  }
}, { deep: true })

// 生命周期
onMounted(() => {
  // 加载宠物状态
  loadPetState()
  
  // 如果是首次访问（没有保存的可见性状态），默认显示宠物
  const savedVisible = localStorage.getItem('petCompanionVisible')
  if (savedVisible === null) {
    // 首次访问，默认显示
    isVisible.value = true
  }
  
  // 如果没有设置初始位置，设置默认位置
  if (!petX.value) {
    petX.value = window.innerWidth - 150
  }
  if (!petY.value) {
    petY.value = window.innerHeight - 150
  }
  
  // 点击外部关闭菜单
  const handleClickOutside = (e) => {
    if (showMenu.value && !e.target.closest('.pet-menu') && !e.target.closest('.pet')) {
      showMenu.value = false
    }
  }
  
  // 监听事件
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleKeydown)
  
  // 触摸事件监听
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('touchend', endTouchDrag)
  window.addEventListener('touchcancel', endTouchDrag)
  
  // 启动游戏循环
  gameLoop()
  
  // 显示欢迎消息
  setTimeout(() => {
    if (isLoggedIn.value) {
      showThought('你好呀！')
    } 
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('keydown', handleKeydown)
  
  // 移除触摸事件监听
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', endTouchDrag)
  window.removeEventListener('touchcancel', endTouchDrag)
  
  cancelAnimationFrame(animationFrame)
  
  // 最后保存一次状态
  savePetState()
})

// 暴露方法供外部调用
defineExpose({
  show: () => {
    isVisible.value = true
    localStorage.setItem('petCompanionVisible', 'true')
  },
  hide: hidePet
})
</script>

<style scoped>
.pet-companion {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.pet {
  position: absolute;
  pointer-events: auto;
  cursor: grab;
  user-select: none;
  will-change: left, top;
  touch-action: none; /* 禁用浏览器默认的触摸行为 */
  -webkit-touch-callout: none; /* 禁用iOS长按菜单 */
}

.pet.dragging {
  cursor: grabbing;
}

.pet-body {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.pet-emoji {
  font-size: 70px;
  animation: petIdle 2s ease-in-out infinite;
}

.pet-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  animation: petIdle 2s ease-in-out infinite;
}

/* 状态动画 */
.pet.idle .pet-emoji,
.pet.idle .pet-image {
  animation: petIdle 2s ease-in-out infinite;
}

.pet.walking .pet-emoji,
.pet.walking .pet-image {
  animation: petWalk 0.3s ease-in-out infinite;
}

.pet.sleeping .pet-emoji,
.pet.sleeping .pet-image {
  animation: petSleep 2s ease-in-out infinite;
  opacity: 0.7;
}

.pet.eating .pet-emoji,
.pet.eating .pet-image {
  animation: petEat 0.5s ease-in-out infinite;
}

.pet.playing .pet-emoji,
.pet.playing .pet-image {
  animation: petPlay 0.4s ease-in-out infinite;
}

.pet.happy .pet-emoji,
.pet.happy .pet-image {
  animation: petHappy 0.3s ease-in-out 3;
}

@keyframes petIdle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.05) rotate(2deg); }
}

@keyframes petWalk {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-3px) rotate(5deg); }
}

@keyframes petSleep {
  0%, 100% { transform: scale(0.95); }
  50% { transform: scale(1); }
}

@keyframes petEat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.1) rotate(-10deg); }
  75% { transform: scale(1.1) rotate(10deg); }
}

@keyframes petPlay {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-15deg) scale(1.1); }
  75% { transform: rotate(15deg) scale(1.1); }
}

@keyframes petHappy {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(10deg); }
}

/* 状态图标 */
.state-icon {
  position: absolute;
  top: -15px;
  right: -5px;
  font-size: 16px;
  animation: float 1s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 状态栏 */
.pet-status-bar {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 4px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
}

.pet:hover .pet-status-bar {
  opacity: 1;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.status-icon {
  font-size: 12px;
}

.status-bar {
  width: 30px;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 3px;
}

.status-fill.mood {
  background: linear-gradient(90deg, #ff6b9d 0%, #ffa07a 100%);
}

.status-fill.hunger {
  background: linear-gradient(90deg, #ffd700 0%, #ffa500 100%);
}

.status-fill.energy {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

/* 思考泡泡 */
.thought-bubble {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: bubbleAppear 0.3s ease;
  pointer-events: none;
}

.thought-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid rgba(255, 255, 255, 0.95);
}

@keyframes bubbleAppear {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 深色模式 */
html[data-theme="dark"] .thought-bubble {
  background: rgba(50, 50, 50, 0.95);
  color: #e5e5e5;
}

html[data-theme="dark"] .thought-bubble::after {
  border-top-color: rgba(50, 50, 50, 0.95);
}

/* 右键菜单 */
.pet-menu {
  position: fixed;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  z-index: 10000;
  min-width: 120px;
  animation: menuAppear 0.2s ease;
}

@keyframes menuAppear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  transition: background 0.2s;
}

.menu-item:hover {
  background: var(--bg-secondary);
}

.menu-divider {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}

.menu-status {
  padding: 8px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 6px;
  margin-bottom: 4px;
}

.menu-status-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 8px;
  text-align: center;
  /* 超出省略 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80%;
  text-align: center;
  margin: auto;
}

.menu-status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 4px 0;
  color: var(--text-secondary);
}

.status-value {
  font-weight: 600;
  color: var(--text-primary);
  min-width: 30px;
  text-align: right;
}

.status-value.low {
  color: #ff6b6b;
  animation: statusPulse 1.5s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

html[data-theme="dark"] .pet-menu {
  background: var(--bg-primary);
  color: var(--text-primary);
}

html[data-theme="dark"] .menu-status {
  background: rgba(102, 126, 234, 0.1);
}

/* 显示宠物按钮 */
.show-pet-button {
  position: fixed;
  left: 2rem;
  bottom: 5rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 9998;
  animation: petButtonPulse 2s infinite;
}

.show-pet-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

@keyframes petButtonPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 宠物选择器 */
.pet-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 10003;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pet-selector {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: selectorAppear 0.3s ease;
}

@keyframes selectorAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.selector-header h3 {
  margin: 0;
  font-size: 20px;
  color: var(--text-primary);
}

.selector-close {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.selector-close:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

.selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.pet-option {
  position: relative;
  padding: 16px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.pet-option:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

.pet-option.active {
  border-color: var(--primary-color);
  background: rgba(102, 126, 234, 0.1);
}

.pet-preview {
  width: 80px;
  height: 80px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-primary);
  overflow: hidden;
}

.pet-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-preview-emoji {
  font-size: 48px;
}

.pet-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
  /* 超出省略 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current-badge {
  display: inline-block;
  padding: 2px 8px;
  background: var(--primary-color);
  color: white;
  font-size: 11px;
  border-radius: 10px;
  font-weight: 600;
}

.custom-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #ff6b9d;
  color: white;
  font-size: 11px;
  border-radius: 10px;
  font-weight: 600;
  margin-top: 4px;
}

.delete-pet-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 75, 75, 0.9);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
  transform: scale(0.8);
}

.pet-option:hover .delete-pet-btn {
  opacity: 1;
  transform: scale(1);
}

.delete-pet-btn:hover {
  background: rgba(255, 50, 50, 1);
  transform: scale(1.1);
}

.delete-pet-btn:active {
  transform: scale(0.95);
}

.upload-option {
  border: 2px dashed var(--border-color);
  background: transparent;
}

.upload-option:hover {
  border-color: var(--primary-color);
  border-style: dashed;
}

.upload-icon {
  font-size: 48px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.upload-option:hover .upload-icon {
  color: var(--primary-color);
  opacity: 1;
}

.upload-option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-option.disabled:hover {
  border-color: var(--border-color);
  transform: none;
  box-shadow: none;
}

.upload-option.disabled .upload-icon {
  color: var(--text-secondary);
  opacity: 0.4;
}

.upload-option.disabled:hover .upload-icon {
  color: var(--text-secondary);
  opacity: 0.4;
}

.selector-fade-enter-active,
.selector-fade-leave-active {
  transition: opacity 0.3s ease;
}

.selector-fade-enter-from,
.selector-fade-leave-to {
  opacity: 0;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .pet-body {
    width: 40px;
    height: 40px;
  }
  
  .pet-emoji {
    font-size: 32px;
  }
  
  .thought-bubble {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  .show-pet-button {
    right: 1rem;
    bottom: 6rem;
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  .selector-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
  }
  
  .pet-preview {
    width: 60px;
    height: 60px;
  }
  
  .pet-preview-emoji {
    font-size: 36px;
  }
}
</style>
