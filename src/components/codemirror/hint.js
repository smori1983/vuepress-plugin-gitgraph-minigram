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

  if (normalize(line).length === 0) {
    return null;
  }

  const gitCommands = [
    'git commit',
    'git branch ',
    'git checkout ',
    'git switch ',
    'git merge ',
    'git tag ',
  ];

  const gitCommandSuggestions = gitCommands.filter((command) => {
    const normalized = normalize(line);
    const trimmed = command.trim();

    return (trimmed.indexOf(normalized) === 0) && (normalized !== trimmed);
  });

  if (gitCommandSuggestions.length > 0) {
    return {
      list: gitCommandSuggestions,
      from: CodeMirror.Pos(cursor.line, line.indexOf('git')),
      to: CodeMirror.Pos(cursor.line, line.length),
    };
  }

  if (normalize(line) === 'git commit' && endsWithSpace(line)) {
    return {
      list: ['-m '],
      from: CodeMirror.Pos(cursor.line, line.length),
      to: CodeMirror.Pos(cursor.line, line.length),
    }
  }

  if (normalize(line) === 'git checkout' && endsWithSpace(line)) {
    return {
      list: logManager.getOtherBranches().concat(['-b ']),
      from: CodeMirror.Pos(cursor.line, line.length),
      to: CodeMirror.Pos(cursor.line, line.length),
    };
  }

  if (normalize(line) === 'git switch' && endsWithSpace(line)) {
    return {
      list: logManager.getOtherBranches().concat(['-c ']),
      from: CodeMirror.Pos(cursor.line, line.length),
      to: CodeMirror.Pos(cursor.line, line.length),
    };
  }

  if (normalize(line) === 'git merge' && endsWithSpace(line)) {
    return {
      list: logManager.getMergeableBranches(),
      from: CodeMirror.Pos(cursor.line, line.length),
      to: CodeMirror.Pos(cursor.line, line.length),
    };
  }

  if (normalize(line).indexOf('git commit -') === 0) {
    const list = ['git commit -m ']
      .filter((item) => {
        const normalized = normalize(line);
        return (item.indexOf(normalized) === 0) && (normalized !== normalize(item));
      });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, line.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (normalize(line).indexOf('git checkout') === 0) {
    const list = logManager.getOtherBranches()
      .map(branch => sprintf('git checkout %s', branch))
      .concat(['git checkout -b '])
      .filter((item) => {
        const normalized = normalize(line);
        return (item.indexOf(normalized) === 0) && (normalized !== item);
      });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, line.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (normalize(line).indexOf('git switch') === 0) {
    const list = logManager.getOtherBranches()
      .map(branch => sprintf('git switch %s', branch))
      .concat(['git switch -c '])
      .filter((item) => {
        const normalized = normalize(line);
        return (item.indexOf(normalized) === 0) && (normalized !== item);
      });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, line.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, line.length),
      };
    }
  }

  if (normalize(line).indexOf('git merge') === 0) {
    const list = logManager.getMergeableBranches()
      .map(branch => sprintf('git merge %s', branch))
      .filter((item) => {
        const normalized = normalize(line);
        return (item.indexOf(normalized) === 0) && (normalized !== item);
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
