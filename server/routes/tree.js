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
      let children = [];
      const files = parseFileList(data);
      const pathnameArr = pathname.split('/').filter(s => !!s);

      switch (pathnameArr.length) {
        case 0:
          children = [];
          break;
        case 1:
          children = [ { filepath: '', base: '..' } ];
          break;
        default:
          const parentDirName = pathnameArr[pathnameArr.length - 2];
          const parentDir = files.find(file => file.name === parentDirName);
          children = [ { ...parentDir, base: '..' } ];
          break;
      }

      const tree = {
        children: [ ...children, ...files.filter(file => pathname === file.dir) ]
      };

      res.render('index', { title, branch, tree });
    });
});

module.exports = router;
