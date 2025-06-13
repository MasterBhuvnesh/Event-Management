// release.config.js
module.exports = {
    branches: ['production'],
    repositoryUrl: 'https://github.com/MasterBhuvnesh/Event-Management',
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      '@semantic-release/changelog',
      [
        '@semantic-release/git',
        {
          assets: ['CHANGELOG.md'],
          message: 'chore(release): ${nextRelease.version} by event [skip ci]',
        },
      ],
      [
        '@semantic-release/github',
        {
          assets: [],
          releasedLabels: ['released'],
          successComment: false,
        },
      ],
    ],
  };
  