const path = require('path');
const express = require('express');

const git = require('./../helpers/git');
const parseFileList = require('./../helpers/parseFileList');

const config = require('./../../app.json');

const router = express.Router();

router.get('/', (req, res, next) => {
  const branch = config.defaultBranch;
  const pathname = '';

  const title = config.menu && config.menu.length !== 0 ? config.menu[0].title : '';
  const filepath = path.normalize(pathname);
  const cwd = config.repositoryDiractory;

  git(`ls-tree -r -t ${branch} ${filepath}`, { cwd })
    .then(data => {
      if (!data) {
        next();

        return;
      }

      const files = parseFileList(data).filter(file => pathname === file.dir);
      const tree = { children: files };

      res.render('index', { title, branch, tree });
    })
    .catch(next);
});

module.exports = router;
