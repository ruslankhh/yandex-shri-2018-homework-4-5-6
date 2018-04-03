const path = require('path');
const { expect } = require('chai');

const computeMockRepo = require('./../../utils/computeMockRepo');
const config = require('./../../../config.json');
const data = require('./../../data/data.json');

const { commits } = data;
const defaultBranch = config.defaultBranch || 'master';
const tree = computeMockRepo(commits, defaultBranch);

// eslint-disable-next-line
it('3.6. Отображение ветки отличной от ветки по умолчанию', function () {
  const otherBranch = Object.keys(tree).filter(b => b !== defaultBranch)[0];
  const commitsPath = path.join('/commits', otherBranch);
  const treePath = path.join('/tree', otherBranch);
  const expectedBranch = otherBranch;
  // Здесь мы учитываем, что в другой ветке находятся ещё коммиты и из ветки по умолчанию
  let isOtherBranchCreated = false;
  const expectedCommitLength = commits.filter(commit => {
    const isOtherBranchInCommit = !!commit[otherBranch];
    const isDefaultBranchInCommit = !!commit[defaultBranch];

    if (isOtherBranchInCommit) {
      isOtherBranchCreated = true;
    }
    if (!isOtherBranchCreated) {
      return isDefaultBranchInCommit;
    } else {
      return isOtherBranchInCommit;
    }
  }).length;
  const expectedDirLength = tree[otherBranch].filter(
    file => file.filepath.split('/').length === 1
  ).length;

  return this.browser
    .url('/')
    .then(() => this.browser.selectByValue('.branch-select', otherBranch))
    .then(() => this.browser.getHTML('.branch-select', false))
    .then(data => {
      expect(data).to.contain(expectedBranch);
    })
    .then(() => this.browser.click(`a[href^="${commitsPath}"]`))
    .then(() => this.browser.elements('.commit-item', false))
    .then(data => {
      expect(data.value.length).to.equal(expectedCommitLength);
    })
    .then(() => this.browser.click(`a[href^="${treePath}"]`))
    .then(() => this.browser.elements('.file-item', false))
    .then(data => {
      expect(data.value.length).to.equal(expectedDirLength);
    });
});
