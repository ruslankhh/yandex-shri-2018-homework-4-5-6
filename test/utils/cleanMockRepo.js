const del = require('del');

const cleanMockRepo = cwd => {
  return del([cwd]);
};

module.exports = cleanMockRepo;
