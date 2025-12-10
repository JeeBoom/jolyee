import { ref } from 'vue'

// 全局的所有链接数据存储
const allLinksData = ref([])

export function useLinksStore() {
  // 添加链接数据
  const addLinks = (categoryIndex, categoryTitle, links) => {
    const formattedLinks = links.map(link => ({
      ...link,
      categoryId: categoryIndex,
      categoryTitle: categoryTitle,
      name: link.name || link.title || '',
      description: link.desc || link.description || '',
      url: link.url || '#',
      icon: link.icon || '🔗'
    }))
    
    // 移除该分类的旧链接，添加新链接
    allLinksData.value = allLinksData.value.filter(l => l.categoryId !== categoryIndex)
    allLinksData.value.push(...formattedLinks)
  }

  // 获取所有链接
  const getAllLinks = () => {
    return allLinksData.value
  }

  // 清空所有链接
  const clearAllLinks = () => {
    allLinksData.value = []
  }

  return {
    addLinks,
    getAllLinks,
    clearAllLinks
  }
}
