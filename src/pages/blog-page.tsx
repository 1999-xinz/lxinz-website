import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getAllPosts,
  getArchives,
  getCategories,
  getTags,
  type BlogTabKey,
} from '../lib/blog'

const tabs: Array<{ key: BlogTabKey; label: string; hint: string }> = [
  { key: 'recent', label: '文章', hint: '像刊物目录一样浏览所有文章' },
  { key: 'categories', label: '分类', hint: '按主题拆分文章线索' },
  { key: 'tags', label: '标签', hint: '从关键词切入阅读' },
  { key: 'archives', label: '归档', hint: '按年份与月份回看' },
]

const bannerImage = '/imgs/banner.png'
const leftVerticalImage = '/imgs/vertical-1.png'
const rightVerticalImage = '/imgs/vertical-2.png'
const PAGE_SIZE = 3

export function BlogPage() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [activeTab, setActiveTab] = useState<BlogTabKey>('recent')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const posts = useMemo(() => getAllPosts(), [])
  const categories = useMemo(() => getCategories(), [])
  const tags = useMemo(() => getTags(), [])
  const archives = useMemo(() => getArchives(), [])
  const visibleTag = activeTag ?? tags[0]?.name ?? null
  const selectedTagGroup = tags.find((tag) => tag.name === visibleTag)
  const visibleCategory = activeCategory ?? categories[0]?.name ?? null
  const selectedCategoryGroup = categories.find(
    (category) => category.name === visibleCategory,
  )
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedPosts = posts.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  )
  const pageNumbers = Array.from(
    { length: totalPages },
    (_item, index) => index + 1,
  )

  useEffect(() => {
    const wrapper = wrapperRef.current

    if (!wrapper) {
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const ratio = event.clientY / window.innerHeight
      const shift = (ratio - 0.5) * 28
      wrapper.style.setProperty('--side-shift', `${shift}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="blog-page-wrapper">
      <aside
        className="blog-side-visual blog-side-visual-left"
        aria-hidden="true"
      >
        <span className="blog-side-visual-ghost blog-side-visual-ghost-a" />
        <span className="blog-side-visual-ghost blog-side-visual-ghost-b" />
        <figure className="blog-side-visual-card blog-side-visual-card-echo">
          <span className="blog-side-visual-pin blog-side-visual-pin-top" />
          <span className="blog-side-visual-glow" />
        </figure>
        <figure className="blog-side-visual-card">
          <span className="blog-side-visual-pin blog-side-visual-pin-top" />
          <img
            className="blog-side-visual-image"
            src={leftVerticalImage}
            alt=""
          />
          <span className="blog-side-visual-pin blog-side-visual-pin-bottom" />
        </figure>
      </aside>
      <aside
        className="blog-side-visual blog-side-visual-right"
        aria-hidden="true"
      >
        <span className="blog-side-visual-ghost blog-side-visual-ghost-a" />
        <span className="blog-side-visual-ghost blog-side-visual-ghost-b" />
        <figure className="blog-side-visual-card blog-side-visual-card-echo">
          <span className="blog-side-visual-pin blog-side-visual-pin-top" />
          <span className="blog-side-visual-glow" />
        </figure>
        <figure className="blog-side-visual-card">
          <span className="blog-side-visual-pin blog-side-visual-pin-top" />
          <img
            className="blog-side-visual-image"
            src={rightVerticalImage}
            alt=""
          />
          <span className="blog-side-visual-pin blog-side-visual-pin-bottom" />
        </figure>
      </aside>

      <img
        className="blog-banner-visual blog-banner-top"
        src={bannerImage}
        alt="博客横幅"
      />

      <nav className="blog-top-tabs" aria-label="博客标签页切换">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              activeTab === tab.key
                ? 'blog-top-tab blog-top-tab-active'
                : 'blog-top-tab'
            }
            onClick={() => {
              setActiveTab(tab.key)

              if (tab.key === 'recent') {
                setCurrentPage(1)
              }
            }}
          >
            <span>{tab.label}</span>
            <small>{tab.hint}</small>
          </button>
        ))}
      </nav>
      <section
        className={
          activeTab === 'recent'
            ? 'blog-editorial-page blog-editorial-page-recent'
            : 'blog-editorial-page'
        }
      >
        {activeTab === 'recent' ? (
          <div className="blog-recent-feed-wrap">
            <div className="blog-recent-feed">
              {paginatedPosts.map((post) => (
                <article
                  key={post.slug}
                  className={
                    post.cover
                      ? 'blog-recent-card blog-recent-card-with-cover'
                      : 'blog-recent-card blog-recent-card-no-cover'
                  }
                >
                  {post.cover ? (
                    <Link
                      className="blog-recent-media"
                      to={`/posts/${post.slug}`}
                    >
                      <img src={post.cover} alt={post.title} />
                    </Link>
                  ) : null}

                  <div className="blog-recent-body">
                    <h3>{post.title}</h3>
                    <p>{post.summary}</p>
                    <div className="blog-inline-meta blog-recent-meta">
                      <span>{post.compactDate}</span>
                      <span>{post.category}</span>
                    </div>
                  </div>

                  <Link
                    className="blog-row-link"
                    to={`/posts/${post.slug}`}
                    aria-label={post.title}
                  />
                </article>
              ))}
            </div>

            <nav className="blog-pagination" aria-label="文章分页">
              <button
                type="button"
                className="blog-page-btn"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
              >
                上一页
              </button>

              <div className="blog-page-numbers">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={
                      page === safeCurrentPage
                        ? 'blog-page-btn blog-page-btn-active'
                        : 'blog-page-btn'
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="blog-page-btn"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={safeCurrentPage === totalPages}
              >
                下一页
              </button>
            </nav>
          </div>
        ) : null}

        {activeTab === 'categories' ? (
          <div className="blog-directory-section blog-category-directory">
            <div className="blog-tag-cloud">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  className={
                    category.name === visibleCategory
                      ? 'blog-tag-chip blog-tag-chip-active'
                      : 'blog-tag-chip'
                  }
                  onClick={() => setActiveCategory(category.name)}
                >
                  <span className="blog-tag-chip-name">{category.name}</span>
                  <small className="blog-tag-chip-count">
                    {category.count}
                  </small>
                </button>
              ))}
            </div>

            <div className="blog-compact-list">
              {selectedCategoryGroup?.posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/posts/${post.slug}`}
                  className="blog-compact-item"
                >
                  <span className="blog-compact-date">{post.compactDate}</span>
                  <span className="blog-compact-title">{post.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'tags' ? (
          <div className="blog-directory-section blog-tag-directory">
            <div className="blog-tag-cloud">
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  className={
                    tag.name === visibleTag
                      ? 'blog-tag-chip blog-tag-chip-active'
                      : 'blog-tag-chip'
                  }
                  onClick={() => setActiveTag(tag.name)}
                >
                  <span className="blog-tag-chip-name">{tag.name}</span>
                  <small className="blog-tag-chip-count">{tag.count}</small>
                </button>
              ))}
            </div>

            <div className="blog-compact-list">
              {selectedTagGroup?.posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/posts/${post.slug}`}
                  className="blog-compact-item"
                >
                  <span className="blog-compact-date">{post.compactDate}</span>
                  <span className="blog-compact-title">{post.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'archives' ? (
          <div className="blog-directory-section blog-archive-directory">
            {archives.map((group) => (
              <article key={group.key} className="blog-archive-group">
                <div className="blog-archive-heading">
                  <h3>{group.label}</h3>
                  <small>{group.posts.length} 篇</small>
                </div>
                <div className="blog-compact-list">
                  {group.posts.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/posts/${post.slug}`}
                      className="blog-compact-item"
                    >
                      <span className="blog-compact-date">
                        {post.compactDate}
                      </span>
                      <span className="blog-compact-title">{post.title}</span>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}
