<template>
  <div class="guide-page">
    <div class="guide-container">
      <header class="guide-header">
        <h1>使用指南</h1>
        <p class="guide-subtitle">快速掌握网站百宝箱的强大功能</p>
      </header>

      <nav class="guide-nav">
        <router-link to="/" class="back-link">← 返回首页</router-link>
      </nav>

      <div class="guide-content">
        <!-- 简介 -->
        <section class="guide-section">
          <h2>🎯 什么是网站百宝箱？</h2>
          <p>
            网站百宝箱是一个精心策划的资源导航平台，为开发者、设计师、内容创作者和学习者提供海量优质资源。
            我们致力于帮助用户快速找到所需工具和学习资源，提升工作效率和学习效果。
          </p>
          <p>
            平台汇集了18个专业分类，涵盖技术开发、AI工具、学习资源、娱乐影音等多个领域，
            每个资源都经过团队精心筛选和验证，确保质量和实用性。
          </p>
        </section>

        <!-- 核心功能 -->
        <section class="guide-section">
          <h2>✨ 核心功能</h2>
          
          <div class="feature-card">
            <h3>🔍 智能搜索</h3>
            <p>支持全站资源搜索，快速定位您需要的工具或网站。使用快捷键 Ctrl+S 或点击搜索按钮即可开始。</p>
            <ul>
              <li>实时搜索建议</li>
              <li>支持关键词匹配</li>
              <li>搜索历史记录</li>
            </ul>
          </div>

          <div class="feature-card">
            <h3>⌨️ 快捷键导航</h3>
            <p>按下 ? 键查看完整快捷键列表，使用数字键1-9快速切换分类，让操作更加高效。</p>
            <ul>
              <li>数字键：快速切换分类（1-9对应不同分类）</li>
              <li>?：显示快捷键帮助</li>
              <li>Ctrl+S：打开搜索</li>
              <li>Ctrl+K：切换暗黑模式</li>
            </ul>
          </div>

          <div class="feature-card">
            <h3>📊 访问统计</h3>
            <p>登录后可查看个人浏览足迹，包括访问次数、常用网站、分类偏好等数据分析。</p>
            <ul>
              <li>总点击次数统计</li>
              <li>访问过的网站数量</li>
              <li>活跃天数记录</li>
              <li>分类分布可视化</li>
            </ul>
          </div>

          <div class="feature-card">
            <h3>🔄 云端同步</h3>
            <p>使用Google或GitHub账号登录，您的浏览记录和偏好设置将自动同步到云端，跨设备访问无忧。</p>
            <ul>
              <li>多设备数据同步</li>
              <li>安全的第三方登录</li>
              <li>隐私数据加密存储</li>
            </ul>
          </div>

          <div class="feature-card">
            <h3>🎨 个性化主题</h3>
            <p>支持亮色和暗色两种主题模式，根据使用习惯自由切换，保护您的视力。</p>
          </div>

          <div class="feature-card">
            <h3>🐱 趣味宠物伴侣</h3>
            <p>可爱的桌面宠物陪伴您浏览网站，支持喂食、互动等功能，让使用过程更加有趣。</p>
          </div>
        </section>

        <!-- 使用技巧 -->
        <section class="guide-section">
          <h2>💡 使用技巧</h2>
          
          <div class="tip-item">
            <h4>1. 善用搜索功能</h4>
            <p>当您不确定某个工具在哪个分类时，直接使用搜索功能可以快速找到目标。</p>
          </div>

          <div class="tip-item">
            <h4>2. 收藏常用资源</h4>
            <p>登录后，系统会自动记录您的访问历史，访问次数最多的网站会出现在"我的足迹"中。</p>
          </div>

          <div class="tip-item">
            <h4>3. 利用快捷键</h4>
            <p>熟练使用快捷键可以大幅提升浏览效率，特别是分类切换和搜索功能。</p>
          </div>

          <div class="tip-item">
            <h4>4. 定期查看新增内容</h4>
            <p>我们会持续更新和优化资源库，添加最新的优质工具和网站。</p>
          </div>

          <div class="tip-item">
            <h4>5. 反馈与建议</h4>
            <p>如果您发现优质资源或有任何建议，欢迎通过联系我们页面反馈。</p>
          </div>
        </section>

        <!-- 常见问题 -->
        <section class="guide-section">
          <h2>❓ 常见问题</h2>
          
          <div class="faq-item">
            <h4>Q: 为什么有些网站打不开？</h4>
            <p>A: 部分国外网站可能需要科学上网工具才能访问，我们在网站描述中已标注"需科学"提示。</p>
          </div>

          <div class="faq-item">
            <h4>Q: 如何添加自己喜欢的网站？</h4>
            <p>A: 目前暂不支持用户自定义添加，但您可以通过联系我们推荐优质资源，我们会评估后添加。</p>
          </div>

          <div class="faq-item">
            <h4>Q: 登录后数据如何保护？</h4>
            <p>A: 我们使用Supabase安全认证系统，所有数据均加密存储，仅记录访问统计，不涉及隐私信息。</p>
          </div>

          <div class="faq-item">
            <h4>Q: 支持移动端访问吗？</h4>
            <p>A: 完全支持！网站采用响应式设计，在手机、平板等设备上都能流畅使用。</p>
          </div>

          <div class="faq-item">
            <h4>Q: 如何切换暗黑模式？</h4>
            <p>A: 点击右上角的月亮/太阳图标，或使用快捷键 Ctrl+K 即可切换主题。</p>
          </div>
        </section>

        <!-- 更新日志 -->
        <section class="guide-section">
          <h2>📝 更新日志</h2>
          
          <div class="changelog-item">
            <h4>v1.0.0 (2025-01-01)</h4>
            <ul>
              <li>✅ 首次发布</li>
              <li>✅ 18个专业分类，200+优质资源</li>
              <li>✅ 全站搜索功能</li>
              <li>✅ 快捷键导航</li>
              <li>✅ 用户登录与数据同步</li>
              <li>✅ 访问统计分析</li>
              <li>✅ 暗黑模式支持</li>
              <li>✅ 桌面宠物功能</li>
            </ul>
          </div>
        </section>

        <!-- 联系方式 -->
        <section class="guide-section">
          <h2>📮 联系我们</h2>
          <p>
            如果您有任何问题、建议或合作意向，欢迎通过以下方式联系我们：
          </p>
          <ul>
            <li>📧 Email: contact@jolyee.net</li>
            <li>🔗 网站: <a href="https://jolyee.net" target="_blank">https://jolyee.net</a></li>
          </ul>
          <p class="contact-footer">
            我们会在24小时内回复您的邮件。感谢您对网站百宝箱的支持！
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 设置页面标题
  document.title = '使用指南 - 网站百宝箱'
})
</script>

<style scoped>
.guide-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem 1rem;
}

.guide-container {
  max-width: 900px;
  margin: 0 auto;
}

.guide-header {
  text-align: center;
  padding: 3rem 0;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 2rem;
}

.guide-header h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.guide-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.guide-nav {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-block;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background 0.3s;
}

.back-link:hover {
  background: var(--bg-secondary);
}

.guide-content {
  line-height: 1.8;
}

.guide-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

.guide-section h2 {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--primary-color);
}

.guide-section p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.feature-card {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary-color);
}

.feature-card h3 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.feature-card ul {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

.feature-card li {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.category-item {
  background: var(--bg-primary);
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
}

.category-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.category-item h4 {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.category-item p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.tip-item,
.faq-item,
.changelog-item {
  background: var(--bg-primary);
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.tip-item h4,
.faq-item h4,
.changelog-item h4 {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.tip-item p,
.faq-item p {
  margin: 0;
  color: var(--text-secondary);
}

.changelog-item ul {
  padding-left: 1.5rem;
  margin-top: 0.75rem;
}

.changelog-item li {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.guide-section a {
  color: var(--primary-color);
  text-decoration: none;
}

.guide-section a:hover {
  text-decoration: underline;
}

.contact-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-style: italic;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .guide-header h1 {
    font-size: 2rem;
  }

  .guide-section {
    padding: 1.5rem;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
