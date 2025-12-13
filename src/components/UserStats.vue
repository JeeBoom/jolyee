<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click="closeStats">
        <div class="stats-modal" @click.stop>
          <!-- 头部标题和关闭按钮在同一行 -->
          <div class="stats-header">
            <div class="stats-title-tabs">
              <h2>📊 我的足迹</h2>
              <div class="view-tabs">
                <button 
                  :class="{ active: currentView === 'dashboard' }"
                  @click="currentView = 'dashboard'"
                >
                  🎮 仪表盘
                </button>
                <button 
                  :class="{ active: currentView === 'universe' }"
                  @click="currentView = 'universe'"
                  title="隐藏彩蛋"
                >
                  🌌 宇宙视图
                </button>
              </div>
            </div>
            <div class="stats-header-actions">
              <!-- <span class="close-tip">按 ESC 或点击关闭</span> -->
              <button class="close-btn" @click="closeStats" title="关闭 (ESC)">✕</button>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>加载数据中...</p>
          </div>

          <!-- 无数据提示 -->
          <div v-else-if="!hasData" class="no-data">
            <div class="no-data-icon">🔍</div>
            <h3>还没有浏览记录</h3>
            <p>开始探索网站，你的足迹将会在这里显示</p>
          </div>

          <!-- 仪表盘视图 -->
          <div v-else-if="currentView === 'dashboard'" class="dashboard-view">
            <!-- 总览卡片 -->
            <div class="stats-cards">
              <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-content">
                  <div class="stat-value">{{ overallStats.totalClicks }}</div>
                  <div class="stat-label">总点击次数</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🌐</div>
                <div class="stat-content">
                  <div class="stat-value">{{ overallStats.uniqueSites }}</div>
                  <div class="stat-label">访问过的网站</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-content">
                  <div class="stat-value">{{ overallStats.activeDays }}</div>
                  <div class="stat-label">活跃天数</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-content">
                  <div class="stat-value">{{ overallStats.topCategory }}</div>
                  <div class="stat-label">最爱分类</div>
                </div>
              </div>
            </div>

            <!-- 成就系统 -->
            <div class="achievements-section">
              <h3>🏆 成就徽章</h3>
              <div class="achievements-grid">
                <div 
                  v-for="achievement in achievements" 
                  :key="achievement.id"
                  class="achievement-card"
                  :class="{ unlocked: achievement.unlocked }"
                  :title="achievement.description"
                >
                  <div class="achievement-icon">{{ achievement.icon }}</div>
                  <div class="achievement-name">{{ achievement.name }}</div>
                  <div v-if="achievement.unlocked" class="achievement-badge">✓</div>
                </div>
              </div>
            </div>

            <!-- Top 10 最常访问 -->
            <div class="top-sites-section">
              <h3>🔥 最常访问</h3>
              <div class="top-sites-list">
                <div 
                  v-for="(site, index) in topSites" 
                  :key="index"
                  class="top-site-item"
                  @click="openUrl(site.url)"
                >
                  <div class="site-rank" :class="`rank-${index + 1}`">
                    {{ index + 1 }}
                  </div>
                  <div class="site-info">
                    <div class="site-name">{{ site.name }}</div>
                    <div class="site-category">{{ site.type }}</div>
                  </div>
                  <div class="site-count">{{ site.count }} 次</div>
                </div>
              </div>
            </div>

            <!-- 分类饼图 -->
            <div class="category-section">
              <h3>📊 分类分布</h3>
              <div class="category-chart">
                <div class="pie-chart">
                  <svg viewBox="0 0 100 100">
                    <circle 
                      v-for="(slice, index) in pieSlices" 
                      :key="index"
                      :cx="50" 
                      :cy="50" 
                      :r="30"
                      fill="none"
                      :stroke="slice.color"
                      :stroke-width="30"
                      :stroke-dasharray="`${slice.percentage} ${100 - slice.percentage}`"
                      :stroke-dashoffset="slice.offset"
                      :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }"
                    />
                  </svg>
                </div>
                <div class="category-legend">
                  <div 
                    v-for="(cat, index) in categoryStats" 
                    :key="index"
                    class="legend-item"
                  >
                    <div class="legend-color" :style="{ background: getColor(index) }"></div>
                    <div class="legend-label">{{ cat.name }}</div>
                    <div class="legend-value">{{ cat.count }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 每周热力图 -->
            <div class="heatmap-section">
              <h3>🔥 活跃热力图</h3>
              <div class="heatmap-container">
                <div class="heatmap-labels-y">
                  <div v-for="day in weekDays" :key="day" class="heatmap-label">{{ day }}</div>
                </div>
                <div class="heatmap-grid">
                  <div 
                    v-for="(day, dayIndex) in heatmapData" 
                    :key="dayIndex"
                    class="heatmap-row"
                  >
                    <div 
                      v-for="(hour, hourIndex) in day" 
                      :key="hourIndex"
                      class="heatmap-cell"
                      :class="getHeatmapClass(hour)"
                      :title="`${weekDays[dayIndex]} ${hourIndex}:00 - ${hour} 次`"
                    ></div>
                  </div>
                </div>
                <div class="heatmap-labels-x">
                  <div v-for="hour in [0, 6, 12, 18, 23]" :key="hour" class="heatmap-label">
                    {{ hour }}h
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 宇宙视图 -->
          <div v-else-if="currentView === 'universe'" class="universe-view">
            <div class="universe-container">
              <div class="universe-background">
                <div class="stars"></div>
                <div class="stars2"></div>
                <div class="stars3"></div>
              </div>
              <div class="planets-container">
                <div 
                  v-for="(site, index) in topSites.slice(0, 8)" 
                  :key="index"
                  class="planet"
                  :class="`planet-${index + 1}`"
                  :style="getPlanetStyle(index)"
                  @click="openUrl(site.url)"
                  :title="`${site.name} - ${site.count} 次访问`"
                >
                  <div class="planet-core" :style="{ fontSize: `${Math.min(20 + site.count, 60)}px` }">
                    🌍
                  </div>
                  <div class="planet-name">{{ site.name }}</div>
                  <div class="planet-count">{{ site.count }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  getUserStats, 
  getCategoryStats, 
  getWeeklyHeatmap, 
  getOverallStats 
} from '../utils/syncService'

const isOpen = ref(false)
const loading = ref(false)
const currentView = ref('dashboard')

// 数据
const topSites = ref([])
const categoryStats = ref([])
const heatmapData = ref([])
const overallStats = ref({
  totalClicks: 0,
  uniqueSites: 0,
  activeDays: 0,
  topCategory: '暂无',
  totalCategories: 0
})

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

// 成就系统
const achievements = computed(() => [
  {
    id: 1,
    icon: '🎯',
    name: '初来乍到',
    description: '首次访问网站',
    unlocked: overallStats.value.totalClicks >= 1
  },
  {
    id: 2,
    icon: '🔥',
    name: '热情探索',
    description: '累计点击 50 次',
    unlocked: overallStats.value.totalClicks >= 50
  },
  {
    id: 3,
    icon: '⚡',
    name: '狂热爱好者',
    description: '累计点击 200 次',
    unlocked: overallStats.value.totalClicks >= 200
  },
  {
    id: 4,
    icon: '🌐',
    name: '广泛涉猎',
    description: '访问 20 个不同网站',
    unlocked: overallStats.value.uniqueSites >= 20
  },
  {
    id: 5,
    icon: '📅',
    name: '持之以恒',
    description: '连续活跃 7 天',
    unlocked: overallStats.value.activeDays >= 7
  },
  {
    id: 6,
    icon: '👑',
    name: '资深用户',
    description: '累计点击 500 次',
    unlocked: overallStats.value.totalClicks >= 500
  }
])

const hasData = computed(() => overallStats.value.totalClicks > 0)

// 饼图数据
const pieSlices = computed(() => {
  const total = categoryStats.value.reduce((sum, cat) => sum + cat.count, 0)
  let currentOffset = 0
  
  return categoryStats.value.map((cat, index) => {
    const percentage = (cat.count / total) * 100
    const slice = {
      percentage: percentage,
      offset: 25 - currentOffset,
      color: getColor(index)
    }
    currentOffset += percentage
    return slice
  })
})

// 颜色方案
const colors = [
  '#667eea', '#764ba2', '#f093fb', '#4facfe',
  '#43e97b', '#fa709a', '#fee140', '#30cfd0',
  '#a8edea', '#fed6e3'
]

const getColor = (index) => colors[index % colors.length]

// 热力图样式
const getHeatmapClass = (count) => {
  if (count === 0) return 'heat-0'
  if (count <= 2) return 'heat-1'
  if (count <= 5) return 'heat-2'
  if (count <= 10) return 'heat-3'
  return 'heat-4'
}

// 宇宙视图行星样式
const getPlanetStyle = (index) => {
  const positions = [
    { left: '20%', top: '20%' },
    { left: '60%', top: '15%' },
    { left: '80%', top: '40%' },
    { left: '70%', top: '70%' },
    { left: '30%', top: '80%' },
    { left: '10%', top: '60%' },
    { left: '45%', top: '45%' },
    { left: '85%', top: '85%' }
  ]
  return positions[index] || { left: '50%', top: '50%' }
}

// 打开URL
const openUrl = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const [sites, categories, heatmap, overall] = await Promise.all([
      getUserStats(),
      getCategoryStats(),
      getWeeklyHeatmap(),
      getOverallStats()
    ])
    
    topSites.value = sites
    categoryStats.value = categories
    heatmapData.value = heatmap
    overallStats.value = overall
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 打开统计
const openStats = async () => {
  isOpen.value = true
  await loadData()
}

// 关闭统计
const closeStats = () => {
  isOpen.value = false
  currentView.value = 'dashboard'
}

// ESC 键关闭
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeStats()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  openStats
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 10003;
}

.stats-modal {
  position: relative;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  background: var(--bg-primary);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow-y: scroll;
  overscroll-behavior: contain;
}

.stats-modal::-webkit-scrollbar {
  width: 0px;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.stats-header {
  padding: 30px;
  border-bottom: 1px solid var(--border-color);
}

.stats-header h2 {
  margin: 0 0 20px 0;
  font-size: 28px;
  color: var(--text-primary);
}

.view-tabs {
  display: flex;
  gap: 10px;
}

.view-tabs button {
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  color: var(--text-primary);
}

.view-tabs button.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

.view-tabs button:hover:not(.active) {
  border-color: var(--primary-color);
}

/* 加载状态 */
.loading {
  padding: 80px 30px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 无数据 */
.no-data {
  padding: 80px 30px;
  text-align: center;
}

.no-data-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.3;
}

.no-data h3 {
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.no-data p {
  color: var(--text-secondary);
}

/* 仪表盘视图 */
.dashboard-view {
  padding: 30px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: cardFloat 3s ease-in-out infinite;
}

.stat-card:nth-child(1) { animation-delay: 0s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.4s; }
.stat-card:nth-child(4) { animation-delay: 0.6s; }

@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.stat-icon {
  font-size: 40px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

/* 成就系统 */
.achievements-section {
  margin-bottom: 40px;
}

.achievements-section h3 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.achievement-card {
  position: relative;
  padding: 20px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
  opacity: 0.4;
}

.achievement-card.unlocked {
  opacity: 1;
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.achievement-card:hover {
  transform: translateY(-5px);
}

.achievement-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.achievement-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.achievement-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

/* Top 10 */
.top-sites-section {
  margin-bottom: 40px;
}

.top-sites-section h3 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.top-sites-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-site-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: var(--bg-secondary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.top-site-item:hover {
  background: var(--border-color);
  transform: translateX(5px);
}

.site-rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  border-radius: 8px;
  background: var(--border-color);
  color: var(--text-primary);
}

.site-rank.rank-1 {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #000;
}

.site-rank.rank-2 {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #000;
}

.site-rank.rank-3 {
  background: linear-gradient(135deg, #cd7f32, #e6a85c);
  color: #000;
}

.site-info {
  flex: 1;
}

.site-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.site-category {
  font-size: 13px;
  color: var(--text-secondary);
}

.site-count {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
}

/* 分类饼图 */
.category-section {
  margin-bottom: 40px;
}

.category-section h3 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.category-chart {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;
}

.pie-chart {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.category-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-label {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.legend-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

/* 热力图 */
.heatmap-section h3 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.heatmap-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr auto;
  gap: 10px;
}

.heatmap-labels-y {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-right: 10px;
}

.heatmap-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: right;
}

.heatmap-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.heatmap-row {
  display: flex;
  gap: 3px;
}

.heatmap-cell {
  flex: 1;
  aspect-ratio: 1;
  border-radius: 2px;
  transition: all 0.2s;
  cursor: pointer;
}

.heatmap-cell:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.heat-0 { background: var(--bg-secondary); }
.heat-1 { background: #c6f6d5; }
.heat-2 { background: #68d391; }
.heat-3 { background: #38a169; }
.heat-4 { background: #22543d; }

html[data-theme="dark"] .heat-0 { background: #2d3748; }
html[data-theme="dark"] .heat-1 { background: #2f855a; }
html[data-theme="dark"] .heat-2 { background: #38a169; }
html[data-theme="dark"] .heat-3 { background: #48bb78; }
html[data-theme="dark"] .heat-4 { background: #68d391; }

.heatmap-labels-x {
  grid-column: 2;
  display: flex;
  justify-content: space-between;
  padding-top: 5px;
}

/* 宇宙视图 */
.universe-view {
  padding: 30px;
  min-height: 600px;
}

.universe-container {
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
}

.universe-background {
  position: absolute;
  width: 100%;
  height: 100%;
}

.stars,
.stars2,
.stars3 {
  position: absolute;
  width: 1px;
  height: 1px;
  background: white;
  box-shadow: 
    0 0 20px rgba(255, 255, 255, 0.5),
    0 0 40px rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: twinkle 3s infinite;
}

.stars { 
  box-shadow: 
    100px 100px white, 200px 50px white, 300px 150px white,
    400px 200px white, 500px 100px white, 600px 250px white,
    700px 150px white, 800px 300px white, 50px 300px white,
    150px 400px white, 250px 350px white, 350px 450px white;
}

.stars2 {
  animation-delay: 1s;
  box-shadow: 
    50px 50px white, 150px 100px white, 250px 200px white,
    350px 150px white, 450px 250px white, 550px 150px white,
    650px 200px white, 750px 250px white, 100px 350px white,
    200px 450px white, 300px 400px white, 400px 500px white;
}

.stars3 {
  animation-delay: 2s;
  box-shadow: 
    75px 75px white, 175px 125px white, 275px 175px white,
    375px 225px white, 475px 175px white, 575px 275px white,
    675px 225px white, 775px 325px white, 125px 375px white,
    225px 425px white, 325px 475px white, 425px 375px white;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.planets-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.planet {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s;
  animation: float 6s ease-in-out infinite;
}

.planet:nth-child(1) { animation-delay: 0s; }
.planet:nth-child(2) { animation-delay: 0.5s; }
.planet:nth-child(3) { animation-delay: 1s; }
.planet:nth-child(4) { animation-delay: 1.5s; }
.planet:nth-child(5) { animation-delay: 2s; }
.planet:nth-child(6) { animation-delay: 2.5s; }
.planet:nth-child(7) { animation-delay: 3s; }
.planet:nth-child(8) { animation-delay: 3.5s; }

@keyframes float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0); }
  50% { transform: translate(-50%, -50%) translateY(-20px); }
}

.planet:hover {
  transform: translate(-50%, -50%) scale(1.2);
  filter: brightness(1.3);
}

.planet-core {
  font-size: 40px;
  text-align: center;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.planet-name {
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.planet-count {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-modal {
    max-height: 95vh;
    border-radius: 16px 16px 0 0;
  }
  
  .stats-cards {
    grid-template-columns: 1fr 1fr;
  }
  
  .achievements-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .category-chart {
    grid-template-columns: 1fr;
  }
  
  .heatmap-cell {
    min-width: 8px;
    min-height: 8px;
  }
  
  .universe-container {
    height: 400px;
  }
}
.close-header {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 10;
}

.close-tip {
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.close-header:hover .close-tip {
  opacity: 1;
}

.close-btn {
  background: var(--bg-secondary);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.close-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: rotate(90deg);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>
