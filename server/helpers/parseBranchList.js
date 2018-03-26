const parseBranchList = (value) => {
  const branches = value.toString().trim().split(/\n/g)
    .map(branch => branch.trim().replace('* ', '').replace('/', '--'))
    .sort();

  return branches;
};

module.exports = parseBranchList;
