const { expect } = require('chai');

const computeMockRepo = require('./../utils/computeMockRepo');
const config = require('./../../config.json');
const data = require('./../data/data.json');

const { commits } = data;
const defaultBranch = config.defaultBranch || 'master';
const tree = computeMockRepo(commits, defaultBranch);

describe('default branch display', () => {
  // eslint-disable-next-line
  it('из списка всех веток отображается ветка по умолчанию', function () {
    const expected = defaultBranch;

    return this.browser
      .url('/')
      .then(() => this.browser.getHTML('.branch-select', false))
      .then(data => {
        expect(data).to.contain(expected);
      });
  });

  // eslint-disable-next-line
  it('для ветки отображается список коммитов', function () {
    const expected = commits.filter(commit => !!commit[defaultBranch]).length;

    return this.browser
      .url('/')
      .then(() =>
        this.browser.element('.header__nav').click('.nav-item__link[href^="/commits"]')
      )
      .then(() => this.browser.elements('.commit-item', false))
      .then(data => {
        expect(data.value.length).to.equal(expected);
      });
  });

  // eslint-disable-next-line
  it('для ветки отображается корректный список файлов и папок', function () {
    const expected = tree[defaultBranch].filter(
      file => file.filepath.split('/').length === 1
    ).length;

    return this.browser
      .url('/')
      .then(() =>
        this.browser.element('.header__nav').click('.nav-item__link[href^="/tree"]')
      )
      .then(() => this.browser.elements('.file-item', false))
      .then(data => {
        expect(data.value.length).to.equal(expected);
      });
  });
});
