<template>
  <div>
    <div ref="graph"></div>

    <div
      class="error"
      v-if="errorMessage"
    >
      <div class="message">
        {{ errorMessage }}
      </div>
      <div class="input">
        <debug-input
          v-bind:error="error"
          v-bind:input="input"
        ></debug-input>
      </div>
    </div>
  </div>
</template>

<script>
import { sprintf } from 'sprintf-js';
import { templateExtend, TemplateName } from '@gitgraph/core';
import { createGitgraph } from '@gitgraph/js';
import { Format2Parser, GitLogger } from 'gitgraph-minigram';
import DebugInput from './GitgraphMinigramDebugInput';

export default {
  components: {
    DebugInput,
  },

  data() {
    return {
      input: '',
      error: null,
      errorMessage: '',
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

    this.input = input;

    if (!parseResult.parsed()) {
      const error = parseResult.getError();

      this.error = error;

      this.errorMessage = sprintf(
        '%s (line: %d, column: %d)',
        error.message,
        error.location.start.line,
        error.location.start.column,
      );

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
      this.errorMessage = e.message;
    }
  },
};
</script>

<style lang="stylus" scoped>
.error {
  .message {
    color #ff5555
  }
  .input {
    padding 1em 0
  }
}
</style>
