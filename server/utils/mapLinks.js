const path = require('path');

const mapLinks = (links, object, file) => {
  return [
    links[0],
    {
      ...links[1],
      url: [file.type, object, file.filepath].filter(s => !!s).join('/')
    },
    {
      ...links[2],
      url: ['commits', object, file.filepath].filter(s => !!s).join('/')
    },
    ...links.slice(3)
  ].map(link => {
    const resUrl = path.join('/', path.normalize(link.url || ''));
    const newUrl =
      resUrl.length > 1 && resUrl[resUrl.length - 1] === '/'
        ? resUrl.slice(0, -1)
        : resUrl;

    return { ...link, url: newUrl };
  });
};

module.exports = mapLinks;
