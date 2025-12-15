<template>
  <section class="shopping" id="shopping-section">
    <div class="cards-grid">
      <article
        v-for="shop in shoppingList"
        :key="shop.name"
        class="card community-card"
        @click="handleShopCardClick(shop)"
        @keydown.enter="handleShopCardClick(shop)"
        tabindex="0"
        role="button"
      >
        <div class="card-header">
          <div v-if="shop.logo" class="platform-icon">
            <img
              :src="shop.logo"
              :alt="shop.name"
              class="logo-image"
              @error="handleImageError"
            />
          </div>
          <div v-else class="platform-icon">
            <span class="fallback-icon">🛒</span>
          </div>
          <h3 class="card-title">{{ shop.name }}</h3>
        </div>
        <p class="card-desc">{{ shop.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLinksStore } from "../utils/linksStore";
import { logUserInteraction } from '../utils/syncService';

const { addLinks } = useLinksStore();

const shoppingList = ref([
  {
    name: "淘宝",
    desc: "阿里巴巴旗下综合性购物平台，商品种类丰富多样",
    logo: "https://www.taobao.com/favicon.ico",
    url: "https://www.taobao.com/",
  },
  {
    name: "天猫",
    desc: "阿里巴巴旗下B2C平台，品牌商品官方旗舰店",
    logo: "https://www.tmall.com/favicon.ico",
    url: "https://www.tmall.com/",
  },
  {
    name: "京东",
    desc: "自营为主的综合性电商平台，物流配送快速",
    logo: "https://www.jd.com/favicon.ico",
    url: "https://www.jd.com/",
  },
  {
    name: "拼多多",
    desc: "社交电商平台，主打拼团购物和性价比商品",
    logo: "https://www.pinduoduo.com/favicon.ico",
    url: "https://www.pinduoduo.com/",
  },
  {
    name: "唯品会",
    desc: "专注品牌特卖的电商平台，折扣力度大",
    logo: "https://www.vip.com/favicon.ico",
    url: "https://www.vip.com/",
  },
  {
    name: "苏宁易购",
    desc: "家电3C起家的综合电商平台，线上线下融合",
    logo: "https://www.suning.com/favicon.ico",
    url: "https://www.suning.com/",
  },
  {
    name: "国美",
    desc: "家电零售巨头，提供家电3C商品销售与服务",
    logo: "https://www.gome.com.cn/favicon.ico",
    url: "https://www.gome.com.cn/",
  },
  {
    name: "1688",
    desc: "阿里巴巴旗下批发采购平台，面向中小企业和商家",
    logo: "https://www.1688.com/favicon.ico",
    url: "https://www.1688.com/",
  },
  {
    name: "小米商城",
    desc: "小米官方电商平台，销售小米及生态链产品",
    logo: "https://www.mi.com/favicon.ico",
    url: "https://www.mi.com/",
  },
  {
    name: "华为商城",
    desc: "华为官方电商平台，提供华为全系列产品",
    logo: "https://www.vmall.com/favicon.ico",
    url: "https://www.vmall.com/",
  },
  {
    name: "网易严选",
    desc: "网易旗下自营电商品牌，精选ODM模式商品",
    logo: "https://you.163.com/favicon.ico",
    url: "https://you.163.com/",
  },
  {
    name: "考拉海购",
    desc: "阿里巴巴旗下跨境电商平台，主打海外商品",
    logo: "https://www.kaola.com/favicon.ico",
    url: "https://www.kaola.com/",
  },
  {
    name: "亚马逊中国",
    desc: "亚马逊在中国的电商平台，跨境购物为主",
    logo: "https://www.amazon.cn/favicon.ico",
    url: "https://www.amazon.cn/",
  },
  {
    name: "当当网",
    desc: "老牌图书电商平台，图书品类齐全价格实惠",
    logo: "https://www.dangdang.com/favicon.ico",
    url: "https://www.dangdang.com/",
  },
  {
    name: "得物",
    desc: "潮流电商平台，专注球鞋潮牌正品鉴定交易",
    logo: "https://www.dewu.com/favicon.ico",
    url: "https://www.dewu.com/",
  },
  {
    name: "闲鱼",
    desc: "阿里巴巴旗下二手交易平台，闲置物品买卖",
    logo: "https://www.goofish.com/favicon.ico",
    url: "https://www.goofish.com/",
  },
  {
    name: "转转",
    desc: "二手交易平台，提供C2C二手商品交易服务",
    logo: "https://www.zhuanzhuan.com/favicon.ico",
    url: "https://www.zhuanzhuan.com/",
  },
  {
    name: "什么值得买",
    desc: "消费决策平台，提供购物攻略和商品推荐",
    logo: "https://www.smzdm.com/favicon.ico",
    url: "https://www.smzdm.com/",
  },
]);

const handleShopCardClick = (shop) => {
  logUserInteraction("shop", shop.name, shop.url);
  window.open(shop.url, "_blank", "noopener,noreferrer");
};

const handleImageError = (e) => {
  e.target.style.display = "none";
  e.target.parentElement.innerHTML = '<span class="fallback-icon">🛒</span>';
};

onMounted(() => {
  // 将购物平台链接添加到全局store（索引3）
  addLinks(3, "购物平台", shoppingList.value);
});
</script>

<style scoped>
.shopping {
  width: 100%;
}

.fallback-icon {
  font-size: 1.5rem;
}
</style>
