<template>
  <div id="app" class="page-wrapper">
    <!-- 页头 -->
    <Header :all-links="allLinks" @open-shortcuts="openShortcuts" />
    
    <!-- 固定顶部分类导航 (滚动时显示) -->
    <transition name="slide-down">
      <div v-if="showFixedNav" class="fixed-category-nav">
        <div class="fixed-nav-container">
          <button
            v-for="(section, index) in menuSections"
            :key="index"
            :class="['fixed-category-btn', { active: activeCategory === index }]"
            @click="switchCategory(index)"
          >
            <span class="category-icon">{{ section.icon }}</span>
            <span class="category-title">{{ section.title }}</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 实时日期时间 -->
      <div class="datetime-display">
        <div class="time">{{ currentTime }}</div>
        <div class="date">{{ currentDate }}</div>
      </div>

      <!-- 通用搜索框 -->
      <UniversalSearch />
      
      <!-- 分类导航栏 -->
      <div class="category-nav" ref="categoryNavRef">
        <button
          v-for="(section, index) in menuSections"
          :key="index"
          :class="['category-btn', { active: activeCategory === index }]"
          @click="switchCategory(index)"
        >
          <span class="category-icon">{{ section.icon }}</span>
          <span class="category-title">{{ section.title }}</span>
        </button>
      </div>

      <!-- 分类内容 -->
      <div class="category-content">
        <div 
          v-for="(section, index) in menuSections" 
          :key="index"
          v-show="activeCategory === index" 
          class="content-section"
        >
          <component 
            :is="section.component" 
            v-if="index === 0 || loadedSections.has(index)"
            :ref="index === 0 ? 'communitiesRef' : undefined"
          />
        </div>
      </div>
      
      <Footer ref="footerRef" />
    </main>

    <!-- 回到顶部按钮 -->
    <BackToTop />

    <!-- 快捷键帮助 -->
    <ShortcutsHelp ref="shortcutsHelpRef" />

    <!-- 宠物伴侣 -->
    <PetCompanion />

    <!-- Cookie 同意弹窗 -->
    <CookieConsent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted,onUnmounted, defineAsyncComponent } from "vue";
import { useRouter } from 'vue-router'
import Header from "./components/Header.vue";
import BackToTop from "./components/BackToTop.vue";
import Footer from "./components/Footer.vue";
import ShortcutsHelp from "./components/ShortcutsHelp.vue";
import UniversalSearch from "./components/UniversalSearch.vue";
import PetCompanion from "./components/PetCompanion.vue";
import CookieConsent from "./components/CookieConsent.vue";

// 懒加载分类组件，减少初始加载时间
const componentMap = {
  Communities: defineAsyncComponent(() => import("./components/Communities.vue")),
  It: defineAsyncComponent(() => import("./components/IT.vue")),
  Ai: defineAsyncComponent(() => import("./components/AI.vue")),
  Shopping: defineAsyncComponent(() => import("./components/Shopping.vue")),
  ShortVideo: defineAsyncComponent(() => import("./components/ShortVideo.vue")),
  News: defineAsyncComponent(() => import("./components/News.vue")),
  Crypto: defineAsyncComponent(() => import("./components/Crypto.vue")),
  Front: defineAsyncComponent(() => import("./components/Front.vue")),
  Backend: defineAsyncComponent(() => import("./components/Backend.vue")),
  Devops: defineAsyncComponent(() => import("./components/Devops.vue")),
  Tools: defineAsyncComponent(() => import("./components/Tools.vue")),
  Movie: defineAsyncComponent(() => import("./components/Movie.vue")),
  Music: defineAsyncComponent(() => import("./components/Music.vue")),
  Software: defineAsyncComponent(() => import("./components/Software.vue")),
  English: defineAsyncComponent(() => import("./components/English.vue")),
  Crossborder: defineAsyncComponent(() => import("./components/Crossborder.vue")),
  Blog: defineAsyncComponent(() => import("./components/Blog.vue")),
}
import { useLinksStore } from "./utils/linksStore"
import { setPageMeta, generateSchemaMarkup } from "./utils/seoManager"
import { setupKeyboardShortcuts } from "./utils/keyboardShortcuts"

const { getAllLinks } = useLinksStore()
const shortcutsHelpRef = ref(null)
const footerRef = ref(null)
const categoryNavRef = ref(null)
const router = useRouter()

const currentDate = ref('')
const currentTime = ref('')

// 当前激活的分类索引，默认为0（优质社区）
const activeCategory = ref(0)

// 固定导航栏显示状态
const showFixedNav = ref(false)

// 懒加载状态：使用Set追踪已加载的分类
const loadedSections = ref(new Set())

// 切换分类
const switchCategory = (index) => {
  const target = menuSections.value[index]

  // 如果定义了路由，则跳转到单独页面
  if (target?.route) {
    router.push(target.route)
    return
  }

  activeCategory.value = index
  // 切换时懒加载对应的组件（跳过第0个，因为默认已加载）
  if (index > 0) {
    loadedSections.value.add(index)
  }
  // 滚动到页面顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const updateDateTime = () => {
  const now = new Date()
  
  // 格式化日期：2025年12月11日 星期三
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekday = weekdays[now.getDay()]
  currentDate.value = `${year}年${month}月${day}日 ${weekday}`
  
  // 格式化时间：23:45:30
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

const menuSections = ref([
  { title: "优质社区", icon: "🌐", group: "学习资源", count: 0, shortcut: "1", component: componentMap.Communities },
  { title: "IT平台", icon: "💻", group: "学习资源", count: 0, shortcut: "2", component: componentMap.It },
  { title: "AI工具", icon: "🤖", group: "开发工具", count: 0, shortcut: "3", component: componentMap.Ai },
  { title: "购物平台", icon: "🛒", group: "商业资源", count: 0, shortcut: "4", component: componentMap.Shopping },
  { title: "短视频", icon: "🎥", group: "娱乐资源", count: 0, shortcut: "5", component: componentMap.ShortVideo },
  { title: "新闻资讯", icon: "📰", group: "学习资源", count: 0, shortcut: "6", component: componentMap.News },
  { title: "股票虚拟币", icon: "💰", group: "商业资源", count: 0, shortcut: "7", component: componentMap.Crypto },
  { title: "前端", icon: "⚛️", group: "开发工具", count: 0, shortcut: "8", component: componentMap.Front },
  { title: "后端", icon: "🔧", group: "开发工具", count: 0, shortcut: "9", component: componentMap.Backend },
  { title: "测试运维", icon: "🚀", group: "开发工具", count: 0, shortcut: "10", component: componentMap.Devops },
  { title: "工具合集", icon: "🛠️", group: "开发工具", count: 0, shortcut: "11", component: componentMap.Tools },
  { title: "影视资源", icon: "🎬", group: "娱乐资源", count: 0, shortcut: "12", component: componentMap.Movie },
  { title: "音乐资源", icon: "🎵", group: "娱乐资源", count: 0, shortcut: "13", component: componentMap.Music },
  { title: "软件下载", icon: "📦", group: "娱乐资源", count: 0, shortcut: "14", component: componentMap.Software },
  { title: "英语", icon: "🌍", group: "学习资源", count: 0, shortcut: "15", component: componentMap.English },
  { title: "跨境出海", icon: "🚢", group: "商业资源", count: 0, shortcut: "16", component: componentMap.Crossborder },
  { title: "博客", icon: "📝", group: "学习资源", count: 0, shortcut: "17", component: componentMap.Blog, route: '/blog' },
]);

// 获取所有链接数据
const allLinks = computed(() => getAllLinks())

// 打开快捷键帮助
const openShortcuts = () => {
  shortcutsHelpRef.value?.openModal()
}

// 初始化
onMounted(() => {
  // 初始化时间显示
  updateDateTime()
  // 每秒更新一次时间
  setInterval(updateDateTime, 1000)
  
  // 设置 SEO 元数据
  setPageMeta({
    title: '导航中心 - 优质资源导航平台 | 开发工具 | 学习社区 | AI应用',
    description: '一个精心整理的优质资源导航平台，汇聚开发工具、学习社区、AI应用、影视资源、音乐资源等优质内容。提供快速访问、搜索、收藏等便捷功能。',
    keywords: '导航,资源导航,开发工具,学习社区,AI应用,影视资源,音乐资源,软件下载,前端,后端,运维',
    image: window.location.origin + '/favicon.svg',
    url: window.location.origin
  })
  
  // 生成 Schema.org 结构化数据
  generateSchemaMarkup()
  
  // 监听滚动，控制固定导航显示
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // 当原始导航栏完全不可见时，显示固定导航
        showFixedNav.value = !entry.isIntersecting
      })
    },
    {
      threshold: 0,
      rootMargin: '0px' // 元素完全离开视口时触发
    }
  )
  
  if (categoryNavRef.value) {
    observer.observe(categoryNavRef.value)
  }
  
  onUnmounted(() => {
    if (categoryNavRef.value) {
      observer.unobserve(categoryNavRef.value)
    }
  })
  
  // 设置全局快捷键
  setupKeyboardShortcuts((e) => {
    // 禁用Tab键
    if (e.key === 'Tab') {
      e.preventDefault()
      return
    }
    
    // Ctrl+S 打开搜索框
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault()
      // Header 中的搜索框处理
      const searchBtn = document.querySelector('.search-btn')
      searchBtn?.click()
    }
    // Ctrl+K 切换主题
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      // 查询主题按钮（最后一个 header-btn）
      const themeBtns = document.querySelectorAll('.header-btn')
      if (themeBtns.length > 0) {
        themeBtns[themeBtns.length - 1].click()
      }
    }
    // Ctrl+T 返回顶部
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
})

</script>

<style scoped>
.content-section {
  scroll-margin-top: 80px;
  padding: 0 10%;
}

/* 固定顶部分类导航 */
.fixed-category-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9990;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

html[data-theme="dark"] .fixed-category-nav {
  background: rgba(26, 26, 26, 0.98);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.fixed-nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  /* max-width: 1400px; */
  margin: 0 auto;
  padding: 0 16px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.fixed-nav-container::-webkit-scrollbar {
  display: none;
}

.fixed-category-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.fixed-category-btn:hover {
  background: var(--bg-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.fixed-category-btn.active {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.3);
}

.fixed-category-btn .category-icon {
  font-size: 14px;
}

.fixed-category-btn .category-title {
  font-size: 13px;
}

/* 滑入动画 */
.slide-down-enter-active {
  animation: slideDown 0.3s ease-out;
}

.slide-down-leave-active {
  animation: slideDown 0.3s ease-out reverse;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 深色模式 */
html[data-theme="dark"] .fixed-category-btn {
  background: rgba(255, 255, 255, 0.05);
}

html[data-theme="dark"] .fixed-category-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

html[data-theme="dark"] .fixed-category-btn.active {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.4);
}

/* 日期时间显示 */
.datetime-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 24px;
  margin: 0 auto 10px;
  width: fit-content;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.08) 0%,
    rgba(118, 75, 162, 0.08) 50%,
    rgba(240, 147, 251, 0.08) 100%
  );
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 16px;
  box-shadow: 
    0 4px 12px rgba(102, 126, 234, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.datetime-display::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.4) 0%,
    rgba(118, 75, 162, 0.4) 50%,
    rgba(240, 147, 251, 0.4) 100%
  );
  border-radius: 16px;
  z-index: -1;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.datetime-display:hover {
  box-shadow: 
    0 6px 20px rgba(102, 126, 234, 0.25),
    0 2px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.datetime-display:hover::before {
  opacity: 0.8;
}

.datetime-display .date {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.datetime-display .time {
  font-size: 60px;
  font-weight: 800;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--secondary-color) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Courier New', monospace;
  letter-spacing: 4px;
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

/* 深色模式 */
html[data-theme="dark"] .datetime-display {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.12) 0%,
    rgba(118, 75, 162, 0.12) 50%,
    rgba(240, 147, 251, 0.12) 100%
  );
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
}

html[data-theme="dark"] .datetime-display::before {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.5) 0%,
    rgba(118, 75, 162, 0.5) 50%,
    rgba(240, 147, 251, 0.5) 100%
  );
  opacity: 0.3;
}

html[data-theme="dark"] .datetime-display:hover::before {
  opacity: 0.6;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .datetime-display {
    padding: 12px 16px;
    margin: 0 auto 10px;
  }
  
  .datetime-display .date {
    font-size: 13px;
  }
  
  .datetime-display .time {
    font-size: 32px;
  }

  .content-section {
    padding: 0 ;
  }
}

/* 分类导航栏样式 */
.category-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  margin: 20px auto;
  max-width: 1400px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.category-btn:hover {
  background: var(--bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.category-btn.active {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.category-icon {
  font-size: 18px;
}

.category-title {
  font-size: 14px;
}

/* 分类内容区域 */
.category-content {
  min-height: 400px;
  position: relative;
}

.content-section {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色模式 */
html[data-theme="dark"] .category-btn {
  background: rgba(255, 255, 255, 0.05);
}

html[data-theme="dark"] .category-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

html[data-theme="dark"] .category-btn.active {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .category-nav {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    gap: 6px;
    padding: 12px 12px;
    margin: 10px 0;
    justify-content: flex-start;
  }

  .category-nav::-webkit-scrollbar {
    display: none;
  }
  
  .category-btn {
    padding: 6px 12px;
    font-size: 12px;
    flex-shrink: 0;
  }
  
  .category-icon {
    font-size: 14px;
  }
  
  .category-title {
    font-size: 12px;
  }
  
  .category-content {
    min-height: 300px;
  }
  
  /* 平板端隐藏固定导航 */
  .fixed-category-nav {
    display: none;
  }
}

@media (max-width: 480px) {
  .category-nav {
    gap: 6px;
    padding: 10px 8px;
    margin: 8px 0;
  }
  
  .category-btn {
    padding: 5px 10px;
    font-size: 11px;
  }
  
  .category-icon {
    font-size: 13px;
  }
  
  .category-title {
    font-size: 11px;
  }
  
  .category-content {
    min-height: 250px;
  }

  .content-section {
    padding: 0;
  }
  
  /* 手机端隐藏固定导航 */
  .fixed-category-nav {
    display: none;
  }
}
</style>

<style>
@import "./styles/main.css";
</style>
