<template>
  <section class="communities" id="crossborder-section">

    <div class="cards-grid">
      <article
        v-for="resource in resources"
        :key="resource.name"
        class="card community-card"
        @click="handleResourceCardClick(resource)"
        @keydown.enter="handleResourceCardClick(resource)"
        tabindex="0"
        role="button"
      >
        <div class="card-header">
          <div v-if="resource.logo" class="platform-icon" :class="resource.iconClass">
            <img
              :src="resource.logo"
              :alt="resource.name"
              class="logo-image"
              @error="handleImageError"
            />
          </div>
          <div v-else class="platform-icon" :class="resource.iconClass">
            <span class="fallback-icon">🌍</span>
          </div>
          <h3 class="card-title">{{ resource.name }}</h3>
        </div>
        <p class="card-desc">{{ resource.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLinksStore } from "../utils/linksStore";
import { logUserInteraction } from '../utils/syncService';

const { addLinks } = useLinksStore();

const resources = ref([
  {
    name: "亚马逊全球开店",
    desc: "全球领先的电商平台，帮助中国卖家拓展国际市场",
    logo: "https://images-na.ssl-images-amazon.com/images/G/01/mobile-apps/dex/alexa/homepage/Alexa_com_logo.png",
    url: "https://www.amazon.com/",
  },
  {
    name: "eBay",
    desc: "全球最大的在线拍卖及购物平台之一，拥有数百万的商品",
    logo: "https://www.ebay.com/favicon.ico",
    url: "https://www.ebay.com/",
  },
  {
    name: "沃尔玛国际",
    desc: "美国最大零售商的国际电商平台，覆盖全球多个国家",
    logo: "https://www.walmart.com/favicon.ico",
    url: "https://www.walmart.com/",
  },
  {
    name: "Shopify",
    desc: "一站式电商解决方案，帮助企业创建和管理在线商店",
    logo: "https://www.shopify.com/favicon.ico",
    url: "https://www.shopify.com/",
  },
  {
    name: "速卖通国际",
    desc: "阿里巴巴旗下国际贸易平台，连接中国卖家和全球买家",
    logo: "https://www.aliexpress.com/favicon.ico",
    url: "https://www.aliexpress.com/",
  },
  {
    name: "Lazada",
    desc: "东南亚领先的电商平台，覆盖东南亚多个国家",
    logo: "https://www.lazada.com.my/favicon.ico",
    url: "https://www.lazada.com/",
  },
  {
    name: "Shopee",
    desc: "东南亚最大的电商平台，提供一站式购物体验",
    logo: "https://shopee.com.my/favicon.ico",
    url: "https://shopee.com/",
  },
  {
    name: "MercadoLibre",
    desc: "拉丁美洲最大的电商平台，覆盖整个拉美地区",
    logo: "https://www.mercadolibre.com/favicon.ico",
    url: "https://www.mercadolibre.com/",
  },
  {
    name: "Rakuten",
    desc: "日本最大的在线购物平台，也是全球电商巨头",
    logo: "https://www.rakuten.com/favicon.ico",
    url: "https://www.rakuten.com/",
  },
  {
    name: "Coupang",
    desc: "韩国领先的电商平台，提供快速配送服务",
    logo: "https://www.coupang.com/favicon.ico",
    url: "https://www.coupang.com/",
  },
  {
    name: "Etsy",
    desc: "全球手工艺品和创意产品的在线市场",
    logo: "https://www.etsy.com/favicon.ico",
    url: "https://www.etsy.com/",
  },
  {
    name: "Google Ads",
    desc: "谷歌广告平台，用于海外推广和用户获取",
    logo: "https://www.google.com/favicon.ico",
    url: "https://ads.google.com/",
  },
  {
    name: "Facebook Business",
    desc: "Facebook 商业平台，用于社交媒体营销和广告投放",
    logo: "https://www.facebook.com/favicon.ico",
    url: "https://www.facebook.com/business",
  },
  {
    name: "TikTok For Business",
    desc: "抖音国际版商业平台，用于品牌推广和内容营销",
    logo: "https://www.tiktok.com/favicon.ico",
    url: "https://www.tiktok.com/business",
  },
  {
    name: "Stripe",
    desc: "全球支付解决方案，支持多币种交易和结算",
    logo: "https://www.stripe.com/favicon.ico",
    url: "https://www.stripe.com/",
  },
  {
    name: "PayPal",
    desc: "全球领先的在线支付平台，支持跨境交易",
    logo: "https://www.paypal.com/favicon.ico",
    url: "https://www.paypal.com/",
  },
  {
    name: "Wise",
    desc: "国际汇款和多币种账户平台，低费用高汇率",
    logo: "https://www.wise.com/favicon.ico",
    url: "https://www.wise.com/",
  },
  {
    name: "国际商务部",
    desc: "美国商务部提供的国际贸易信息和资源",
    logo: "https://www.commerce.gov/favicon.ico",
    url: "https://www.commerce.gov/",
  },
  {
    name: "中国贸促会",
    desc: "中国对外贸易合作的权威机构，提供贸易信息和支持",
    logo: "https://www.ccpit.org/favicon.ico",
    url: "https://www.ccpit.org/",
  },
  {
    name: "世界银行",
    desc: "提供国际贸易数据、市场分析和发展资讯",
    logo: "https://www.worldbank.org/favicon.ico",
    url: "https://www.worldbank.org/",
  },
]);

const handleResourceCardClick = (resource) => {
  console.log(`点击了资源: ${resource.name}`);
  logUserInteraction("crossborder", resource.name, resource.url);

  if (resource.url) {
    window.open(resource.url, "_blank");
  }
};

const handleImageError = (event) => {
  // 当图片加载失败时，用备用图标替换
  event.target.style.display = "none";
  const parent = event.target.parentElement;
  const fallbackIcon = parent.querySelector(".fallback-icon");
  if (!fallbackIcon) {
    const span = document.createElement("span");
    span.className = "fallback-icon";
    span.textContent = "🌍";
    parent.appendChild(span);
  }
};

onMounted(() => {
  addLinks(13, "跨境出海", resources.value);
});
</script>

<style scoped>
/* Styles are in main.css */
</style>
