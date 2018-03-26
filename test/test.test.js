const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;

describe('test', () => {
  it('with mocha', () => {});
  it('with chai', () => {
    assert.isOk(true, 'ok!');
  });
});
