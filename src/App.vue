<template>
  <div id="app" class="page-wrapper">
    <!-- 页头 -->
    <Header :sections="menuSections" :all-links="allLinks" @open-shortcuts="openShortcuts" />

    <!-- 侧边栏菜单 -->
    <Sidebar :sections="menuSections" />

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 实时日期时间 -->
      <div class="datetime-display">
        <div class="time">{{ currentTime }}</div>
        <div class="date">{{ currentDate }}</div>
      </div>

      <!-- 通用搜索框 -->
      <UniversalSearch />
      
      <div id="section-0" class="content-section">
        <Communities ref="communitiesRef" />
      </div>
      <div id="section-1" class="content-section" ref="section1">
        <It v-if="visibleSections.section1" />
      </div>
      <div id="section-2" class="content-section" ref="section2">
        <Ai v-if="visibleSections.section2" />
      </div>
      <div id="section-3" class="content-section" ref="section3">
        <News v-if="visibleSections.section3" />
      </div>
      <div id="section-4" class="content-section" ref="section4">
        <Crypto v-if="visibleSections.section4" />
      </div>
      <div id="section-5" class="content-section" ref="section5">
        <Front v-if="visibleSections.section5" />
      </div>
      <div id="section-6" class="content-section" ref="section6">
        <Backend v-if="visibleSections.section6" />
      </div>
      <div id="section-7" class="content-section" ref="section7">
        <Devops v-if="visibleSections.section7" />
      </div>
      <div id="section-8" class="content-section" ref="section8">
        <Tools v-if="visibleSections.section8" />
      </div>
      <div id="section-9" class="content-section" ref="section9">
        <Movie v-if="visibleSections.section9" />
      </div>
      <div id="section-10" class="content-section" ref="section10">
        <Music v-if="visibleSections.section10" />
      </div>
      <div id="section-11" class="content-section" ref="section11">
        <Software v-if="visibleSections.section11" />
      </div>
      <div id="section-12" class="content-section" ref="section12">
        <English v-if="visibleSections.section12" />
      </div>
      <div id="section-13" class="content-section" ref="section13">
        <Crossborder v-if="visibleSections.section13" />
      </div>
      
      <!-- Waline 评论区 -->
      <div class="waline-wrapper" ref="walineSection">
        <Waline v-if="visibleSections.waline" />
      </div>
      
      <Footer />
    </main>

    <!-- 回到顶部按钮 -->
    <BackToTop />

    <!-- 快捷键帮助 -->
    <ShortcutsHelp ref="shortcutsHelpRef" />

    <!-- 右侧浮动菜单 -->
    <FloatingMenu :sections="menuSections" />

    <!-- 宠物伴侣 -->
    <PetCompanion />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import BackToTop from "./components/BackToTop.vue";
import Footer from "./components/Footer.vue";
import ShortcutsHelp from "./components/ShortcutsHelp.vue";
import FloatingMenu from "./components/FloatingMenu.vue";
import UniversalSearch from "./components/UniversalSearch.vue";
import PetCompanion from "./components/PetCompanion.vue";

// 懒加载分类组件，减少初始加载时间
const Communities = defineAsyncComponent(() => import("./components/Communities.vue"));
const Waline = defineAsyncComponent(() => import("./components/Waline.vue"));
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
import { useLinksStore } from "./utils/linksStore"
import { setPageMeta, generateSchemaMarkup } from "./utils/seoManager"
import { setupKeyboardShortcuts } from "./utils/keyboardShortcuts"

const { getAllLinks } = useLinksStore()
const shortcutsHelpRef = ref(null)

const currentDate = ref('')
const currentTime = ref('')

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
  waline: false
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
const walineSection = ref(null)

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

  // 设置 Intersection Observer 实现懒加载
  const observerOptions = {
    root: null,
    rootMargin: '200px', // 提前 200px 开始加载
    threshold: 0.01
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target
        const sectionId = target.id.replace('section-', 'section')
        
        if (sectionId === 'section') return // 跳过 section-0
        
        // 根据元素的 ref 名称设置可见
        if (target === section1.value) visibleSections.value.section1 = true
        else if (target === section2.value) visibleSections.value.section2 = true
        else if (target === section3.value) visibleSections.value.section3 = true
        else if (target === section4.value) visibleSections.value.section4 = true
        else if (target === section5.value) visibleSections.value.section5 = true
        else if (target === section6.value) visibleSections.value.section6 = true
        else if (target === section7.value) visibleSections.value.section7 = true
        else if (target === section8.value) visibleSections.value.section8 = true
        else if (target === section9.value) visibleSections.value.section9 = true
        else if (target === section10.value) visibleSections.value.section10 = true
        else if (target === section11.value) visibleSections.value.section11 = true
        else if (target === section12.value) visibleSections.value.section12 = true
        else if (target === section13.value) visibleSections.value.section13 = true
        else if (target === walineSection.value) visibleSections.value.waline = true
        
        // 一旦加载，停止观察
        observer.unobserve(target)
      }
    })
  }, observerOptions)

  // 观察所有分类容器
  if (section1.value) observer.observe(section1.value)
  if (section2.value) observer.observe(section2.value)
  if (section3.value) observer.observe(section3.value)
  if (section4.value) observer.observe(section4.value)
  if (section5.value) observer.observe(section5.value)
  if (section6.value) observer.observe(section6.value)
  if (section7.value) observer.observe(section7.value)
  if (section8.value) observer.observe(section8.value)
  if (section9.value) observer.observe(section9.value)
  if (section10.value) observer.observe(section10.value)
  if (section11.value) observer.observe(section11.value)
  if (section12.value) observer.observe(section12.value)
  if (section13.value) observer.observe(section13.value)
  if (walineSection.value) observer.observe(walineSection.value)
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
</style>

<style>
@import "./styles/main.css";
</style>
