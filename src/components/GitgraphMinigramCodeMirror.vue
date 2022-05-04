<template>
  <div>
    <codemirror
      class="input"
      v-model="input"
      v-bind:options="cmOptions"
      v-on:ready="onCmReady"
    ></codemirror>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import { codemirror } from 'vue-codemirror/src';
import hint from './codemirror/hint';

export default {
  components: {
    codemirror,
  },

  data() {
    return {
      cmOptions: {
        theme: 'default',
        extraKeys: {
          'Tab': (cm) => {
            cm.replaceSelection('  ', 'end');
          }
        },
        lineNumbers: true,
      },
      input:
        '[option]\n' +
        '[log]\n',
    };
  },

  methods: {
    /**
     * @param {import('codemirror').Editor} cm
     */
    onCmReady(cm) {
      cm.on('change', (cm) => {
        cm.showHint({
          hint: hint,
          completeSingle: false,
        });
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.input {
  >>>.CodeMirror {
    border 1px solid gray
  }
}
</style>
