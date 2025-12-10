<template>
  <div class="favorites-section">
    <div class="section-header">
      <h2>⭐ 我的收藏</h2>
      <button v-if="favorites.length > 0" class="clear-btn" @click="clearAll">
        清空
      </button>
    </div>

    <div v-if="favorites.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>还没有收藏任何链接</p>
      <p class="hint">点击卡片右上角的 ⭐ 按钮来添加收藏</p>
    </div>

    <div v-else class="favorites-grid">
      <div v-for="item in favorites" :key="`${item.category}-${item.name}`" class="favorite-card">
        <div class="card-header">
          <h3>{{ item.name }}</h3>
          <button class="remove-btn" @click="removeFavorite(item)" title="移除收藏">
            ✕
          </button>
        </div>
        <p class="card-category">{{ item.category }}</p>
        <p v-if="item.desc" class="card-desc">{{ item.desc }}</p>
        <a :href="item.url" target="_blank" class="card-link">
          访问 →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLinksStore } from '../utils/linksStore'
const { addLinks } = useLinksStore()

const favorites = ref([])

const loadFavorites = () => {
  const saved = localStorage.getItem('favorites')
  favorites.value = saved ? JSON.parse(saved) : []
}

const saveFavorites = () => {
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

const addFavorite = (item) => {
  const exists = favorites.value.some(
    fav => fav.name === item.name && fav.category === item.category
  )
  if (!exists) {
    favorites.value.unshift(item)
    saveFavorites()
  }
}

const removeFavorite = (item) => {
  favorites.value = favorites.value.filter(
    fav => !(fav.name === item.name && fav.category === item.category)
  )
  saveFavorites()
}

const clearAll = () => {
  if (confirm('确定要清空所有收藏吗？')) {
    favorites.value = []
    saveFavorites()
  }
}

const isFavorited = (item) => {
  return favorites.value.some(
    fav => fav.name === item.name && fav.category === item.category
  )
}

onMounted(loadFavorites)

// 暴露方法供其他组件使用
defineExpose({
  addFavorite,
  removeFavorite,
  isFavorited,
  favorites
})
</script>

<style scoped>
.favorites-section {
  margin: 3rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin: 0;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: var(--transition);
}

.clear-btn:hover {
  background: #ff0000;
  transform: scale(1.05);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 2px dashed var(--border-color);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0.5rem 0;
}

.hint {
  font-size: 0.9rem;
  margin-top: 1rem !important;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.favorite-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.favorite-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
  border-color: var(--primary-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
  flex: 1;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  transition: var(--transition);
}

.remove-btn:hover {
  color: #ff0000;
  transform: scale(1.3);
}

.card-category {
  color: var(--primary-color);
  font-size: 0.85rem;
  margin: 0.5rem 0;
  font-weight: 600;
}

.card-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-link {
  display: inline-block;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
  transition: var(--transition);
}

.card-link:hover {
  color: var(--secondary-color);
  transform: translateX(4px);
}

@media (max-width: 1024px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }
}
</style>
