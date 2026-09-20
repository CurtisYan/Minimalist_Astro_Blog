# Minimalist Astro Blog

[English](./README.md)

一个使用 [Astro](https://astro.build/) 构建、以归档为核心的极简博客模板，适合个人写作、技术笔记和其他基于 Markdown 的内容。

演示：[blog.curvio.org](https://blog.curvio.org)

## 功能特点

- 简洁的归档布局，默认包含生活和技术栏目
- 支持 Markdown 文章与独立页面
- 支持标签、本地搜索和相关文章
- 响应式排版与图片样式
- 生成静态网站，可部署到任意静态托管平台
- 集中的站点配置

## 快速开始

环境要求：Node.js 22.12.0 或更高版本。

```bash
git clone https://github.com/CurtisYan/Minimalist_Astro_Blog.git
cd Minimalist_Astro_Blog
npm install
npm run dev
```

在浏览器中打开 `http://localhost:4321`。

## 自定义博客

编辑 `src/config/site.ts`，可以修改站点地址、标题、描述、导航、栏目、关于页面链接和页脚。

文章存放在 `src/content/posts/`。默认文件夹为：

- `daily/` 对应生活栏目
- `tech/` 对应技术栏目

新建 Markdown 文件，并添加如下 Frontmatter：

```md
---
title: 我的第一篇文章
date: 2026-09-20
tags: [Astro, 笔记]
excerpt: 文章的简短介绍。
draft: false
---

在这里编写文章正文。
```

独立页面存放在 `src/content/pages/`。发布前请替换或删除仓库中的示例内容。

## 构建与部署

```bash
npm run build
npm run preview
```

生产版本会生成到 `dist/`。部署前，请将 `src/config/site.ts` 中的 `siteUrl` 改为你的真实域名。你可以将构建结果部署到 Cloudflare Pages、Netlify、Vercel、GitHub Pages 或其他静态托管服务。

## 许可证

[MIT](./LICENSE)
