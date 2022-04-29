import GitgraphMinigramDefault from './components/GitgraphMinigramDefault';
import GitgraphMinigramEditor from './components/GitgraphMinigramEditor';

export default ({Vue}) => {
  Vue.component('PluginGitgraphMinigramDefault', GitgraphMinigramDefault);
  Vue.component('PluginGitgraphMinigramEditor', GitgraphMinigramEditor);
};
