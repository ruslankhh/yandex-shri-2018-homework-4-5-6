const { describe, it } = require('mocha');
const { expect } = require('chai');
const path = require('path');

const git = require('./../../../server/utils/git');
const parseFileList = require('./../../../server/utils/parseFileList');
const computeMockRepo = require('./../../utils/computeMockRepo');
const config = require('./../../../config.json');
const data = require('./../../data/data.json');

const { repoDir: cwd } = config;
const { commits } = data;
const defaultBranch = config.defaultBranch || 'master';
const tree = computeMockRepo(commits, defaultBranch);

describe('git', () => {
  it('ls-tree -r -t <object> <path>', () => {
    const object = 'test';
    const filepath = '.';
    const expected = tree[object][0].filepath;

    return git(`ls-tree -r -t ${object} ${filepath}`, { cwd }).then(data => {
      expect(data).to.contain(expected);
    });
  });

  it('branch', () => {
    const expected = Object.keys(tree)
      .sort()
      .reduce((str, branch) => {
        str += `${branch === defaultBranch ? '*' : ' '} ${branch}\n`;

        return str;
      }, '');

    return git(`branch`, { cwd }).then(data => {
      expect(expected).to.equal(data);
    });
  });

  it('rev-parse --show-toplevel', () => {
    const expected = path.join(__dirname, './../../../', cwd) + '\n';

    return git(`rev-parse --show-toplevel`, { cwd }).then(data => {
      expect(expected).to.equal(data);
    });
  });

  it('log <object> -- <path>', () => {
    const object = 'test';
    const { filepath } = tree[object][0];

    return git(`log ${object} -- ${filepath}`, { cwd }).then(data => {
      expect(data).to.include(`Message#0`);
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
