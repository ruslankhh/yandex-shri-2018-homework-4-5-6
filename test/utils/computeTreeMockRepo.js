const _ = require('lodash');

const computeTreeMockRepo = (commits, defaultBranch) => {
  const tree = _.cloneDeep(commits).reduce((commit, next) => {
    Object.keys(commit).forEach(key => {
      commit[key] = next[key] ? [...commit[key], ...next[key]] : commit[key];
    });
    return commit;
  });

  Object.keys(tree).forEach(key => {
    tree[key] = _.sortBy(
      _.uniqBy([...tree[key], ...commits[0][defaultBranch]], 'filepath'),
      'filepath'
    );
  });

  return tree;
};

module.exports = computeTreeMockRepo;
