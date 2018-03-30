const { assert } = require('chai');

describe('title', () => {
  it('должен вернуть "Главная | Git Store"', () =>
    this.browser
      .url('/')
      .getTitle()
      .then(title => {
        assert.equal(title, 'Главная | Git Store');
      }));
});
