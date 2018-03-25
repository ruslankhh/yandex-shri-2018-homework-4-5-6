const path = require('path');
const express = require('express');

const git = require('./../helpers/git');
const parseFileList = require('./../helpers/parseFileList');

const config = require('./../../app.json');

const router = express.Router();

router.get(/^\/(\w+)\/?(.*?)?$/, (req, res, next) => {
  const branch = req.params[0];
  const pathnameArr = req.params[1]
    ? req.params[1].split('/').filter(s => !!s)
    : [];
  const pathname = pathnameArr.join('/');
  const level = pathnameArr.length;

  const title = `${branch}/${pathname}`;
  const filepath = path.normalize(pathname);
  const cwd = config.repositoryDiractory;

  git(`ls-tree -r -t ${branch} ${filepath}`, { cwd })
    .then(data => {
      if (!data) {
        next();

        return;
      }

      const root = { filepath: '', type: 'tree', base: config.name, level: -1 };
      const files = [root, ...parseFileList(data)];
      const file = files[files.length - 1];
      const parents = files.filter(file => file.level < level);
      const breadcrumbs = parents.length > 4
        ? [...parents.slice(0, 2), ...parents.slice(-2)]
        : parents;

      if (file) {
        git(`cat-file ${file.type} ${file.hash}`, { cwd })
          .then(data => {
            file.content = data;
            res.render('blob', { title, branch, file, breadcrumbs });
          })
          .catch(next);
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;
