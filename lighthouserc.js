// @ts-check
// Lighthouse CI configuration for Docusaurus site
// See: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md

/** @type {import('@lhci/cli').LighthouseCIConfig} */
module.exports = {
  ci: {
    collect: {
      // Use the built Docusaurus site
      staticDistDir: './build',
      // URLs to audit (homepage and key pages)
      url: [
        'http://localhost/',
        'http://localhost/docs/intro',
        'http://localhost/blog',
      ],
      // Number of runs per URL for more stable results
      numberOfRuns: 3,
    },
    assert: {
      // Assertions for performance budgets
      assertions: {
        // Performance category thresholds
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      // Use temporary public storage (no server needed)
      target: 'temporary-public-storage',
    },
  },
};
