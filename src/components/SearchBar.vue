<template>
  <div class="search-container">
    <!-- 搜索按钮 -->
    <button class="search-btn" @click="openSearch" title="搜索资源">
      🔍
    </button>

    <!-- 搜索弹出框 -->
    <transition name="search-modal">
      <div v-if="isSearchOpen" class="search-modal-overlay" @click="closeSearch">
        <div class="search-modal" @click.stop>
          <!-- 关闭按钮 -->
          <!-- <button class="search-close" @click="closeSearch" title="关闭搜索">
            ✕
          </button> -->

          <!-- 搜索输入框 -->
          <div class="search-input-wrapper">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="搜索资源、分类..."
              @keyup.enter="performSearch"
              @keyup.esc="closeSearch"
              ref="searchInputRef"
              autofocus
            />
            <button class="search-execute" @click="performSearch" title="执行搜索">
              搜索
            </button>
          </div>

          <!-- 搜索结果 -->
          <div v-if="searchResults.length > 0" class="search-results">
            <div class="results-header">
              找到 {{ searchResults.length }} 个结果
            </div>
            <div class="results-list">
              <a
                v-for="(item, index) in searchResults"
                :key="index"
                :href="item.isLink ? item.url : `#section-${item.sectionIndex}`"
                :target="item.isLink ? '_blank' : '_self'"
                class="result-item"
                :class="{ 'result-link': item.isLink }"
                @click="item.isLink ? null : selectResult(item.sectionIndex)"
              >
                <span class="result-icon">{{ item.icon }}</span>
                <div class="result-content">
                  <span class="result-title">{{ item.title }}</span>
                  <span v-if="item.description" class="result-description">{{ item.description }}</span>
                </div>
                <span class="result-match">{{ item.matchType }}</span>
              </a>
            </div>
          </div>

          <!-- 搜索提示 -->
          <div v-else-if="searchQuery" class="search-empty">
            <p>没有找到匹配的结果 😞</p>
          </div>

          <!-- 搜索热门提示 -->
          <div v-else class="search-tips">
            <p class="tips-title">💡 搜索提示</p>
            <ul class="tips-list">
              <li v-for="(section, index) in sections" :key="index">
                <a
                  :href="`#section-${index}`"
                  @click="selectResult(index)"
                >
                  {{ section.icon }} {{ section.title }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  sections: {
    type: Array,
    default: () => []
  },
  // 如果有实际的链接数据，可以通过这个属性传入
  allLinks: {
    type: Array,
    default: () => []
  }
})

const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = ref(null)

const openSearch = async () => {
  isSearchOpen.value = true
  await nextTick()
  searchInputRef.value?.focus()
}

const closeSearch = () => {
  isSearchOpen.value = false
  searchQuery.value = ''
}

const performSearch = () => {
  // 搜索逻辑会通过 searchResults 计算属性自动执行
}

const selectResult = (sectionIndex) => {
  closeSearch()
  // 延迟滚动以确保DOM更新
  setTimeout(() => {
    const element = document.getElementById(`section-${sectionIndex}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

// 计算搜索结果
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) {
    return []
  }

  const query = searchQuery.value.toLowerCase().trim()
  const results = []
  const addedSections = new Set()

  // 1. 搜索分类名称和分组
  props.sections.forEach((section, index) => {
    // 搜索分类标题
    if (section.title.toLowerCase().includes(query)) {
      if (!addedSections.has(index)) {
        results.push({
          sectionIndex: index,
          title: section.title,
          icon: section.icon,
          matchType: '分类',
          priority: 1
        })
        addedSections.add(index)
      }
    }
    // 搜索分组名称
    else if (section.group && section.group.toLowerCase().includes(query)) {
      if (!addedSections.has(index)) {
        results.push({
          sectionIndex: index,
          title: section.title,
          icon: section.icon,
          matchType: '分组',
          priority: 2
        })
        addedSections.add(index)
      }
    }
  })

  // 2. 搜索链接数据（如果有的话）
  if (props.allLinks && props.allLinks.length > 0) {
    props.allLinks.forEach((link, linkIndex) => {
      const matchedFields = []

      // 搜索链接名称
      if (link.name && link.name.toLowerCase().includes(query)) {
        matchedFields.push('name')
      }
      // 搜索链接描述
      if (link.description && link.description.toLowerCase().includes(query)) {
        matchedFields.push('description')
      }
      // 搜索链接URL
      if (link.url && link.url.toLowerCase().includes(query)) {
        matchedFields.push('url')
      }
      // 搜索分类标题
      if (link.categoryTitle && link.categoryTitle.toLowerCase().includes(query)) {
        matchedFields.push('category')
      }

      if (matchedFields.length > 0) {
        const sectionIndex = link.categoryId || 0
        results.push({
          sectionIndex: sectionIndex,
          title: link.name || '未命名链接',
          icon: link.icon || '🔗',
          matchType: `链接${matchedFields.length > 1 ? '(多项)' : ''}`,
          description: link.description || '',
          url: link.url || '#',
          priority: 0,
          isLink: true
        })
      }
    })
  }

  // 按优先级排序
  return results.sort((a, b) => a.priority - b.priority)
})
</script>

<style scoped>
.search-container {
  position: relative;
  flex-shrink: 0;
}

/* 搜索按钮 - 基础样式（由Header统一管理） */
.search-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 9995;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  padding: 0;
  margin: 0;
}

.search-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* 搜索弹出框 */
.search-modal-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10001;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 60px;
  animation: fadeIn 0.3s ease;
}

.search-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideDown 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 关闭按钮 */
.search-close {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 32px;
  height: 32px;
  background: rgba(102, 126, 234, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 11002;
}

.search-close:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

/* 搜索输入框 */
.search-input-wrapper {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-bottom: 2px solid var(--border-color);
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: var(--bg-primary);
}

.search-execute {
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.search-execute:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

/* 搜索结果 */
.search-results {
  padding: 0;
}

.results-header {
  padding: 15px 20px;
  background: rgba(102, 126, 234, 0.08);
  font-weight: 600;
  color: var(--primary-color);
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border-color);
}

.results-list {
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--text-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.result-item:hover {
  background: rgba(102, 126, 234, 0.08);
  padding-left: 25px;
}

.result-item.result-link:hover {
  background: rgba(102, 126, 234, 0.12);
}

.result-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.result-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-description {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.8;
}

.result-match {
  font-size: 0.75rem;
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.15);
  padding: 4px 8px;
  border-radius: 12px;
  flex-shrink: 0;
  font-weight: 600;
}

/* 空状态 */
.search-empty {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-secondary);
}

.search-empty p {
  margin: 0;
  font-size: 1.1rem;
}

/* 搜索提示 */
.search-tips {
  padding: 20px;
}

.tips-title {
  margin: 0 0 15px 0;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.tips-list li a {
  display: block;
  padding: 10px 15px;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 8px;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 0.9rem;
}

.tips-list li a:hover {
  background: rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

/* 弹出框动画 */
.search-modal-enter-active,
.search-modal-leave-active {
  transition: opacity 0.3s ease;
}

.search-modal-enter-from,
.search-modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .search-modal-overlay {
    padding-top: 20px;
  }

  .search-modal {
    width: 95%;
    max-height: 80vh;
  }

  .search-input-wrapper {
    flex-direction: column;
    gap: 10px;
  }

  .search-execute {
    width: 100%;
  }

  .tips-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
