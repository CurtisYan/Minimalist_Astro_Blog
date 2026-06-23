export const siteConfig = {
  siteUrl: 'https://example.com',
  lang: 'zh-CN',
  title: '极简博客模板',
  description: '一个支持中英内容的 Astro 极简博客模板。',
  menuLabel: '菜单',
  archiveTitle: '归档',
  archiveSubtitle: '',
  assets: {
    stylesheet: '/assets/site.css',
    script: '/assets/site.js',
    scriptVersion: '20260622a',
    icons: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'alternate icon', href: '/favicon.ico' }
    ]
  },
  external: {
    imageHost: ''
  },
  legacy: {
    configPath: '/assets/site-config.json'
  },
  nav: [
    { label: '生活', href: '/life/' },
    { label: '技术', href: '/tech/' },
    { label: '标签', href: '/tags/', hidden: false },
    { label: '关于', href: '/about/' }
  ],
  sections: {
    life: {
      title: '生活',
      href: '/life/',
      dirs: ['daily']
    },
    tech: {
      title: '技术',
      href: '/tech/',
      dirs: ['tech']
    }
  },
  content: {
    aboutPage: 'about'
  },
  aboutLinks: [
    {
      label: '模板特色',
      href: '/posts/tech/2026-06-23-template-features/'
    },
    {
      label: '使用说明',
      href: '/posts/tech/2026-06-24-template-usage/'
    },
    {
      label: '示例文章',
      href: '/posts/daily/2026-06-20-welcome/'
    },
    {
      label: 'GitHub',
      href: 'https://github.com/your-name'
    },
    {
      label: 'Contact',
      href: 'mailto:you@example.com'
    }
  ],
  footer: {
    text: "Curtis's Blog",
    credit: {
      label: 'Theme by Anders Norén',
      href: 'https://andersnoren.se/'
    }
  }
} as const;

export type SiteSection = keyof typeof siteConfig.sections;
