const { describe, it } = require('mocha');
const { expect } = require('chai');

const mapLinks = require('./../../../server/utils/mapLinks');

describe('map links', () => {
  it('with good data', () => {
    const links = [
      { title: 'Главная', url: '/' },
      { title: 'Файлы', url: '/tree' },
      { title: 'Коммиты', url: '/commits' },
      { title: 'Ветки', url: '/branches' }
    ];
    const object = 'test';
    const file = { type: 'blob', filepath: 'README.md' };
    const mappedLinks = mapLinks(links, object, file);

    expect(mappedLinks)
      .to.be.a('array')
      .with.lengthOf(links.length);
    expect(mappedLinks[1]).to.be.a('object');
    expect(mappedLinks[1]).to.have.property('title');
    expect(mappedLinks[1].url).to.equal('/blob/test/README.md');
  });

  it('with bad data', () => {
    const links = [
      { title: 'Главная', url: '/' },
      { title: 'Файлы', url: '/tree/' },
      { title: 'Коммиты', url: '/commits/' },
      { title: 'Ветки', url: '/branches/' },
      { title: 'Секрет' }
    ];
    const object = 'test';
    const file = { type: 'blob', filepath: '/README.md/' };
    const mappedLinks = mapLinks(links, object, file);

    expect(mappedLinks)
      .to.be.a('array')
      .with.lengthOf(links.length);
    expect(mappedLinks[1].url).to.equal('/blob/test/README.md');
    expect(mappedLinks[4].url).to.equal('/');
  });
});
