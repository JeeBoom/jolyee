<template>
  <div id="app" class="page-wrapper">
    <!-- 页头 -->
    <Header :sections="menuSections" :all-links="allLinks" @open-shortcuts="openShortcuts" />

    <!-- 侧边栏菜单 -->
    <Sidebar :sections="menuSections" />

    <!-- 主内容区域 -->
    <main class="main-content">
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
        <Front />
      </div>
      <div id="section-4" class="content-section">
        <Backend />
      </div>
      <div id="section-5" class="content-section">
        <Devops />
      </div>
      <div id="section-6" class="content-section">
        <Tools />
      </div>
      <div id="section-7" class="content-section">
        <Movie />
      </div>
      <div id="section-8" class="content-section">
        <Music />
      </div>
      <div id="section-9" class="content-section">
        <Software />
      </div>
      <div id="section-10" class="content-section">
        <English />
      </div>
      <div id="section-11" class="content-section">
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
import { useLinksStore } from "./utils/linksStore"
import { setPageMeta, generateSchemaMarkup } from "./utils/seoManager"
import { setupKeyboardShortcuts } from "./utils/keyboardShortcuts"

const { getAllLinks } = useLinksStore()
const shortcutsHelpRef = ref(null)

const menuSections = ref([
  { title: "优质社区", icon: "🌐", group: "学习资源", count: 0, shortcut: "1" },
  { title: "IT平台", icon: "💻", group: "学习资源", count: 0, shortcut: "2" },
  { title: "AI工具", icon: "🤖", group: "开发工具", count: 0, shortcut: "3" },
  { title: "前端", icon: "⚛️", group: "开发工具", count: 0, shortcut: "4" },
  { title: "后端", icon: "🔧", group: "开发工具", count: 0, shortcut: "5" },
  { title: "测试运维", icon: "🚀", group: "开发工具", count: 0, shortcut: "6" },
  { title: "工具合集", icon: "🛠️", group: "开发工具", count: 0, shortcut: "7" },
  { title: "影视资源", icon: "🎬", group: "娱乐资源", count: 0, shortcut: "8" },
  { title: "音乐资源", icon: "🎵", group: "娱乐资源", count: 0, shortcut: "9" },
  { title: "软件下载", icon: "📦", group: "娱乐资源", count: 0, shortcut: "10" },
  { title: "英语", icon: "🌍", group: "学习资源", count: 0, shortcut: "11" },
  { title: "跨境出海", icon: "🚢", group: "商业资源", count: 0, shortcut: "12" },
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
</style>

<style>
@import "./styles/main.css";
</style>
