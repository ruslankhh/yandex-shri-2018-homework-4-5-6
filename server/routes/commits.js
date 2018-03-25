const _ = require('lodash');
const path = require('path');
const express = require('express');
const git = require('./../helpers/git');
const parseFileList = require('./../helpers/parseFileList');
const parseBranchList = require('./../helpers/parseBranchList');
const parseCommitList = require('./../helpers/parseCommitList');
const config = require('./../../app.json');

const router = express.Router();

router.get(/^\/((\w+)\/?(.*?)?$)?/, (req, res, next) => {
  const branch = req.params[1] || config.defaultBranch || 'master';
  const pathnameArr = req.params[2]
    ? req.params[2].split('/').filter(s => !!s)
    : [];
  const pathname = pathnameArr.join('/');
  const level = pathnameArr.length;
  const title = `${branch}/${pathname}`;
  const filepath = path.normalize(pathname);
  const cwd = config.repositoryDiractory;

  Promise.all([
    git(`ls-tree -r -t ${branch} ${filepath}`, { cwd }),
    git(`branch`, { cwd }),
    git(`log ${branch} -- ${filepath}`, { cwd })
  ])
    .then(data => {
      if (!data[0]) {
        next();

        return;
      }

      const root = { filepath: '', type: 'tree', base: config.name, level: -1 };
      const files = [root, ...parseFileList(data[0])];
      const file = files[files.length - 1];
      const parents = files.filter(file => file.level < level);
      const branches = _.uniq([branch, ...parseBranchList(data[1])]);
      const breadcrumbs = parents.map(item => {
        item.type = 'commits';
        return item;
      });

      const commits = parseCommitList(data[2]);

      if (file) {
        res.render('commits', { title, branches, breadcrumbs, branch, commits });
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;
