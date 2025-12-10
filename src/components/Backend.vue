<template>
  <section class="communities" id="backend-section">
    <h2 class="section-title">后端</h2>
    <div class="cards-grid">
      <article 
        v-for="community in communities" 
        :key="community.name"
        class="card community-card"
        @click="handleCommunityCardClick(community)"
        @keydown.enter="handleCommunityCardClick(community)"
        tabindex="0"
        role="button"
      >
        <div class="card-header">
          <div v-if="community.logo" class="platform-icon" :class="community.iconClass">
            <img :src="community.logo" :alt="community.name" class="logo-image" @error="handleImageError" />
          </div>
          <div v-else class="platform-icon" :class="community.iconClass">
            <span class="fallback-icon">🔗</span>
          </div>
          <h3 class="card-title">{{ community.name }}</h3>
        </div>
        <p class="card-desc">{{ community.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLinksStore } from '../utils/linksStore'

const { addLinks } = useLinksStore()

const communities = ref([
  {
    name: 'Java 面试指南 | JavaGuide',
    desc: '「Java学习 + 面试指南」一份涵盖大部分 Java 程序员所需要掌握的核心知识。准备 Java 面试，首选 JavaGuide！',
    logo: 'https://javaguide.cn/favicon.ico', 
    url: 'https://javaguide.cn/'
  },
  {
    name: '面试鸭',
    desc: '面试鸭 - 程序员求职面试刷题神器，高频编程题目免费刷',
    logo: 'https://www.mianshiya.com/favicon.ico', 
    url: 'https://www.mianshiya.com/'
  },
  {
    name: '小林coding',
    desc: '图解计算机网络、操作系统、计算机组成、MySQL、Redis，让天下没有难懂的八股文！',
    logo: 'https://cdn.xiaolincoding.com/icon.webp', 
    url: 'https://xiaolincoding.com/'
  },
  {
    name: 'CS自学指南',
    desc: 'CS自学指南 - 计算机科学自学资源汇总',
    logo: 'https://csdiy.wiki/images/favicon.ico', 
    url: 'https://csdiy.wiki/'
  },
  {
    name: '书栈网',
    desc: 'IT程序员互联网开源编程书籍阅读分享，囊括前端、后端、移动端等相关书籍',
    logo: 'https://www.bookstack.cn/favicon.ico', 
    url: 'https://www.bookstack.cn/'
  },
  {
    name: 'Spring 官方',
    desc: 'Java 最流行的企业级框架，Spring Boot、Spring Cloud 等，Java 后端的必学框架',
    logo: 'https://spring.io/icons/icon-48x48.png?v=96334d577af708644f6f0495dd1c7bc8',
    url: 'https://spring.io/'
  },
  {
    name: 'Node.js 官方',
    desc: 'JavaScript 服务端运行时，JavaScript 全栈开发的基础，Express、Nest.js 等框架都基于它',
    logo: 'https://nodejs.org/favicon.ico',
    url: 'https://nodejs.org/'
  },
  {
    name: 'Python 官方',
    desc: 'Python 编程语言官方网站，Django、Flask 等后端框架的基础',
    logo: 'https://www.python.org/favicon.ico',
    url: 'https://www.python.org/'
  },
  {
    name: 'Django 框架',
    desc: 'Python 最流行的 Web 框架，大而全的企业级开发框架',
    logo: 'https://www.djangoproject.com/favicon.ico',
    url: 'https://www.djangoproject.com/'
  },
  {
    name: 'Go 官方',
    desc: 'Go 语言，云原生和微服务时代的后端语言首选，性能卓越',
    logo: 'https://go.dev/favicon.ico',
    url: 'https://go.dev/'
  },
  {
    name: 'Rust 官方',
    desc: 'Rust 编程语言，内存安全和高性能的系统级编程语言，后端基础设施常用',
    logo: 'https://rust-lang.org/static/images/apple-touch-icon.png?v=ngJW8jGAmR',
    url: 'https://www.rust-lang.org/'
  },
  {
    name: 'PostgreSQL',
    desc: '功能最强大的开源关系型数据库，不少互联网大厂都在用',
    logo: 'https://www.postgresql.org/favicon.ico',
    url: 'https://www.postgresql.org/'
  },
  {
    name: 'MongoDB',
    desc: '最流行的 NoSQL 文档数据库，灵活的数据模型适合快速迭代',
    logo: 'https://www.mongodb.com/favicon.ico',
    url: 'https://www.mongodb.com/'
  },
  {
    name: 'Redis 官方',
    desc: '开源内存数据库，缓存和高性能数据处理的标配',
    logo: 'https://redis.io/favicon.ico',
    url: 'https://redis.io/'
  },
  {
    name: 'Apache Kafka',
    desc: '分布式事件流处理平台，消息队列和实时数据处理的行业标准',
    logo: 'https://kafka.apache.org/favicon.ico',
    url: 'https://kafka.apache.org/'
  },
  {
    name: 'RabbitMQ',
    desc: '开源消息队列系统，可靠的消息传递和异步处理',
    logo: 'https://www.rabbitmq.com/favicon.ico',
    url: 'https://www.rabbitmq.com/'
  },
  {
    name: 'NGINX 官方',
    desc: '高性能的 Web 服务器和反向代理服务器，后端必须掌握',
    logo: 'https://nginx.org/favicon.ico',
    url: 'https://nginx.org/'
  },
  {
    name: '阿里云开发者社区',
    desc: '国内云计算大厂阿里的开发者社区，海量后端技术文章和最佳实践',
    logo: 'https://developer.aliyun.com/favicon.ico',
    url: 'https://developer.aliyun.com/'
  },
])

// 注册链接数据到全局store
onMounted(() => {
  addLinks(4, '后端', communities.value)
})

const handleCommunityCardClick = (community) => {
  console.log(`点击了社区: ${community.name}`)
  logUserInteraction('community', community.name)
  
  if (community.url) {
    window.open(community.url, '_blank')
  }
}

const logUserInteraction = (type, target) => {
  const timestamp = new Date().toLocaleString()
  console.log(`[${timestamp}] 用户交互: ${type} - ${target}`)

  try {
    const interactions = JSON.parse(localStorage.getItem('userInteractions')) || []
    interactions.push({
      type,
      target,
      timestamp
    })

    if (interactions.length > 100) {
      interactions.shift()
    }

    localStorage.setItem('userInteractions', JSON.stringify(interactions))
  } catch (e) {
    console.warn('无法访问 localStorage:', e)
  }
}

const handleImageError = (event) => {
  // 当图片加载失败时，用备用图标替换
  event.target.style.display = 'none';
  const parent = event.target.parentElement;
  const fallbackIcon = parent.querySelector('.fallback-icon');
  if (!fallbackIcon) {
    const span = document.createElement('span');
    span.className = 'fallback-icon';
    span.textContent = '🔗';
    parent.appendChild(span);
  }
};
</script>

<style scoped>
/* Styles are in main.css */
</style>
