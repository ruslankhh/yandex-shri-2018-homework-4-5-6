const objectSelect = document.getElementsByClassName('branch__select')[0];

if (objectSelect) {
  const oldObject = objectSelect.value;

  objectSelect.addEventListener('change', (e) => {
    const newObject = objectSelect.value;
    const { pathname } = window.location;
    const pathnameMatch = pathname
      ? pathname.match(/^\/(\w+)\/?(\w+)\/?(.*?)?$/)
      : null;
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
