<template>
  <section class="communities" id="music-section">

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
          <h3 class="card-title">{{ community.name }}</h3>
        </div>
        <p class="card-desc">{{ community.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useLinksStore } from '../utils/linksStore'
const { addLinks } = useLinksStore()

const communities = ref([
  {
    name: 'QQ音乐',
    desc: '在线听歌、音乐下载、无损音乐、热门歌曲、经典老歌',
    logo: 'https://y.qq.com/favicon.ico', 
    url: 'https://y.qq.com/'
  },
  {
    name: '网易云音乐',
    desc: '专注于发现与分享的音乐产品，依托专业音乐人、DJ、好友推荐',
    logo: 'https://s1.music.126.net/style/favicon.ico', 
    url: 'https://music.163.com/'
  },
  {
    name: '酷狗音乐',
    desc: '在线正版音乐网站，提供在线音乐试听下载、听书、长音频',
    logo: 'https://www.kugou.com/favicon.ico', 
    url: 'https://www.kugou.com/'
  },
  {
    name: '酷我音乐',
    desc: '无损音质正版在线试听，高品质音乐在线听',
    logo: 'https://www.kuwo.cn/favicon.ico?v=1', 
    url: 'https://www.kuwo.cn/'
  },
  {
    name: '汽水音乐',
    desc: '懂年轻人的品质音乐APP',
    logo: 'https://lf-luna.qishui.com/obj/music-luna-fe/luna/home/1.0.0.200/favicon.png', 
    url: 'https://www.qishui.com/'
  },
  {
    name: 'Spotify',
    desc: '全球最大的流媒体音乐平台，数百万首歌曲随心听',
    logo: 'https://www.spotify.com/favicon.ico', 
    url: 'https://www.spotify.com/'
  },
  {
    name: 'Apple Music',
    desc: '苹果音乐流媒体服务，超过1亿首歌曲无损播放',
    logo: 'https://www.apple.com/favicon.ico', 
    url: 'https://music.apple.com/'
  },
  {
    name: 'YouTube Music',
    desc: 'YouTube官方音乐平台，海量MV和音乐视频',
    logo: 'https://music.youtube.com/favicon.ico', 
    url: 'https://music.youtube.com/'
  },
  {
    name: 'SoundCloud',
    desc: '全球最大的独立音乐分享平台，发现新兴音乐人',
    logo: 'https://soundcloud.com/favicon.ico', 
    url: 'https://soundcloud.com/'
  },
  {
    name: 'Bandcamp',
    desc: '独立音乐人作品销售平台，直接支持艺术家',
    logo: 'https://s4.bcbits.com/client-bundle/1/PageLayout_1/favicon-78ff127104384a042453aca8d73be7dc.static/favicon/favicon-32x32.png', 
    url: 'https://bandcamp.com/'
  },
  {
    name: 'HiFiNi 音乐磁场',
    desc: '由音乐爱好者维护的高品质音乐分享平台',
    logo: 'https://hifiti.com/favicon.ico', 
    url: 'https://hifiti.com/'
  },
  {
    name: '喜马拉雅',
    desc: '专业音频分享平台，有声书、儿童、相声评书、财经新闻',
    logo: 'https://www.ximalaya.com/favicon.ico', 
    url: 'https://www.ximalaya.com/'
  },
  {
    name: '豆瓣音乐',
    desc: '发现音乐、分享音乐、讨论音乐的社区',
    logo: 'https://www.douban.com/favicon.ico', 
    url: 'https://music.douban.com/'
  },
  {
    name: 'Audiomack',
    desc: '免费音乐流媒体平台，专注说唱和嘻哈音乐',
    logo: 'https://www.audiomack.com/favicon.ico', 
    url: 'https://www.audiomack.com/'
  },
  {
    name: 'TIDAL',
    desc: '高保真音乐流媒体服务，提供无损和母带级音质',
    logo: 'https://tidal.com/favicon.ico', 
    url: 'https://tidal.com/'
  },
  {
    name: 'Deezer',
    desc: '国际音乐流媒体平台，支持全球180个国家',
    logo: 'https://www.deezer.com/favicon.ico', 
    url: 'https://www.deezer.com/'
  },
  {
    name: 'Last.fm',
    desc: '音乐推荐和统计平台，记录你的音乐品味',
    logo: 'https://www.last.fm/favicon.ico', 
    url: 'https://www.last.fm/'
  },
  {
    name: 'Genius',
    desc: '歌词注解平台，了解歌曲背后的故事和含义',
    logo: 'https://genius.com/favicon.ico', 
    url: 'https://genius.com/'
  },
])

// 注册链接数据到全局store
onMounted(() => {
  addLinks(10, '音乐资源', communities.value)
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
</script>

<style scoped>
/* Styles are in main.css */
</style>
