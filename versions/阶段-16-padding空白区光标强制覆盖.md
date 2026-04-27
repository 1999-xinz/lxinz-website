# 阶段 16 - padding 空白区光标强制覆盖

## 目标

继续修复页面中 padding、留白和装饰层附近仍可能退回系统默认鼠标的问题。

## 已完成

- 为通用伪元素统一改为继承当前容器光标。
- 为 `site-shell`、`site-header`、`page-shell`、`page-card`、`feature-card` 显式绑定默认光标。
- 降低布局空白区、卡片边缘和装饰背景层导致的系统光标回退问题。

## 相关文件

- `src/styles/_base.scss`
- `src/styles/_layout.scss`
- `src/styles/_pages.scss`

## 说明

这次处理的核心思路是不再依赖层层继承是否刚好命中，而是对页面壳层和伪元素直接指定默认光标。
