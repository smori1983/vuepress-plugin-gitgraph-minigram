const LogManagerOriginal = require('gitgraph-minigram/src/grammar-support/log-manager');

class LogManager extends LogManagerOriginal {
  constructor() {
    super();
  }

  /**
   * Get the branch names other than current branch.
   *
   * @return {string[]}
   */
  getOtherBranches() {
    return this._branchList.getBranchNames().filter((branch) => {
      return branch !== this._getCurrentBranch();
    });
  }

  /**
   * Get the branch names that can be merged into current branch.
   *
   * @return {string[]}
   */
  getMergeableBranches() {
    return this.getOtherBranches().filter((branch) => {
      return this._branchList.get(branch).getCommitCount() > 0;
    });
  }
}

module.exports = LogManager;
