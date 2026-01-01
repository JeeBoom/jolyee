<template>
  <div class="blog-list">
    <div class="blog-header">
      <h2 class="blog-title">📝 博客文章</h2>
      <p class="blog-subtitle">分享技术、记录生活、传递价值</p>
      
      <!-- 博客分类标签 -->
      <div class="blog-categories">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-tag', { active: activeCategory === category.id }]"
          @click="filterByCategory(category.id)"
        >
          {{ category.icon }} {{ category.name }}
        </button>
      </div>
    </div>

    <div class="posts-grid">
      <article
        v-for="post in filteredPosts"
        :key="post.id"
        class="post-card"
        @click="openPost(post)"
      >
        <!-- <div v-if="post.coverImage" class="post-cover">
          <img :src="post.coverImage" :alt="post.title" />
        </div> -->
        
        <div class="post-content">
          <div class="post-meta">
            <span class="post-category">{{ post.category }}</span>
            <span class="post-date">{{ formatDate(post.date) }}</span>
          </div>
          
          <h3 class="post-title">{{ post.title }}</h3>
          
          <p class="post-excerpt">{{ post.excerpt }}</p>
          
          <div class="post-footer">
            <div class="post-tags">
              <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">
                #{{ tag }}
              </span>
            </div>
            <div class="post-info">
              <span class="read-time">⏱️ {{ post.readTime }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- 如果没有文章 -->
    <div v-if="filteredPosts.length === 0" class="no-posts">
      <p>📭 该分类暂无文章，敬请期待...</p>
    </div>

    <!-- 文章详情模态框 -->
    <transition name="modal-fade">
      <div v-if="selectedPost" class="post-modal-overlay">
        <div class="post-modal">
          <div class="close-header">
            <span class="close-tip">按 ESC 或点击关闭</span>
            <button class="close-btn" @click="closePost">✕</button>
          </div>
          
          <div class="post-content-wrapper">
            <article class="post-detail">
              <header class="post-header">
                <div class="post-meta">
                  <span class="post-category">{{ selectedPost.category }}</span>
                  <span class="post-date">{{ formatDate(selectedPost.date) }}</span>
                  <span class="read-time">⏱️ {{ selectedPost.readTime }}</span>
                </div>
                
                <h1 class="post-title">{{ selectedPost.title }}</h1>
                
                <div class="post-tags">
                  <span v-for="tag in selectedPost.tags" :key="tag" class="tag">
                    #{{ tag }}
                  </span>
                </div>
                
                <div class="post-author">
                  <span>作者：{{ selectedPost.author }}</span>
                </div>
              </header>
              
              <!-- <div v-if="selectedPost.coverImage" class="post-cover-large">
                <img :src="selectedPost.coverImage" :alt="selectedPost.title" />
              </div> -->
              
              <div class="post-body" v-html="renderedContent"></div>

              <!-- 评论区 -->
              <BlogGiscus 
                v-if="selectedPost"
                :article-id="selectedPost.id"
              />
            </article>

            <!-- 右侧目录导航 -->
            <aside v-if="tableOfContents.length > 0" class="post-toc">
              <div class="toc-title">📑 目录</div>
              <nav class="toc-items">
                <a 
                  v-for="item in tableOfContents" 
                  :key="item.id"
                  :class="['toc-link', { active: activeHeadingId === item.id }]"
                  :href="`#${item.id}`"
                  @click.prevent="scrollToHeading(item.id)"
                >
                  {{ item.text }}
                </a>
              </nav>
            </aside>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllPosts } from '../utils/blogData'
import { marked } from 'marked'
import BlogGiscus from './BlogGiscus.vue'

// 博客分类
const categories = ref([
  { id: 'all', name: '全部', icon: '📚' },
  { id: 'frontend', name: '前端技术', icon: '💻' },
  { id: 'notes', name: '开发笔记', icon: '📝' },
  { id: 'casual', name: '随便写写', icon: '✍️' },
  { id: 'game', name: '游戏', icon: '🎮' },
  { id: 'recommend', name: '各种推荐', icon: '⭐' },
  { id: 'travel', name: '旅行日记', icon: '✈️' },
  { id: 'misc', name: '杂七杂八', icon: '🎨' },
])

const activeCategory = ref('all')
const posts = ref(getAllPosts())
const selectedPost = ref(null)
const router = useRouter()

// 根据分类过滤文章
const filteredPosts = computed(() => {
  if (activeCategory.value === 'all') {
    return posts.value
  }
  return posts.value.filter(post => post.blogCategory === activeCategory.value)
})

// 切换分类
const filterByCategory = (categoryId) => {
  activeCategory.value = categoryId
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const openPost = (post) => {
  router.push({ name: 'BlogPost', params: { slug: post.slug } })
}

const closePost = () => {
  selectedPost.value = null
  document.body.style.overflow = ''
  tableOfContents.value = []
  activeHeadingId.value = ''
  // 移除ESC键监听
  document.removeEventListener('keydown', handleEscKey)
  // 移除滚动监听
  const modalElement = document.querySelector('.post-detail')
  if (modalElement) {
    modalElement.removeEventListener('scroll', updateActiveHeading)
  }
}

const handleEscKey = (e) => {
  if (e.key === 'Escape' && selectedPost.value) {
    closePost()
  }
}

// 配置 marked 支持表格等扩展语法
marked.setOptions({
  gfm: true, // 启用 GitHub Flavored Markdown
  breaks: true, // 支持换行
  tables: true, // 启用表格支持
})

const renderedContent = computed(() => {
  if (!selectedPost.value) return ''
  return marked(selectedPost.value.content)
})

// 文章目录
const tableOfContents = ref([])
const activeHeadingId = ref('')

// 提取文章h3标题生成目录
const extractHeadings = () => {
  if (!selectedPost.value) return
  
  setTimeout(() => {
    const headings = document.querySelectorAll('.post-body h3')
    const toc = []
    
    headings.forEach((heading, index) => {
      const id = `heading-${index}`
      heading.id = id
      
      toc.push({
        id,
        text: heading.textContent
      })
    })
    
    tableOfContents.value = toc
    
    // 监听滚动
    const modalElement = document.querySelector('.post-detail')
    if (modalElement) {
      modalElement.addEventListener('scroll', updateActiveHeading)
    }
  }, 100)
}

// 滚动到指定标题
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  const modalElement = document.querySelector('.post-detail')
  
  if (element && modalElement) {
    const offsetTop = element.offsetTop - 150
    modalElement.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
  }
}

// 更新活动标题
const updateActiveHeading = () => {
  const modalElement = document.querySelector('.post-detail')
  if (!modalElement) return
  
  const scrollTop = modalElement.scrollTop
  const headings = document.querySelectorAll('.post-body h3')
  
  let currentId = ''
  headings.forEach((heading) => {
    if (heading.offsetTop - 200 <= scrollTop) {
      currentId = heading.id
    }
  })
  
  activeHeadingId.value = currentId
}
</script>

<style scoped>
.blog-list {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.blog-header {
  text-align: center;
  margin-bottom: 3rem;
}

.blog-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.blog-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* 博客分类标签 */
.blog-categories {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.category-tag {
  padding: 0.4rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-tag:hover {
  background: var(--bg-hover);
  border-color: var(--primary-color);
  color: var(--text-primary);
}

.category-tag.active {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border-color: transparent;
  font-weight: 600;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--border-color);
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.post-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-cover img {
  transform: scale(1.05);
}

.post-content {
  padding: 1.5rem;
}

.post-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.post-category {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
}

.post-date {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
}

.post-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.8rem;
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.post-info {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.read-time {
  white-space: nowrap;
}

.no-posts {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  font-size: 1.2rem;
}

/* 模态框样式 */
.post-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.post-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  max-width: 1400px;
  width: 100%;
  height: 95vh;
  max-height: 95vh;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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

.post-content-wrapper {
  display: flex;
  gap: 2rem;
  height: 100%;
  overflow: hidden;
}

.post-detail {
  flex: 1;
  padding: 2rem;
  padding-top: 4rem;
  overflow-y: auto;
  min-width: 0;
  /* 隐藏滚动条但保留滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.post-detail::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.post-header {
  margin-bottom: 2rem;
}

/* 右侧目录导航 */
.post-toc {
  width: 240px;
  flex-shrink: 0;
  padding: 4rem 1.5rem 2rem 0;
  overflow-y: hidden;
}

.toc-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--border-color);
}

.toc-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toc-link {
  display: block;
  padding: 0.5rem 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.85rem;
  line-height: 1.4;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.toc-link:hover {
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.05);
  border-left-color: var(--primary-color);
}

.toc-link.active {
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.1);
  border-left-color: var(--primary-color);
  font-weight: 600;
}

.post-header .post-meta {
  margin-bottom: 1rem;
}

.post-header .post-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  -webkit-line-clamp: unset;
  line-clamp: unset;
}

.post-author {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 1rem;
}

.post-cover-large {
  width: 100%;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.post-cover-large img {
  width: 100%;
  height: auto;
}

.post-body {
  color: var(--text-primary);
  line-height: 1.8;
  font-size: 1rem;
}

.post-body :deep(h2) {
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  color: var(--text-primary);
  font-weight: 700;
}

.post-body :deep(h3) {
  font-size: 1.3rem;
  margin: 1.5rem 0 0.75rem;
  color: var(--text-primary);
  font-weight: 600;
}

.post-body :deep(p) {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.post-body :deep(blockquote) {
  border-left: 4px solid var(--primary-color);
  padding-left: 1rem;
  margin: 1.5rem 0;
  background: rgba(102, 126, 234, 0.05);
  padding: 1rem;
  border-radius: 4px;
}

.post-body :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}

.post-body :deep(ul),
.post-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.post-body :deep(li) {
  margin-bottom: 0.5rem;
}

.post-body :deep(hr) {
  border: none;
  border-top: 2px solid var(--border-color);
  margin: 2rem 0;
}

.post-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1.5rem 0;
  border: 1px solid var(--border-color);
}

.post-body :deep(th),
.post-body :deep(td) {
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  text-align: left;
}

.post-body :deep(th) {
  background-color: rgba(102, 126, 234, 0.1);
  font-weight: 600;
  color: var(--text-primary);
}

.post-body :deep(td) {
  color: var(--text-secondary);
}

.post-body :deep(tr:hover) {
  background-color: rgba(102, 126, 234, 0.05);
}

/* 动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .post-modal,
.modal-fade-leave-active .post-modal {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .post-modal,
.modal-fade-leave-to .post-modal {
  transform: scale(0.9);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .blog-title {
    font-size: 2rem;
  }

  .blog-categories {
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .category-tag {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }

  .post-modal-overlay {
    padding: 10px;
  }

  .post-modal {
    height: 90vh;
    max-height: 90vh;
    border-radius: 8px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 1.3rem;
  }

  .post-detail {
    padding: 1rem;
    padding-top: 3rem;
  }

  .post-header .post-title {
    font-size: 1.5rem;
  }

  .post-body {
    font-size: 0.95rem;
  }
}
</style>
