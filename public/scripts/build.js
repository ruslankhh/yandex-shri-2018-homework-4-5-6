/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cleanURL__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__blocks_NavItem_NavItem__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__blocks_BranchSelect_BranchSelect__ = __webpack_require__(3);




window.onload = () => {
  Object(__WEBPACK_IMPORTED_MODULE_0__cleanURL__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_1__blocks_NavItem_NavItem__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_2__blocks_BranchSelect_BranchSelect__["a" /* default */])();
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const cleanURL = () => {
  const { pathname } = window.location;

  if (pathname.length > 1 && pathname[pathname.length - 1] === '/') {
    window.location.pathname = pathname.slice(0, pathname.length - 1);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (cleanURL);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const NavItem = () => {
  const { pathname } = window.location;
  const navLinks = document.querySelectorAll('.nav-item__link');

  if (navLinks) {
    navLinks.forEach(link => {
      if (link.pathname === pathname) {
        link.classList.add('nav-item__link--active');
      }
    });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (NavItem);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_parseURL__ = __webpack_require__(4);


const BranchSelect = () => {
  const pathnameMatch = Object(__WEBPACK_IMPORTED_MODULE_0__scripts_parseURL__["a" /* default */])(window.location);
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
};

/* harmony default export */ __webpack_exports__["a"] = (BranchSelect);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const parseURL = (url) => {
  const { pathname } = url;
  const pathnameMatch = pathname
    ? pathname.match(/^\/([\w-]+)\/?([\w-]+)?\/?(.*?)?$/)
    : null;

  return pathnameMatch;
};

/* harmony default export */ __webpack_exports__["a"] = (parseURL);


/***/ })
/******/ ]);