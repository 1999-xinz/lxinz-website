# 阶段 06 - Skip Animation 点击修复

## 目标

修复启动动画右上角 `Skip Animation` 点击后不能立即进入首页的问题。

## 已完成

- 将 `Skip Animation` 按钮从动画面板内部提升到动画遮罩顶层。
- 按钮同时监听 `pointerdown` 与 `click`，避免事件被动画层吞掉。
- 为跳过逻辑统一收口到 `completeIntro`。
- 将 `.intro-gate` 设为默认不接收指针事件，仅允许 `.intro-panel` 与 `.intro-skip` 响应交互。
- 调整动画层级，避免背景装饰层抢占点击。

## 相关文件

- `src/components/intro-gate.tsx`
- `src/index.css`

## 说明

这一阶段只修复跳过动画的交互问题，不改动动画文案和整体视觉风格。
