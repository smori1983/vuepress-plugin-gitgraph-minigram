/**
 * @typedef {import('codemirror').Editor} Editor
 * @typedef {import('codemirror').ShowHintOptions} ShowHintOptions
 */

const { CodeMirror } = require('vue-codemirror/src');

/**
 * @param {Editor} cm
 * @param {ShowHintOptions} options
 */
const hint = (cm, options) => {
  const cursor = cm.getCursor();
  const currentLineText = cm.getLine(cursor.line);

  if (currentLineText.trim() === 'git' && currentLineText.slice(-1) === ' ') {
    return {
      list: [
        'commit',
        'commit -m',
        'switch',
        'switch -c',
        'merge',
        'tag',
      ],
      from: CodeMirror.Pos(cursor.line, currentLineText.length),
      to: CodeMirror.Pos(cursor.line, currentLineText.length),
    };
  }

  return null;
};

module.exports = hint;
