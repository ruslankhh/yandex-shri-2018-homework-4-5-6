const path = require('path');

const parseFileData = value => {
  const [filemode, type, hash, filepath] = value.split(/\s|\t/g);
  const level = filepath.split(/\//g).length - 1;
  const isBlob = type === 'blob';
  const isDirectory = type === 'tree';

  return {
    filepath,
    level,
    filemode,
    hash,
    type,
    ...path.parse(filepath),
    isBlob,
    isDirectory
  };
};

module.exports = parseFileData;
