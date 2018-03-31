const _ = require('lodash');
const path = require('path');
const express = require('express');
const git = require('./../utils/git');
const mapLinks = require('./../utils/mapLinks');
const parseFileList = require('./../utils/parseFileList');
const parseBranchList = require('./../utils/parseBranchList');
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
    git('branch', { cwd }),
    git('rev-parse --show-toplevel', { cwd })
  ])
    .then(data => {
      if (!data[0]) {
        next();

        return;
      }

      const base = path.parse(data[2]).base.trim();
      const root = { filepath: '', type: 'tree', base, level: -1 };
      const files = [root, ...parseFileList(data[0])];
      const file = files.filter(
        file => file.type === 'blob' && file.filepath === pathname
      )[0];

      if (file) {
        const parents = files.filter(file => file.level < level);
        const branches = _.uniq([object, ...parseBranchList(data[1])]);
        const breadcrumbs = parents;
        const links = mapLinks(config.menu, object, file);

        git(`cat-file ${file.type} ${file.hash}`, { cwd })
          .then(data => {
            file.content = data;
            res.render('blob', { title, links, branches, breadcrumbs, object, file });
          })
          .catch(next);
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;
