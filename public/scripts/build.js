'use strict';

function cleanURL() {
  var pathname = window.location.pathname;


  if (pathname.length > 1 && pathname[pathname.length - 1] === '/') {
    window.location.pathname = pathname.slice(0, pathname.length - 1);
  }
}
"use strict";

window.onload = function () {
  cleanURL();
  NavItem();
  BranchSelect();
};
"use strict";

function parseURL(url) {
  var pathname = url.pathname;

  var pathnameMatch = pathname ? pathname.match(/^\/([\w-]+)\/?([\w-]+)?\/?(.*?)?$/) : null;

  return pathnameMatch;
}
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function BranchSelect() {
  var pathnameMatch = parseURL(window.location);
  var branchSelect = document.getElementsByClassName('branch-select')[0];

  if (branchSelect) {
    var oldObject = branchSelect.value;

    branchSelect.addEventListener('change', function (e) {
      var newObject = branchSelect.value;
      var pathnameArr = pathnameMatch ? pathnameMatch.slice(1) : ['tree', oldObject];

      var _pathnameArr = _slicedToArray(pathnameArr, 3),
          type = _pathnameArr[0],
          object = _pathnameArr[1],
          filepath = _pathnameArr[2];

      if (newObject !== object) {
        var newPathnameArr = [type, newObject, filepath].filter(function (s) {
          return !!s;
        });

        window.location.pathname = '/' + newPathnameArr.join('/');
      }
    });
  }
}
'use strict';

function NavItem() {
  var pathname = window.location.pathname;

  var navLinks = document.querySelectorAll('.nav-item__link');

  if (navLinks) {
    navLinks.forEach(function (link) {
      if (link.pathname === pathname) {
        link.classList.add('nav-item__link--active');
      }
    });
  }
}