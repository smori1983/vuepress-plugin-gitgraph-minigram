<template>
  <pre>
    <debug-input-line
      v-for="line in lines"
      v-bind:text="line.text"
      v-bind:error="line.error"
    ></debug-input-line>
  </pre>
</template>

<script>
import DebugInputLine from './GitgraphMinigramDebugInputLine';

export default {
  components: {
    DebugInputLine,
  },

  props: {
    input: {
      type: String,
      required: true,
    },
    errorLocation: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      lines: [],
    };
  },

  mounted() {
    /**
     * @type {number}
     */
    const errorLine = this.errorLocation.start.line;

    this.lines = this.input
      .split(/[\r\n]+/)
      .map((line, index) => {
        return {
          text: line,
          error: errorLine === (index + 1),
        };
      });
  },
}
</script>

<style lang="stylus" scoped>
pre {
  border 1px solid black
  background-color white
  color black
  padding 10px
}
</style>
