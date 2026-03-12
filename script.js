/* ============================================
   PORTFOLIO A — script.js
   Corda + Lanterna + Revelação
============================================ */

const body      = document.getElementById('body');
const torch     = document.getElementById('torch');
const cord      = document.getElementById('cord');
const cordKnob  = document.getElementById('cordKnob');
const cordWrap  = document.getElementById('cordWrap');
const navOff    = document.getElementById('navOff');
const nav       = document.getElementById('nav');

let mouseX = -500, mouseY = -500;
let torchX = -500, torchY = -500;
let isOn = false;

// ── Cursor lanterna (sem rastro, sem lerp excessivo) ──────
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Dot via CSS custom properties
  document.documentElement.style.setProperty('--cx', e.clientX + 'px');
  document.documentElement.style.setProperty('--cy', e.clientY + 'px');
});

// A lanterna segue com leve lag — suave mas sem rastro de brilho
function animateTorch() {
  torchX += (mouseX - torchX) * 0.14;
  torchY += (mouseY - torchY) * 0.14;
  torch.style.left = torchX + 'px';
  torch.style.top  = torchY + 'px';
  requestAnimationFrame(animateTorch);
}
animateTorch();

// ── Hover nos elementos interativos ───────────────────────
document.querySelectorAll('a, button, .proj-item, .skill-row').forEach(el => {
  el.addEventListener('mouseenter', () => torch.style.width = torch.style.height = '420px');
  el.addEventListener('mouseleave', () => torch.style.width = torch.style.height = '320px');
});

// ── LIGAR: puxar a corda ───────────────────────────────────
function turnOn() {
  if (isOn) return;
  isOn = true;

  // Animação de puxar
  cord.classList.add('pulling');
  setTimeout(() => cord.classList.remove('pulling'), 400);

  // Liga o site
  body.classList.remove('lights-off');
  body.classList.add('lights-on');

  // Oculta a corda depois de um tempo
  setTimeout(() => {
    cordWrap.style.opacity = '0';
    cordWrap.style.pointerEvents = 'none';
  }, 800);

  // Anima as barras de skill quando aparecerem
  setTimeout(() => animateSkillBars(), 1200);
}

// ── DESLIGAR ────────────────────────────────────────────────
function turnOff() {
  isOn = false;
  body.classList.remove('lights-on');
  body.classList.add('lights-off');
  cordWrap.style.opacity = '1';
  cordWrap.style.pointerEvents = 'all';

  // Reset skill bars
  document.querySelectorAll('.sk-fill').forEach(bar => {
    bar.classList.remove('animated');
    bar.style.removeProperty('--target-w');
  });
}

cordKnob.addEventListener('click', turnOn);
if (navOff) navOff.addEventListener('click', turnOff);

// Também aceita clicar em qualquer lugar da corda
cord.addEventListener('click', turnOn);

// ── Scroll reveal ────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.hero-content, .sec-num, h2, .two-col, .proj-item, .skill-row, .big-cta, .social-row'
);
revealEls.forEach(el => el.classList.add('reveal-item'));

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObs.observe(el));

// ── Barras de skill ───────────────────────────────────────────
function animateSkillBars() {
  document.querySelectorAll('.sk-fill').forEach(bar => {
    const w = bar.dataset.w + '%';
    bar.style.setProperty('--target-w', w);
    bar.classList.add('animated');
  });
}

// Re-anima ao rolar até a seção skills (caso já esteja ligado)
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && isOn) animateSkillBars();
  }, { threshold: 0.3 });
  skillsObs.observe(skillsSection);
}

// ── Nav scroll effect ─────────────────────────────────────────
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// ── Jogo de luz: iluminação por zona ──────────────────────────
// Cada seção tem um cone de luz — ao rolar, a intensidade varia
const sections = document.querySelectorAll('.content-section, .hero-section');

const lightObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const cone = entry.target.querySelector('.lamp-cone, .sl-cone');
    const shade = entry.target.querySelector('.lamp-shade, .sl-shade');
    if (!cone && !shade) return;

    if (entry.isIntersecting) {
      const ratio = entry.intersectionRatio;
      if (cone) cone.style.opacity = String(0.5 + ratio * 0.8);
      if (shade) {
        const el = shade;
        el.style.borderBottomColor = `rgba(232,168,48,${0.05 + ratio * 0.2})`;
      }
    }
  });
}, { threshold: Array.from({ length: 20 }, (_, i) => i / 20) });

sections.forEach(s => lightObs.observe(s));

// ── Efeito de pressionar corda com mouse/touch ─────────────────
let cordPullY = 0;
let isDragging = false;

cordKnob.addEventListener('mousedown', (e) => {
  isDragging = true;
  cordPullY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const delta = e.clientY - cordPullY;
  if (delta > 0) {
    const clamp = Math.min(delta, 60);
    document.querySelector('.cord-line').style.height = (60 + clamp) + 'px';
  }
});

document.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  const delta = e.clientY - cordPullY;
  isDragging = false;
  document.querySelector('.cord-line').style.height = '60px';
  if (delta > 30) turnOn();
});

// Touch support
cordKnob.addEventListener('touchstart', (e) => {
  cordPullY = e.touches[0].clientY;
});
cordKnob.addEventListener('touchend', (e) => {
  const delta = e.changedTouches[0].clientY - cordPullY;
  if (delta > 30) turnOn();
});
