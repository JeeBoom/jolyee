<template>
  <section class="communities" id="music-section">
    <h2 class="section-title">音乐</h2>
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
    name: '汽水音乐',
    desc: '汽水音乐 - 懂年轻人的品质音乐APP',
    logo: 'https://lf-luna.qishui.com/obj/music-luna-fe/luna/home/1.0.0.200/favicon.png', 
    url: 'https://www.qishui.com/'
  },
    {
    name: 'HiFiNi - 音乐磁场',
    desc: 'HiFiNi 是一个由音乐爱好者维护的分享平台, 旨在解决问题互帮互助, 如果您有需求, 请注册账号并发布信息、详细描述歌曲信息等, 我们会尽力帮您寻找HiFiNi MUSIC BBS - HiFiNi.COM',
    logo: 'https://hifiti.com/favicon.ico', 
    url: 'https://hifiti.com/'
  },
   {
    name: 'QQ音乐',
    desc: '音乐,QQ音乐,在线听歌,音乐下载,音乐播放器,音乐网站,MV,巅峰榜,音乐排行榜,翻译歌曲,热门歌曲,经典老歌,无损音乐,无损曲库',
    logo: 'https://y.qq.com/favicon.ico', 
    url: 'https://y.qq.com/'
  },
  {
    name: '网易云音乐',
    desc: '网易云音乐是一款专注于发现与分享的音乐产品，依托专业音乐人、DJ、好友推荐及社交功能，为用户打造全新的音乐生活。',
    logo: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/98/bd/94/98bd9409-ae62-519b-ebb3-add5714ad406/AppIcon-1x_U007emarketing-0-9-0-0-85-220-0.png/512x512bb.jpg', 
    url: 'https://music.163.com/'
  },
  {
    name: '酷狗音乐',
    desc: '酷狗音乐在线正版音乐网站，为您提供酷狗音乐播放器下载 、在线音乐试听下载，提供听书、长音频、频道、听小说和MV播放服务。酷狗音乐，就是歌多！小说相声也很多！场景音乐也很多！',
    logo: 'https://www.kugou.com/favicon.ico', 
    url: 'https://www.kugou.com/'
  },
  {
    name: '酷我音乐-无损音质正版在线试听网站',
    desc: '酷我音乐-无损音质正版在线试听网站，酷我音乐为您提供高品质音乐，无损音乐下载，拥有各类音乐榜单，快捷的新歌速递，完善的主题电台，个性化的歌曲推荐，高品质音乐在线听，好音质，用酷我。陪着我，不要停',
    logo: 'https://www.kuwo.cn/favicon.ico?v=1', 
    url: 'https://www.kuwo.cn/'
  },
  {
    name: '喜马拉雅',
    desc: '国内专业音频分享平台，随时随地，听我想听！4亿用户选择的在线音频平台。马东、郭德纲、吴晓波等20多万大咖入驻，1亿多条原创有声内容覆盖有声书、儿童、相声评书、财经新闻、音乐等328类',
    logo: 'https://www.ximalaya.com/favicon.ico', 
    url: 'https://www.ximalaya.com/'
  },
])

// 注册链接数据到全局store
onMounted(() => {
  addLinks(7, '音乐资源', communities.value)
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
