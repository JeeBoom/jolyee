<template>
  <div class="search-container">
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索链接... (Ctrl/Cmd + K)"
        class="search-input"
        @keydown.enter="handleSearch"
        @keydown.escape="clearSearch"
      />
      <button class="search-btn" @click="handleSearch">
        <span class="search-icon">🔍</span>
      </button>
    </div>

    <!-- 搜索结果 -->
    <div v-if="searchQuery && searchResults.length > 0" class="search-results">
      <div class="results-header">
        找到 {{ searchResults.length }} 个结果
      </div>
      <div class="results-list">
        <a
          v-for="result in searchResults"
          :key="result.url"
          :href="result.url"
          target="_blank"
          rel="noopener noreferrer"
          class="result-item"
        >
          <div class="result-category">{{ result.category }}</div>
          <div class="result-name">{{ result.name }}</div>
          <div class="result-desc">{{ result.desc }}</div>
        </a>
      </div>
    </div>

    <!-- 无搜索结果 -->
    <div v-if="searchQuery && searchResults.length === 0" class="no-results">
      没有找到相关结果
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const allLinks = ref([])

const props = defineProps({
  links: {
    type: Array,
    default: () => []
  }
})

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  return props.links.filter(link =>
    link.name.toLowerCase().includes(query) ||
    link.desc.toLowerCase().includes(query) ||
    link.category.toLowerCase().includes(query)
  ).slice(0, 10) // 最多显示 10 个结果
})

const handleSearch = () => {
  if (searchResults.value.length > 0) {
    // 点击第一个结果或直接打开搜索
    window.open(searchResults.value[0].url, '_blank')
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

// 快捷键支持 Ctrl/Cmd + K
const setupHotkeys = () => {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      const input = document.querySelector('.search-input')
      if (input) input.focus()
    }
  })
}

onMounted(() => {
  setupHotkeys()
})
</script>

<style scoped>
.search-container {
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  z-index: 50;
  margin-bottom: 2rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.search-icon {
  font-size: 1.2rem;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 600px;
  background: var(--bg-primary);
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  margin-top: 0.5rem;
}

.results-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.results-list {
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  display: block;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.result-item:hover {
  background: var(--bg-secondary);
  padding-left: 1.5rem;
}

.result-category {
  font-size: 0.75rem;
  color: var(--primary-color);
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.result-name {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.result-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-results {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    max-width: 100%;
    padding: 0 1rem;
  }

  .search-input,
  .search-btn {
    width: 100%;
  }
}
</style>
