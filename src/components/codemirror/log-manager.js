const LogManagerOriginal = require('gitgraph-minigram/src/grammar-support/log-manager');

class LogManager extends LogManagerOriginal {
  constructor() {
    super();
  }

  /**
   * @return {string}
   */
  getCurrentBranch() {
    return this._getCurrentBranch();
  }

  /**
   * @return {string[]}
   */
  getCreatedBranches() {
    return this._branchList.getBranchNames();
  }

  /**
   * @return {string[]}
   */
  getMergeableBranches() {
    const result = [];

    this.getCreatedBranches().forEach((branch) => {
      if (this._branchList.get(branch).getCommitCount() > 0) {
        result.push(branch);
      }
    });

    return result;
  }
}

module.exports = LogManager;
