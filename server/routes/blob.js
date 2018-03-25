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

      if (file) {
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
