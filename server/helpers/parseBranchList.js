const parseBranchList = (value) => {
  const branches = value.toString().trim().split(/\n/g)
    .map(item => { console.log(item); return item; })
    .map(branch => branch.replace('* ', '').replace('/', '--'))
    .map(item => { console.log(item); return item; })
    .sort();

  return branches;
};

module.exports = parseBranchList;
