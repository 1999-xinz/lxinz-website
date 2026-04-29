import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getAllPosts,
  getArchives,
  getCategories,
  getTags,
  type BlogTabKey,
} from '../lib/blog'

const tabs: Array<{ key: BlogTabKey; label: string; hint: string }> = [
  { key: 'recent', label: '近期发布', hint: '像刊物目录一样浏览最近更新' },
  { key: 'categories', label: '分类', hint: '按主题拆分文章线索' },
  { key: 'tags', label: '标签', hint: '从关键词切入阅读' },
  { key: 'archives', label: '归档', hint: '按年份与月份回看' },
]

export function BlogPage() {
  const [activeTab, setActiveTab] = useState<BlogTabKey>('recent')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const posts = useMemo(() => getAllPosts(), [])
  const categories = useMemo(() => getCategories(), [])
  const tags = useMemo(() => getTags(), [])
  const archives = useMemo(() => getArchives(), [])
  const visibleTag = activeTag ?? tags[0]?.name ?? null
  const selectedTagGroup = tags.find((tag) => tag.name === visibleTag)
  const leadPost = posts[0]
  const latestPosts = posts.slice(1)

  return (
    <div className="blog-page-wrapper">
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
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.label}</span>
            <small>{tab.hint}</small>
          </button>
        ))}
      </nav>

      <section className="blog-editorial-page">
        {activeTab === 'recent' && leadPost ? (
          <div className="blog-journal-shell">
            <article className="blog-lead-story">
              <div className="blog-lead-copy">
                <p className="blog-date-label">{leadPost.compactDate}</p>
                <h3>{leadPost.title}</h3>
                <p>{leadPost.summary}</p>
                <div className="blog-inline-meta">
                  <span>{leadPost.author}</span>
                  <span>{leadPost.category}</span>
                  <span>{leadPost.readingMinutes} 分钟阅读</span>
                </div>
              </div>

              {leadPost.cover ? (
                <Link
                  className="blog-lead-media"
                  to={`/posts/${leadPost.slug}`}
                >
                  <img src={leadPost.cover} alt={leadPost.title} />
                </Link>
              ) : null}

              <Link
                className="blog-row-link"
                to={`/posts/${leadPost.slug}`}
                aria-label={leadPost.title}
              />
            </article>

            <div className="blog-stream-list">
              {latestPosts.map((post) => (
                <article key={post.slug} className="blog-stream-item">
                  <div className="blog-stream-copy">
                    <p className="blog-date-label">{post.compactDate}</p>
                    <h3>{post.title}</h3>
                    <p>{post.summary}</p>
                    <div className="blog-inline-meta">
                      <span>{post.author}</span>
                      <span>{post.category}</span>
                      <span>{post.readingMinutes} 分钟阅读</span>
                    </div>
                  </div>

                  {post.cover ? (
                    <Link
                      className="blog-stream-media"
                      to={`/posts/${post.slug}`}
                    >
                      <img src={post.cover} alt={post.title} />
                    </Link>
                  ) : null}

                  <Link
                    className="blog-row-link"
                    to={`/posts/${post.slug}`}
                    aria-label={post.title}
                  />
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'categories' ? (
          <div className="blog-index-panel">
            {categories.map((group) => (
              <article key={group.name} className="blog-index-group">
                <div className="blog-index-heading">
                  <div>
                    <p className="eyebrow">分类</p>
                    <h3>{group.name}</h3>
                  </div>
                  <strong>{group.count}</strong>
                </div>
                <div className="blog-index-links">
                  {group.posts.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/posts/${post.slug}`}
                      className="blog-index-link"
                    >
                      <span>{post.title}</span>
                      <small>{post.compactDate}</small>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === 'tags' ? (
          <div className="blog-tag-layout">
            <div className="blog-tag-cloud-panel">
              <p className="eyebrow">标签</p>
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
                    <span className="blog-tag-chip-name">#{tag.name}</span>
                    <small className="blog-tag-chip-count">{tag.count}</small>
                  </button>
                ))}
              </div>
            </div>

            <article className="blog-index-group blog-tag-focus-panel">
              <div className="blog-index-heading">
                <div>
                  <p className="eyebrow">标签聚焦</p>
                  <h3>{visibleTag ? `#${visibleTag}` : '暂无标签'}</h3>
                </div>
                <strong>{selectedTagGroup?.count ?? 0}</strong>
              </div>
              <div className="blog-index-links">
                {selectedTagGroup?.posts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/posts/${post.slug}`}
                    className="blog-index-link"
                  >
                    <span>{post.title}</span>
                    <small>
                      {post.category} · {post.compactDate}
                    </small>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        ) : null}

        {activeTab === 'archives' ? (
          <div className="blog-archive-panel">
            {archives.map((group) => (
              <article key={group.key} className="blog-index-group">
                <div className="blog-index-heading">
                  <div>
                    <p className="eyebrow">归档</p>
                    <h3>{group.label}</h3>
                  </div>
                  <strong>{group.posts.length}</strong>
                </div>
                <div className="blog-index-links">
                  {group.posts.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/posts/${post.slug}`}
                      className="blog-index-link"
                    >
                      <span>{post.title}</span>
                      <small>
                        {post.author} · {post.readingMinutes} 分钟
                      </small>
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
