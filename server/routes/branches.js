const _ = require('lodash');
const path = require('path');
const express = require('express');
const git = require('./../utils/git');
const parseBranchList = require('./../utils/parseBranchList');
const config = { ...require('./../../config.json'), ...require('./../data/data.json') };

const router = express.Router();

router.get('/*', (req, res, next) => {
  const object = config.defaultBranch || 'master';
  const title = config.menu[2].title;
  const cwd = config.repoDir;

  const nav = { branches: false, breadcrumbs: true };

  Promise.all([git('branch', { cwd }), git('rev-parse --show-toplevel', { cwd })])
    .then(data => {
      if (!data) {
        next();

        return;
      }

      const base = path.parse(data[1]).base.trim();
      const root = { filepath: '', type: 'tree', base, level: -1 };
      const parents = [root];
      const branches = _.uniq([object, ...parseBranchList(data[0])]);
      const breadcrumbs = parents;
      const links = config.menu;

      res.render('branches', { title, links, branches, breadcrumbs, object, nav });
    })
    .catch(next);
});

module.exports = router;
