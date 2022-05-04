import GitgraphMinigramDefault from './components/GitgraphMinigramDefault';
import GitgraphMinigramEditor from './components/GitgraphMinigramEditor';
import GitgraphMinigramCodeMirror from "./components/GitgraphMinigramCodeMirror";

export default ({Vue}) => {
  Vue.component('PluginGitgraphMinigramDefault', GitgraphMinigramDefault);
  Vue.component('PluginGitgraphMinigramEditor', GitgraphMinigramEditor);
  Vue.component('PluginGitgraphMinigramCodeMirror', GitgraphMinigramCodeMirror);
};
