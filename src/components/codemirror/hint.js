/**
 * @typedef {import('codemirror').Editor} Editor
 * @typedef {import('codemirror').ShowHintOptions} ShowHintOptions
 */

const { CodeMirror } = require('vue-codemirror/src');
const format2 = require('gitgraph-minigram/src/grammar/format2');
const { Format2Parser } = require('gitgraph-minigram');
const LogManager = require('./log-manager');

/**
 * @param {Editor} cm
 * @param {ShowHintOptions} options
 */
const hint = (cm, options) => {
  const parser = new Format2Parser();
  const parseResult = parser.parse(cm.getValue());

  if (parseResult.parsed()) {
    return null;
  }

  //const pegError = parseResult.getError();
  const cursor = cm.getCursor();

  //const pegPosition = pegError.location.start.line + ':' + pegError.location.start.column;
  //const cmPosition = (cursor.line + 1) + ':' + (cursor.ch + 1);

  const logManager = new LogManager();
  try {
    format2.parse(cm.getValue(), {
      logManager: logManager,
    });
  } catch (e) {}

  const currentLineText = cm.getLine(cursor.line);

  if (currentLineText.trim() === 'git' && currentLineText.slice(-1) === ' ') {
    return {
      list: [
        'commit ',
        'commit -m ',
        'switch ',
        'switch -c ',
        'merge ',
        'tag ',
      ],
      from: CodeMirror.Pos(cursor.line, currentLineText.length),
      to: CodeMirror.Pos(cursor.line, currentLineText.length),
    };
  }

  if (currentLineText.trim() === 'git checkout' && currentLineText.slice(-1) === ' ') {
    return {
      list: logManager.getCreatedBranches().filter((branch) => {
        return branch !== logManager.getCurrentBranch();
      }),
      from: CodeMirror.Pos(cursor.line, currentLineText.length),
      to: CodeMirror.Pos(cursor.line, currentLineText.length),
    };
  }

  if (currentLineText.trim() === 'git switch' && currentLineText.slice(-1) === ' ') {
    return {
      list: logManager.getCreatedBranches().filter((branch) => {
        return branch !== logManager.getCurrentBranch();
      }),
      from: CodeMirror.Pos(cursor.line, currentLineText.length),
      to: CodeMirror.Pos(cursor.line, currentLineText.length),
    };
  }

  if (currentLineText.trim() === 'git merge' && currentLineText.slice(-1) === ' ') {
    return {
      list: logManager.getCreatedBranches().filter((branch) => {
        return branch !== logManager.getCurrentBranch();
      }),
      from: CodeMirror.Pos(cursor.line, currentLineText.length),
      to: CodeMirror.Pos(cursor.line, currentLineText.length),
    };
  }

  return null;
};

module.exports = hint;
