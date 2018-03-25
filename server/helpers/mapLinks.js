const mapLinks = (links, object, file) => {
  return [
    links[0],
    {
      ...links[1],
      url: '/' + [file.type, object, file.filepath].filter(s => !!s).join('/')
    },
    {
      ...links[2],
      url: '/' + ['commits', object, file.filepath].filter(s => !!s).join('/')
    },
    ...links.slice(3)
  ];
};

module.exports = mapLinks;
