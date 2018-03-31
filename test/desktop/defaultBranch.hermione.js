const { expect } = require('chai');

const cleanMockRepo = require('./../utils/cleanMockRepo');
const createMockRepo = require('./../utils/createMockRepo');
const growMockRepo = require('./../utils/growMockRepo');
const config = require('./../../config.json');

describe('default branch', () => {
  const cwd = config.repoDir;
  const commits = [
    {
      master: [{ filepath: 'README.md', content: '# Hello, world!' }],
      feature: [{ filepath: 'main.js', content: "console.log('It\\'s work');" }],
      test: [{ filepath: 'test.test.js', content: "console.log('Test!');" }]
    },
    {
      test: [{ filepath: 'test2.test.js', content: "console.log('Test!');" }]
    },
    {
      test: [
        { filepath: 'test.test.js', content: "console.log('Test1!');" },
        { filepath: 'test2.test.js', content: "console.log('Test2!');" },
        { filepath: 'test3.test.js', content: "console.log('Test3!');" }
      ]
    }
  ];

  beforeEach(() =>
    Promise.resolve()
      .then(() => cleanMockRepo(cwd))
      .then(() => createMockRepo(cwd, commits[0]))
      .then(() => growMockRepo(cwd, commits[1]))
      .then(() => growMockRepo(cwd, commits[2]))
  );

  // eslint-disable-next-line
  it('из списка всех веток отображается ветка по умолчанию', function () {
    const expected = 'master';

    return this.browser
      .url('/')
      .then(() => this.browser.getHTML('.branch-select', false))
      .then(data => {
        expect(data).to.contain(expected);
      });
  });
});
