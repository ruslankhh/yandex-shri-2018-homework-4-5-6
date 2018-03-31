const { expect } = require('chai');

describe('title', () => {
  // eslint-disable-next-line
  it('соответствует ожидаемому', function () {
    const expected = 'Главная | Git Store';

    return this.browser
      .url('/')
      .getTitle()
      .then(title => {
        expect(title).to.equal(expected);
      });
  });
});
