const _ = require('lodash');
const { writeFile } = require('fs');
const path = require('path');
const { promisify } = require('util');

const git = require('./../../server/helpers/git');

const writeFileAsync = promisify(writeFile);

const growMockRepo = (cwd, tree, i = 0) => {
  const branches = _.uniq(Object.keys(tree));

  return Promise.resolve().then(() =>
    branches.reduce((promise, branch) => {
      promise = promise
        .then(() => git(`checkout ${branch}`, { cwd }))
        .then(() =>
          Promise.all(
            tree[branch].map(({ filepath, content }) =>
              writeFileAsync(path.join(cwd, filepath), content)
            )
          )
        )
        .then(() => git(`add .`, { cwd }))
        .then(() => git(`commit -m Message#${i}`, { cwd }))
        .then(() => git(`checkout master`, { cwd }));
      i = i + 1;

      return promise;
    }, Promise.resolve())
  );
};

module.exports = growMockRepo;
