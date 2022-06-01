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
    'git branch ',
    'git checkout ',
    'git switch ',
    'git merge ',
    'git tag ',
  ];

  const gitCommandSuggestions = gitCommands.filter((command) => {
    const normalized = normalize(currentLine);
    const trimmed = command.trim();

    return (normalized.length > 0) && (trimmed.indexOf(normalized) === 0) && (normalized !== trimmed);
  });

  if (gitCommandSuggestions.length > 0) {
    return {
      list: gitCommandSuggestions,
      from: CodeMirror.Pos(cursor.line, currentLine.indexOf('git')),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    };
  }

  if (normalize(currentLine) === 'git commit' && endsWithSpace(currentLine)) {
    return {
      list: ['-m '],
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    }
  }

  if (normalize(currentLine) === 'git checkout' && endsWithSpace(currentLine)) {
    return {
      list: logManager.getOtherBranches().concat(['-b ']),
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    };
  }

  if (normalize(currentLine) === 'git switch' && endsWithSpace(currentLine)) {
    return {
      list: logManager.getOtherBranches().concat(['-c ']),
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    };
  }

  if (normalize(currentLine) === 'git merge' && endsWithSpace(currentLine)) {
    return {
      list: logManager.getMergeableBranches(),
      from: CodeMirror.Pos(cursor.line, currentLine.length),
      to: CodeMirror.Pos(cursor.line, currentLine.length),
    };
  }

  if (normalize(currentLine).indexOf('git commit -') === 0) {
    const candidates = [];
    candidates.push('git commit -m ');

    const list = candidates.filter((item) => {
      const normalized = normalize(currentLine);

      return (item.indexOf(normalized) === 0) && (normalized !== normalize(item));
    });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, currentLine.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, currentLine.length),
      };
    }
  }

  if (normalize(currentLine).indexOf('git checkout') === 0) {
    const candidates = logManager.getOtherBranches()
      .map(branch => sprintf('git checkout %s', branch))
      .concat(['git checkout -b ']);

    const list = candidates.filter((item) => {
      const normalized = normalize(currentLine);

      return (item.indexOf(normalized) === 0) && (normalized !== item);
    });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, currentLine.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, currentLine.length),
      };
    }
  }

  if (normalize(currentLine).indexOf('git switch') === 0) {
    const candidates = logManager.getOtherBranches()
      .map(branch => sprintf('git switch %s', branch))
      .concat(['git switch -c ']);

    const list = candidates.filter((item) => {
      const normalized = normalize(currentLine);

      return (item.indexOf(normalized) === 0) && (normalized !== item);
    });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, currentLine.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, currentLine.length),
      };
    }
  }

  if (normalize(currentLine).indexOf('git merge') === 0) {
    const candidates = logManager.getMergeableBranches()
      .map(branch => sprintf('git merge %s', branch));

    const list = candidates.filter((item) => {
      const normalized = normalize(currentLine);

      return (item.indexOf(normalized) === 0) && (normalized !== item);
    });

    if (list.length > 0) {
      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, currentLine.indexOf('git')),
        to: CodeMirror.Pos(cursor.line, currentLine.length),
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
