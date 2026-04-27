# 阶段 11 - Skip Animation 按钮光标修复

## 目标

修复启动动画页面中 `Skip Animation` 按钮在鼠标悬停时没有切换到自定义手套光标的问题。

## 已完成

- 为 `Skip Animation` 按钮单独显式指定悬停光标。
- 为 `Skip Animation` 按钮单独显式指定按下光标。
- 避免动画遮罩层的默认光标影响按钮的交互反馈。

## 相关文件

- `src/styles/_intro.scss`

## 说明

这次修复只处理启动动画右上角按钮的光标表现，不改动其它动画逻辑。
