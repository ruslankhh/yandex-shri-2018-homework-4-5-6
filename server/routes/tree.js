const path = require('path');
const express = require('express');

const git = require('./../helpers/git');
const parseFileList = require('./../helpers/parseFileList');

const config = require('./../../app.json');

const router = express.Router();

router.get(/^\/(\w+)\/?(.*?)?$/, (req, res, next) => {
  let { 0: branch, 1: pathname = '' } = req.params;
  const pathnameArr = pathname.split('/').filter(s => !!s);
  pathname = pathnameArr.join('/');

  const title = `${branch}/${pathname}`;
  const filepath = path.normalize(pathname);
  const cwd = config.repositoryDiractory;

  git(`ls-tree -r -t ${branch} ${filepath}`, { cwd })
    .then(data => {
      if (!data) {
        next();

        return;
      }

      const files = parseFileList(data);
      const children = files.filter(file => pathname === file.dir);
      let parent = null;

      switch (pathnameArr.length) {
        case 1:
          parent = { filepath: '' };
          break;
        default:
          const parentDirName = pathnameArr[pathnameArr.length - 2];

          parent = files.find(file => file.name === parentDirName);
          break;
      }

      if (files[files.length - 1].filepath !== pathname) {
        if (children.length > 0) {
          const tree = { parent, children };

          res.render('tree', { title, branch, tree });
        } else {
          next();
        }
      } else {
        const file = files[files.length - 1];

        git(`cat-file ${file.type} ${file.hash}`, { cwd })
          .then(data => {
            file.content = data;
            res.render('blob', { title, branch, file });
          });
      }
    })
    .catch(next);
});

module.exports = router;
