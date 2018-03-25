const _ = require('lodash');
const path = require('path');
const express = require('express');
const git = require('./../helpers/git');
const mapLinks = require('./../helpers/mapLinks');
const parseFileList = require('./../helpers/parseFileList');
const parseBranchList = require('./../helpers/parseBranchList');
const config = require('./../../app.json');

const router = express.Router();

router.get('/', (req, res, next) => {
  const object = config.defaultBranch || 'master';
  res.redirect(`/tree/${object}`);
  next();
});

router.get(/^\/((\w+)\/?(.*?)?$)?/, (req, res, next) => {
  const object = req.params[1] || config.defaultBranch || 'master';
  const pathnameArr = req.params[2]
    ? req.params[2].split('/').filter(s => !!s)
    : [];
  const pathname = pathnameArr.join('/');
  const level = pathnameArr.length;
  const title = [object, pathname].filter(s => !!s).join('/');
  const filepath = path.normalize(pathname);
  const cwd = config.repositoryDiractory;

  Promise.all([
    git(`ls-tree -r -t ${object} ${filepath}`, { cwd }),
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

      if (file && file.type === 'tree') {
        const parents = files.filter(file => file.level < level);
        const branches = _.uniq([object, ...parseBranchList(data[1])]);
        const breadcrumbs = parents;
        const children = files.filter(file => pathname === file.dir);
        const parent = level > 0
          ? files.find(file => file.name === pathnameArr[pathnameArr.length - 2])
          : null;
        const tree = { parent, children };
        const links = mapLinks(config.menu, object, file);

        res.render('tree', { title, links, branches, breadcrumbs, object, tree });
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;
