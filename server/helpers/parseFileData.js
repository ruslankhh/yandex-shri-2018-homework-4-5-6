const path = require('path');

const parseFileData = (value) => {
  const [filemode, type, hash, filepath] = value.split(/\s|\t/g);

  return { filepath, filemode, hash, type, ...path.parse(filepath) };
};

module.exports = parseFileData;
