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
          // Здесь такой порядок элементов в массиве, чтобы после uniqBy остались
          // их последние версии
          tree[branch] = _.uniqBy([...commit[branch], ...tree[initBranch]], 'filepath');
        } else {
          tree[branch] = _.uniqBy([...commit[branch], ...tree[branch]], 'filepath');
        }
      }
    });
  });

  return tree;
};

module.exports = computeMockRepo;
