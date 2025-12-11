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
      <div id="section-1" class="content-section">
        <It />
      </div>
      <div id="section-2" class="content-section">
        <Ai />
      </div>
      <div id="section-3" class="content-section">
        <News />
      </div>
      <div id="section-4" class="content-section">
        <Crypto />
      </div>
      <div id="section-5" class="content-section">
        <Front />
      </div>
      <div id="section-6" class="content-section">
        <Backend />
      </div>
      <div id="section-7" class="content-section">
        <Devops />
      </div>
      <div id="section-8" class="content-section">
        <Tools />
      </div>
      <div id="section-9" class="content-section">
        <Movie />
      </div>
      <div id="section-10" class="content-section">
        <Music />
      </div>
      <div id="section-11" class="content-section">
        <Software />
      </div>
      <div id="section-12" class="content-section">
        <English />
      </div>
      <div id="section-13" class="content-section">
        <Crossborder />
      </div>
      
      <!-- Waline 评论区 -->
      <div class="waline-wrapper">
        <Waline />
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
import { ref, computed, onMounted } from "vue";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import BackToTop from "./components/BackToTop.vue";
import Footer from "./components/Footer.vue";
import ShortcutsHelp from "./components/ShortcutsHelp.vue";
import FloatingMenu from "./components/FloatingMenu.vue";
import UniversalSearch from "./components/UniversalSearch.vue";
import PetCompanion from "./components/PetCompanion.vue";
import Communities from "./components/Communities.vue";
import Waline from "./components/Waline.vue";
import It from "./components/IT.vue";
import Software from "./components/Software.vue";
import English from "./components/English.vue";
import Music from "./components/Music.vue";
import Movie from "./components/Movie.vue";
import Ai from "./components/AI.vue";
import Front from "./components/Front.vue";
import Backend from "./components/Backend.vue";
import Devops from "./components/Devops.vue";
import Tools from "./components/Tools.vue";
import Crossborder from "./components/Crossborder.vue";
import News from "./components/News.vue";
import Crypto from "./components/Crypto.vue";
import { useLinksStore } from "./utils/linksStore"
import { setPageMeta, generateSchemaMarkup } from "./utils/seoManager"
import { setupKeyboardShortcuts } from "./utils/keyboardShortcuts"

const { getAllLinks } = useLinksStore()
const shortcutsHelpRef = ref(null)

const currentDate = ref('')
const currentTime = ref('')

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
</style>

<style>
@import "./styles/main.css";
</style>
