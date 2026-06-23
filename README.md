# 极简博客模板

[English README](./README.en.md)

演示站点：[blog.curvio.org](https://blog.curvio.org)

这是一个用 Astro 做的极简博客模板。它默认中文，也适合写中英双语内容。主题重点很简单：文章归档清楚、Markdown 阅读舒服、图片显示克制好看，配置尽量集中。

## 本地预览

```bash
npm install
npm run dev
```

构建后预览：

```bash
npm run build
npm run preview
```

## 配置

主要配置文件在 `src/config/site.ts`。站点标题、导航栏、标签入口是否隐藏、关于页按钮、页脚文字、栏目映射都在这里改。

模板里的两篇说明已经放进博客文章中：

- `/posts/tech/2026-06-23-template-features/`
- `/posts/tech/2026-06-24-template-usage/`

把示例文章替换成自己的内容，就可以开始写了。
