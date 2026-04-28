# 阶段-19：Shiro 鼠标主题 + 鼠标模块独立 + 点击涟漪效果

## 概览

本阶段完成三件事：

1. 将鼠标主题从 Among-Us `.cur` 切换到 **Shiro** 风格 `.cur` 资源包
2. 将所有鼠标相关样式抽离至独立 SCSS 模块 `_cursor.scss`
3. 新增 **点击涟漪动画**（实心圆点 → 扩散空心圆环）

---

## 一、Shiro 鼠标主题接入

### 资源目录

```
public/cursors/shiro/
  normal.cur               ← default / pointer / wait
  Escritura a Mano.cur     ← active（URL 编码后引用）
  ayuda.cur                ← help
  precision.cur            ← crosshair
  No Disponible.cur        ← not-allowed
  texto.cur                ← text
  Movee2.cur               ← move
  horizontal.cur           ← ew-resize
  vertical1.cur            ← ns-resize
  diagonal resize 1.cur    ← nwse-resize
  diagonal resize 2.cur    ← nesw-resize
```

### CSS 变量映射

```scss
:root {
  --cursor-default: url('/cursors/shiro/normal.cur'), auto;
  --cursor-pointer: url('/cursors/shiro/normal.cur'), pointer;
  --cursor-active: url('/cursors/shiro/Escritura%20a%20Mano.cur'), pointer;
  --cursor-help: url('/cursors/shiro/ayuda.cur'), help;
  --cursor-wait: url('/cursors/shiro/normal.cur'), wait;
  --cursor-crosshair: url('/cursors/shiro/precision.cur'), crosshair;
  --cursor-not-allowed: url('/cursors/shiro/No%20Disponible.cur'), not-allowed;
  --cursor-text: url('/cursors/shiro/texto.cur'), text;
  --cursor-move: url('/cursors/shiro/Movee2.cur'), move;
  --cursor-ew-resize: url('/cursors/shiro/horizontal.cur'), ew-resize;
  --cursor-ns-resize: url('/cursors/shiro/vertical1.cur'), ns-resize;
  --cursor-nwse-resize:
    url('/cursors/shiro/diagonal%20resize%201.cur'), nwse-resize;
  --cursor-nesw-resize:
    url('/cursors/shiro/diagonal%20resize%202.cur'), nesw-resize;
}
```

> 注：文件名含空格时须 URL 编码（空格 → `%20`），否则浏览器无法解析。
> `--cursor-wait` 暂复用 `normal.cur`，Shiro 资源包无独立 wait 图标。

---

## 二、鼠标样式模块独立

### 背景

原先鼠标变量散落在 `_theme.scss`，全局覆盖规则写在 `_base.scss`，维护时需要跨文件跳转。

### 改动

| 文件                      | 操作                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| `src/styles/_cursor.scss` | **新建**，承接所有鼠标相关内容                                    |
| `src/styles/_theme.scss`  | 删除 `--cursor-*` 变量                                            |
| `src/styles/_base.scss`   | 删除所有 `cursor:` 规则（仅保留 box-sizing / 颜色继承等基础重置） |
| `src/main.scss`           | 新增 `@use './styles/cursor'`                                     |

### `_cursor.scss` 结构

```
_cursor.scss
├── :root { --cursor-* 变量 }
├── html / * / body /* 全局默认覆盖 */
├── a, button, [role=button] /* pointer */
├── input[type=text], textarea, p, h1-h6 … /* text */
├── a:active, button:active /* active */
├── [data-cursor='*'] /* 手动覆盖属性 */
├── :disabled, [aria-disabled] /* not-allowed */
├── .cursor-ripple { … }
└── @keyframes cursor-ripple-wave { … }
```

---

## 三、点击涟漪效果

### 实现方式

- **Hook**：`src/hooks/use-click-ripple.ts`
  - 监听 `document` 的 `pointerdown` 事件（`passive: true`）
  - 仅响应鼠标左键（`button === 0`），忽略触屏（`pointerType === 'touch'`）
  - 在点击坐标处插入 `<span class="cursor-ripple">`
  - 监听 `animationend` 后自动移除元素，无内存泄漏

- **挂载**：在 `src/App.tsx` 顶层调用 `useClickRipple()`

### 动画设计

初始尺寸 **8px** 实心圆点，经 **520ms** 扩散为半径约 27px 的空心圆环，最终淡出消失。

```
0%   → 实心圆点（scale 1,   opacity 0.85, background: accent, border: 0）
32%  → 扩大圆点（scale 1.9, opacity 0.68, background 变浅,     border: 0）
55%  → 转为圆环（scale 3.4, opacity 0.46, background: 透明,    border-width: 2px）
100% → 消散圆环（scale 6.8, opacity 0,    background: 透明,    border-width: 1px）
```

缓动：`cubic-bezier(0.2, 0.62, 0.2, 1)`（快速扩散、柔和收尾）

颜色跟随主题 CSS 变量 `--accent`，深色/浅色模式自动适配。

减弱动效支持：

```scss
@media (prefers-reduced-motion: reduce) {
  .cursor-ripple {
    animation-duration: 1ms;
  }
}
```

---

## 涉及文件

| 文件                            | 变更类型                      |
| ------------------------------- | ----------------------------- |
| `public/cursors/shiro/*.cur`    | 新增资源                      |
| `src/styles/_cursor.scss`       | 新建                          |
| `src/styles/_theme.scss`        | 删除 cursor 变量              |
| `src/styles/_base.scss`         | 删除 cursor 规则              |
| `src/main.scss`                 | 新增 `@use './styles/cursor'` |
| `src/hooks/use-click-ripple.ts` | 新建                          |
| `src/App.tsx`                   | 调用 `useClickRipple()`       |
