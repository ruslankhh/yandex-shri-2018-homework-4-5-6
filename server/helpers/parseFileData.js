const path = require('path');

const parseFileData = (value) => {
  const [filemode, type, hash, filepath] = value.split(/\s|\t/g);
  const level = filepath.split(/\//g).length - 1;

  return { filepath, level, filemode, hash, type, ...path.parse(filepath) };
};

module.exports = parseFileData;
