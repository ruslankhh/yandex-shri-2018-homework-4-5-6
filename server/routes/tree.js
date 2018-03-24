const express = require('express');

const git = require('./../helpers/git');
const parseFileList = require('./../helpers/parseFileList');

const config = require('./../../app.json');

const router = express.Router();

router.get(/^\/(\w+)\/?([\w/]+?)?$/, (req, res, next) => {
  const { 0: branch, 1: pathname = '' } = req.params;
  const title = `${branch}/${pathname}`;
  const filepath = pathname || '.';
  const cwd = config.repositoryDiractory;

  git(`ls-tree -r -t ${branch} ${filepath}`, { cwd })
    .then(data => {
      const files = parseFileList(data);
      const children = files.filter(file => pathname === file.dir);
      let parent = null;

      const pathnameArr = pathname.split('/').filter(s => !!s);

      switch (pathnameArr.length) {
        case 1:
          parent = { filepath: '' };
          break;
        default:
          const parentDirName = pathnameArr[pathnameArr.length - 2];

          parent = files.find(file => file.name === parentDirName);
          break;
      }

      const tree = { parent, children };

      res.render('tree', { title, branch, tree });
    });
});

module.exports = router;
