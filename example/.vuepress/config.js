module.exports = {
  title: 'Demo',

  themeConfig: {
    sidebar: [
      {
        collapse: false,
        title: 'Patterns',
        children: [
          '/pattern/ok_01.md',
          '/pattern/ok_02.md',
          '/pattern/error_01.md',
          '/pattern/error_02.md',
        ],
      },
    ],
  },

  plugins: [
    [require('../../src')],
  ],

  markdown: {
    extendMarkdown: (md) => {
      md.set({ breaks: true });
    },
  },
};
