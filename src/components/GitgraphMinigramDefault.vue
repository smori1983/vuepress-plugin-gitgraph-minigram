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
import graphDefaultMixin from './mixin/graphDefault';
import { Format2Parser, GitLogger } from 'gitgraph-minigram';
import ErrorInfo from './GitgraphMinigramErrorInfo';

export default {
  mixins: [
    graphDefaultMixin,
  ],

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
    const graph = this.createGraph(container);

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
