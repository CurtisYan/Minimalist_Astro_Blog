export const siteConfig = {
  siteUrl: 'https://example.com',
  lang: 'en',
  title: 'Minimalist Blog Template',
  description: 'A minimal Astro blog template for clear archives, calm writing, and bilingual content.',
  menuLabel: 'Menu',
  archiveTitle: 'Archive',
  archiveSubtitle: '',
  assets: {
    stylesheet: '/assets/site.css',
    script: '/assets/site.js',
    scriptVersion: '20260623a',
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
    { label: 'Life', href: '/life/' },
    { label: 'Tech', href: '/tech/' },
    { label: 'Tags', href: '/tags/', hidden: false },
    { label: 'About', href: '/about/' }
  ],
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
  },
  content: {
    aboutPage: 'about'
  },
  aboutLinks: [
    {
      label: 'Template Features',
      href: '/posts/tech/2026-06-23-template-features/'
    },
    {
      label: 'Usage Guide',
      href: '/posts/tech/2026-06-24-template-usage/'
    },
    {
      label: 'Sample Post',
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
