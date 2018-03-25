const parseBranchList = (value) => {
  const branches = value.toString().trim().split(/\n/g)
    .map(branch => branch.slice(2))
    .sort();

  return branches;
};

module.exports = parseBranchList;
