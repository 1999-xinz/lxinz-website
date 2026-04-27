# 阶段 17 - 直接接入 Among Us `.cur`

## 目标

按当前要求，直接把下载包中的 `.cur` 鼠标文件接入项目，用于网站展示。

## 已完成

- 将下载目录中的 `.cur` 文件复制到项目静态资源目录。
- 同时保留一份 `.png` 预览图，方便后续核对资源来源。
- 将全局默认、指向、按下三类核心鼠标变量统一切换到该 `.cur` 文件。

## 相关文件

- `public/cursors/among-us/among-us-pointer.cur`
- `public/cursors/among-us/among-us-pointer-preview.png`
- `src/styles/_theme.scss`

## 说明

这次接入的是下载包中的 `.cur` 文件。`.ani` 没有接入网页样式，因为浏览器对动画光标支持不稳定。
