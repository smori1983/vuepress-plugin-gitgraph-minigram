const path = require('path');

module.exports = (options) => {
  const {
    fenceName = 'gitgraph',
    componentName = 'PluginGitgraphMinigramDefault',
  } = options;

  return {
    enhanceAppFiles: [
      path.resolve(__dirname, 'enhanceAppFile.js'),
    ],
    chainMarkdown(config) {
      config
        .plugin('vuepress-plugin-gitgraph-minigram')
        .use(require('./markdown-it-plugin')(fenceName, componentName));
    },
  };
};
