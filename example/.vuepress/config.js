module.exports = {
  title: 'Demo',

  themeConfig: {
    sidebar: [
      {
        collapse: false,
        title: 'Patterns',
        sidebarDepth: 0,
        children: [
          '/pattern/ok_01.md',
          '/pattern/ok_02.md',

          '/pattern/error_001.md',
          '/pattern/error_002.md',
          '/pattern/error_003.md',

          '/pattern/error_101.md',
          '/pattern/error_102.md',

          '/pattern/error_201.md',
          '/pattern/error_202.md',
          '/pattern/error_211.md',
          '/pattern/error_212.md',
          '/pattern/error_213.md',
          '/pattern/error_214.md',
          '/pattern/error_221.md',
          '/pattern/error_222.md',
          '/pattern/error_223.md',
          '/pattern/error_224.md',
          '/pattern/error_231.md',
          '/pattern/error_232.md',
          '/pattern/error_233.md',
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
