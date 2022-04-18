---
title: Error 223
---
## Result

```gitgraph
[log]
git commit -m '1'
git switch -c branch1
git commit -m '2'
git commit -m '3'
git switch -c branch2
git checkout master
git merge branch1
git merge branch2
git tag v1.0.0
```
