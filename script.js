document.getElementById('year').textContent = new Date().getFullYear();

// Logo click: go back to the previous page
document.querySelectorAll('.logo').forEach(logo => {
  logo.addEventListener('click', e => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'index.html#home';
    }
  });
});

// Nav shadow + active link
const nav = document.getElementById('nav');
const links = [...document.querySelectorAll('.nav-links a')];
const sections = links.map(l => {
  const href = l.getAttribute('href');
  if (href && href.startsWith('#')) {
    try { return document.querySelector(href); } catch (e) { return null; }
  }
  return null;
});
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 20);
  let current = null;
  sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) current = i; });
  links.forEach((l, i) => l.classList.toggle('active', i === current));
});

// Mobile menu
const navLinks = document.getElementById('navLinks');
document.getElementById('menuToggle').addEventListener('click', () => navLinks.classList.toggle('open'));
links.forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

// Reveal on scroll with immediate viewport check & failsafe
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      e.target.querySelectorAll?.('.bar').forEach(b => b.classList.add('go'));
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

const revealElements = document.querySelectorAll('.reveal, .skill-bars');
revealElements.forEach(el => {
  io.observe(el);
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.add('in');
    el.querySelectorAll?.('.bar').forEach(b => b.classList.add('go'));
  }
});

// Failsafe so no element is ever stuck hidden
setTimeout(() => {
  revealElements.forEach(el => {
    el.classList.add('in');
    el.querySelectorAll?.('.bar').forEach(b => b.classList.add('go'));
  });
}, 1200);

// Tabs
const tabs = document.querySelectorAll('.tab');
const indicator = document.querySelector('.tab-indicator');
function moveIndicator(t) {
  if (!t || !indicator) return;
  indicator.style.width = t.offsetWidth + 'px';
  indicator.style.left = t.offsetLeft + 'px';
}
tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  moveIndicator(t);
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + t.dataset.tab);
  if (panel) {
    panel.classList.add('active');
    panel.querySelectorAll('.bar').forEach(b => {
      b.classList.remove('go');
      requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('go')));
    });
  }
}));

// Initialize tab indicator immediately and on load/resize
const activeTab = document.querySelector('.tab.active');
if (activeTab) moveIndicator(activeTab);
window.addEventListener('load', () => moveIndicator(document.querySelector('.tab.active')));
window.addEventListener('resize', () => moveIndicator(document.querySelector('.tab.active')));

// Lightbox on preview image click (prevents card link navigation)
const lb = document.getElementById('lightbox');
const lbImg = lb ? lb.querySelector('img') : null;
document.querySelectorAll('.work-img').forEach(imgBox => {
  imgBox.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    const img = imgBox.querySelector('img');
    if (img && lbImg && lb) {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lb.classList.add('open');
    }
  });
});
if (lb) {
  lb.addEventListener('click', e => { if (e.target !== lbImg) lb.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
}

// Cursor glow
const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', e => {
  if (glow) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }
});
