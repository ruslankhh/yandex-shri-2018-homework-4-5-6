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

export default NavItem;
