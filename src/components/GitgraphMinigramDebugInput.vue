<template>
  <div class="container">
    <template v-for="line in lines">
      <span
        class="line"
        :class="{ error: line.error }"
      >{{ line.text }}</span>

      <span
        v-if="line.error"
        class="line"
      >{{ marker }}</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    input: {
      type: String,
      required: true,
    },
    error: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      lines: [],
      marker: '',
    };
  },

  mounted() {
    /**
     * @type {number}
     */
    const errorLine = this.error.location.start.line;

    this.lines = this.input
      .split(/[\r\n]+/)
      .map((line, index) => {
        return {
          text: line,
          error: errorLine === (index + 1),
        };
      });

    if (this.error.expected) {
      this.marker = '-'.repeat(this.error.location.start.column - 1) + '^';
    }
  },
}
</script>

<style lang="stylus" scoped>
.container {
  padding 10px
  border 1px solid black
  background-color white
  color black
  font-family monospace

  span.line {
    display block
  }

  span.error {
    color #ff5555
  }
}
</style>
