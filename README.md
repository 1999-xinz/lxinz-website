# Lxinz Blog

一个基于 `React + TypeScript + Vite` 的个人网站骨架，用于承载博客文章、canvas 动画实验和交互式页面。

## 开发命令

```bash
pnpm install
pnpm dev
```

## 校验命令

```bash
pnpm lint
pnpm build
```

## 阶段记录

每个阶段的实现说明都记录在 `versions/` 目录下，并使用中文命名，方便回看每一步改动。

## 样式结构

项目当前使用 `SCSS`，统一入口为 `src/main.scss`。

- `src/styles/_theme.scss`：主题变量、颜色、字体、圆角、阴影
- `src/styles/_base.scss`：基础重置与全局通用元素
- `src/styles/_layout.scss`：站点外层布局与头部区域
- `src/styles/_navigation.scss`：球形导航与导航交互
- `src/styles/_pages.scss`：页面卡片与内容区样式
- `src/styles/_intro.scss`：启动动画与终端风格遮罩
