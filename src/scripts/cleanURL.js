const cleanURL = () => {
  const { pathname } = window.location;

  if (pathname.length > 1 && pathname[pathname.length - 1] === '/') {
    window.location.pathname = pathname.slice(0, pathname.length - 1);
  }
};

export default cleanURL;
