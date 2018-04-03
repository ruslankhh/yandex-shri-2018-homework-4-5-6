const del = require('del');
const path = require('path');

const cleanMockRepo = cwd => {
  return del(path.join(__dirname, './../../', cwd));
};

module.exports = cleanMockRepo;
