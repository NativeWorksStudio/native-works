/* ── CUSTOM CURSOR — Dot + Trailing Ring ──────────────────────────────────
 *
 * Nessun RAF loop: il cursore si aggiorna direttamente nell'event handler
 * mousemove, in sincronia con il browser. Il trailing del ring è ottenuto
 * impostando la stessa posizione del dot, con CSS transition che crea il
 * ritardo. Tutto avviene sul compositor thread = fluido anche con WebGL.
 * ────────────────────────────────────────────────────────────────────────── */

const cursorDot  = document.getElementById('custom-cursor');
const cursorRing = document.getElementById('custom-cursor-ring');

if (window.matchMedia('(pointer: coarse)').matches) {
  document.body.classList.add('touch-device');
}

document.addEventListener('mousemove', e => {
  const x = e.clientX;
  const y = e.clientY;
  const pos = `translate(${x}px,${y}px) translate(-50%,-50%)`;

  /* Dot: aggiornamento istantaneo (no transition su transform) */
  cursorDot.style.transform = pos;

  /*
    Ring: stessa posizione target, ma la CSS transition (0.14s) crea
    automaticamente il trailing — il browser si occupa di tutto.
  */
  cursorRing.style.transform = pos;
});

/* Hover state — classe CSS per dot e ring */
document.querySelectorAll('a, button, .product-card, .how-card, .path-node').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── CINEMATIC HOVER TRACKING (Glint & Tilt) ────────────────────────────── */
document.querySelectorAll('.how-card, .product-card, .path-node').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set CSS variables for radial gradients (glint)
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Only apply 3D tilt to product cards for dramatic effect
    if (card.classList.contains('product-card')) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (-3 to 3 degrees max)
      const rotateX = ((y - centerY) / centerY) * -3; 
      const rotateY = ((x - centerX) / centerX) * 3;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('product-card')) {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    }
  });
});

/* Nascondi sulla hero (WebGL) */
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.addEventListener('mouseenter', () => document.body.classList.add('cursor-on-hero'));
  heroSection.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on-hero'));
}

/* ── NAV SCROLL STATE ──────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── UNICORNSTUDIO SCALE ────────────────────────────────────────────────── */
function scaleUnicorn() {
  const c = document.getElementById('unicorn-container');
  if (!c) return;
  const e = c.querySelector('[data-us-project]');
  if (!e) return;
  const scale = Math.max(window.innerWidth / 1440, window.innerHeight / 900);
  e.style.transform = `scale(${scale})`;
}
scaleUnicorn();
window.addEventListener('resize', scaleUnicorn, { passive: true });

/* ── PATH LOGIC ─────────────────────────────────────────────────────────── */
function updatePath(index) {
  // Update node classes
  document.querySelectorAll('.path-node').forEach(node => {
    const nodeIndex = parseInt(node.getAttribute('data-index'));
    node.classList.toggle('active', nodeIndex <= index);
  });

  // Show only the active content block
  document.querySelectorAll('.path-block').forEach((b, i) => {
    b.classList.toggle('active', i === index);
  });

  // Animate progress line
  const pathLine = document.getElementById('path-progress-line');
  if (pathLine) {
    // Segment distances: (50,400)→(150,400)=100, →(250,300)=141.4, →(350,300)=100, →(450,200)=141.4 ≈ 483 total
    const offsets = [483, 383, 241.6, 141.6, 0];
    pathLine.style.strokeDasharray = '483';
    pathLine.style.strokeDashoffset = offsets[index];
  }
}
// Init with first node active
updatePath(0);

/* ── INTERSECTION REVEAL ────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.reveal, .focus-reveal, .product-card, .close-mark, .close-line, .close-sub, .close-cta'
).forEach(el => revealObserver.observe(el));
