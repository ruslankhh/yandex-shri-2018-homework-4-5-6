const path = require('path');
const { expect } = require('chai');

const computeMockRepo = require('./../../utils/computeMockRepo');
const config = require('./../../../config.json');
const data = require('./../../data/data.json');

const { commits } = data;
const defaultBranch = config.defaultBranch || 'master';
const tree = computeMockRepo(commits, defaultBranch);

// eslint-disable-next-line
it('3.8. Отображение содержимого файла в ветке отличной от ветки по умолчанию', function () {
  const otherBranch = Object.keys(tree).filter(b => b !== defaultBranch)[0];
  const dir = tree[otherBranch].filter(
    file => !!file.isDirectory && file.filepath.split('/').length === 1
  )[0];
  const dirPath = path.join('/tree', otherBranch, dir.filepath);
  const dirFiles = tree[otherBranch].filter(
    file => file.filepath.includes(dir.filepath) && file.filepath.split('/').length === 2
  );
  const file = dirFiles[0];
  const filePath = path.join('/blob', otherBranch, file.filepath);
  const expectedFileContent = file.content;
  const expectedDirLength = dirFiles.length;

  return this.browser
    .url('/')
    .then(() => this.browser.selectByValue('.branch-select', otherBranch))
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
