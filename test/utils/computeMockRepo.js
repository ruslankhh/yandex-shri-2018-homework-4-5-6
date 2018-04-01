const _ = require('lodash');

/*
 * Подсчитывает результирующее состояние дерева со всеми ветками и файлами.
 */
const computeMockRepo = (commits, defaultBranch) => {
  const tree = {};
  let initBranch;

  commits.forEach(commit => {
    const branches = Object.keys(commit);

    branches.forEach(branch => {
      if (!initBranch) {
        initBranch = branch;
        tree[branch] = commit[branch];
      } else {
        if (!tree[branch]) {
          tree[branch] = _.uniqBy([...tree[initBranch], ...commit[branch]], 'filepath');
        } else {
          tree[branch] = _.uniqBy([...tree[branch], ...commit[branch]], 'filepath');
        }
      }
    });
  });

  return tree;
};

module.exports = computeMockRepo;
