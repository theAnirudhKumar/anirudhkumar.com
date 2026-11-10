document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {

  // Theme: light (default) / dark / system
  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.theme-switch [data-theme-set]'));

  var cycle = document.querySelector('.theme-cycle');
  var order = { light: 'dark', dark: 'system', system: 'light' };
  var names = { light: 'Light', dark: 'Dark', system: 'System' };

  function apply(pref) {
    var dark = pref === 'dark' || (pref === 'system' && mq.matches);
    if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    root.setAttribute('data-theme-pref', pref);
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute('content', dark ? '#14110D' : (window.matchMedia('(min-width: 761px)').matches ? '#F4EEE3' : '#FCF9F4'));
    buttons.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-theme-set') === pref); });
    if (cycle) {
      cycle.setAttribute('data-pref', pref);
      cycle.setAttribute('aria-label', 'Theme: ' + names[pref] + '. Tap for ' + names[order[pref]] + '.');
    }
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
  if (cycle) cycle.addEventListener('click', function () {
    var cur = localStorage.getItem('theme');
    if (!order[cur]) cur = 'light';
    var next = order[cur];
    localStorage.setItem('theme', next);
    apply(next);
  });
  if (mq.addEventListener) mq.addEventListener('change', function () {
    if (localStorage.getItem('theme') === 'system') apply('system');
  });

  // Phone menu: opens the nav as a dropdown, closes on a link, outside tap, Escape or a wider screen.
  var head = document.querySelector('.masthead');
  var mbtn = document.querySelector('.menu-btn');
  function setMenu(open) {
    head.classList.toggle('open', open);
    mbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mbtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (head && mbtn) {
    mbtn.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!head.classList.contains('open')); });
    Array.prototype.forEach.call(head.querySelectorAll('nav a'), function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('click', function (e) { if (!head.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    var wide = window.matchMedia('(min-width: 761px)');
    if (wide.addEventListener) wide.addEventListener('change', function () { setMenu(false); });
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

  // Tab bar highlight on the home page: Home, then Community and Contact as the page reaches them
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabbar a'));
  var tCom = document.getElementById('community'), tCon = document.getElementById('contact');
  if (tabs.length && tCom && tCon) {
    var byTab = function (k) { return document.querySelector('.tabbar a[data-tab="' + k + '"]'); };
    var ticking = false;
    var updateTab = function () {
      ticking = false;
      var mid = window.innerHeight / 2;
      var com = tCom.getBoundingClientRect(), con = tCon.getBoundingClientRect();
      var atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      var key = (con.top <= mid || atEnd) ? 'contact' : (com.top <= mid && com.bottom > mid) ? 'community' : 'home';
      tabs.forEach(function (a) { if (a === byTab(key)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    };
    var queueTab = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(updateTab); } };
    window.addEventListener('scroll', queueTab, { passive: true });
    window.addEventListener('resize', queueTab);
    updateTab();
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
