<template>
  <span
    class="line"
    :class="{ error: error }"
  >{{ text }}</span>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    error: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
.line {
  display block
}
.error {
  color #ff5555
}
</style>
