const path = require('path');
const { expect } = require('chai');

const computeMockRepo = require('./../utils/computeMockRepo');
const config = require('./../../config.json');
const data = require('./../data/data.json');

const { commits } = data;
const defaultBranch = config.defaultBranch || 'master';
const tree = computeMockRepo(commits, defaultBranch);

// eslint-disable-next-line
it('3.2. Работа с деревом файлов в ветке по умолчанию', function () {
  const dir = tree[defaultBranch].filter(
    file => !!file.isDirectory && file.filepath.split('/').length === 1
  )[0];
  const dirPath = path.join('/tree', defaultBranch, dir.filepath);
  const expectedDirLength = tree[defaultBranch].filter(
    file => file.filepath.includes(dir.filepath) && file.filepath.split('/').length === 2
  ).length;
  const expectedParentDirLength = tree[defaultBranch].filter(
    file => file.filepath.split('/').length === 1
  ).length;

  return this.browser
    .url('/')
    .then(() => this.browser.element('.content').click(`.file-item a[href="${dirPath}"]`))
    .then(() => this.browser.elements('.file-item', false))
    .then(data => {
      // Ссылка на родительский коталог не учитываем
      expect(data.value.length - 1).to.equal(expectedDirLength);
    })
    .then(() => this.browser.element('.content').click(`.file-item:first-child a`))
    .then(() => this.browser.elements('.file-item', false))
    .then(data => {
      expect(data.value.length).to.equal(expectedParentDirLength);
    });
});
