const objectSelect = document.getElementsByClassName('branch__select')[0];

if (objectSelect) {
  objectSelect.addEventListener('change', (e) => {
    const newObject = objectSelect.value;
    const { pathname } = window.location;
    const [, type, object, filepath = ''] = pathname.match(/^\/(\w+)\/?(\w+)\/?(.*?)?$/);

    if (newObject !== object) {
      window.location.pathname = `/${type}/${newObject}/${filepath}`;
    }
  });
}
