<template>
  <div class="error">
    <div class="message">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { sprintf } from 'sprintf-js';

export default {
  props: {
    error: {
      type: Error,
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
      '[general] %s',
      this.error.message
    );
  },

}
</script>

<style lang="stylus" scoped>
.error {
  .message {
    color #ff5555
  }
}
</style>
