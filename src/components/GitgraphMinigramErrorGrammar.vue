<template>
  <div class="error">
    <div class="message">
      {{ message }}
    </div>
    <div class="input">
      <debug-input
        v-bind:error="error"
        v-bind:input="input"
      ></debug-input>
    </div>
  </div>
</template>

<script>
import { sprintf } from 'sprintf-js';
import DebugInput from './GitgraphMinigramDebugInput';

export default {
  components: {
    DebugInput,
  },

  props: {
    error: {
      type: Object,
      required: true,
    },
    input: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      message: '',
    };
  },

  mounted() {
    this.message = sprintf(
      '[grammar] %s (line: %d, column: %d)',
      this.error.message,
      this.error.location.start.line,
      this.error.location.start.column,
    );
  },

}
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
