# 阶段 18 - SVG 鼠标边缘失效排查与修复

## 目标

排查项目在部分浏览器中，页面右侧与下方边缘区域自定义 SVG 鼠标偶发失效并回退为系统光标的问题，并记录最终修复方案。

## 现象

- 在 macOS Safari 中，自定义 SVG 鼠标表现正常。
- 在部分 Chromium 系浏览器中，鼠标移动到页面右侧或下方边缘时，光标会回退为系统默认样式。
- 页面主体区域、卡片区域、按钮区域的鼠标样式本身是正常的，异常主要集中在窗口边缘附近。

## 排查结论

- 这次问题的核心原因不是页面容器漏设 `cursor`，也不是某个组件局部覆盖失败。
- 根因更接近 Chromium 对自定义光标图片边界的处理差异：
  - 原来的 SVG 光标自然尺寸为 `64x64`。
  - 当鼠标靠近窗口右侧或下侧边缘时，较大的光标图像更容易超出可显示区域。
  - Safari 对这类情况容忍度更高，而 Chromium 更容易直接回退到系统光标。
- 因此，这个问题本质上是 **SVG 光标尺寸与热点设置在 Chromium 下的边缘兼容性问题**。

## 已完成

- 将 `public/cursors` 下全部 `sw-*.svg` 光标的自然尺寸从 `64x64` 调整为 `32x32`。
- 将 `src/styles/_theme.scss` 中各类光标变量的热点坐标同步缩小：
  - 默认 / pointer / active / help / wait：由 `10 8` 调整为 `5 4`
  - 其余居中类光标：由 `32 32` 调整为 `16 16`
- 保持当前方案继续使用 SVG 光标，不切回 `.cur`。
- 降低 Chromium 在窗口右侧和下侧边缘回退系统光标的概率。

## 当前采取的方案

优先采用“**缩小 SVG 光标自然尺寸 + 同步修正热点**”作为兼容性修复方案。

原因：

- 改动范围小，不影响现有光标资源组织方式。
- 不需要回退到 `.cur` 文件，仍可保持当前 SVG 资源链路。
- 相比单纯继续叠加页面容器 `cursor`，这个方案更直接命中实际问题。

## 后续可选优化

如果后续在 Chromium 边缘区域仍有少量回退，可继续考虑：

- 进一步裁紧默认箭头与手型 SVG 的透明留白。
- 为关键光标增加多级兜底，例如：SVG + 位图 + keyword fallback。
- 仅对兼容性最敏感的几个核心状态单独提供更紧凑的资源版本。

## 相关文件

- `src/styles/_theme.scss`
- `public/cursors/sw-arrow-default.svg`
- `public/cursors/sw-hand-pointer.svg`
- `public/cursors/sw-hand-active.svg`
- `public/cursors/sw-help.svg`
- `public/cursors/sw-wait.svg`
- `public/cursors/sw-crosshair.svg`
- `public/cursors/sw-not-allowed.svg`
- `public/cursors/sw-text.svg`
- `public/cursors/sw-move.svg`
- `public/cursors/sw-ew-resize.svg`
- `public/cursors/sw-ns-resize.svg`
- `public/cursors/sw-nwse-resize.svg`
- `public/cursors/sw-nesw-resize.svg`

## 说明

这次记录确认了一点：同一套 SVG 鼠标资源在 Safari 中正常，并不代表在 Chromium 系浏览器的窗口边缘也一定稳定。后续若继续扩展鼠标主题，优先控制自然尺寸与热点位置，避免再引入类似边缘回退问题。
