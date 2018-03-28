const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const path = require('path');

const createMockRepo = require('./../../utils/createMockRepo');
const cleanMockRepo = require('./../../utils/cleanMockRepo');
const git = require('./../../../server/helpers/git');
const parseFileList = require('./../../../server/helpers/parseFileList');

describe('git', () => {
  const cwd = './repo';
  const tree = {
    master: [{ filepath: 'README.md', content: '# Hello, world!' }],
    feature: [{ filepath: 'main.js', content: "console.log('It\\'s work');" }],
    test: [{ filepath: 'test.test.js', content: "console.log('Test!');" }]
  };

  before(() =>
    Promise.resolve()
      .then(() => cleanMockRepo(cwd))
      .then(() => createMockRepo(cwd, tree))
  );

  it('ls-tree -r -t <object> <path>', () => {
    const object = 'test';
    const filepath = '.';

    return git(`ls-tree -r -t ${object} ${filepath}`, { cwd }).then(data => {
      expect(data).to.be.a('string');
      expect(data.includes(tree['master'][0].filepath)).to.equal(true);
      expect(data.includes(tree[object][0].filepath)).to.equal(true);
    });
  });

  it('branch', () => {
    const expected = Object.keys(tree)
      .sort()
      .reduce((str, branch) => {
        str += `${branch === 'master' ? '*' : ' '} ${branch}\n`;

        return str;
      }, '');

    return git(`branch`, { cwd }).then(data => {
      expect(expected).to.equal(data);
    });
  });

  it('rev-parse --show-toplevel', () => {
    const expected = path.join(__dirname, './../../../repo') + '\n';

    return git(`rev-parse --show-toplevel`, { cwd }).then(data => {
      expect(expected).to.equal(data);
    });
  });

  it('log <object> -- <path>', () => {
    const object = 'test';
    const { filepath } = tree[object][0];

    return git(`log ${object} -- ${filepath}`, { cwd }).then(data => {
      expect(true).to.equal(data.includes('Message#3'));
    });
  });

  it('cat-file <type> <object>', () => {
    const object = 'test';
    const { filepath, content } = tree[object][0];

    return git(`ls-tree -r -t ${object} ${filepath}`, { cwd }).then(data => {
      const files = parseFileList(data);
      const file = files.filter(
        file => file.type === 'blob' && file.filepath === filepath
      )[0];

      return git(`cat-file ${file.type} ${file.hash}`, { cwd }).then(data => {
        expect(content).to.equal(data);
      });
    });
  });
});
