/**
 * @typedef {import('codemirror').Editor} Editor
 * @typedef {import('codemirror').ShowHintOptions} ShowHintOptions
 */

const { CodeMirror } = require('vue-codemirror/src');
const format2 = require('gitgraph-minigram/src/grammar/format2');
const LogManager = require('./log-manager');

/**
 * @param {Editor} cm
 * @param {ShowHintOptions} options
 */
const hint = (cm, options) => {
  const cursor = cm.getCursor();

  const logManager = new LogManager();
  try {
    format2.parse(cm.getValue(), {
      logManager: logManager,
    });
  } catch (e) {}

  const currentLine = cm.getLine(cursor.line);

  const gitCommands = [
    'git commit',
    'git checkout ',
    'git switch ',
    'git merge ',
    'git tag ',
  ];

  const gitCommandSuggestions = gitCommands.filter((command) => {
    const trimmed = command.trim();

    return trimmed.indexOf(currentLine.trim()) === 0 && currentLine.trim() !== trimmed;
  });

  if (gitCommandSuggestions.length > 0) {
    return {
      list: gitCommandSuggestions,
      from: CodeMirror.Pos(cursor.line, currentLine.indexOf('git')),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    };
  }

  if (currentLine.trim() === 'git commit' && endsWithSpace(currentLine)) {
    return {
      list: ['-m '],
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    }
  }

  if (currentLine.trim() === 'git checkout' && endsWithSpace(currentLine)) {
    return {
      list: logManager.getCreatedBranches().filter((branch) => {
        return branch !== logManager.getCurrentBranch();
      }).concat(['-b ']),
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    };
  }

  if (currentLine.trim() === 'git switch' && endsWithSpace(currentLine)) {
    return {
      list: logManager.getCreatedBranches().filter((branch) => {
        return branch !== logManager.getCurrentBranch();
      }).concat(['-c ']),
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    };
  }

  if (currentLine.trim() === 'git merge' && endsWithSpace(currentLine)) {
    return {
      list: logManager.getCreatedBranches().filter((branch) => {
        return branch !== logManager.getCurrentBranch();
      }),
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    };
  }

  return null;
};

/**
 * @param {string} line
 * @returns {boolean}
 */
const endsWithSpace = (line) => {
  return /\s/.test(line.slice(-1));
};

module.exports = hint;
