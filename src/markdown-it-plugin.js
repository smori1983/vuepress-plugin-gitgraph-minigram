/**
 * @param {string} fenceName
 * @param {string} componentName
 */
module.exports = (fenceName, componentName) => {
  return (md) => {
    const fence = md.renderer.rules.fence;

    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args;
      const {content, info} = tokens[idx];

      if (info.trim() === fenceName) {
        return `<${componentName}>${content}</${componentName}>`;
      }

      return fence(...args);
    };
  };
};
