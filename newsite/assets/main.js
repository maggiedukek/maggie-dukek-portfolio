// Mobile menu + reveal-on-scroll (shared across pages)
document.addEventListener('DOMContentLoaded', () => {
  const t = document.getElementById('navToggle');
  const l = document.getElementById('navLinks');
  if (t && l) {
    t.addEventListener('click', () => l.classList.toggle('open'));
    l.querySelectorAll('a').forEach(a => a.addEventListener('click', () => l.classList.remove('open')));
  }
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4 * 55) + 'ms';
    io.observe(el);
  });

  /