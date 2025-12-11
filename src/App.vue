<template>
  <div id="app" class="page-wrapper">
    <!-- 页头 -->
    <Header :sections="menuSections" :all-links="allLinks" @open-shortcuts="openShortcuts" />

    <!-- 侧边栏菜单 -->
    <!-- <Sidebar :sections="menuSections" /> -->

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
      <div class="category-nav">
        <button
          v-for="(section, index) in menuSections"
          :key="index"
          :class="['category-btn', { active: activeCategory === index }]"
          @click="switchCategory(index)"
        >
          <span class="category-icon">{{ section.icon }}</span>
          <span class="category-title">{{ section.title }}</span>
        </button>
        <!-- 博客按钮 -->
        <button
          :class="['category-btn', { active: activeCategory === 14 }]"
          @click="switchCategory(14)"
        >
          <span class="category-icon">📝</span>
          <span class="category-title">博客</span>
        </button>
      </div>

      <!-- 分类内容 -->
      <div class="category-content">
        <div v-show="activeCategory === 0" class="content-section">
          <Communities ref="communitiesRef" />
        </div>
        <div v-show="activeCategory === 1" class="content-section" ref="section1">
          <It v-if="visibleSections.section1" />
        </div>
        <div v-show="activeCategory === 2" class="content-section" ref="section2">
          <Ai v-if="visibleSections.section2" />
        </div>
        <div v-show="activeCategory === 3" class="content-section" ref="section3">
          <News v-if="visibleSections.section3" />
        </div>
        <div v-show="activeCategory === 4" class="content-section" ref="section4">
          <Crypto v-if="visibleSections.section4" />
        </div>
        <div v-show="activeCategory === 5" class="content-section" ref="section5">
          <Front v-if="visibleSections.section5" />
        </div>
        <div v-show="activeCategory === 6" class="content-section" ref="section6">
          <Backend v-if="visibleSections.section6" />
        </div>
        <div v-show="activeCategory === 7" class="content-section" ref="section7">
          <Devops v-if="visibleSections.section7" />
        </div>
        <div v-show="activeCategory === 8" class="content-section" ref="section8">
          <Tools v-if="visibleSections.section8" />
        </div>
        <div v-show="activeCategory === 9" class="content-section" ref="section9">
          <Movie v-if="visibleSections.section9" />
        </div>
        <div v-show="activeCategory === 10" class="content-section" ref="section10">
          <Music v-if="visibleSections.section10" />
        </div>
        <div v-show="activeCategory === 11" class="content-section" ref="section11">
          <Software v-if="visibleSections.section11" />
        </div>
        <div v-show="activeCategory === 12" class="content-section" ref="section12">
          <English v-if="visibleSections.section12" />
        </div>
        <div v-show="activeCategory === 13" class="content-section" ref="section13">
          <Crossborder v-if="visibleSections.section13" />
        </div>
        <div v-show="activeCategory === 14" class="content-section" ref="section14">
          <Blog v-if="visibleSections.section14" />
        </div>
      </div>
      
      <!-- Waline 评论区 -->
      <div class="waline-wrapper">
        <!-- <Waline /> -->
      </div>
      
      <Footer ref="footerRef" />
    </main>

    <!-- 回到顶部按钮 -->
    <BackToTop />

    <!-- 快捷键帮助 -->
    <ShortcutsHelp ref="shortcutsHelpRef" />

    <!-- 右侧浮动菜单 -->
    <FloatingMenu :sections="menuSections" />

    <!-- 宠物伴侣 -->
    <PetCompanion />

    <!-- Cookie 同意弹窗 -->
    <CookieConsent 
      @open-privacy="footerRef?.openPrivacy()" 
      @open-terms="footerRef?.openTerms()" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import Header from "./components/Header.vue";
// import Sidebar from "./components/Sidebar.vue";
import BackToTop from "./components/BackToTop.vue";
import Footer from "./components/Footer.vue";
import ShortcutsHelp from "./components/ShortcutsHelp.vue";
import FloatingMenu from "./components/FloatingMenu.vue";
import UniversalSearch from "./components/UniversalSearch.vue";
import PetCompanion from "./components/PetCompanion.vue";
import CookieConsent from "./components/CookieConsent.vue";

// 懒加载分类组件，减少初始加载时间
const Communities = defineAsyncComponent(() => import("./components/Communities.vue"));
// const Waline = defineAsyncComponent(() => import("./components/Waline.vue"));
const It = defineAsyncComponent(() => import("./components/IT.vue"));
const Software = defineAsyncComponent(() => import("./components/Software.vue"));
const English = defineAsyncComponent(() => import("./components/English.vue"));
const Music = defineAsyncComponent(() => import("./components/Music.vue"));
const Movie = defineAsyncComponent(() => import("./components/Movie.vue"));
const Ai = defineAsyncComponent(() => import("./components/AI.vue"));
const Front = defineAsyncComponent(() => import("./components/Front.vue"));
const Backend = defineAsyncComponent(() => import("./components/Backend.vue"));
const Devops = defineAsyncComponent(() => import("./components/Devops.vue"));
const Tools = defineAsyncComponent(() => import("./components/Tools.vue"));
const Crossborder = defineAsyncComponent(() => import("./components/Crossborder.vue"));
const News = defineAsyncComponent(() => import("./components/News.vue"));
const Crypto = defineAsyncComponent(() => import("./components/Crypto.vue"));
const Blog = defineAsyncComponent(() => import("./components/Blog.vue"));
import { useLinksStore } from "./utils/linksStore"
import { setPageMeta, generateSchemaMarkup } from "./utils/seoManager"
import { setupKeyboardShortcuts } from "./utils/keyboardShortcuts"

const { getAllLinks } = useLinksStore()
const shortcutsHelpRef = ref(null)
const footerRef = ref(null)

const currentDate = ref('')
const currentTime = ref('')

// 当前激活的分类索引，默认为0（优质社区）
const activeCategory = ref(0)

// 切换分类
const switchCategory = (index) => {
  activeCategory.value = index
  // 切换时懒加载对应的组件
  if (index === 1 && !visibleSections.value.section1) {
    visibleSections.value.section1 = true
  } else if (index === 2 && !visibleSections.value.section2) {
    visibleSections.value.section2 = true
  } else if (index === 3 && !visibleSections.value.section3) {
    visibleSections.value.section3 = true
  } else if (index === 4 && !visibleSections.value.section4) {
    visibleSections.value.section4 = true
  } else if (index === 5 && !visibleSections.value.section5) {
    visibleSections.value.section5 = true
  } else if (index === 6 && !visibleSections.value.section6) {
    visibleSections.value.section6 = true
  } else if (index === 7 && !visibleSections.value.section7) {
    visibleSections.value.section7 = true
  } else if (index === 8 && !visibleSections.value.section8) {
    visibleSections.value.section8 = true
  } else if (index === 9 && !visibleSections.value.section9) {
    visibleSections.value.section9 = true
  } else if (index === 10 && !visibleSections.value.section10) {
    visibleSections.value.section10 = true
  } else if (index === 11 && !visibleSections.value.section11) {
    visibleSections.value.section11 = true
  } else if (index === 12 && !visibleSections.value.section12) {
    visibleSections.value.section12 = true
  } else if (index === 13 && !visibleSections.value.section13) {
    visibleSections.value.section13 = true
  } else if (index === 14 && !visibleSections.value.section14) {
    visibleSections.value.section14 = true
  }
}

// 懒加载状态：跟踪哪些分类已经可见
const visibleSections = ref({
  section1: false,
  section2: false,
  section3: false,
  section4: false,
  section5: false,
  section6: false,
  section7: false,
  section8: false,
  section9: false,
  section10: false,
  section11: false,
  section12: false,
  section13: false,
  section14: false
})

// 分类容器的 refs
const section1 = ref(null)
const section2 = ref(null)
const section3 = ref(null)
const section4 = ref(null)
const section5 = ref(null)
const section6 = ref(null)
const section7 = ref(null)
const section8 = ref(null)
const section9 = ref(null)
const section10 = ref(null)
const section11 = ref(null)
const section12 = ref(null)
const section13 = ref(null)

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
  { title: "优质社区", icon: "🌐", group: "学习资源", count: 0, shortcut: "1" },
  { title: "IT平台", icon: "💻", group: "学习资源", count: 0, shortcut: "2" },
  { title: "AI工具", icon: "🤖", group: "开发工具", count: 0, shortcut: "3" },
  { title: "新闻资讯", icon: "📰", group: "学习资源", count: 0, shortcut: "4" },
  { title: "股票虚拟币", icon: "💰", group: "商业资源", count: 0, shortcut: "5" },
  { title: "前端", icon: "⚛️", group: "开发工具", count: 0, shortcut: "6" },
  { title: "后端", icon: "🔧", group: "开发工具", count: 0, shortcut: "7" },
  { title: "测试运维", icon: "🚀", group: "开发工具", count: 0, shortcut: "8" },
  { title: "工具合集", icon: "🛠️", group: "开发工具", count: 0, shortcut: "9" },
  { title: "影视资源", icon: "🎬", group: "娱乐资源", count: 0, shortcut: "10" },
  { title: "音乐资源", icon: "🎵", group: "娱乐资源", count: 0, shortcut: "11" },
  { title: "软件下载", icon: "📦", group: "娱乐资源", count: 0, shortcut: "12" },
  { title: "英语", icon: "🌍", group: "学习资源", count: 0, shortcut: "13" },
  { title: "跨境出海", icon: "🚢", group: "商业资源", count: 0, shortcut: "14" },
]);

const communitiesRef = ref(null);

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
  }
  
  .datetime-display .date {
    font-size: 13px;
  }
  
  .datetime-display .time {
    font-size: 32px;
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
  max-width: 1200px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
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
    gap: 6px;
    padding: 12px 8px;
    margin: 10px auto;
  }
  
  .category-btn {
    padding: 6px 10px;
    font-size: 12px;
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
}

@media (max-width: 480px) {
  .category-nav {
    gap: 4px;
    padding: 10px 4px;
    margin: 8px auto;
  }
  
  .category-btn {
    padding: 5px 8px;
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
}
</style>

<style>
@import "./styles/main.css";
</style>
