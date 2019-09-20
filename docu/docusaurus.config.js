const path = require('path');

module.exports = {
  title: 'Platform UI',
  tagline: 'Make your UI affectli. Build with quintessence of material-ui and our vision.',
  url: 'https://github.com/mi-c3/platform-ui',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'mic3', // Usually your GitHub org/user name.
  projectName: 'platform-ui-doc', // Usually your repo name.
  themeConfig: {
    prismTheme: require('prism-react-renderer/themes/vsDark'),
    navbar: {
      title: 'Platform UI Doc',
      logo: {
        alt: 'Platform UI Doc',
        src: '/img/logo.192x192.png',
      },
      links: [
        {to: 'docs/get-started/installation', label: 'Docs', position: 'left'},
        {to: 'docs/docusaurus/style-guide', label: 'Markdown', position: 'left'},
        {
          href: 'https://github.com/mi-c3/platform-ui',
          label: 'GitHub',
          position: 'right',
        },
        {
          to: '/storybook/index.html',
          label: 'Storybook',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       {
      //         label: 'Docs',
      //         to: 'docs/doc1',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'Community',
      //     items: [
      //       {
      //         label: 'Discord',
      //         href: 'https://discordapp.com/invite/docusaurus',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'Social',
      //     items: [
      //       {
      //         label: 'Blog',
      //         to: 'blog',
      //       },
      //     ],
      //   },
      // ],
      logo: {
        alt: 'Affectli',
        src: '/img/badge.png',
      },
      copyright: `Copyright © ${new Date().getFullYear()} MI-C3, Inc. Platform UI. Built with Docusaurus.`,
    },
  },
  themes: ['@docusaurus/theme-live-codeblock'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
