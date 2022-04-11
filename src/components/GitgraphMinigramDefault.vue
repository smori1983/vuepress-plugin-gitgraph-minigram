<template>
  <div>
    <div ref="graph"></div>

    <div
      class="error"
      v-if="error"
    >
      <div class="message">
        {{ error }}
      </div>
      <div class="input">
        <pre v-html="input"></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { sprintf } from 'sprintf-js';
import { templateExtend, TemplateName } from '@gitgraph/core';
import { createGitgraph } from '@gitgraph/js';
import { Format2Parser, GitLogger } from 'gitgraph-minigram';

export default {
  data() {
    return {
      input: '',
      error: '',
    };
  },

  mounted() {
    if (!this.$slots.default) {
      return;
    }

    const parser = new Format2Parser();
    const logger = new GitLogger();

    const input = this.$slots.default[0].text;
    const parseResult = parser.parse(input);

    if (!parseResult.parsed()) {
      const error = parseResult.getError();

      this.error = sprintf(
        '%s (line: %d, column: %d)',
        error.message,
        error.location.start.line,
        error.location.start.column,
      );

      this.input = input
        .split(/[\r\n]+/)
        .map((line, index) => {
          if (error.location.start.line === (index + 1)) {
            return sprintf('<span class="line has-error">%s</span>', line);
          } else {
            return sprintf('<span class="line">%s</span>', line);
          }
        })
        .join('');

      return;
    }

    const container = this.$refs['graph'];
    // DEFAULT_FONT: 'normal 12pt Calibri'
    const font = 'normal 12pt Monospace';
    const customTemplate = templateExtend(TemplateName.Metro, {
      branch: {
        lineWidth: 5,
        spacing: 25,
        label: {
          borderRadius: 5,
          font: font,
        },
      },
      commit: {
        message: {
          displayAuthor: false,
          displayHash: false,
          font: font,
        },
        dot: {
          size: 8,
        },
        spacing: 40,
      },
      tag: {
        borderRadius: 5,
        pointerWidth: 5,
        font: font,
      },
    });
    const graph = createGitgraph(container, {
      template: customTemplate,
      branchLabelOnEveryCommit: true,
    });

    try {
      logger.create(graph, parseResult.getParseData());
    } catch (e) {
      this.error = e.message;
      this.input = input;
    }
  },
};
</script>

<style lang="stylus" scoped>
.error {
  .message {
    color #ff5555
  }
  .input pre {
    border 1px solid #ff5555
    background-color white
    color black
    padding 10px

    >>> .line {
      display block
    }
    >>> .has-error {
      color #ff5555
    }
  }
}
</style>
