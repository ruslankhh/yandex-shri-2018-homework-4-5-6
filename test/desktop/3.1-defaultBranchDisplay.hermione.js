const { expect } = require('chai');

const computeMockRepo = require('./../utils/computeMockRepo');
const config = require('./../../config.json');
const data = require('./../data/data.json');

const { commits } = data;
const defaultBranch = config.defaultBranch || 'master';
const tree = computeMockRepo(commits, defaultBranch);

// eslint-disable-next-line
it('3.1. Отображение ветки по умолчанию', function () {
  const expectedBranch = defaultBranch;
  const expectedCommitLngth = commits.filter(commit => !!commit[defaultBranch]).length;
  const expectedDirLength = tree[defaultBranch].filter(
    file => file.filepath.split('/').length === 1
  ).length;

  return this.browser
    .url('/')
    .then(() => this.browser.getHTML('.branch-select', false))
    .then(data => {
      expect(data).to.contain(expectedBranch);
    })
    .then(() =>
      this.browser.element('.header__nav').click('.nav-item__link[href^="/commits"]')
    )
    .then(() => this.browser.elements('.commit-item', false))
    .then(data => {
      expect(data.value.length).to.equal(expectedCommitLngth);
    })
    .then(() =>
      this.browser.element('.header__nav').click('.nav-item__link[href^="/tree"]')
    )
    .then(() => this.browser.elements('.file-item', false))
    .then(data => {
      expect(data.value.length).to.equal(expectedDirLength);
    });
});
