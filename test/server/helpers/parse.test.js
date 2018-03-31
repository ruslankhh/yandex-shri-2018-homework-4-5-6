const { describe, it } = require('mocha');
const { expect } = require('chai');

const git = require('./../../../server/helpers/git');
const parseBranchList = require('./../../../server/helpers/parseBranchList');
const parseCommitList = require('./../../../server/helpers/parseCommitList');
const parseFileData = require('./../../../server/helpers/parseFileData');
const parseFileList = require('./../../../server/helpers/parseFileList');
const computeTreeMockRepo = require('./../../utils/computeTreeMockRepo');
const config = {
  ...require('./../../../config.json'),
  ...require('./../../data/data.json')
};

const { repoDir: cwd, commits } = config;
const defaultBranch = config.defaultBranch || 'master';
const tree = computeTreeMockRepo(commits, defaultBranch);

describe('parse', () => {
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
    let expectedCountCommits = commits.filter(
      commit =>
        !!commit[object] && commit[object].some(file => file.filepath === filepath)
    ).length;

    if (commits[0][defaultBranch].some(file => file.filepath === filepath)) {
      expectedCountCommits += 1;
    }

    return git(`log ${object} -- ${filepath}`, { cwd }).then(data => {
      const commitObjects = parseCommitList(data);

      expect(commitObjects)
        .to.be.a('array')
        .with.lengthOf(expectedCountCommits);
      expect(commitObjects[0]).to.have.property('hash');
      expect(commitObjects[0])
        .to.have.property('shortHash')
        .with.lengthOf(8);
      expect(commitObjects[0]).to.have.property('author');
      expect(commitObjects[0]).to.have.property('date');
      expect(commitObjects[0]).to.have.property('message');
      expect(commitObjects[0].author).to.be.a('object');
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
    const expectedCountFiles = tree[object].length;

    return git(`ls-tree -r -t ${object} ${filepath}`, { cwd }).then(data => {
      const files = parseFileList(data);

      expect(files)
        .to.be.a('array')
        .with.lengthOf(expectedCountFiles);
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
