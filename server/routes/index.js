const _ = require('lodash');
const path = require('path');
const express = require('express');
const git = require('./../helpers/git');
const parseFileList = require('./../helpers/parseFileList');
const parseBranchList = require('./../helpers/parseBranchList');
const config = require('./../../app.json');

const router = express.Router();

router.get('/', (req, res, next) => {
  const object = config.defaultBranch;
  const pathname = '';
  const title = config.menu && config.menu.length !== 0 ? config.menu[0].title : '';
  const filepath = path.normalize(pathname);
  const cwd = config.repositoryDirectory;

  Promise.all([
    git(`ls-tree -r -t ${object.replace('--', '/')} ${filepath}`, { cwd }),
    git('branch', { cwd }),
    git('rev-parse --show-toplevel', { cwd })
  ])
    .then(data => {
      if (!data) {
        next();

        return;
      }

      const base = path.parse(data[2]).base;
      const root = { filepath: '', type: 'tree', base, level: -1 };
      const files = parseFileList(data[0]);
      const breadcrumbs = [root];
      const links = config.menu;
      const branches = _.uniq([object, ...parseBranchList(data[1])]);
      const children = files.filter(file => pathname === file.dir);
      const tree = { children };

      res.render('index', { title, links, branches, breadcrumbs, object, tree });
    })
    .catch(next);
});

module.exports = router;
