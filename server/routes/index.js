const express = require('express');

const git = require('./../helpers/git');
const parseFileList = require('./../helpers/parseFileList');

const config = require('./../../app.json');

const router = express.Router();

router.get('/', (req, res, next) => {
  const title = config.menu && config.menu.length !== 0 ? config.menu[0].title : '';
  const branch = 'master';
  const pathname = '';
  const filepath = pathname || '.';
  const cwd = config.repositoryDiractory;

  git(`ls-tree -r -t ${branch} ${filepath}`, { cwd })
    .then(data => {
      const files = parseFileList(data).filter(file => pathname === file.dir);
      const tree = { children: files };

      res.render('index', { title, branch, tree });
    });
});

module.exports = router;
