<template>
  <section class="communities" id="crypto-section">

    <div class="cards-grid">
      <article
        v-for="site in cryptoList"
        :key="site.name"
        class="card community-card"
        @click="handleCardClick(site)"
        @keydown.enter="handleCardClick(site)"
        tabindex="0"
        role="button"
      >
        <div class="card-header">
          <div v-if="site.logo" class="platform-icon" :class="site.iconClass">
            <img
              :src="site.logo"
              :alt="site.name"
              class="logo-image"
              @error="handleImageError"
            />
          </div>
          <div v-else class="platform-icon" :class="site.iconClass">
            <span class="fallback-icon">💰</span>
          </div>
          <h3 class="card-title">{{ site.name }}</h3>
        </div>
        <p class="card-desc">{{ site.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLinksStore } from "../utils/linksStore";

const { addLinks } = useLinksStore();

const cryptoList = ref([
  // 股票平台
  {
    name: "东方财富",
    desc: "中国领先的财经门户和证券交易平台",
    url: "https://www.eastmoney.com/",
    logo: "https://www.eastmoney.com/favicon.ico",
    category: "股票平台",
  },
  {
    name: "同花顺",
    desc: "专业的股票、基金、证券交易软件",
    url: "https://www.10jqka.com.cn/",
    logo: "https://www.10jqka.com.cn/favicon.ico",
    category: "股票平台",
  },
  {
    name: "雪球",
    desc: "聪明的投资者都在这里",
    url: "https://xueqiu.com/",
    logo: "https://xueqiu.com/favicon.ico",
    category: "股票平台",
  },
  {
    name: "富途牛牛",
    desc: "港美股交易平台",
    url: "https://www.futunn.com/",
    logo: "https://www.futunn.com/favicon.ico",
    category: "股票平台",
  },
  {
    name: "老虎证券",
    desc: "美港股一站式交易平台",
    url: "https://www.itiger.com/",
    logo: "https://www.itiger.com/favicon.ico",
    category: "股票平台",
  },
  {
    name: "新浪财经",
    desc: "7x24小时全球财经资讯",
    url: "https://finance.sina.com.cn/",
    logo: "https://finance.sina.com.cn/favicon.ico",
    category: "股票资讯",
  },
  // 虚拟货币交易所
  {
    name: "币安 Binance",
    desc: "全球最大的加密货币交易平台",
    url: "https://www.binance.com/",
    logo: "https://www.binance.com/favicon.ico",
    category: "虚拟货币",
  },
  {
    name: "欧易 OKX",
    desc: "全球领先的数字资产交易平台",
    url: "https://www.okx.com/",
    logo: "https://www.okx.com/favicon.ico",
    category: "虚拟货币",
  },
  {
    name: "火必 HTX",
    desc: "安全可信赖的数字资产交易平台",
    url: "https://www.htx.com/",
    logo: "https://www.htx.com/favicon.ico",
    category: "虚拟货币",
  },
  {
    name: "Coinbase",
    desc: "美国最大的加密货币交易所",
    url: "https://www.coinbase.com/",
    logo: "https://www.coinbase.com/favicon.ico",
    category: "虚拟货币",
  },
  {
    name: "Kraken",
    desc: "老牌加密货币交易平台",
    url: "https://www.kraken.com/",
    logo: "https://www.kraken.com/favicon.ico",
    category: "虚拟货币",
  },
  // 行情数据
  {
    name: "CoinMarketCap",
    desc: "全球加密货币市值排名和价格追踪",
    url: "https://coinmarketcap.com/",
    logo: "https://coinmarketcap.com/favicon.ico",
    category: "行情数据",
  },
  {
    name: "CoinGecko",
    desc: "加密货币价格、图表和市场数据",
    url: "https://www.coingecko.com/",
    logo: "https://www.coingecko.com/favicon.ico",
    category: "行情数据",
  },
  {
    name: "TradingView",
    desc: "专业的金融市场图表和交易平台",
    url: "https://www.tradingview.com/",
    logo: "https://www.tradingview.com/favicon.ico",
    category: "行情数据",
  },
  {
    name: "Investing.com",
    desc: "全球金融市场实时行情",
    url: "https://www.investing.com/",
    logo: "https://www.investing.com/favicon.ico",
    category: "行情数据",
  },
  // 区块链浏览器
  {
    name: "Etherscan",
    desc: "以太坊区块链浏览器",
    url: "https://etherscan.io/",
    logo: "https://etherscan.io/favicon.ico",
    category: "区块链",
  },
  {
    name: "BscScan",
    desc: "币安智能链浏览器",
    url: "https://bscscan.com/",
    logo: "https://bscscan.com/favicon.ico",
    category: "区块链",
  },
  {
    name: "Blockchain.com",
    desc: "比特币区块链浏览器",
    url: "https://www.blockchain.com/",
    logo: "https://www.blockchain.com/favicon.ico",
    category: "区块链",
  },
  // 加密资讯
//   {
//     name: "金色财经",
//     desc: "区块链和加密货币资讯平台",
//     url: "https://www.jinse.com/",
//     logo: "https://www.jinse.com/favicon.ico",
//     category: "加密资讯",
//   },
//   {
//     name: "币世界",
//     desc: "专业的区块链资讯服务平台",
//     url: "https://www.bishijie.com/",
//     logo: "https://www.bishijie.com/favicon.ico",
//     category: "加密资讯",
//   },
  {
    name: "CoinDesk",
    desc: "全球领先的区块链新闻媒体",
    url: "https://www.coindesk.com/",
    logo: "https://www.coindesk.com/favicon.ico",
    category: "加密资讯",
  },
]);

const handleCardClick = (site) => {
  window.open(site.url, "_blank");
  logUserInteraction(site.name, site.url);
};

const handleImageError = (e) => {
  e.target.style.display = "none";
  const fallbackIcon = e.target.parentElement.nextElementSibling;
  if (fallbackIcon) {
    fallbackIcon.style.display = "inline-block";
  }
};

const logUserInteraction = (name, url) => {
  try {
    const interaction = {
      name,
      url,
      timestamp: new Date().toISOString(),
      category: "股票虚拟币",
    };
    const logs =
      JSON.parse(localStorage.getItem("userInteractions")) || [];
    logs.push(interaction);
    if (logs.length > 100) logs.shift();
    localStorage.setItem("userInteractions", JSON.stringify(logs));
  } catch (e) {
    console.warn("无法访问 localStorage:", e);
  }
};

onMounted(() => {
  addLinks(4, "股票虚拟币", cryptoList.value);
});
</script>

<style scoped>
/* Styles are in main.css */
</style>
