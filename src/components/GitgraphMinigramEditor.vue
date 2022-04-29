<template>
  <div class="container">
    <div class="left">
      <div class="input-block">
        <div class="title">Input</div>
        <textarea
          class="input"
          v-model="input"
          @keyup="render()"
        ></textarea>
        <div
          class="error-message"
          v-if="errorMessage"
        >{{ errorMessage }}</div>
      </div>
    </div>
    <div class="right">
      <tabs
        :cache-lifetime="-1"
        :options="{useUrlFragment: false, defaultTabHash: 'editor-tab-graph'}"
        @changed="tabChanged"
      >
        <tab
          id="editor-tab-graph"
          name="Graph"
        >
          <div ref="graph"></div>
        </tab>
        <tab
          id="editor-tab-ast"
          name="AST"
        >
          <pre class="ast">{{ ast }}</pre>
        </tab>
      </tabs>
    </div>
  </div>
</template>

<script>
import { sprintf } from 'sprintf-js';
import { Tabs, Tab } from 'vue-tabs-component';
import { GitLogger, Format2Parser } from 'gitgraph-minigram';
import graphDefaultMixin from './mixin/graphDefault';

export default {
  mixins: [
    graphDefaultMixin,
  ],

  components: {
    Tabs,
    Tab,
  },

  data() {
    return {
      parser: null,
      logger: null,
      graph: null,
      input:
        '[option]\n' +
        'defaultBranch: master\n' +
        '[log]\n' +
        'git commit -m \'Initial commit\'\n' +
        'git switch -c feature/1\n' +
        'git commit -m \'Implement class\'\n' +
        'git commit -m \'Add tests\'\n' +
        'git switch master\n' +
        'git merge feature/1\n' +
        'git tag v1.0.0\n',
      ast: '',
      errorMessage: '',
    };
  },

  created() {
    this.parser = new Format2Parser();
    this.logger = new GitLogger();
  },

  mounted() {
    const container = this.$refs['graph'];

    this.graph = this.createGraph(container);
    this.render();
  },

  methods: {
    tabChanged(selectedTab) {
      if (selectedTab.tab.id === 'editor-tab-graph' && this.graph) {
        this.render();
      }
    },

    render() {
      const parseResult = this.parser.parse(this.input);

      if (parseResult.parsed()) {
        this.errorMessage = '';
        this.ast = JSON.stringify(parseResult.getParseData().dump(), null, 2);

        try {
          this.graph.clear();
          this.logger.create(this.graph, parseResult.getParseData());
        } catch (e) {
          this.errorMessage = e.message;
        }
      } else {
        this.errorMessage = sprintf(
          '%s (line: %d)',
          parseResult.getError().message,
          parseResult.getError().location.start.line,
        );
      }
    },
  },
}
</script>

<style lang="stylus">
.theme-default-content {
  max-width 100% !important
}
</style>

<style lang="stylus" scoped>
$gitgraphFontSize = 15px

.container {
  display flex
  .left {
    width 40%
  }
  .right {
    width 60%
  }
}
.input-block {
  .title {
    margin 0 0 1rem
    line-height 2.5rem
    font-weight bold
  }
  .input {
    display block
    max-width calc(100% - 30px)
    min-width calc(100% - 30px)
    min-height 150px
    height 300px
    line-height normal
    margin 0 0 1rem
    padding 0.5rem
    border-radius 6px
    font-size $gitgraphFontSize
  }
  .error-message {
    margin 0
    padding 0 1rem 0 0
    color red
  }
}
.tabs-component {
  margin 0
  width 100%
  >>> .tabs-component-tabs {
    margin 0 0 1rem
    padding 0
    align-items stretch
    display flex
    justify-content flex-start
    .tabs-component-tab {
      margin 0
      padding 0
      color #999
      font-size 14px
      font-weight 600
      list-style none
      .tabs-component-tab-a {
        margin 0
        padding 0 2rem 0 0
        line-height 2.5rem
        align-items center
        color inherit
        display flex
        text-decoration none
      }
    }
    .tabs-component-tab:hover {
      color #666
    }
    .tabs-component-tab.is-active {
      color #000
    }
  }
  >>> .tabs-component-panels {
    margin 0
    padding 0
  }
}
.ast {
  margin 0
  padding 0.5rem
  border 1px solid gray
  border-radius 6px
  background-color white
  line-height normal
  font-size $gitgraphFontSize
  color black
}
</style>