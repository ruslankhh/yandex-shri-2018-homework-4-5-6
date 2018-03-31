const _ = require('lodash');
const { mkdir, writeFile } = require('fs');
const path = require('path');
const { promisify } = require('util');

const git = require('./../../server/helpers/git');
const config = { ...require('./../../config.json'), ...require('./../data/data.json') };

const mkdirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);

const defaultBranch = config.defaultBranch || 'master';

const createMockRepo = (cwd, tree, i = 0) => {
  const branches = _.uniq([defaultBranch, ...Object.keys(tree)]);

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
          .then(() => git(`commit -m Message#${i}`, { cwd }))
          .then(() => git(`checkout ${branches[0]}`, { cwd }));
        i = i + 1;

        return promise;
      }, Promise.resolve())
    );
};

module.exports = createMockRepo;
