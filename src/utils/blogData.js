// 博客文章数据管理
import matter from 'gray-matter'
import { Buffer } from 'buffer'

// gray-matter 依赖 Node 的 Buffer，这里在浏览器环境做一次兜底
if (typeof globalThis !== 'undefined' && typeof globalThis.Buffer === 'undefined') {
  // eslint-disable-next-line no-undef
  globalThis.Buffer = Buffer
}

// 历史静态数据已迁移到 Markdown 文章目录
const staticPosts = [];

// 读取 Markdown 文章（位于 src/utils/posts/*.md）
const markdownModules = import.meta.glob('./posts/*.md', {
  as: 'raw',
  eager: true,
})

const estimateReadTime = (text = '') => {
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(2, Math.ceil(words / 300))
  return `${minutes} 分钟`
}

const loadMarkdownPosts = () => {
  return Object.entries(markdownModules).map(([path, raw], index) => {
    const { data, content } = matter(raw)
    const fileName = path.split('/').pop()?.replace('.md', '') || `md-${index}`
    const slug = data?.slug || fileName

    return {
      id: data?.id || `md-${slug}`,
      title: data?.title || slug,
      slug,
      author: data?.author || 'ssuperjee',
      date: data?.date || new Date().toISOString().slice(0, 10),
      category: data?.category || '前端技术',
      blogCategory: data?.blogCategory || 'frontend',
      tags: data?.tags || [],
      excerpt:
        data?.excerpt || `${content.trim().slice(0, 120)}${content.length > 120 ? '…' : ''}`,
      coverImage: data?.coverImage || '',
      content,
      readTime: data?.readTime || estimateReadTime(content),
      views: data?.views || 0,
      published: data?.published ?? true,
    }
  })
}

const markdownPosts = loadMarkdownPosts()

// 合并 Markdown 文章与历史静态文章
export const blogPosts = [...markdownPosts, ...staticPosts]

// 获取所有文章
export const getAllPosts = () => {
  return blogPosts.filter((post) => post.published);
};

// 根据 ID 获取文章
export const getPostById = (id) => {
  return blogPosts.find((post) => post.id === id && post.published);
};

// 根据 slug 获取文章
export const getPostBySlug = (slug) => {
  return blogPosts.find((post) => post.slug === slug && post.published);
};

// 获取最新文章
export const getLatestPosts = (limit = 5) => {
  return getAllPosts()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

// 根据分类获取文章
export const getPostsByCategory = (category) => {
  return getAllPosts().filter((post) => post.category === category);
};

// 根据标签获取文章
export const getPostsByTag = (tag) => {
  return getAllPosts().filter((post) => post.tags.includes(tag));
};
