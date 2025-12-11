<template>
  <div class="pet-companion-wrapper">
    <!-- 宠物主体 -->
    <div v-if="isVisible" class="pet-companion">
      <div 
        class="pet"
        :class="[currentState, { 'dragging': isDragging }]"
        :style="{ left: petX + 'px', top: petY + 'px' }"
        @mousedown="startDrag"
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
      </div>

      <!-- 右键菜单 -->
      <div 
        v-if="showMenu" 
        class="pet-menu"
        :style="{ left: menuX + 'px', top: menuY + 'px' }"
      >
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
      v-else
      class="show-pet-button"
      @click="showPet"
      title="显示宠物伴侣 (Ctrl+P)"
    >
      🐾
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 宠物类型
const petTypes = [
  { name: 'capybara', emoji: '🦫', image: '/images/lulu.gif', sound: '噜噜~' },
  { name: 'littleduck', emoji: '🦆', image: '/images/xly2.gif', sound: '小刘鸭~' },
  { name: 'yellowduck', emoji: '🦆', image: '/images/pkq.gif', sound: '小黄鸭~' },
  { name: 'paidaxing', emoji: '🦆', image: '/images/pdx.gif', sound: '派大星~' },
  { name: 'jiqimao', emoji: '👧', image: '/images/jiqimao.gif', sound: '机器猫~' },
]

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
const isFollowing = ref(true)

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
const currentPet = computed(() => petTypes[currentPetIndex.value])

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

// 结束拖拽
const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    showThought('你想带我去哪？')
  }
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
  showThought('好吃！')
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
  showThought('真开心！')
  mood.value = Math.min(100, mood.value + 20)
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
  showThought(currentPet.value.sound)
  mood.value = Math.min(100, mood.value + 15)
  
  setTimeout(() => {
    currentState.value = 'idle'
    showStateIcon.value = false
  }, 1500)
}

// 切换宠物类型
const changePetType = () => {
  showMenu.value = false
  currentPetIndex.value = (currentPetIndex.value + 1) % petTypes.length
  showThought('嗨！是我~')
  // 立即保存到localStorage
  localStorage.setItem('petCompanionType', currentPetIndex.value.toString())
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
  localStorage.setItem('petCompanionVisible', 'false')
}

// 显示宠物
const showPet = () => {
  isVisible.value = true
  localStorage.setItem('petCompanionVisible', 'true')
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
  
  // 饥饿和能量缓慢变化
  hunger.value = Math.min(100, hunger.value + 0.01)
  if (energy.value < 100 && currentState.value === 'sleeping') {
    energy.value = Math.min(100, energy.value + 0.1)
  }
}

// 游戏循环
let animationFrame
const gameLoop = () => {
  followMouse()
  autoAction()
  animationFrame = requestAnimationFrame(gameLoop)
}

// 生命周期
onMounted(() => {
  // 从localStorage读取设置
  const savedVisible = localStorage.getItem('petCompanionVisible')
  if (savedVisible === 'false') {
    isVisible.value = false
  }
  
  const savedPetType = localStorage.getItem('petCompanionType')
  if (savedPetType) {
    currentPetIndex.value = parseInt(savedPetType) || 0
  }
  
  // 初始位置
  petX.value = window.innerWidth - 150
  petY.value = window.innerHeight - 150
  
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
  
  // 启动游戏循环
  gameLoop()
  
  // 显示欢迎消息
  setTimeout(() => {
    showThought('你好呀！')
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('keydown', handleKeydown)
  cancelAnimationFrame(animationFrame)
  
  // 保存设置
  localStorage.setItem('petCompanionType', currentPetIndex.value.toString())
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
}

.pet.dragging {
  cursor: grabbing;
}

.pet-body {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.pet-emoji {
  font-size: 40px;
  animation: petIdle 2s ease-in-out infinite;
}

.pet-image {
  width: 60px;
  height: 60px;
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

html[data-theme="dark"] .pet-menu {
  background: var(--bg-primary);
  color: var(--text-primary);
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
}
</style>
