const { describe, it, before } = require('mocha');
const { expect } = require('chai');

const createMockRepo = require('./../../utils/createMockRepo');
const cleanMockRepo = require('./../../utils/cleanMockRepo');
const git = require('./../../../server/helpers/git');
const parseBranchList = require('./../../../server/helpers/parseBranchList');
const parseCommitList = require('./../../../server/helpers/parseCommitList');
const parseFileData = require('./../../../server/helpers/parseFileData');
const parseFileList = require('./../../../server/helpers/parseFileList');

describe('parse', () => {
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

  it('branch list', () => {
    const expected = Object.keys(tree).sort();

    return git(`branch`, { cwd }).then(data => {
      const branches = parseBranchList(data);

      expect(expected).to.deep.equal(branches);
    });
  });

  it('commit list', () => {
    const object = 'test';
    const { filepath } = tree[object][0];

    return git(`log ${object} -- ${filepath}`, { cwd }).then(data => {
      const commits = parseCommitList(data);

      expect(commits)
        .to.be.a('array')
        .with.lengthOf(1);
      expect(commits[0]).to.have.property('hash');
      expect(commits[0])
        .to.have.property('shortHash')
        .with.lengthOf(8);
      expect(commits[0]).to.have.property('author');
      expect(commits[0]).to.have.property('date');
      expect(commits[0]).to.have.property('message');
      expect(commits[0].author).to.be.a('object');
      expect(commits[0].message).to.equal('Message#3');
    });
  });

  it('file data', () => {
    const object = 'test';
    const { filepath } = tree[object][0];

    return git(`ls-tree -r -t ${object} ${filepath}`, { cwd }).then(data => {
      const file = parseFileData(data);

      expect(file).to.be.a('object');
      expect(file).to.have.property('filepath');
      expect(file).to.have.property('level');
      expect(file).to.have.property('filemode');
      expect(file).to.have.property('hash');
      expect(file).to.have.property('type');
      expect(file).to.have.property('root');
      expect(file).to.have.property('dir');
      expect(file).to.have.property('base');
      expect(file).to.have.property('ext');
      expect(file).to.have.property('name');
      expect(file).to.have.property('isBlob');
      expect(file).to.have.property('isDirectory');
      expect(file.filepath).to.equal(filepath);
    });
  });

  it('file list', () => {
    const object = 'test';
    const filepath = '.';

    return git(`ls-tree -r -t ${object} ${filepath}`, { cwd }).then(data => {
      const files = parseFileList(data);

      expect(files)
        .to.be.a('array')
        .with.lengthOf(2);
      expect(files[0]).to.be.a('object');
      expect(files[0]).to.have.property('filepath');
      expect(files[0]).to.have.property('level');
      expect(files[0]).to.have.property('filemode');
      expect(files[0]).to.have.property('hash');
      expect(files[0]).to.have.property('type');
      expect(files[0]).to.have.property('root');
      expect(files[0]).to.have.property('dir');
      expect(files[0]).to.have.property('base');
      expect(files[0]).to.have.property('ext');
      expect(files[0]).to.have.property('name');
      expect(files[0]).to.have.property('isBlob');
      expect(files[0]).to.have.property('isDirectory');
    });
  });
});
