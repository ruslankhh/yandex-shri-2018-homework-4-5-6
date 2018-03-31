const _ = require('lodash');
const path = require('path');
const express = require('express');
const git = require('./../utils/git');
const mapLinks = require('./../utils/mapLinks');
const parseFileList = require('./../utils/parseFileList');
const parseBranchList = require('./../utils/parseBranchList');
const parseCommitList = require('./../utils/parseCommitList');
const config = { ...require('./../../config.json'), ...require('./../data/data.json') };

const router = express.Router();

router.get(/^\/(([\w-]+)\/?(.*?)?$)?/, (req, res, next) => {
  const object = req.params[1] || config.defaultBranch || 'master';
  const pathnameArr = req.params[2] ? req.params[2].split('/').filter(s => !!s) : [];
  const pathname = pathnameArr.join('/');
  const level = pathnameArr.length;
  const title = [object, pathname].filter(s => !!s).join('/');
  const filepath = path.normalize(pathname);
  const cwd = config.repoDir;

  Promise.all([
    git(`ls-tree -r -t ${object.replace('--', '/')} ${filepath}`, { cwd }),
    git(`branch`, { cwd }),
    git(`log ${object.replace('--', '/')} -- ${filepath}`, { cwd }),
    git('rev-parse --show-toplevel', { cwd })
  ])
    .then(data => {
      if (!data[0]) {
        next();

        return;
      }

      const base = path.parse(data[3]).base.trim();
      const root = { filepath: '', type: 'tree', base, level: -1 };
      const files = [root, ...parseFileList(data[0])];
      const file = files.filter(file => file.filepath === pathname)[0];

      if (file) {
        const parents = files.filter(file => file.level < level);
        const branches = _.uniq([object, ...parseBranchList(data[1])]);
        const breadcrumbs = parents.map(item => ({ ...item, type: 'commits' }));
        const links = mapLinks(config.menu, object, file);
        const commits = parseCommitList(data[2]);

        res.render('commits', {
          title,
          links,
          branches,
          breadcrumbs,
          object,
          commits,
          file
        });
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;
