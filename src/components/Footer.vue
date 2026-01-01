<template>
  <footer class="site-footer">
    <!-- 网站描述 -->
    <div class="footer-description">
      <p class="description-text">
        🌐 一个精心整理的优质资源导航平台，汇聚开发工具、学习社区、AI应用、影视资源等优质内容
      </p>
    </div>

    <!-- 支持作者 -->
    <!-- <div class="footer-support">
      <h4>❤️ 支持作者</h4>
      <div class="support-links">
        <button class="support-btn" @click="openWeChatQR" title="微信赞赏码">微信赞赏</button>
        <button class="support-btn" @click="openAlipayQR" title="支付宝赞赏码">支付宝赞赏</button>
      </div>
    </div> -->

    <!-- 友情链接 -->
    <!-- <div class="footer-links">
      <h4>友情链接</h4>
      <div class="links-container">
        <p class="no-links">暂无友情链接 👀</p>
      </div>
    </div> -->

     <!-- 更新时间 -->
    <div class="footer-update">
      <span class="update-label">最近更新：</span>
      <span class="update-time">{{ lastUpdateTime }}   </span>
      <a class="contact-auth" @click="openContactAuthorQR" title="联系作者">联系作者</a>
    </div>

    <!-- 政策链接 -->
    <div class="footer-policies">
        <router-link to="/guide" class="policy-link">使用指南</router-link>
        <span class="separator">|</span>
      <router-link to="/blog" class="policy-link">博客</router-link>
      <span class="separator">|</span>
      <router-link to="/about" class="policy-link">关于我们</router-link>
      <span class="separator">|</span>
      <router-link to="/contact" class="policy-link">联系我们</router-link>
      <span class="separator">|</span>
      <router-link to="/privacy" class="policy-link">隐私政策</router-link>
      <span class="separator">|</span>
      <router-link to="/terms" class="policy-link">服务条款</router-link>
    </div>

    <!-- 底部版权 -->
    <div class="footer-copyright">
      <p>&copy; 2024-2025 导航中心 | Made with ❤️ by ssuperjee</p>
    </div>

    <!-- 二维码模态框 -->
    <QRModal ref="wechatQRModal" title="微信赞赏" :qr-image="wechatQR" />
    <QRModal ref="alipayQRModal" title="支付宝赞赏" :qr-image="alipayQR" />
    <QRModal ref="contactAuthorModal" title="联系作者" :qr-image="contactAuthorQR" />
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QRModal from './QRModal.vue'

const lastUpdateTime = ref('2025-12-09')
const wechatQRModal = ref(null)
const alipayQRModal = ref(null)
const contactAuthorModal = ref(null)

// 在此处填入你的二维码图片URL（可以是public目录中的图片或外部URL）
// 例如: const wechatQR = '/qr-wechat.png'
const wechatQR = ref('/weixin-qr.webp')  // 替换为实际的微信二维码图片路径
const alipayQR = ref('/alipay-qr.webp')  // 替换为实际的支付宝二维码图片路径
const contactAuthorQR = ref('/contact-author-qr.webp')  // 替换为实际的联系作者二维码图片路径

const openWeChatQR = () => {
  wechatQRModal.value?.open()
}

const openAlipayQR = () => {
  alipayQRModal.value?.open()
}

const openContactAuthorQR = () => {
  contactAuthorModal.value?.open()
}

onMounted(() => {
  // 获取当前日期作为最后更新时间
  const today = new Date()
  lastUpdateTime.value = today.toLocaleDateString('zh-CN')
})
</script>

<style scoped>
.site-footer {
  /* background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%); */
  border-top: 2px solid var(--border-color);
  padding: 40px 20px;
  margin-top: 60px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-description {
  /* max-width: 800px; */
  margin: 0 auto 30px;
  padding: 20px;
  background: rgba(102, 126, 234, 0.05);
  /* border-left: 4px solid var(--primary-color); */
  border-radius: 4px;
  text-align: center;
}

.description-text {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.footer-update {
  text-align: center;
  margin: 20px 0;
  padding: 10px;
}

.update-label {
  font-weight: 600;
  color: var(--primary-color);
}

.update-time {
  color: var(--text-secondary);
  margin-right: 10px;
}

.footer-support {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 8px;
  text-align: center;
}

.footer-support h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.support-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.support-btn {
  display: inline-block;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  border: none;
  cursor: pointer;
}

.support-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
}

.footer-links {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  border-radius: 8px;
}

.footer-links h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.links-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  min-height: 40px;
  align-items: center;
}

.no-links {
  margin: 0;
  color: var(--text-secondary);
  font-style: italic;
}

.footer-copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  margin-top: 30px;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.footer-copyright p {
  margin: 0;
}

.contact-auth {
  color: var(--primary-color);
  cursor: pointer;
  margin-left: 10px;
  text-decoration: underline;
}

.footer-policies {
  text-align: center;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.policy-link {
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.policy-link:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

.separator {
  color: var(--border-color);
}

@media (max-width: 768px) {
  .site-footer {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    padding: 30px 15px;
    margin-top: 40px;
  }

  .footer-description,
  .footer-support,
  .footer-links {
    margin: 20px auto;
    padding: 15px;
    max-width: 100%;
  }

  .footer-description p {
    font-size: 0.85rem;
  }

  .footer-policies {
    flex-direction: column;
    gap: 8px;
  }

  .separator {
    display: none;
  }

  .support-links {
    gap: 10px;
  }

  .support-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>
