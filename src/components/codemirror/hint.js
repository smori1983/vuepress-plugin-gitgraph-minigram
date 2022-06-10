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

  const line = cm.getLine(cursor.line);
  const lineNormalized = normalize(line);

  if (lineNormalized.length === 0) {
    return null;
  }

  if (lineNormalized.indexOf('git ') === 0) {
    const list = []
      .concat(['commit'])
      .concat(['branch '])
      .concat(['checkout '])
      .concat(['switch '])
      .concat(['merge '])
      .concat(['tag '])
      .filter(item => sprintf('git %s', item).indexOf(lineNormalized) === 0)
      .filter(item => sprintf('git %s', item) !== lineNormalized);

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, 'git '.length),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (lineNormalized.indexOf('git commit ') === 0) {
    const list = ['-m ']
      .filter(item => sprintf('git commit %s', item).indexOf(lineNormalized) === 0)
      .filter(item => sprintf('git commit %s', item) !== lineNormalized);

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, 'git commit '.length),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (lineNormalized.indexOf('git checkout ') === 0) {
    const list = logManager.getOtherBranches().concat(['-b '])
      .filter(item => sprintf('git checkout %s', item).indexOf(lineNormalized) === 0)
      .filter(item => sprintf('git checkout %s', item) !== lineNormalized);

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, 'git checkout '.length),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (lineNormalized.indexOf('git switch ') === 0) {
    const list = logManager.getOtherBranches().concat(['-c '])
      .filter(item => sprintf('git switch %s', item).indexOf(lineNormalized) === 0)
      .filter(item => sprintf('git switch %s', item) !== lineNormalized);

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, 'git switch '.length),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (lineNormalized.indexOf('git merge ') === 0) {
    const list = logManager.getMergeableBranches()
      .filter(item => sprintf('git merge %s', item).indexOf(lineNormalized) === 0)
      .filter(item => sprintf('git merge %s', item) !== lineNormalized);

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, 'git merge '.length),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  return null;
};

/**
 * @param {string} value
 * @returns {string}
 */
const normalize = (value) => {
  return value.trimStart().split(/\s+/).join(' ');
};

/**
 * @param {string} line
 * @returns {boolean}
 */
const endsWithSpace = (line) => {
  return /\s/.test(line.slice(-1));
};

module.exports = hint;
