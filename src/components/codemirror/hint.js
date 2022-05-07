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

  if (currentLine.trim() === 'git commit' && currentLine.slice(-1) === ' ') {
    return {
      list: ['-m'],
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    }
  }

  if (currentLine.trim() === 'git checkout' && currentLine.slice(-1) === ' ') {
    return {
      list: logManager.getCreatedBranches().filter((branch) => {
        return branch !== logManager.getCurrentBranch();
      }).concat(['-b']),
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    };
  }

  if (currentLine.trim() === 'git switch' && currentLine.slice(-1) === ' ') {
    return {
      list: logManager.getCreatedBranches().filter((branch) => {
        return branch !== logManager.getCurrentBranch();
      }).concat(['-c']),
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    };
  }

  if (currentLine.trim() === 'git merge' && currentLine.slice(-1) === ' ') {
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

module.exports = hint;
