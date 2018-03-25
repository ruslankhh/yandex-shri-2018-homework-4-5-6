const _ = require('lodash');
const path = require('path');
const express = require('express');
const git = require('./../helpers/git');
const parseFileList = require('./../helpers/parseFileList');
const parseBranchList = require('./../helpers/parseBranchList');
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
    git('branch', { cwd })
  ])
    .then(data => {
      if (!data[0]) {
        next();

        return;
      }

      const root = { filepath: '', type: 'tree', base: config.name, level: -1 };
      const files = [ root, ...parseFileList(data[0]) ];
      const file = files.filter(file => pathname === file.filepath)[0];
      const parents = files.filter(file => file.level < level);
      const branches = _.uniq([branch, ...parseBranchList(data[1])]);
      const breadcrumbs = parents;
      const children = files.filter(file => pathname === file.dir);
      const parent = level > 0
        ? files.find(file => file.name === pathnameArr[pathnameArr.length - 2])
        : null;
      const tree = { parent, children };

      if (file && file.type === 'tree') {
        res.render('tree', { title, branches, breadcrumbs, branch, tree });
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;
