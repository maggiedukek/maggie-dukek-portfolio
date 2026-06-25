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

  // Rotating hero word
  const rot = document.getElementById('rotator');
  if (rot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const words = rot.querySelectorAll('span');
    let i = 0;
    setInterval(() => {
      words[i].classList.remove('on');
      i = (i + 1) % words.length;
      words[i].classList.add('on');
    }, 2400);
  }
});
// Hero code-rain (home page only) — teal with rare rose ♡/✦, transparent so the texture shows
document.addEventListener('DOMContentLoaded', function () {
  var c = document.querySelector('.hero-rain');
  if (!c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = c.getContext('2d');
  var glyphs = '01{}[]<>/=;:+*()$#?01abcdef'.split('');
  var rare = ['♡', '✦'];
  var fontSize = 15, cols, ys;
  function resize() {
    c.width = c.clientWidth; c.height = c.clientHeight;
    cols = Math.max(1, Math.floor(c.width / fontSize));
    ys = []; for (var i = 0; i < cols; i++) ys[i] = Math.floor(Math.random() * -40);
  }
  resize();
  window.addEventListener('resize', resize);
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var last = 0;
  function draw(t) {
    requestAnimationFrame(draw);
    if (t - last < 60) return;
    last = t;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.055)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.font = '600 ' + fontSize + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    for (var i = 0; i < cols; i++) {
      var x = i * fontSize, y = ys[i] * fontSize, ch, color;
      if (Math.random() < 0.045) { ch = pick(rare); color = (ch === '♡') ? '#d6749a' : '#8fd0db'; }
      else { ch = pick(glyphs); color = (Math.random() < 0.16) ? '#8fd0db' : '#4a9fb0'; }
      ctx.fillStyle = color;
      ctx.fillText(ch, x, y);
      if (y > c.height && Math.random() > 0.975) ys[i] = Math.floor(Math.random() * -20);
      ys[i]++;
    }
  }
  requestAnimationFrame(draw);
});
