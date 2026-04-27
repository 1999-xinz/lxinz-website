export function HomePage() {
  return (
    <section className="page-card">
      <p className="eyebrow">Home</p>
      <h2 className="page-title">个人作品站起步页</h2>
      <p className="page-copy">
        这里会逐步承载博客文章、canvas 动画实验、交互式页面和后续的 JavaScript
        游戏内容。
      </p>

      <div className="feature-grid">
        <article className="feature-card">
          <h3>Blog Space</h3>
          <p>文章展示与技术思考归档。</p>
        </article>
        <article className="feature-card">
          <h3>Canvas Lab</h3>
          <p>动画、shader、交互效果与视觉实验。</p>
        </article>
        <article className="feature-card">
          <h3>Game Corner</h3>
          <p>偏游戏化的小型玩法与输入交互场景。</p>
        </article>
      </div>
    </section>
  )
}
