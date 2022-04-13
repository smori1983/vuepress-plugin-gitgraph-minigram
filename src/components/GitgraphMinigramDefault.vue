<template>
  <div>
    <div ref="graph"></div>

    <template v-if="error">
      <error-info
        v-bind:error="error"
        v-bind:type="errorType"
        v-bind:input="input"
      ></error-info>
    </template>
  </div>
</template>

<script>
import { templateExtend, TemplateName } from '@gitgraph/core';
import { createGitgraph } from '@gitgraph/js';
import { Format2Parser, GitLogger } from 'gitgraph-minigram';
import ErrorInfo from './GitgraphMinigramErrorInfo';

export default {
  components: {
    ErrorInfo,
  },

  data() {
    return {
      input: '',
      error: null,
      errorType: '',
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
      this.error = parseResult.getError();
      this.errorType = 'grammar';

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
      this.error = e;
      this.errorType = 'general';
    }
  },
};
</script>

<style lang="stylus" scoped>
</style>
