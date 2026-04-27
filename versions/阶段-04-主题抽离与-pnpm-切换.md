# 阶段 04 - 主题抽离与 pnpm 切换

## 目标

将公共主题体系抽离出来，并把项目脚本与锁文件迁移到 `pnpm`。

## 已完成

- 将全局主题变量、字体变量抽离到 `src/styles/theme.css`。
- `src/main.tsx` 改为显式引入主题样式文件。
- `package.json` 中脚本由 `npm run` 改为 `pnpm run`。
- `Husky` hooks 改为使用 `pnpm exec`。
- 将 `versions/` 目录下的记录改为中文文件名和中文内容。

## 相关文件

- `src/styles/theme.css`
- `src/main.tsx`
- `src/index.css`
- `package.json`

## 说明

这一阶段只处理主题与包管理器相关结构，不改启动动画本身。
