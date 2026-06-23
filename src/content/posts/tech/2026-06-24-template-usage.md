---
title: 使用说明 / Usage Guide
date: 2026-06-24
tags: [模板, 配置]
keywords: [siteConfig, frontmatter, 本地预览, 部署]
excerpt: 说明如何启动本地预览、修改配置、写文章、配置导航、页脚和关于页按钮。
draft: false
---


## 中文

这篇文档集中说明如何配置和使用模板。主要入口是 `src/config/site.ts`。

## 快速开始

```bash
npm install
npm run dev
npm run build
npm run preview
```

部署静态站点时：

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `22.12.0` 或更新

## 站点配置

`siteConfig` 是模板的核心配置。

### 必填或强烈建议填写

- `siteUrl`：生产站点地址。用于 sitemap，部署前必须改成你的域名，例如 `https://example.com`。
- `lang`：HTML 语言代码，例如 `zh-CN` 或 `en`。
- `title`：站点标题，会用于页头、页面标题和默认页脚。
- `description`：站点描述，会用于首页副标题和 meta description。
- `menuLabel`：移动端导航按钮文字。
- `archiveTitle`：首页归档标题。
- `nav`：顶部导航。每项包含 `label` 和 `href`；加 `hidden: true` 可以隐藏导航项但保留路由。
- `sections`：栏目配置。每个栏目需要 `title`、`href` 和 `dirs`。
- `content.aboutPage`：关于页使用的 Markdown 页面 id，默认读取 `src/content/pages/about.md`。
- `footer.text`：页脚版权年份后的显示文字。

### 可选配置

- `archiveSubtitle`：归档页副标题，留空即可不显示。
- `assets.stylesheet`：主题 CSS 路径。
- `assets.script`：客户端脚本路径。
- `assets.scriptVersion`：脚本缓存版本。修改 `public/assets/site.js` 后建议更新。
- `assets.icons`：浏览器图标链接。图标文件放在 `public/` 下。
- `external.imageHost`：远程图床域名，用于输出 `preconnect`；没有远程图床时留空。
- `legacy.configPath`：旧静态 fallback 配置路径，通常保持默认。
- `aboutLinks`：关于页按钮列表，可指向文章、页面、外部网站或邮箱。
- `footer.credit`：额外页脚链接，不需要时设为 `null`。

示例：

```ts
nav: [
  { label: 'Life', href: '/life/' },
  { label: 'Tech', href: '/tech/' },
  { label: 'Tags', href: '/tags/', hidden: true },
  { label: 'About', href: '/about/' }
],
aboutLinks: [
  { label: 'Start here', href: '/posts/daily/2026-06-20-welcome/' },
  { label: 'Website', href: 'https://example.com' },
  { label: 'Email', href: 'mailto:you@example.com' }
],
footer: {
  text: 'My Blog',
  credit: null
}
```

## 栏目和导航

栏目由 `sections` 和文章目录共同决定。

```ts
sections: {
  life: {
    title: 'Life',
    href: '/life/',
    dirs: ['daily']
  },
  tech: {
    title: 'Tech',
    href: '/tech/',
    dirs: ['tech']
  }
}
```

`src/content/posts/daily/...` 会进入 Life 栏目，`src/content/posts/tech/...` 会进入 Tech 栏目。

如果新增栏目：

1. 在 `sections` 里添加新栏目。
2. 在 `nav` 里添加导航项，或设置 `hidden: true`。
3. 在 `src/pages/` 里添加对应 Astro 页面。
4. 在 `src/content/posts/` 下创建对应目录。

## 文章页头 Frontmatter

文章放在 `src/content/posts/` 下。为了兼容旧文章，schema 允许部分字段缺省；但新文章建议至少填写 `title` 和 `date`。

推荐写法：

```yaml
---
title: 示例文章
date: 2026-06-20
tags: [Astro, Blog]
keywords: [template, static site]
excerpt: 用于搜索和相关文章评分的短摘要。
draft: false
---
```

文章字段：

- `title`：文章标题。新文章建议必填。
- `date`：发布日期。推荐 `YYYY-MM-DD`。如果缺省，模板会尝试从文件名里解析日期。
- `tags`：可见标签，会显示在文章页和标签页。新文章建议使用数组。
- `keywords`：隐藏关键词，用于搜索和相关文章评分。
- `excerpt`：摘要，用于搜索和相关文章评分。
- `thumbnail`、`cover`：兼容旧内容的媒体字段。
- `draft`：设为 `true` 时不生成到公开页面。

标签兼容旧格式：

```yaml
tags: Astro, Blog
tags: Astro; Blog
tags: CLI Tool
```

新文章仍建议使用数组：`tags: [Astro, Blog]`。

## 独立页面页头

独立页面放在 `src/content/pages/` 下。关于页默认是 `src/content/pages/about.md`。

页面字段：

- `title`：必填。
- `description`：可选，用于 meta description。
- `date`：可选。
- `draft`：可选，设为 `true` 后不公开使用。

示例：

```yaml
---
title: About
description: About this blog.
---
```

## 图片写法

普通图片：

```md
![Alt text](/assets/example.jpg)
```

带说明文字：

```md
![Alt text](/assets/example.jpg)
*Image caption.*
```

第一张图片会自动更宽，适合作为文章引导图。后续图片会稍窄。图片资源可以放在 `public/assets/` 下，然后用 `/assets/...` 引用。

## 搜索和相关文章

搜索由 `src/pages/search-index.json.ts` 生成索引，`public/assets/site.js` 在浏览器端加载。索引包含标题、摘要、正文、标签和关键词。

相关文章由 `src/lib/related-posts.ts` 计算。想让推荐更准确，优先维护好 `tags`、`keywords` 和 `excerpt`，通常不需要改算法。

## 发布前检查

```bash
npm run build
```

发布前建议检查：

- `siteUrl` 是否已经改成你的生产域名。
- `title`、`description`、`footer.text` 是否还是示例文字。
- `aboutLinks` 是否指向真实页面。
- `nav` 里不想展示的项目是否设置了 `hidden: true`。
- 示例文章是否已经替换或删除。
- favicon 是否已经替换。

## English

This guide explains how to configure and use the template. The main entry point is `src/config/site.ts`.

## Quick Start

```bash
npm install
npm run dev
npm run build
npm run preview
```

For static deployment:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `22.12.0` or newer

## Site Configuration

`siteConfig` is the central template configuration.

### Required Or Strongly Recommended

- `siteUrl`: production URL used by sitemap generation. Change it before deployment.
- `lang`: HTML language code, such as `zh-CN` or `en`.
- `title`: site title used in the header, page titles, and default footer.
- `description`: site description used by the homepage tagline and meta description.
- `menuLabel`: mobile navigation button text.
- `archiveTitle`: homepage archive heading.
- `nav`: header navigation. Each item has `label` and `href`; add `hidden: true` to hide it from the header while keeping the route.
- `sections`: section mapping. Each section needs `title`, `href`, and `dirs`.
- `content.aboutPage`: Markdown page id used by `/about/`.
- `footer.text`: text shown after the copyright year.

### Optional

- `archiveSubtitle`: optional archive subtitle.
- `assets.stylesheet`: theme CSS path.
- `assets.script`: client script path.
- `assets.scriptVersion`: client script cache version. Update it after changing `public/assets/site.js`.
- `assets.icons`: favicon links. Put icon files under `public/`.
- `external.imageHost`: optional remote image host for `preconnect`.
- `legacy.configPath`: fallback config path for old static pages.
- `aboutLinks`: about-page buttons linking to posts, pages, external sites, or email addresses.
- `footer.credit`: optional extra footer link. Set it to `null` if unused.

Example:

```ts
nav: [
  { label: 'Life', href: '/life/' },
  { label: 'Tech', href: '/tech/' },
  { label: 'Tags', href: '/tags/', hidden: true },
  { label: 'About', href: '/about/' }
],
aboutLinks: [
  { label: 'Start here', href: '/posts/daily/2026-06-20-welcome/' },
  { label: 'Website', href: 'https://example.com' },
  { label: 'Email', href: 'mailto:you@example.com' }
],
footer: {
  text: 'My Blog',
  credit: null
}
```

## Sections And Navigation

Sections are controlled by `sections` and post folders.

```ts
sections: {
  life: {
    title: 'Life',
    href: '/life/',
    dirs: ['daily']
  },
  tech: {
    title: 'Tech',
    href: '/tech/',
    dirs: ['tech']
  }
}
```

`src/content/posts/daily/...` belongs to Life, and `src/content/posts/tech/...` belongs to Tech.

To add a section:

1. Add it to `sections`.
2. Add a nav item, or set `hidden: true`.
3. Add a matching Astro page under `src/pages/`.
4. Create the matching folder under `src/content/posts/`.

## Post Frontmatter

Posts live under `src/content/posts/`. The schema allows missing fields for migration compatibility, but new posts should include at least `title` and `date`.

Recommended frontmatter:

```yaml
---
title: Example Post
date: 2026-06-20
tags: [Astro, Blog]
keywords: [template, static site]
excerpt: A short summary for search and related-post scoring.
draft: false
---
```

Post fields:

- `title`: post title. Recommended for all new posts.
- `date`: publish date. `YYYY-MM-DD` is recommended. If missing, the template tries to parse a date from the filename.
- `tags`: visible tags shown on article and tag pages. Arrays are recommended.
- `keywords`: hidden hints for search and related posts.
- `excerpt`: summary used by search and related-post scoring.
- `thumbnail`, `cover`: legacy-compatible media fields.
- `draft`: set to `true` to hide the post from public pages.

Legacy tag formats are supported:

```yaml
tags: Astro, Blog
tags: Astro; Blog
tags: CLI Tool
```

Use arrays for new posts: `tags: [Astro, Blog]`.

## Standalone Page Frontmatter

Standalone pages live under `src/content/pages/`. The about page defaults to `src/content/pages/about.md`.

Page fields:

- `title`: required.
- `description`: optional meta description.
- `date`: optional.
- `draft`: optional. Set to `true` when it should not be used publicly.

Example:

```yaml
---
title: About
description: About this blog.
---
```

## Images

Basic image:

```md
![Alt text](/assets/example.jpg)
```

Image with caption:

```md
![Alt text](/assets/example.jpg)
*Image caption.*
```

The first image is wider and works well as a lead image. Later images are slightly narrower. Put image assets under `public/assets/` and reference them with `/assets/...`.

## Search And Related Posts

Search is generated by `src/pages/search-index.json.ts` and loaded in the browser by `public/assets/site.js`. The index includes titles, excerpts, body text, tags, and keywords.

Related posts are calculated in `src/lib/related-posts.ts`. To improve recommendations, maintain useful `tags`, `keywords`, and `excerpt` values before changing the algorithm.

## Pre-Launch Checklist

```bash
npm run build
```

Before publishing, check:

- `siteUrl` points to your production domain.
- `title`, `description`, and `footer.text` are no longer sample text.
- `aboutLinks` point to real destinations.
- Unwanted nav items use `hidden: true`.
- Sample posts are replaced or removed.
- Favicons are replaced if needed.
