<template>
  <section class="communities" id="english-section">

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
    name: '有道翻译',
    desc: '有道翻译提供即时免费的中文、英语、日语、韩语、法语、德语、俄语、西班牙语、葡萄牙语、越南语、印尼语、意大利语、荷兰语、泰语全文翻译、网页翻译、文档翻译、PDF翻译、DOC翻译、PPT翻译、人工翻译、同传等服务。',
    logo: 'https://ydlunacommon-cdn.nosdn.127.net/31cf4b56e6c0b3af668aa079de1a898c.png', 
    url: 'https://fanyi.youdao.com/'
  },
  {
    name: 'DeepL翻译',
    desc: '全世界最准确的翻译工具，支持31种语言的即时翻译',
    logo: 'https://www.deepl.com/img/favicon/favicon_96.png', 
    url: 'https://www.deepl.com/translator'
  },
  {
    name: 'Cambridge Dictionary',
    desc: '剑桥词典 - 权威英语词典和同义词词典',
    logo: 'https://dictionary.cambridge.org/favicon.ico', 
    url: 'https://dictionary.cambridge.org/'
  },
  {
    name: 'Merriam-Webster',
    desc: '韦氏词典 - 美国最权威的英语词典',
    logo: 'https://www.merriam-webster.com/favicon.ico', 
    url: 'https://www.merriam-webster.com/'
  },
  {
    name: 'Duolingo',
    desc: '多邻国 - 全球最受欢迎的语言学习平台',
    logo: 'https://d35aaqx5ub95lt.cloudfront.net/favicon.ico', 
    url: 'https://www.duolingo.com/'
  },
  {
    name: 'BBC Learning English',
    desc: 'BBC英语学习 - 免费的英语学习资源和课程',
    logo: 'https://www.bbc.co.uk/favicon.ico', 
    url: 'https://www.bbc.co.uk/learningenglish/'
  },
  {
    name: 'VOA Learning English',
    desc: '美国之音英语学习 - 慢速英语新闻和教学资源',
    logo: 'https://www.voanews.com/favicon.ico', 
    url: 'https://learningenglish.voanews.com/'
  },
  {
    name: 'TED Talks',
    desc: 'TED演讲 - 用思想改变世界，练习英语听力的绝佳资源',
    logo: 'https://www.ted.com/favicon.ico', 
    url: 'https://www.ted.com/talks'
  },
  {
    name: '巴别英语',
    desc: '看美剧和TED演讲练习英语听力和口语，海量免费资源',
    logo: 'https://www.babelabc.com/favicon.ico', 
    url: 'https://www.babelabc.com/'
  },
  {
    name: 'Grammarly',
    desc: '语法检查和写作辅助工具，提升英语写作水平',
    logo: 'https://static-web.grammarly.com/cms/master/public/favicon-32x32.png', 
    url: 'https://www.grammarly.com/'
  },
  {
    name: 'Quizlet',
    desc: '在线学习工具，通过闪卡和游戏学习英语词汇',
    logo: 'https://quizlet.com/favicon.ico', 
    url: 'https://quizlet.com/'
  },
  {
    name: 'YouGlish',
    desc: '通过YouTube视频学习英语发音，真实语境中的单词用法',
    logo: 'https://youglish.com/favicon.ico', 
    url: 'https://youglish.com/'
  },
  {
    name: 'Coursera',
    desc: '在线课程平台，提供大量英语授课的专业课程',
    logo: 'https://www.coursera.org/favicon.ico', 
    url: 'https://www.coursera.org/'
  },
  {
    name: 'English Central',
    desc: '通过视频学习英语，提供发音评分和词汇练习',
    logo: 'https://www.englishcentral.com/favicon.ico', 
    url: 'https://www.englishcentral.com/'
  },
  {
    name: '经典英文名著',
    desc: '与经典邂逅，与英语共舞 - 在线阅读经典英文小说',
    logo: 'https://bookyell.com/asset/images/favicon.png', 
    url: 'https://bookyell.com/'
  },
  {
    name: 'FreeMdict Forum',
    desc: 'MDX词典资源交流论坛，英语学习资料下载',
    logo: 'https://forumcdn.freemdict.com/uploads/default/optimized/1X/2180ed6a0534a9290a33abd13226859a832f6207_2_32x32.png', 
    url: 'https://forum.freemdict.com/'
  },
  {
    name: 'Anki',
    desc: '强大的记忆卡片软件，科学高效记忆英语单词',
    logo: 'https://apps.ankiweb.net/favicon.ico', 
    url: 'https://apps.ankiweb.net/'
  },
  {
    name: 'IELTS官方网站',
    desc: '雅思考试官方网站，提供考试资讯和备考资源',
    logo: 'https://www.ielts.org/favicon.ico', 
    url: 'https://www.ielts.org/'
  },
])

// 注册链接数据到全局store
onMounted(() => {
  addLinks(12, '英语', communities.value)
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
