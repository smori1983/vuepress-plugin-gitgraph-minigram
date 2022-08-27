const markdownItFence = require('markdown-it-fence');

/**
 * @param {string} fenceName
 * @param {string} componentName
 */
module.exports = (fenceName, componentName) => {
  return (md) => {
    return markdownItFence(md, fenceName, {
      marker: '`',
      render: (tokens, idx, options, env, self) => {
        return `<${componentName}>${tokens[idx].content}</${componentName}>`;
      },
    });
  };
};
