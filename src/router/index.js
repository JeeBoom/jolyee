import { createRouter, createWebHistory } from 'vue-router'

// 主页组件
import App from '../App.vue'

// 政策页面组件
const AboutPage = () => import('../pages/AboutPage.vue')
const ContactPage = () => import('../pages/ContactPage.vue')
const PrivacyPage = () => import('../pages/PrivacyPage.vue')
const TermsPage = () => import('../pages/TermsPage.vue')
const GuidePage = () => import('../pages/GuidePage.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App,
    meta: {
      title: '导航中心 - 优质资源导航平台'
    }
  },
  {
    path: '/guide',
    name: 'Guide',
    component: GuidePage,
    meta: {
      title: '使用指南 - 导航中心',
      description: '详细的使用指南，帮助您快速掌握网站功能'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    meta: {
      title: '关于我们 - 导航中心',
      description: '了解更多关于导航中心的信息'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage,
    meta: {
      title: '联系我们 - 导航中心',
      description: '联系导航中心团队'
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyPage,
    meta: {
      title: '隐私政策 - 导航中心',
      description: '导航中心隐私政策'
    }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsPage,
    meta: {
      title: '服务条款 - 导航中心',
      description: '导航中心服务条款'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫：更新页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
