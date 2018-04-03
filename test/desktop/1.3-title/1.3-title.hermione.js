const { expect } = require('chai');

// eslint-disable-next-line
it('1.3. Title страницы соответствует ожидаемому', function () {
  const expected = 'Главная | Git Store';

  return this.browser
    .url('/')
    .getTitle()
    .then(title => {
      expect(title).to.equal(expected);
    });
});
