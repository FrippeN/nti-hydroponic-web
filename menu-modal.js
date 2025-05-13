// Unifies all menu and modal JS for all pages

document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeButton = mobileMenu ? mobileMenu.querySelector('.close-button') : null;
  const navLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (mobileMenuButton && mobileMenu && closeButton) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.classList.add('modal-open');
    });

    closeButton.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.classList.remove('modal-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('modal-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(event.target) &&
        event.target !== mobileMenuButton
      ) {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('modal-open');
      }
    });
  }


});
