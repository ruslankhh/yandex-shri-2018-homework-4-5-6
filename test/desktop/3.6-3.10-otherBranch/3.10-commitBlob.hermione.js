const path = require('path');
const url = require('url');
const { expect } = require('chai');

const computeMockRepo = require('./../../utils/computeMockRepo');
const config = require('./../../../config.json');
const data = require('./../../data/data.json');

const { commits } = data;
const defaultBranch = config.defaultBranch || 'master';
const tree = computeMockRepo(commits, defaultBranch);

// eslint-disable-next-line
it('3.10. Отображение содержимого файла для коммита из ветки отличной от ветки по умолчанию', function () {
  const otherBranch = Object.keys(tree).filter(b => b !== defaultBranch)[0];
  const commitsPath = path.join('/commits', otherBranch);
  const dir = tree[otherBranch].filter(
    file => !!file.isDirectory && file.filepath.split('/').length === 1
  )[0];
  let objectHash;
  let dirPath;
  const dirFiles = tree[otherBranch].filter(
    file => file.filepath.includes(dir.filepath) && file.filepath.split('/').length === 2
  );
  const file = dirFiles[0];
  let filePath;
  const expectedFileContent = file.content;
  const expectedDirLength = tree[otherBranch].filter(
    file => file.filepath.includes(dir.filepath) && file.filepath.split('/').length === 2
  ).length;

  return this.browser
    .url('/')
    .then(() => this.browser.selectByValue('.branch-select', otherBranch))
    .then(() => this.browser.click(`a[href^="${commitsPath}"]`))
    .then(() => this.browser.click('.commit-item:first-child a'))
    .then(() => this.browser.getUrl())
    .then(data => {
      objectHash = url.parse(data).pathname.split('/')[2];
      dirPath = path.join('/tree', objectHash, dir.filepath);
      filePath = path.join('/blob', objectHash, file.filepath);
    })
    .then(() => this.browser.click(`.file-item a[href="${dirPath}"]`))
    .then(() => this.browser.click(`.file-item a[href="${filePath}"]`))
    .then(() => this.browser.getHTML('.content pre', false))
    .then(data => {
      expect(data).to.contain(expectedFileContent);
    })
    .then(() => this.browser.click(`.breadcrumbs__item a[href="${dirPath}"]`))
    .then(() => this.browser.elements('.file-item', false))
    .then(data => {
      // Ссылку на родительский коталог не учитываем
      expect(data.value.length - 1).to.equal(expectedDirLength);
    });
});
