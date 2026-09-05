document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {

  // Theme
  var themeBtn = document.querySelector('.theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var root = document.documentElement;
      var dark = root.getAttribute('data-theme') === 'dark';
      if (dark) { root.removeAttribute('data-theme'); localStorage.setItem('theme', 'light'); }
      else { root.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); }
    });
  }

  // Reveal on scroll. Content must never stay hidden: CSS only hides once .js is set,
  // and this timeout releases everything if the observer never fires.
  var reveals = document.querySelectorAll('[data-reveal]');
  function showAll() { reveals.forEach(function (el) { el.classList.add('seen'); }); }
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 2500);
  } else {
    showAll();
  }

  // Nav section highlight
  var links = Array.prototype.slice.call(document.querySelectorAll('.masthead nav a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
});
