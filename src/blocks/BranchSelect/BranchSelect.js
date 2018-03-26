function BranchSelect () {
  const pathnameMatch = parseURL(window.location);
  const branchSelect = document.getElementsByClassName('branch-select')[0];

  if (branchSelect) {
    const oldObject = branchSelect.value;

    branchSelect.addEventListener('change', (e) => {
      const newObject = branchSelect.value;
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
}
