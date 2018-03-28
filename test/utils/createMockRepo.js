const _ = require('lodash');
const { mkdir, writeFile } = require('fs');
const path = require('path');
const { promisify } = require('util');

const git = require('./../../server/helpers/git');

const mkdirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);

const createMockRepo = (cwd, tree) => {
  const branches = _.uniq(['master', ...Object.keys(tree)]);
  let i = 0;

  return Promise.resolve()
    .then(() => mkdirAsync(cwd))
    .then(() => git('init', { cwd }))
    .then(() =>
      branches.reduce((promise, branch) => {
        promise = promise
          .then(() => git(`checkout -b ${branch}`, { cwd }))
          .then(() =>
            Promise.all(
              tree[branch].map(({ filepath, content }) =>
                writeFileAsync(path.join(cwd, filepath), content)
              )
            )
          )
          .then(() => git(`add .`, { cwd }))
          .then(() => git(`commit -m "Message#${i}"`, { cwd }))
          .then(() => git(`checkout master`, { cwd }));
        i = i + 1;

        return promise;
      }, Promise.resolve())
    );
};

module.exports = createMockRepo;
