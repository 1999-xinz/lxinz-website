import GithubSlugger from 'github-slugger'
import { marked } from 'marked'

export type BlogTabKey = 'recent' | 'categories' | 'tags' | 'archives'

export type TocItem = {
  id: string
  text: string
  level: number
}

export type PostSummary = {
  slug: string
  title: string
  summary: string
  author: string
  category: string
  tags: string[]
  date: string
  formattedDate: string
  compactDate: string
  yearMonth: string
  yearMonthLabel: string
  readingMinutes: number
  cover?: string
}

export type PostDetail = PostSummary & {
  html: string
  toc: TocItem[]
}

type CategoryGroup = {
  name: string
  count: number
  posts: PostSummary[]
}

type TagGroup = {
  name: string
  count: number
  posts: PostSummary[]
}

type ArchiveGroup = {
  key: string
  label: string
  posts: PostSummary[]
}

type PostFrontmatter = {
  title?: unknown
  date?: unknown
  summary?: unknown
  author?: unknown
  category?: unknown
  tags?: unknown
  cover?: unknown
}

const markdownModules = import.meta.glob<string>('../content/posts/*/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const assetModules = import.meta.glob<string>(
  '../content/posts/**/*.{png,jpg,jpeg,gif,svg,webp,avif}',
  {
    eager: true,
    import: 'default',
  },
) as Record<string, string>

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
})

marked.setOptions({
  gfm: true,
  breaks: false,
})

function stripWrappingQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function parseFrontmatter(rawMarkdown: string) {
  const normalized = rawMarkdown.replace(/\r\n/g, '\n')

  if (!normalized.startsWith('---\n')) {
    return {
      data: {},
      content: normalized,
    }
  }

  const lines = normalized.split('\n')
  const frontmatterLines: string[] = []
  let currentArrayKey: string | null = null
  let cursor = 1

  while (cursor < lines.length && lines[cursor] !== '---') {
    frontmatterLines.push(lines[cursor])
    cursor += 1
  }

  if (cursor >= lines.length) {
    return {
      data: {},
      content: normalized,
    }
  }

  const data: Record<string, unknown> = {}

  for (const line of frontmatterLines) {
    if (!line.trim()) {
      continue
    }

    const arrayItemMatch = line.match(/^\s*-\s*(.+)$/)

    if (arrayItemMatch && currentArrayKey) {
      const current = data[currentArrayKey]

      if (Array.isArray(current)) {
        current.push(stripWrappingQuotes(arrayItemMatch[1].trim()))
      }

      continue
    }

    const arrayKeyMatch = line.match(/^([A-Za-z0-9_-]+):\s*$/)

    if (arrayKeyMatch) {
      currentArrayKey = arrayKeyMatch[1]
      data[currentArrayKey] = []
      continue
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/)

    if (keyValueMatch) {
      currentArrayKey = null
      data[keyValueMatch[1]] = stripWrappingQuotes(keyValueMatch[2].trim())
    }
  }

  return {
    data,
    content: lines.slice(cursor + 1).join('\n'),
  }
}

function normalizePath(path: string) {
  const segments = path.split('/')
  const resolved: string[] = []

  for (const segment of segments) {
    if (!segment || segment === '.') {
      continue
    }

    if (segment === '..') {
      resolved.pop()
      continue
    }

    resolved.push(segment)
  }

  return resolved.join('/')
}

function isExternalPath(path: string) {
  return /^(?:[a-z]+:|\/|#)/i.test(path)
}

function getSlugFromModulePath(modulePath: string) {
  const match = modulePath.match(/posts\/([^/]+)\//)
  return match?.[1] ?? ''
}

function resolveAssetUrl(slug: string, assetPath: string) {
  if (!assetPath || isExternalPath(assetPath)) {
    return assetPath
  }
  // Remove any leading ./ from the assetPath to avoid paths like "../..././file.png"
  const cleanAssetPath = assetPath.replace(/^\.\/+,?/, '').replace(/^\.\//, '')

  if (!cleanAssetPath) {
    return assetPath
  }

  const rawKey = `../content/posts/${slug}/${cleanAssetPath}`
  const normalized = normalizePath(rawKey)

  // Try the most-likely keys that import.meta.glob produced.
  if (assetModules[rawKey]) {
    return assetModules[rawKey]
  }

  if (assetModules[normalized]) {
    return assetModules[normalized]
  }

  // Try with a leading ./ in case the glob keys differ on some environments.
  const dotKey = `./${rawKey}`
  if (assetModules[dotKey]) {
    return assetModules[dotKey]
  }

  // Fallback: return a clean site-relative path without the './' segment.
  return `/content/posts/${slug}/${cleanAssetPath}`
}

function rewriteMarkdownAssetPaths(markdown: string, slug: string) {
  return markdown
    .replace(
      /!\[([^\]]*)\]\((?![a-z]+:|\/|#)([^)\s]+)(?:\s+"([^"]+)")?\)/gi,
      (_match, alt: string, assetPath: string, title?: string) => {
        const resolved = resolveAssetUrl(slug, assetPath)
        const titlePart = title ? ` "${title}"` : ''
        return `![${alt}](${resolved}${titlePart})`
      },
    )
    .replace(
      /<img([^>]*?)src=["'](?![a-z]+:|\/|#)([^"']+)["']([^>]*)>/gi,
      (_match, before: string, assetPath: string, after: string) => {
        const resolved = resolveAssetUrl(slug, assetPath)
        return `<img${before}src="${resolved}"${after}>`
      },
    )
}

function enhanceHtml(html: string) {
  const parser = new DOMParser()
  const document = parser.parseFromString(
    `<article>${html}</article>`,
    'text/html',
  )
  const container = document.body.firstElementChild
  const slugger = new GithubSlugger()
  const toc: TocItem[] = []

  container?.querySelectorAll('h1, h2, h3').forEach((heading) => {
    const text = heading.textContent?.trim() ?? ''

    if (!text) {
      return
    }

    const id = slugger.slug(text)
    heading.setAttribute('id', id)
    toc.push({
      id,
      text,
      level: Number.parseInt(heading.tagName.slice(1), 10),
    })
  })

  container?.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href')

    if (!href || !/^https?:\/\//i.test(href)) {
      return
    }

    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noreferrer')
  })

  container?.querySelectorAll('img').forEach((image) => {
    image.setAttribute('loading', 'lazy')
    image.setAttribute('decoding', 'async')
  })

  return {
    html: container?.innerHTML ?? html,
    toc,
    textContent: container?.textContent?.trim() ?? '',
  }
}

function getReadingMinutes(text: string) {
  const length = text.replace(/\s+/g, '').length
  return Math.max(1, Math.ceil(length / 420))
}

function createPost(modulePath: string, rawMarkdown: string): PostDetail {
  const slug = getSlugFromModulePath(modulePath)
  const { data, content } = parseFrontmatter(rawMarkdown)
  const frontmatter = data as PostFrontmatter
  const markdown = rewriteMarkdownAssetPaths(content.trim(), slug)
  const rendered = marked.parse(markdown) as string
  const enhanced = enhanceHtml(rendered)
  const date =
    typeof frontmatter.date === 'string' ? frontmatter.date : '2026-01-01'
  const parsedDate = new Date(date)
  const safeDate = Number.isNaN(parsedDate.getTime())
    ? new Date('2026-01-01')
    : parsedDate
  const formattedDate = dateFormatter.format(safeDate)
  const yearMonthLabel = monthFormatter.format(safeDate)

  const computedTitle =
    typeof frontmatter.title === 'string' ? frontmatter.title : slug

  return {
    slug,
    title: computedTitle,
    summary:
      typeof frontmatter.summary === 'string' && frontmatter.summary.trim()
        ? frontmatter.summary
        : computedTitle,
    author:
      typeof frontmatter.author === 'string' && frontmatter.author.trim()
        ? frontmatter.author
        : 'lxinz',
    category:
      typeof frontmatter.category === 'string' && frontmatter.category.trim()
        ? frontmatter.category
        : '未分类',
    tags: Array.isArray(frontmatter.tags)
      ? frontmatter.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    date,
    formattedDate,
    compactDate: date.replaceAll('-', '/'),
    yearMonth: `${safeDate.getFullYear()}-${String(safeDate.getMonth() + 1).padStart(2, '0')}`,
    yearMonthLabel,
    readingMinutes: getReadingMinutes(enhanced.textContent),
    cover:
      typeof frontmatter.cover === 'string'
        ? resolveAssetUrl(slug, frontmatter.cover)
        : undefined,
    html: enhanced.html,
    toc: enhanced.toc,
  }
}

const allPosts = Object.entries(markdownModules)
  .map(([modulePath, rawMarkdown]) => createPost(modulePath, rawMarkdown))
  .sort((left, right) => right.date.localeCompare(left.date))

export function getAllPosts() {
  return allPosts
}

export function getLatestPosts(limit = 3) {
  return allPosts.slice(0, limit)
}

export function getPostBySlug(slug: string) {
  return allPosts.find((post) => post.slug === slug)
}

export function getCategories(): CategoryGroup[] {
  const groups = new Map<string, PostSummary[]>()

  for (const post of allPosts) {
    const current = groups.get(post.category) ?? []
    current.push(post)
    groups.set(post.category, current)
  }

  return [...groups.entries()]
    .map(([name, posts]) => ({ name, count: posts.length, posts }))
    .sort(
      (left, right) =>
        right.count - left.count || left.name.localeCompare(right.name),
    )
}

export function getTags(): TagGroup[] {
  const groups = new Map<string, PostSummary[]>()

  for (const post of allPosts) {
    for (const tag of post.tags) {
      const current = groups.get(tag) ?? []
      current.push(post)
      groups.set(tag, current)
    }
  }

  return [...groups.entries()]
    .map(([name, posts]) => ({ name, count: posts.length, posts }))
    .sort(
      (left, right) =>
        right.count - left.count || left.name.localeCompare(right.name),
    )
}

export function getArchives(): ArchiveGroup[] {
  const groups = new Map<string, ArchiveGroup>()

  for (const post of allPosts) {
    const current = groups.get(post.yearMonth)

    if (current) {
      current.posts.push(post)
      continue
    }

    groups.set(post.yearMonth, {
      key: post.yearMonth,
      label: post.yearMonthLabel,
      posts: [post],
    })
  }

  return [...groups.values()]
}

export function getRelatedPosts(post: PostDetail, limit = 3) {
  return allPosts
    .filter((item) => item.slug !== post.slug)
    .sort((left, right) => {
      const leftScore = left.category === post.category ? 2 : 0
      const rightScore = right.category === post.category ? 2 : 0
      const leftTagScore = left.tags.filter((tag) =>
        post.tags.includes(tag),
      ).length
      const rightTagScore = right.tags.filter((tag) =>
        post.tags.includes(tag),
      ).length
      return rightScore + rightTagScore - (leftScore + leftTagScore)
    })
    .slice(0, limit)
}

export function getBlogStats() {
  const categories = getCategories().length
  const tags = getTags().length
  return {
    posts: allPosts.length,
    categories,
    tags,
  }
}
