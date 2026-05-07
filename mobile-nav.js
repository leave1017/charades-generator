(function () {
  var backdrop = document.createElement('div');
  backdrop.id = 'mobile-nav-backdrop';
  document.body.appendChild(backdrop);

  function openMenu() {
    var menu = document.getElementById('mobile-menu');
    if (!menu) return;
    menu.classList.remove('hidden');
    backdrop.classList.add('active');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    var menu = document.getElementById('mobile-menu');
    if (!menu) return;
    menu.classList.add('hidden');
    backdrop.classList.remove('active');
    document.body.classList.remove('nav-open');
  }

  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('mobile-menu-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        var menu = document.getElementById('mobile-menu');
        if (menu && menu.classList.contains('hidden')) {
          openMenu();
        } else {
          closeMenu();
        }
      });
    }
  });
})();
