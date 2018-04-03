const _ = require('lodash');

const parseFileData = require('./parseFileData');

const parseFileList = value => {
  const files = value
    .toString()
    .trim()
    .split(/\n/g)
    .map(parseFileData);

  return _.orderBy(files, ['type', o => o.filepath.toLowerCase()], ['desc', 'asc']);
};

module.exports = parseFileList;
