---
title: 模板特色 / Template Features
date: 2026-06-23
tags: [模板, Astro]
keywords: [极简博客, 图片显示, Markdown, Astro]
excerpt: 介绍这个极简 Astro 博客模板的归档、搜索、相关文章、图片显示和 Markdown 阅读优化。
draft: false
---

## 中文

这是一套归档优先的 Astro 静态博客模板。它适合个人博客、技术笔记、生活随笔、知识库式文章，以及从旧静态站迁移过来的 Markdown 内容。

### 核心特点

- **归档优先**：首页按年份和日期展示文章，而不是信息流或营销式首页。
- **栏目清晰**：`src/content/posts/` 下的顶层目录会映射到栏目，例如 `daily` 对应 Life，`tech` 对应 Tech。
- **标签系统**：文章标签会生成标签首页、标签归档页，以及旧 `.html` 标签链接的兼容跳转。
- **本地搜索**：构建时生成 `/search-index.json`，前端脚本读取标题、摘要、正文、标签和关键词进行搜索。
- **相关文章**：构建时根据标签、关键词、标题/摘要词重合、栏目、父级目录和日期生成推荐，不需要外部服务。
- **旧链接兼容**：保留 `archive.html`、`life.html`、`tech.html`、`search.html`、`page/about.html` 等兼容路由，适合迁移旧站。
- **中英双语文档**：核心文档集中在两篇 Markdown 中，每篇同时包含中文和英文。

### 图片显示特色

模板对 Markdown 图片做了偏文章阅读的优化：

- 文章里的图片自动居中显示，带轻微圆角和阴影。
- 每篇文章的第一张图片会作为 lead image，显示得更宽、上下留白更多。
- 后续正文图片会稍窄，避免长文章阅读时视觉过重。
- 移动端会自动放宽图片宽度，保持图片可读。
- 如果 Markdown 图片后紧跟斜体或小号文字，会被作为图片说明居中显示。

示例：

```md
![A desk setup](/assets/example.jpg)
*A quiet writing desk.*
```

模板也兼容带 `figcaption` 的 `figure` 结构，旧 WordPress 风格的 `wp-block-image` 会有基本样式支持。

### Markdown 阅读优化

模板针对 Markdown 文章做了这些显示优化：

- 文章标题使用更有杂志感的 serif 字体，正文保持较高行高。
- 正文首段自动首行缩进，图片段落不会缩进。
- 二级、三级标题有更柔和的层级，不会像后台文档那样压迫正文。
- 正文链接使用细下划线，hover 时增强对比。
- 标签集中放在文末，降低阅读过程中的干扰。
- 相关文章模块只显示标题，不展示摘要、标签、缩略图或解释文字。
- 代码、表格、引用等 Markdown 基础元素会由 Astro Markdown 管线输出，并继承模板的整体排版。
- 客户端脚本会给文章图片补充 `decoding="async"`；第一张图片默认 eager，其余图片默认 lazy。

### Astro 与静态输出

模板使用 Astro Content Collections 管理文章和页面。构建结果是纯静态文件，可以部署到 Cloudflare Pages、Netlify、Vercel、GitHub Pages 或任何静态托管服务。

默认集成：

- `@astrojs/sitemap`：根据 `siteConfig.siteUrl` 生成 sitemap。
- `astro:transitions`：启用 Astro 的客户端页面过渡。
- `public/assets/site.js`：负责移动端导航、当前导航高亮、搜索浮层、年份更新、链接预取和图片属性增强。
- `public/assets/site.css`：负责主题字体、归档、文章、标签、搜索和响应式样式。

## English

This is an archive-first Astro static blog template for personal writing, technical notes, journals, knowledge-base posts, and Markdown content migrated from older static sites.

### Highlights

- **Archive-first layout**: the homepage groups posts by year and date.
- **Clear sections**: top-level folders under `src/content/posts/` map to sections, such as `daily` for Life and `tech` for Tech.
- **Tags**: tag pages, a tag index, and legacy `.html` tag redirects are generated.
- **Local search**: `/search-index.json` is generated at build time from titles, excerpts, body text, tags, and keywords.
- **Related posts**: recommendations are calculated at build time from tags, keywords, title/excerpt tokens, section, parent path, and date.
- **Legacy redirects**: routes such as `archive.html`, `life.html`, `tech.html`, `search.html`, and `page/about.html` help migrated sites keep old links working.
- **Bilingual docs**: the core docs are kept in two Markdown files, each containing Chinese and English.

### Image Presentation

The theme gives Markdown images a reading-oriented presentation:

- Article images are centered with subtle radius and shadow.
- The first image in an article is treated as a wider lead image.
- Later inline images are slightly narrower.
- Mobile screens relax image widths automatically.
- Italic or small text immediately after an image is styled as a centered caption.

Example:

```md
![A desk setup](/assets/example.jpg)
*A quiet writing desk.*
```

The template also supports `figure` + `figcaption` markup and basic styling for older WordPress-style `wp-block-image` figures.

### Markdown Optimizations

- Magazine-like serif article headings with comfortable body line height.
- First paragraph indentation, while image paragraphs stay unindented.
- Softer `h2` and `h3` hierarchy for long-form reading.
- Thin underlined links with stronger hover contrast.
- Tags are placed at the end of the article.
- Related posts show titles only, keeping the ending quiet.
- Standard Markdown elements such as code, tables, and blockquotes inherit the theme styling.
- The browser script adds `decoding="async"` to article images; the first image loads eagerly and later images load lazily.

### Astro And Static Output

The template uses Astro Content Collections for posts and standalone pages. The build output is static and can be deployed to Cloudflare Pages, Netlify, Vercel, GitHub Pages, or any static host.

Default integrations and assets:

- `@astrojs/sitemap`: generates sitemap files from `siteConfig.siteUrl`.
- `astro:transitions`: enables Astro client-side page transitions.
- `public/assets/site.js`: handles mobile navigation, active nav state, search overlay, year updates, link prefetching, and image enhancements.
- `public/assets/site.css`: provides typography, archive, article, tag, search, and responsive styles.
