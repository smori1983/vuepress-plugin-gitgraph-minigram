import { templateExtend, TemplateName } from '@gitgraph/core';
import { createGitgraph } from '@gitgraph/js';

export default {
  methods: {
    /**
     * @param {HTMLElement} container
     */
    createGraph(container) {
      // DEFAULT_FONT: 'normal 12pt Calibri'
      const font = 'normal 12pt Monospace';
      const customTemplate = templateExtend(TemplateName.Metro, {
        branch: {
          lineWidth: 5,
          spacing: 25,
          label: {
            borderRadius: 5,
            font: font,
          },
        },
        commit: {
          message: {
            displayAuthor: false,
            displayHash: false,
            font: font,
          },
          dot: {
            size: 8,
          },
          spacing: 40,
        },
        tag: {
          borderRadius: 5,
          pointerWidth: 5,
          font: font,
        },
      });

      return createGitgraph(container, {
        template: customTemplate,
        branchLabelOnEveryCommit: true,
      });
    },
  },
};
