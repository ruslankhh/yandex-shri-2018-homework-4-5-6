const _ = require('lodash');
const { expect } = require('chai');

const config = require('./../../config.json');
const data = require('./../data/data.json');

const { commits } = data;
const defaultBranch = config.defaultBranch || 'master';

describe('default branch', () => {
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
    const expected = _.uniq(
      _.flatten(
        commits
          .filter(commit => !!commit[defaultBranch])
          .map(commit => commit[defaultBranch].map(file => file.filepath))
      )
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
