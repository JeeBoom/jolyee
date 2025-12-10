<template>
  <!-- 菜单 -->
  <aside class="sidebar" :class="{ opened: isMenuOpen }">
    <nav class="sidebar-nav">
      <!-- 菜单头部 -->
      <div class="sidebar-header">
        <h3>📚 分类导航</h3>
      </div>

      <!-- 按分组显示菜单 -->
      <div class="menu-groups">
        <div v-for="group in groupedSections" :key="group.name" class="menu-group">
          <!-- 分组标题 -->
          <div class="group-title">{{ group.name }}</div>
          
          <!-- 分组内的菜单项 -->
          <ul class="nav-list">
            <li v-for="(section, index) in group.items" :key="index" class="nav-item">
              <a 
                :href="`#section-${section.originalIndex}`" 
                class="nav-link"
                :class="{ active: activeSection === section.originalIndex }"
                @click="handleNavClick(section.originalIndex)"
                :title="`${section.title} (按 ${section.shortcut} 快速访问)`"
              >
                <span class="nav-icon">{{ section.icon }}</span>
                <span class="nav-title">{{ section.title }}</span>
                <!-- <span class="nav-shortcut">{{ section.shortcut }}</span> -->
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </aside>

  <!-- 模态遮罩 -->
  <div v-if="isMenuOpen" class="menu-overlay" @click="isMenuOpen = false"></div>

  <!-- 汉堡菜单按钮 -->
  <!-- <button class="hamburger-btn" @click="isMenuOpen = !isMenuOpen" :title="isMenuOpen ? '关闭菜单' : '打开菜单'">
    <span class="hamburger-line" :class="{ active: isMenuOpen }"></span>
    <span class="hamburger-line" :class="{ active: isMenuOpen }"></span>
    <span class="hamburger-line" :class="{ active: isMenuOpen }"></span>
  </button> -->
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  sections: {
    type: Array,
    default: () => []
  }
})

const activeSection = ref(0)
const isMenuOpen = ref(false)

// 分组菜单项
const groupedSections = computed(() => {
  const groups = {}
  
  props.sections.forEach((section, index) => {
    const groupName = section.group || '其他'
    if (!groups[groupName]) {
      groups[groupName] = []
    }
    groups[groupName].push({
      ...section,
      originalIndex: index
    })
  })
  
  // 按照原始顺序返回分组
  const groupOrder = ['学习资源', '开发工具', '娱乐资源', '其他']
  return groupOrder
    .filter(name => groups[name])
    .map(name => ({
      name,
      items: groups[name]
    }))
})

const handleNavClick = (index) => {
  activeSection.value = index
  isMenuOpen.value = false
  const element = document.getElementById(`section-${index}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      handleScroll()
    }, 800)
  }
}

// 键盘快捷键支持
const handleKeyPress = (e) => {
  const key = e.key
  if (key >= '0' && key <= '9') {
    const index = key === '0' ? 9 : parseInt(key) - 1
    if (index < props.sections.length) {
      handleNavClick(index)
    }
  }
}

const handleScroll = () => {
  const sections = document.querySelectorAll('[id^="section-"]')
  let current = 0
  let closestDistance = Infinity
  
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect()
    const distance = Math.abs(rect.top)
    
    if (rect.top < 200 && distance < closestDistance) {
      closestDistance = distance
      current = index
    }
  })
  
  activeSection.value = current
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keypress', handleKeyPress)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keypress', handleKeyPress)
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: var(--bg-primary);
  border-right: 2px solid var(--border-color);
  padding-top: 10px;
  padding-left: 5px;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 9999 !important;
  transition: transform 0.3s ease-out;
  transform: translateX(-100%);
}

.sidebar.opened {
  transform: translateX(0);
}

/* 菜单头部 */
.sidebar-header {
  padding: 15px 20px;
  border-bottom: 2px solid var(--primary-color);
  margin-bottom: 10px;
  background: rgba(102, 126, 234, 0.08);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

/* 菜单分组 */
.menu-groups {
  padding: 10px 0;
}

.menu-group {
  margin-bottom: 15px;
}

.group-title {
  padding: 8px 20px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  margin-top: 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  font-size: 0.9rem;
  position: relative;
}

.nav-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.nav-title {
  flex: 1;
  font-weight: 500;
}

.nav-shortcut {
  font-size: 0.7rem;
  color: var(--primary-color);
  opacity: 0.6;
  padding: 2px 6px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 3px;
  font-weight: 600;
}

.nav-link:hover {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.15) 0%, rgba(102, 126, 234, 0.05) 100%);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  padding-left: 20px;
}

.nav-link:hover .nav-icon {
  transform: scale(1.3);
}

.nav-link:hover .nav-shortcut {
  background: rgba(102, 126, 234, 0.2);
  opacity: 1;
}

.nav-link.active {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(102, 126, 234, 0.05) 100%);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  font-weight: 600;
  padding-left: 20px;
}

.nav-link.active .nav-icon {
  transform: scale(1.25);
}

/* 菜单遮罩 */
.menu-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998 !important;
  pointer-events: auto;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 汉堡菜单按钮 */
.hamburger-btn {
  position: fixed;
  right: 5%;
  top: 20px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  z-index: 10000 !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (min-width: 769px) {
  .hamburger-btn {
    right: 6%;
  }
}

.hamburger-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* 汉堡菜单线条 */
.hamburger-line {
  width: 24px;
  height: 2.5px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(9px, 9px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .nav-link {
    padding: 8px 12px;
  }

  .nav-shortcut {
    display: none;
  }

  .hamburger-btn {
    display: flex;
  }
}
</style>
