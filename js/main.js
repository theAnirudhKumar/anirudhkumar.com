document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {

  // Theme: light (default) / dark / system
  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.theme-switch [data-theme-set]'));

  function apply(pref) {
    var dark = pref === 'dark' || (pref === 'system' && mq.matches);
    if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    root.setAttribute('data-theme-pref', pref);
    buttons.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-theme-set') === pref); });
  }

  var stored = localStorage.getItem('theme');
  if (stored !== 'light' && stored !== 'dark' && stored !== 'system') stored = 'light';
  apply(stored);

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var pref = b.getAttribute('data-theme-set');
      localStorage.setItem('theme', pref);
      apply(pref);
    });
  });
  if (mq.addEventListener) mq.addEventListener('change', function () {
    if (localStorage.getItem('theme') === 'system') apply('system');
  });

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

  // Nav section highlight (home page anchors only)
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
