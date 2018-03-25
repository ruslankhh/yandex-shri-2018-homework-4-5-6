const { pathname } = window.location;
const pathnameMatch = pathname
  ? pathname.match(/^\/([\w-]+)\/?([\w-]+)?\/?(.*?)?$/)
  : null;

if (pathname.length > 1 && pathname[pathname.length - 1] === '/') {
  window.location.pathname = pathname.slice(0, pathname.length - 1);
}

const objectSelect = document.getElementsByClassName('branch__select')[0];

if (objectSelect) {
  const oldObject = objectSelect.value;

  objectSelect.addEventListener('change', (e) => {
    const newObject = objectSelect.value;
    const pathnameArr = pathnameMatch
      ? pathnameMatch.slice(1)
      : ['tree', oldObject];
    const [type, object, filepath] = pathnameArr;

    if (newObject !== object) {
      const newPathnameArr = [type, newObject, filepath].filter(s => !!s);

      window.location.pathname = `/${newPathnameArr.join('/')}`;
    }
  });
}

const navLinks = document.querySelectorAll('.nav-item__link');

if (navLinks) {
  navLinks.forEach(link => {
    if (link.pathname === pathname) {
      link.classList.add('nav-item__link--active');
    }
  });
}
