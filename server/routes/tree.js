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

      const root = { filepath: '', type: 'tree' };
      const files = [ root, ...parseFileList(data) ];
      const file = files.filter(file => pathname === file.filepath)[0];
      const children = files.filter(file => pathname === file.dir);
      const parent = level > 0
        ? files.find(file => file.name === pathnameArr[pathnameArr.length - 2])
        : null;
      const tree = { parent, children };

      if (file && file.type === 'tree') {
        res.render('tree', { title, branch, tree });
      } else if (file) {
        git(`cat-file ${file.type} ${file.hash}`, { cwd })
          .then(data => {
            file.content = data;
            res.render('blob', { title, branch, file });
          });
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;
