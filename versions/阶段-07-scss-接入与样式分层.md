# 阶段 07 - SCSS 接入与样式分层

## 目标

将项目样式体系从单一 CSS 文件迁移到更适合长期维护的 SCSS 分层结构。

## 已完成

- 接入 `sass`。
- 新增 `src/main.scss` 作为统一样式入口。
- 将公共主题变量迁移到 `src/styles/_theme.scss`。
- 将样式拆分为 `base / layout / navigation / pages / intro` 多个 SCSS 文件。
- 删除原有 `src/index.css` 与 `src/styles/theme.css` 单文件结构。

## 相关文件

- `src/main.scss`
- `src/styles/_theme.scss`
- `src/styles/_base.scss`
- `src/styles/_layout.scss`
- `src/styles/_navigation.scss`
- `src/styles/_pages.scss`
- `src/styles/_intro.scss`

## 说明

这一阶段主要解决样式工程结构问题，组件结构和类名尽量保持稳定，方便后续继续增强视觉和交互。
