<template>
  <div class="policy-page">
    <div class="policy-container">
      <h1 class="policy-title">关于我们</h1>
      <div class="policy-content">
        <AboutContent />
      </div>
      <div class="back-home">
        <router-link to="/" class="back-link">← 返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import AboutContent from '../components/policies/AboutContent.vue'
</script>

<style scoped>
.policy-page {
  min-height: 100vh;
  padding: 40px 20px;
  background: var(--bg-primary);
}

.policy-container {
  max-width: 900px;
  margin: 0 auto;
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.policy-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.policy-content {
  color: var(--text-secondary);
  line-height: 1.8;
}

.back-home {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.back-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.back-link:hover {
  color: var(--secondary-color);
  transform: translateX(-5px);
}

@media (max-width: 768px) {
  .policy-container {
    padding: 24px;
  }
  
  .policy-title {
    font-size: 1.5rem;
  }
}
</style>
