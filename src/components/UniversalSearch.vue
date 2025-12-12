<template>
  <div class="universal-search">
    <div class="search-box">
      <!-- 搜索引擎切换按钮 -->
      <div class="engine-selector" @click="toggleEngineMenu">
        <img 
          v-if="currentEngine.logo" 
          :src="currentEngine.logo" 
          :alt="currentEngine.name"
          class="engine-icon"
          @error="handleImageError"
        >
        <span v-else class="engine-icon-text">{{ currentEngine.icon || '🔍' }}</span>
        <span class="engine-name">{{ currentEngine.name }}</span>
        <span class="dropdown-arrow" :class="{ open: showEngineMenu }">▼</span>
      </div>

      <!-- 搜索输入框 -->
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="`使用 ${currentEngine.name} 搜索...`"
        @keyup.enter="handleSearch"
        @focus="inputFocused = true"
        @blur="inputFocused = false"
      >

      <!-- 搜索按钮 -->
      <button class="search-button" @click="handleSearch" title="搜索">
        <span class="search-icon">🔍</span>
      </button>

      <!-- 搜索引擎下拉菜单 -->
      <transition name="slide-down">
        <div v-if="showEngineMenu" class="engine-menu" @click.stop>
          <div class="engine-menu-header">选择搜索引擎</div>
          <div class="engine-list">
            <div
              v-for="engine in searchEngines"
              :key="engine.id"
              class="engine-item"
              :class="{ active: engine.id === currentEngine.id }"
              @click="selectEngine(engine)"
            >
              <img 
                v-if="engine.logo" 
                :src="engine.logo" 
                :alt="engine.name"
                class="engine-item-icon"
                @error="handleImageError"
              >
              <span v-else class="engine-item-icon-text">{{ engine.icon || '🔍' }}</span>
              <div class="engine-info">
                <span class="engine-item-name">{{ engine.name }}</span>
                <span class="engine-item-desc">{{ engine.desc }}</span>
              </div>
              <span v-if="engine.id === currentEngine.id" class="check-mark">✓</span>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 点击外部关闭菜单 -->
    <div v-if="showEngineMenu" class="menu-overlay" @click="closeEngineMenu"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const searchQuery = ref('')
const showEngineMenu = ref(false)
const inputFocused = ref(false)

const searchEngines = ref([
  {
    id: 'google',
    name: 'Google',
    desc: '全球最大的搜索引擎',
    logo: 'https://www.google.com/favicon.ico',
    searchUrl: 'https://www.google.com/search?q='
  },
  {
    id: 'baidu',
    name: '百度',
    desc: '全球最大的中文搜索引擎',
    logo: 'https://www.baidu.com/favicon.ico',
    searchUrl: 'https://www.baidu.com/s?wd='
  },
  {
    id: 'bing',
    name: 'Bing',
    desc: '微软必应搜索',
    logo: 'https://www.bing.com/favicon.ico',
    searchUrl: 'https://www.bing.com/search?q='
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    desc: '注重隐私保护',
    logo: 'https://duckduckgo.com/favicon.ico',
    searchUrl: 'https://duckduckgo.com/?q='
  },
  {
    id: 'yandex',
    name: 'Yandex',
    desc: '俄罗斯搜索引擎',
    logo: 'https://yandex.com/favicon.ico',
    searchUrl: 'https://yandex.com/search/?text='
  },
  {
    id: 'sogou',
    name: '搜狗',
    desc: '中文搜索专家',
    logo: 'https://www.sogou.com/favicon.ico',
    searchUrl: 'https://www.sogou.com/web?query='
  },
  {
    id: '360',
    name: '360搜索',
    desc: '安全搜索引擎',
    logo: 'https://www.so.com/favicon.ico',
    searchUrl: 'https://www.so.com/s?q='
  },
  {
    id: 'github',
    name: 'GitHub',
    desc: '搜索代码和项目',
    logo: 'https://github.com/favicon.ico',
    searchUrl: 'https://github.com/search?q='
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    desc: '搜索编程问题',
    logo: 'https://stackoverflow.com/favicon.ico',
    searchUrl: 'https://stackoverflow.com/search?q='
  },
  {
    id: 'zhihu',
    name: '知乎',
    desc: '搜索中文问答',
    logo: 'https://static.zhihu.com/heifetz/favicon.ico',
    searchUrl: 'https://www.zhihu.com/search?q='
  },
  {
    id: 'bilibili',
    name: '哔哩哔哩',
    desc: '搜索视频内容',
    logo: 'https://www.bilibili.com/favicon.ico',
    searchUrl: 'https://search.bilibili.com/all?keyword='
  },
  {
    id: 'youtube',
    name: 'YouTube',
    desc: '搜索全球视频',
    logo: 'https://www.youtube.com/favicon.ico',
    searchUrl: 'https://www.youtube.com/results?search_query='
  },
  {
    id: 'taobao',
    name: '淘宝',
    desc: '搜索商品购物',
    logo: 'https://www.taobao.com/favicon.ico',
    searchUrl: 'https://s.taobao.com/search?q='
  },
  {
    id: 'jd',
    name: '京东',
    desc: '京东商城搜索',
    logo: 'https://www.jd.com/favicon.ico',
    searchUrl: 'https://search.jd.com/Search?keyword='
  },
  {
    id: 'amazon',
    name: 'Amazon',
    desc: '亚马逊全球购',
    logo: 'https://www.amazon.com/favicon.ico',
    searchUrl: 'https://www.amazon.com/s?k='
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    desc: '搜索推文和话题',
    logo: 'https://twitter.com/favicon.ico',
    searchUrl: 'https://twitter.com/search?q='
  },
  {
    id: 'weibo',
    name: '微博',
    desc: '搜索微博内容',
    logo: 'https://weibo.com/favicon.ico',
    searchUrl: 'https://s.weibo.com/weibo?q='
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    desc: '搜索生活方式',
    logo: 'https://www.xiaohongshu.com/favicon.ico',
    searchUrl: 'https://www.xiaohongshu.com/search_result?keyword='
  },
  {
    id: 'douyin',
    name: '抖音',
    desc: '搜索短视频',
    logo: 'https://www.douyin.com/favicon.ico',
    searchUrl: 'https://www.douyin.com/search/'
  },
  {
    id: 'scholar',
    name: 'Google学术',
    desc: '搜索学术文献',
    logo: 'https://scholar.google.com/favicon.ico',
    searchUrl: 'https://scholar.google.com/scholar?q='
  },
  {
    id: 'baike',
    name: '百度百科',
    desc: '搜索百科知识',
    logo: 'https://baike.baidu.com/favicon.ico',
    searchUrl: 'https://baike.baidu.com/search?word='
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    desc: '维基百科全书',
    logo: 'https://www.wikipedia.org/favicon.ico',
    searchUrl: 'https://zh.wikipedia.org/wiki/'
  },
  {
    id: 'mdn',
    name: 'MDN',
    desc: 'Web开发文档',
    logo: 'https://developer.mozilla.org/favicon.ico',
    searchUrl: 'https://developer.mozilla.org/zh-CN/search?q='
  },
  {
    id: 'npm',
    name: 'npm',
    desc: '搜索npm包',
    logo: 'https://www.npmjs.com/favicon.ico',
    searchUrl: 'https://www.npmjs.com/search?q='
  },
  {
    id: 'dockerhub',
    name: 'Docker Hub',
    desc: '搜索Docker镜像',
    logo: 'https://hub.docker.com/favicon.ico',
    searchUrl: 'https://hub.docker.com/search?q='
  },
  {
    id: 'csdn',
    name: 'CSDN',
    desc: '技术博客搜索',
    logo: 'https://www.csdn.net/favicon.ico',
    searchUrl: 'https://so.csdn.net/so/search?q='
  },
  {
    id: 'juejin',
    name: '稀土掘金',
    desc: '技术文章搜索',
    logo: 'https://lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg',
    searchUrl: 'https://juejin.cn/search?query='
  },
])

// 当前选中的搜索引擎（默认Google）
const currentEngine = ref(searchEngines.value[0])

// 从 localStorage 加载上次选择的搜索引擎
onMounted(() => {
  const savedEngineId = localStorage.getItem('preferred-search-engine')
  if (savedEngineId) {
    const engine = searchEngines.value.find(e => e.id === savedEngineId)
    if (engine) {
      currentEngine.value = engine
    }
  }
})

// 切换搜索引擎菜单
const toggleEngineMenu = () => {
  showEngineMenu.value = !showEngineMenu.value
}

// 关闭搜索引擎菜单
const closeEngineMenu = () => {
  showEngineMenu.value = false
}

// 选择搜索引擎
const selectEngine = (engine) => {
  currentEngine.value = engine
  localStorage.setItem('preferred-search-engine', engine.id)
  closeEngineMenu()
  
  // 记录用户偏好
  logEngineSelection(engine.name)
}

// 执行搜索
const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (!query) return

  // 构建搜索URL
  const searchUrl = currentEngine.value.searchUrl + encodeURIComponent(query)
  
  // 在新标签页打开搜索结果
  window.open(searchUrl, '_blank')
  
  // 记录搜索行为
  logSearchAction(currentEngine.value.name, query)
}

// 图片加载错误处理
const handleImageError = (e) => {
  e.target.style.display = 'none'
}

// 记录搜索引擎选择
const logEngineSelection = (engineName) => {
  try {
    const logs = JSON.parse(localStorage.getItem('userInteractions')) || []
    logs.push({
      type: 'engine_selection',
      target: engineName,
      timestamp: new Date().toISOString()
    })
    if (logs.length > 100) logs.shift()
    localStorage.setItem('userInteractions', JSON.stringify(logs))
  } catch (e) {
    console.warn('无法访问 localStorage:', e)
  }
}

// 记录搜索行为
const logSearchAction = (engineName, query) => {
  try {
    const logs = JSON.parse(localStorage.getItem('userInteractions')) || []
    logs.push({
      type: 'search',
      engine: engineName,
      query: query,
      timestamp: new Date().toISOString()
    })
    if (logs.length > 100) logs.shift()
    localStorage.setItem('userInteractions', JSON.stringify(logs))
  } catch (e) {
    console.warn('无法访问 localStorage:', e)
  }
}

// 监听全局点击事件，关闭菜单
const handleClickOutside = (e) => {
  if (showEngineMenu.value && !e.target.closest('.engine-selector') && !e.target.closest('.engine-menu')) {
    closeEngineMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.universal-search {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  padding: 30px 0;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 60px;
  overflow: visible;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  height: 60px;
}

.search-box:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 6px 30px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}
/* 搜索引擎选择器 */
.engine-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-right: 1px solid var(--border-color);
  white-space: nowrap;
  user-select: none;
  border-radius: 60px 0px 0px 60px;
}

.engine-selector:hover {
  background: var(--hover-background);
}

.engine-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.engine-icon-text {
  font-size: 24px;
}

.engine-name {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 16px;
 font-size: 14px;
}

.dropdown-arrow {
  font-size: 10px;
  color: var(--text-tertiary);
  transition: transform 0.3s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

/* 搜索输入框 */
.search-input {
  flex: 1;
  padding: 16px 24px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 17px;
  color: var(--text-primary);
  border-radius: 0;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

/* 搜索按钮 */
.search-button {
  padding: 16px 28px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 0 60px 60px 0;
  outline: none;
}

.search-button:hover {
  filter: brightness(1.1);
  transform: scale(1.05);
}

.search-icon {
  font-size: 22px;
}

/* 搜索引擎下拉菜单 */
.engine-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 10001;
  max-height: 500px;
  overflow-y: auto;
}

.engine-menu-header {
  padding: 12px 16px;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  background: var(--background);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.engine-list {
  padding: 4px;
}

.engine-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 2px 0;
}

.engine-item:hover {
  background: var(--hover-background);
}

.engine-item.active {
  background: rgba(102, 126, 234, 0.1);
  border-left: 3px solid var(--primary-color);
}

.engine-item-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.engine-item-icon-text {
  font-size: 24px;
  flex-shrink: 0;
}

.engine-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.engine-item-name {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 14px;
}

.engine-item-desc {
  font-size: 12px;
  color: var(--text-tertiary);
}

.check-mark {
  color: var(--primary-color);
  font-size: 18px;
  font-weight: bold;
}

/* 遮罩层 */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
}

/* 动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* 滚动条样式 */
.engine-menu::-webkit-scrollbar {
  width: 6px;
}

.engine-menu::-webkit-scrollbar-track {
  background: transparent;
}

.engine-menu::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.engine-menu::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* 暗色模式 */
html[data-theme="dark"] .search-box {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: var(--bg-primary);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-theme="dark"] .search-box:focus-within {
  box-shadow: 0 6px 30px rgba(102, 126, 234, 0.4);
  border-color: var(--primary-color);
}

html[data-theme="dark"] .engine-selector {
  border-right-color: rgba(255, 255, 255, 0.1);
}

html[data-theme="dark"] .engine-selector:hover {
  background: rgba(255, 255, 255, 0.05);
}

html[data-theme="dark"] .engine-menu {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  background: var(--bg-primary);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-theme="dark"] .engine-menu-header {
  background: var(--bg-secondary);
  border-bottom-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

html[data-theme="dark"] .engine-item {
  color: var(--text-primary);
}

html[data-theme="dark"] .engine-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

html[data-theme="dark"] .engine-item.active {
  background: rgba(102, 126, 234, 0.15);
  border-left-color: var(--primary-color);
}

html[data-theme="dark"] .engine-item-name {
  color: var(--text-primary);
}

html[data-theme="dark"] .engine-item-desc {
  color: var(--text-secondary);
}

html[data-theme="dark"] .search-input {
  color: var(--text-primary);
}

html[data-theme="dark"] .search-input::placeholder {
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .universal-search {
    max-width: 100%;
    padding: 15px;
  }

  .engine-name {
    display: none;
  }

  .search-input {
    font-size: 14px;
    padding: 10px 12px;
  }

  .engine-selector {
    padding: 10px 12px;
  }

  .search-button {
    padding: 10px 16px;
    outline: none;
  }

  .engine-menu {
    max-height: 300px;
  }
}
</style>
