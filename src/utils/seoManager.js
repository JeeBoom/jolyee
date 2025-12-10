/**
 * SEO 元数据管理工具
 */

/**
 * 设置页面元数据
 */
export function setPageMeta(config = {}) {
  const {
    title = '导航中心 - 优质资源导航平台',
    description = '一个精心整理的优质资源导航平台，汇聚开发工具、学习社区、AI应用、影视资源等优质内容',
    keywords = '导航,资源导航,开发工具,学习社区,AI应用,影视资源',
    image = '/favicon.svg',
    url = 'https://nav.example.com'
  } = config

  // 设置标题
  document.title = title

  // 移除旧的元标签
  const existingMetas = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name="twitter:"]')
  existingMetas.forEach(meta => meta.remove())

  // 创建新的元标签
  const metaTags = [
    // 基础 SEO 元标签
    {
      name: 'description',
      content: description
    },
    {
      name: 'keywords',
      content: keywords
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0'
    },
    // Open Graph (Facebook, Twitter 等社交媒体)
    {
      property: 'og:title',
      content: title
    },
    {
      property: 'og:description',
      content: description
    },
    {
      property: 'og:image',
      content: image
    },
    {
      property: 'og:url',
      content: url
    },
    {
      property: 'og:type',
      content: 'website'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: title
    },
    {
      name: 'twitter:description',
      content: description
    },
    {
      name: 'twitter:image',
      content: image
    },
    // 其他优化
    {
      name: 'theme-color',
      content: '#667eea'
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent'
    }
  ]

  // 添加元标签到 head
  metaTags.forEach(tagConfig => {
    const meta = document.createElement('meta')
    Object.entries(tagConfig).forEach(([key, value]) => {
      meta.setAttribute(key, value)
    })
    document.head.appendChild(meta)
  })

  // 设置规范 URL
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url
}

/**
 * 生成结构化数据 (Schema.org JSON-LD)
 */
export function generateSchemaMarkup() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': '导航中心',
    'description': '一个精心整理的优质资源导航平台',
    'url': 'https://nav.example.com',
    'image': 'https://nav.example.com/favicon.svg',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://nav.example.com?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  // 移除旧的 schema
  const oldSchema = document.querySelector('script[type="application/ld+json"]')
  if (oldSchema) {
    oldSchema.remove()
  }

  // 创建并添加新的 schema
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schema)
  document.head.appendChild(script)
}

/**
 * 预生成 sitemap.xml 内容
 */
export function generateSitemapContent(categories = []) {
  const baseUrl = 'https://nav.example.com'
  const today = new Date().toISOString().split('T')[0]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
`

  // 为每个分类添加条目
  categories.forEach(category => {
    xml += `  <url>
    <loc>${baseUrl}#${category.id}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>
`
  })

  xml += `</urlset>`
  return xml
}

/**
 * 生成 robots.txt 内容
 */
export function generateRobotsTxtContent() {
  return `# Allow all robots
User-agent: *
Allow: /
Disallow: 

# Sitemap
Sitemap: https://nav.example.com/sitemap.xml

# Google-specific
User-agent: Googlebot
Allow: /

# Bing-specific
User-agent: Bingbot
Allow: /

# 爬虫延迟（可选）
Crawl-delay: 1
`
}
