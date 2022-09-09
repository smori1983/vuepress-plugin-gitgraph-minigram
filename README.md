# vuepress-plugin-gitgraph-minigram

VuePress plugin for [gitgraph-minigram](https://www.npmjs.com/package/gitgraph-minigram).

Provides:

- `markdown-it` notation to draw git commit graph of [@gitgraph/js](https://www.npmjs.com/package/@gitgraph/js).
- web editor powered by CodeMirror 5.


## Example site

- Run `npm run example:dev`
- Visit [online demo](https://smori1983.github.io/vuepress-plugin-gitgraph-minigram/)


## Basic usage

```
module.exports = {
  ...
  plugins: [
    ['gitgraph-minigram'],
  ],
};
```


## Configuration

```
module.exports = {
  ...
  plugins: [
    ['gitgraph-minigram', {
      fenceName: <string>,
      componentName: <string>,
    }],
  ],
};
```

- The default fence name (value after <code>```</code>) is `gitgraph`.
- The default component is `PluginGitgraphMinigramDefault`.
  - `src/components/GitgraphMinigramDefault.vue`


## Example

````
## Result

```gitgraph
[log]
git commit -m 'initial commit'
git switch -c feature/1
git commit -m '1'
git commit -m '2'
git checkout master
git merge feature/1
git tag v1.0.0
```
````

will be rendered as:

![](https://cdn.jsdelivr.net/gh/smori1983/vuepress-plugin-gitgraph-minigram@master/doc/example01.png)
