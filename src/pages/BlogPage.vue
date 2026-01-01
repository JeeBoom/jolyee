<template>
  <div class="blog-page">
    <div class="blog-container">
      <!-- <header class="blog-header">
        <h1 class="blog-title">博客文章</h1>
        <p class="blog-subtitle">技术实践、经验分享与成长记录</p>
      </header> -->

      <nav class="blog-nav">
        <router-link to="/" class="back-link">← 返回首页</router-link>
      </nav>

      <div class="blog-content">
        <Blog />
      </div>
    </div>
  </div>
</template>

<script setup>
import Blog from '../components/Blog.vue'
</script>

<style scoped>
.blog-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem 1rem;
}

.blog-container {
  max-width: 1280px;
  margin: 0 auto;
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.blog-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.blog-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.blog-subtitle {
  color: var(--text-secondary);
}

.blog-nav {
  margin-bottom: 1.5rem;
}

.back-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-link:hover {
  color: var(--secondary-color);
  transform: translateX(-4px);
}

.blog-content {
  background: var(--bg-secondary);
  border-radius: 12px;
}

@media (max-width: 768px) {
  .blog-container {
    padding: 1.25rem;
  }

  .blog-title {
    font-size: 1.5rem;
  }
}
</style>
