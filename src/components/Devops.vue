<template>
  <section class="communities" id="devops-section">
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
          <div
            v-if="community.logo"
            class="platform-icon"
            :class="community.iconClass"
          >
            <img
              :src="community.logo"
              :alt="community.name"
              class="logo-image"
              @error="handleImageError"
            />
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
import { ref, onMounted } from "vue";
import { useLinksStore } from "../utils/linksStore";
import { logUserInteraction } from "../utils/syncService";
const { addLinks } = useLinksStore();
const communities = ref([
  {
    name: "测试之家",
    desc: "测试之家（TesterHome）由一线测试工程师发起和运营，社区的主旨是公益，开源，分享，落地",
    logo: "https://testerhome.com/photo/favicon.png",
    url: "https://testerhome.com/",
  },
  {
    name: "Postman 官方",
    desc: "API 开发、测试和文档管理的全能平台，是接口测试的标配工具",
    logo: "https://www.postman.com/_mk-www-next/favicon.ico",
    url: "https://www.postman.com/",
  },
  {
    name: "Jenkins",
    desc: "全球最流行的开源持续集成和持续部署服务器，运维人员的必备工具",
    logo: "https://www.jenkins.io/favicon.ico",
    url: "https://www.jenkins.io/",
  },
  {
    name: "Docker 官方",
    desc: "容器化平台，现代运维和DevOps的基石，广泛应用于测试环境部署",
    logo: "https://www.docker.com/favicon.ico",
    url: "https://www.docker.com/",
  },
  {
    name: "Kubernetes",
    desc: "容器编排管理平台，大规模应用部署和测试的重要工具",
    logo: "https://kubernetes.io/icons/favicon-64.png",
    url: "https://kubernetes.io/",
  },
  {
    name: "GitLab",
    desc: "企业级 Git 仓库管理，内置 CI/CD 管道，很多大厂测试团队都在用",
    logo: "https://about.gitlab.com/favicon.ico",
    url: "https://about.gitlab.com/",
  },
  {
    name: "Prometheus",
    desc: "开源监控和告警系统，运维团队用来监控测试环境和生产环境的性能",
    logo: "",
    url: "https://prometheus.io/",
  },
  {
    name: "ELK Stack",
    desc: "Elasticsearch + Logstash + Kibana，日志分析和监控的标准组合",
    logo: "https://www.elastic.co/favicon.ico",
    url: "https://www.elastic.co/what-is/elk-stack",
  },
  {
    name: "Grafana",
    desc: "可视化监控和告警平台，与 Prometheus 配合使用，运维人员的得力助手",
    logo: "https://grafana.com/favicon.ico",
    url: "https://grafana.com/",
  },
  {
    name: "JMeter",
    desc: "开源性能测试和负载测试工具，性能测试人员的核心工具",
    logo: "https://jmeter.apache.org/images/favicon.png",
    url: "https://jmeter.apache.org/",
  },
  {
    name: "Selenium",
    desc: "开源自动化测试框架，UI 自动化测试的事实标准",
    logo: "https://www.selenium.dev/images/selenium_logo_square_green.png",
    url: "https://www.selenium.dev/",
  },
  {
    name: "蒲公英 - 应用内测平台",
    desc: "国内知名的 App 测试分发平台，内测版本管理的首选",
    logo: "https://www.pgyer.com/favicon.ico",
    url: "https://www.pgyer.com/",
  },
]);

// 注册链接数据到全局store
onMounted(() => {
  addLinks(7, "测试运维", communities.value);
});

const handleCommunityCardClick = (community) => {
  console.log(`点击了社区: ${community.name}`);
  logUserInteraction("devops", community.name, community.url);
  window.open(community.url, "_blank");
};

const handleImageError = (event) => {
  // 当图片加载失败时，用备用图标替换
  event.target.style.display = "none";
  const parent = event.target.parentElement;
  const fallbackIcon = parent.querySelector(".fallback-icon");
  if (!fallbackIcon) {
    const span = document.createElement("span");
    span.className = "fallback-icon";
    span.textContent = "🔗";
    parent.appendChild(span);
  }
};
</script>

<style scoped>
/* Styles are in main.css */
</style>
