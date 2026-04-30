import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '../lib/blog'

const leftVerticalImage = '/imgs/vertical-1.png'
const rightVerticalImage = '/imgs/vertical-2.png'

export function PostPage() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const { slug = '' } = useParams()
  const post = getPostBySlug(slug)

  useEffect(() => {
    const wrapper = wrapperRef.current

    if (!wrapper) {
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const ratio = event.clientY / window.innerHeight
      const shift = (ratio - 0.5) * 20
      wrapper.style.setProperty('--side-shift', `${shift}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!post) {
    return (
      <section className="page-card blog-page-card">
        <p className="eyebrow">缺失</p>
        <h2 className="page-title">这篇文章暂时还没有被收录。</h2>
        <p className="page-copy">
          可以先返回博客总览，或者检查 slug 是否正确。
        </p>
        <Link className="text-link" to="/">
          返回博客页
        </Link>
      </section>
    )
  }

  return (
    <div ref={wrapperRef} className="post-page-shell">
      <aside
        className="post-side-visual post-side-visual-left"
        aria-hidden="true"
      >
        <span className="post-side-visual-ghost post-side-visual-ghost-a" />
        <span className="post-side-visual-ghost post-side-visual-ghost-b" />
        <figure className="post-side-visual-card post-side-visual-card-echo">
          <span className="post-side-visual-pin post-side-visual-pin-top" />
          <span className="post-side-visual-glow" />
        </figure>
        <figure className="post-side-visual-card">
          <span className="post-side-visual-pin post-side-visual-pin-top" />
          <img
            className="post-side-visual-image"
            src={leftVerticalImage}
            alt=""
          />
          <span className="post-side-visual-pin post-side-visual-pin-bottom" />
        </figure>
      </aside>
      <aside
        className="post-side-visual post-side-visual-right"
        aria-hidden="true"
      >
        <span className="post-side-visual-ghost post-side-visual-ghost-a" />
        <span className="post-side-visual-ghost post-side-visual-ghost-b" />
        <figure className="post-side-visual-card post-side-visual-card-echo">
          <span className="post-side-visual-pin post-side-visual-pin-top" />
          <span className="post-side-visual-glow" />
        </figure>
        <figure className="post-side-visual-card">
          <span className="post-side-visual-pin post-side-visual-pin-top" />
          <img
            className="post-side-visual-image"
            src={rightVerticalImage}
            alt=""
          />
          <span className="post-side-visual-pin post-side-visual-pin-bottom" />
        </figure>
      </aside>

      <section className="post-editorial-page">
        <aside className="post-left-rail">
          <Link
            className="post-left-block post-left-block-link post-back-link"
            to="/"
          >
            ← 返回博客总览
          </Link>

          <div className="post-left-block">
            <p className="eyebrow">此页面内容</p>
            <nav className="toc-list" aria-label="文章目录">
              {post.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`toc-link toc-link-level-${item.level}`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="post-editorial-paper">
          {post.cover ? (
            <div className="post-cover-wrap editorial-cover-wrap">
              <img className="post-cover" src={post.cover} alt={post.title} />
            </div>
          ) : null}

          <header className="post-article-header">
            <h1 className="post-article-title">{post.title}</h1>
            <div className="post-author-row">
              <span className="post-author-avatar" aria-hidden="true">
                {post.author.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <strong>{post.author}</strong>
                <p>
                  发布于 {post.compactDate} · {post.category}
                </p>
              </div>
            </div>
            <p className="post-article-summary">{post.summary}</p>
          </header>

          <div
            className="post-content markdown-body editorial-markdown"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </section>
    </div>
  )
}
