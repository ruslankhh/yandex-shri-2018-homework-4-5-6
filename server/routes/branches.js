const _ = require('lodash');
const express = require('express');
const git = require('./../helpers/git');
const parseBranchList = require('./../helpers/parseBranchList');
const config = require('./../../app.json');

const router = express.Router();

router.get('/*', (req, res, next) => {
  const object = config.defaultBranch || 'master';
  const title = config.menu[2].title;
  const cwd = config.repositoryDiractory;

  res.locals.nav = { branches: false, breadcrumbs: true };

  git('branch', { cwd })
    .then(data => {
      if (!data) {
        next();

        return;
      }

      const root = { filepath: '', type: 'tree', base: config.name, level: -1 };
      const parents = [root];
      const branches = _.uniq([object, ...parseBranchList(data)]);
      const breadcrumbs = parents;
      const links = config.menu;

      res.render('branches', { title, links, branches, breadcrumbs, object });
    })
    .catch(next);
});

module.exports = router;
