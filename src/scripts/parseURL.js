const parseURL = (url) => {
  const { pathname } = url;
  const pathnameMatch = pathname
    ? pathname.match(/^\/([\w-]+)\/?([\w-]+)?\/?(.*?)?$/)
    : null;

  return pathnameMatch;
};

export default parseURL;
