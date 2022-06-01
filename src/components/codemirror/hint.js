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

  if (lineNormalized.indexOf('g') === 0) {
    const list = []
      .concat(['git commit'])
      .concat(['git branch '])
      .concat(['git checkout '])
      .concat(['git switch '])
      .concat(['git merge '])
      .concat(['git tag '])
      .filter((item) => {
        return (item.indexOf(lineNormalized) === 0) && (lineNormalized !== item.trim());
      });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, line.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (lineNormalized === 'git commit' && endsWithSpace(line)) {
    return {
      list: ['-m '],
      from: CodeMirror.Pos(cursor.line, line.length),
      to: CodeMirror.Pos(cursor.line, line.length),
    }
  }

  if (lineNormalized === 'git checkout' && endsWithSpace(line)) {
    return {
      list: logManager.getOtherBranches().concat(['-b ']),
      from: CodeMirror.Pos(cursor.line, line.length),
      to: CodeMirror.Pos(cursor.line, line.length),
    };
  }

  if (lineNormalized === 'git switch' && endsWithSpace(line)) {
    return {
      list: logManager.getOtherBranches().concat(['-c ']),
      from: CodeMirror.Pos(cursor.line, line.length),
      to: CodeMirror.Pos(cursor.line, line.length),
    };
  }

  if (lineNormalized === 'git merge' && endsWithSpace(line)) {
    return {
      list: logManager.getMergeableBranches(),
      from: CodeMirror.Pos(cursor.line, line.length),
      to: CodeMirror.Pos(cursor.line, line.length),
    };
  }

  if (lineNormalized.indexOf('git commit -') === 0) {
    const list = ['git commit -m ']
      .filter((item) => {
        return (item.indexOf(lineNormalized) === 0) && (lineNormalized !== item.trim());
      });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, line.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (lineNormalized.indexOf('git checkout') === 0) {
    const list = logManager.getOtherBranches()
      .map(branch => sprintf('git checkout %s', branch))
      .concat(['git checkout -b '])
      .filter((item) => {
        return (item.indexOf(lineNormalized) === 0) && (lineNormalized !== item.trim());
      });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, line.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (lineNormalized.indexOf('git switch') === 0) {
    const list = logManager.getOtherBranches()
      .map(branch => sprintf('git switch %s', branch))
      .concat(['git switch -c '])
      .filter((item) => {
        return (item.indexOf(lineNormalized) === 0) && (lineNormalized !== item.trim());
      });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, line.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (lineNormalized.indexOf('git merge') === 0) {
    const list = logManager.getMergeableBranches()
      .map(branch => sprintf('git merge %s', branch))
      .filter((item) => {
        return (item.indexOf(lineNormalized) === 0) && (lineNormalized !== item.trim());
      });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, line.indexOf('git')),
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
  return value.trim().split(/\s+/).join(' ');
};

/**
 * @param {string} line
 * @returns {boolean}
 */
const endsWithSpace = (line) => {
  return /\s/.test(line.slice(-1));
};

module.exports = hint;
