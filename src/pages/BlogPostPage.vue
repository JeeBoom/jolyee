<template>
  <div class="blog-post-page">
    <div class="blog-post-container" v-if="post">
      <nav class="post-nav">
        <router-link to="/blog" class="back-link">← 返回博客列表</router-link>
      </nav>

      <article class="post-detail">
        <header class="post-header">
          <div class="post-meta">
            <span class="post-category">{{ post.category }}</span>
            <span class="post-date">{{ formatDate(post.date) }}</span>
            <span class="read-time">⏱️ {{ post.readTime }}</span>
          </div>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
          <div class="post-author">作者：{{ post.author }}</div>
        </header>

        <div v-if="post.coverImage" class="post-cover-large">
          <img :src="post.coverImage" :alt="post.title" />
        </div>

        <div class="post-body" v-html="renderedContent"></div>

        <div class="post-comments">
          <BlogGiscus :article-id="post.id" />
        </div>
      </article>

      <aside v-if="tableOfContents.length" class="post-toc">
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

    <div v-else class="post-not-found">
      <p>未找到文章，返回 <router-link to="/blog">博客列表</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { getPostBySlug } from '../utils/blogData'
import BlogGiscus from '../components/BlogGiscus.vue'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const tableOfContents = ref([])
const activeHeadingId = ref('')

const loadPost = () => {
  const slug = route.params.slug
  const found = getPostBySlug(slug)
  post.value = found || null
  if (!found) return
  setTimeout(extractHeadings, 50)
  if (found.title) {
    document.title = `${found.title} - 导航中心`
  }
}

const renderedContent = computed(() => {
  if (!post.value) return ''
  return marked(post.value.content)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const extractHeadings = () => {
  tableOfContents.value = []
  const headings = document.querySelectorAll('.post-body h3')
  const toc = []
  headings.forEach((heading, index) => {
    const id = `heading-${index}`
    heading.id = id
    toc.push({ id, text: heading.textContent || `小节 ${index + 1}` })
  })
  tableOfContents.value = toc
}

const scrollToHeading = (id) => {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const updateActiveHeading = () => {
  const headings = tableOfContents.value
  const scrollPosition = window.scrollY + 120
  for (let i = headings.length - 1; i >= 0; i -= 1) {
    const el = document.getElementById(headings[i].id)
    if (el && el.offsetTop <= scrollPosition) {
      activeHeadingId.value = headings[i].id
      break
    }
  }
}

onMounted(() => {
  loadPost()
  window.addEventListener('scroll', updateActiveHeading)
})

watch(() => route.params.slug, () => {
  loadPost()
})

</script>

<style scoped>
.blog-post-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem 1rem;
}

.blog-post-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;
}

.post-nav {
  grid-column: 1 / -1;
  margin-bottom: 0.5rem;
}

.back-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.back-link:hover {
  color: var(--secondary-color);
}

.post-detail {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.post-header {
  margin-bottom: 1.5rem;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.post-title {
  font-size: 2rem;
  margin: 0.5rem 0;
  color: var(--text-primary);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: rgba(102, 126, 234, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
}

.post-author {
  margin-top: 0.5rem;
  color: var(--text-secondary);
}

.post-cover-large img {
  width: 100%;
  border-radius: 12px;
  margin: 1rem 0;
}

.post-body {
  color: var(--text-primary);
  line-height: 1.8;
}

.post-body h2, .post-body h3, .post-body h4 {
  margin-top: 1.25rem;
}

.post-body pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 12px;
  overflow-x: auto;
}

.post-body code {
  background: rgba(15, 23, 42, 0.08);
  padding: 0.1rem 0.3rem;
  border-radius: 6px;
}

.post-toc {
  position: sticky;
  top: 80px;
  align-self: start;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.toc-title {
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.toc-items {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.toc-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
}

.toc-link.active {
  color: var(--primary-color);
  font-weight: 600;
}

.post-not-found {
  text-align: center;
  color: var(--text-secondary);
  padding: 3rem 1rem;
}

@media (max-width: 960px) {
  .blog-post-container {
    grid-template-columns: 1fr;
  }

  .post-toc {
    position: relative;
    top: auto;
  }
}
</style>
