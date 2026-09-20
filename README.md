# Minimalist Astro Blog

[中文文档](./README.zh-CN.md)

A minimal, archive-first blog template built with [Astro](https://astro.build/). It is designed for personal writing, technical notes, and other Markdown-based content.

Demo: [blog.curvio.org](https://blog.curvio.org)

## Features

- Clean archive layout with Life and Tech sections
- Markdown posts and standalone pages
- Tags, local search, and related posts
- Responsive typography and image styling
- Static output that can be deployed to any static host
- Centralized site configuration

## Quick Start

Requirements: Node.js 22.12.0 or newer.

```bash
git clone https://github.com/CurtisYan/Minimalist_Astro_Blog.git
cd Minimalist_Astro_Blog
npm install
npm run dev
```

Open `http://localhost:4321` in your browser.

## Customize the Blog

Edit `src/config/site.ts` to change the site URL, title, description, navigation, sections, About links, and footer.

Posts are stored in `src/content/posts/`. The default folders are:

- `daily/` for the Life section
- `tech/` for the Tech section

Create a file ending in `.md` and use this post template:

```md
---
title: My First Post
date: 2026-09-20
tags: [Astro, Notes]
keywords: [Astro, blog]
excerpt: A short description of the post.
draft: false
---

Write your post here.
```

Standalone pages are stored in `src/content/pages/`. Replace or remove the sample content before publishing.

For complete configuration options, section mapping, image usage, and a pre-launch checklist, see the [template usage guide](./src/content/posts/tech/2026-06-24-template-usage.md).

## Build and Deploy

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`. Before deployment, set `siteUrl` in `src/config/site.ts` to your real domain. You can deploy the output to Cloudflare Pages, Netlify, Vercel, GitHub Pages, or any static hosting service.

## License

[MIT](./LICENSE)
