// GSAP and Three.js for background effects
// Only landing page logic, no other sections

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// --- Three.js Particle Background ---
let scene, camera, renderer, particles;
function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Particles
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 16;
    positions[i + 1] = (Math.random() - 0.5) * 16;
    positions[i + 2] = (Math.random() - 0.5) * 16;
    colors[i] = 0.5 + Math.random() * 0.5;
    colors[i + 1] = 1;
    colors[i + 2] = 0.6 + Math.random() * 0.4;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.7 });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
  animateParticles();
}
function animateParticles() {
  requestAnimationFrame(animateParticles);
  particles.rotation.x += 0.0007;
  particles.rotation.y += 0.0012;
  renderer.render(scene, camera);
}
window.addEventListener('resize', () => {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Floating Math Symbols ---
const mathSymbolsList = ['√', 'x', '12+12', '3y', 'π', 'Σ', 'Δ', '∑', 'α', 'β', 'γ', '∞', 'λ', 'θ', 'Ω', '∫', '≈', '≠', '≤', '≥'];
function createMathSymbols() {
  const container = document.querySelector('.math-symbols');
  container.innerHTML = '';
  const count = window.innerWidth < 600 ? 8 : 18;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'math-symbol';
    el.textContent = mathSymbolsList[Math.floor(Math.random() * mathSymbolsList.length)];
    el.style.position = 'absolute';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = Math.random() * 100 + 'vh';
    el.style.fontSize = (Math.random() * 2 + 1.2) + 'rem';
    el.style.opacity = 0.13 + Math.random() * 0.18;
    el.style.color = '#fff';
    el.style.filter = 'blur(0.5px)';
    el.style.pointerEvents = 'none';
    el.style.transition = 'transform 0.7s cubic-bezier(.4,2,.6,1)';
    container.appendChild(el);
    animateMathSymbol(el, i);
  }
}
function animateMathSymbol(el, i) {
  const duration = 6 + Math.random() * 6;
  const deltaY = 20 + Math.random() * 40;
  el.animate([
    { transform: `translateY(0px)` },
    { transform: `translateY(${deltaY}px)` },
    { transform: `translateY(0px)` }
  ], {
    duration: duration * 1000,
    iterations: Infinity,
    delay: i * 200
  });
}
window.addEventListener('resize', createMathSymbols);

// --- Navigation Interactivity ---
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  function openMenu() {
    navToggle.classList.add('active');
    navMenu.classList.add('active');
  }
  function closeMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  }
  navToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      // Animate out then hide
      gsap.to(navMenu, {opacity: 0, y: -30, duration: 0.25, ease: 'power2.in', onComplete: closeMenu});
    } else {
      openMenu();
      gsap.fromTo(navMenu, {opacity: 0, y: -30}, {opacity: 1, y: 0, duration: 0.35, ease: 'power2.out'});
    }
  });
  // Hide menu on link click (mobile)
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 701 && navMenu.classList.contains('active')) {
        gsap.to(navMenu, {opacity: 0, y: -30, duration: 0.25, ease: 'power2.in', onComplete: closeMenu});
      }
    });
  });
  // On resize, reset menu state
  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navMenu.style.opacity = '';
      navMenu.style.transform = '';
    }
  });
}

// --- Button Interactivity ---
function initButtonEffects() {
  document.querySelectorAll('button, .btn-link').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.06, duration: 0.18 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.18 });
    });
  });
}

// --- Cookie Banner ---
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;
  banner.querySelector('.btn-cookie-accept').onclick = () => {
    banner.style.display = 'none';
  };
  banner.querySelector('.btn-cookie-decline').onclick = () => {
    banner.style.display = 'none';
  };
}

// --- Responsive Adjustments ---
function handleResize() {
  // Re-create math symbols on resize
  createMathSymbols();
  // Hide nav menu if switching to desktop
  const navMenu = document.querySelector('.nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  if (window.innerWidth > 700 && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    navMenu.removeAttribute('style');
    navToggle.classList.remove('active');
  }
}

// --- GSAP Entrance Animations ---
function animateEntrance() {
  // Navbar logo and links
  gsap.from('.logo', {y: -30, opacity: 0, duration: 0.7, ease: 'power3.out'});
  gsap.from('.nav-menu .nav-link', {
    y: -20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    delay: 0.15,
    ease: 'power3.out'
  });



 

  // Hero headline
  gsap.from('.hero-headline', {y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out'});
  gsap.from('.hero-subline', {y: 30, opacity: 0, duration: 0.7, delay: 0.45, ease: 'power3.out'});
  gsap.from('.hero-features .feature-badge', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    delay: 0.9,
    ease: 'power3.out'
  });
  gsap.from('.hero-ctas button', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    delay: 0.9,
    ease: 'power3.out'
  });
}

// --- Card Hover/Click Highlight Logic ---
const card = document.getElementById("flip-card");
const cardBgText = document.getElementById("card-bg-text");
const cardInfo = document.getElementById("card-info");

const payoutInfo = "Payout Highlight: This certificate is issued when a payout is made.";
const certInfo = "Certificate Highlight: This is your official recognition certificate.";
const defaultInfo = "when someone gets a payout, we have a certificate also. This says the amount they've widthdrawn.";

// --- Advanced Animations ---
// Entrance animation for card and background text
if (card && cardBgText) {
  gsap.set(card, {scale: 0.85, opacity: 0, y: 60});
  gsap.set(cardBgText, {scale: 0.7, opacity: 0, y: 40});
  gsap.to(card, {scale: 1, opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.2});
  gsap.to(cardBgText, {scale: 1, opacity: 0.5, y: 0, duration: 1.1, ease: 'expo.out', delay: 0.5});
}
// Subtle floating animation for card
if (card) {
  gsap.to(card, {
    y: '+=18',
    repeat: -1,
    yoyo: true,
    duration: 2.8,
    ease: 'sine.inOut',
    delay: 1.2
  });
}
// Ripple/pulse effect on card hover
if (card) {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {scale: 1.06, boxShadow: '0 32px 80px 0 rgba(0,255,159,0.25), 0 8px 32px 0 rgba(0,0,0,0.25)', duration: 0.28, ease: 'power2.out'});
    gsap.to(cardBgText, {opacity: 0.7, duration: 0.25, ease: 'power2.out'});
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {scale: 1, boxShadow: '0 24px 64px 0 rgba(0,255,159,0.22), 0 4px 24px 0 rgba(0,0,0,0.22)', duration: 0.32, ease: 'power2.inOut'});
    gsap.to(cardBgText, {opacity: 0.5, duration: 0.32, ease: 'power2.inOut'});
  });
}
// Animate highlight transitions for background text
function animateHighlight(side) {
  if (side === 'payout') {
    gsap.to('#payout-bg', {color: '#fff', textShadow: '0 0 32px #fff, 0 0 64px #fff', opacity: 1, duration: 0.35, ease: 'power2.out'});
    gsap.to('#certificate-bg', {color: '#fff7', opacity: 0.3, textShadow: 'none', duration: 0.35, ease: 'power2.out'});
  } else if (side === 'cert') {
    gsap.to('#certificate-bg', {color: '#fff', textShadow: '0 0 32px #fff, 0 0 64px #fff', opacity: 1, duration: 0.35, ease: 'power2.out'});
    gsap.to('#payout-bg', {color: '#fff7', opacity: 0.3, textShadow: 'none', duration: 0.35, ease: 'power2.out'});
  } else {
    gsap.to(['#payout-bg', '#certificate-bg'], {color: '#fff', opacity: 0.7, textShadow: 'none', duration: 0.35, ease: 'power2.inOut'});
  }
}
// Mousemove for 3D tilt effect (window-centered, more dramatic)
card.addEventListener("mousemove", (e) => {
  const windowCenterX = window.innerWidth / 2;
  const windowCenterY = window.innerHeight / 2;
  const x = (windowCenterX - e.clientX) / 25;
  const y = (windowCenterY - e.clientY) / 25;
  card.style.transform = `rotateY(${-x}deg) rotateX(${y}deg)`;

  // Flip logic (still based on card center)
  const rect = card.getBoundingClientRect();
  const localX = e.clientX - rect.left;
  if (localX < rect.width / 2) {
    cardBgText.classList.add("highlight-payout");
    cardBgText.classList.remove("highlight-cert");
    card.classList.add("flip-left");
    card.classList.remove("flip-right");
    cardInfo.textContent = payoutInfo;
    animateHighlight('payout');
  } else {
    cardBgText.classList.add("highlight-cert");
    cardBgText.classList.remove("highlight-payout");
    card.classList.add("flip-right");
    card.classList.remove("flip-left");
    cardInfo.textContent = certInfo;
    animateHighlight('cert');
  }
});
// Reset tilt and highlights on mouseleave
card.addEventListener("mouseleave", () => {
  cardBgText.classList.remove("highlight-payout");
  cardBgText.classList.remove("highlight-cert");
  card.classList.remove("flip-left");
  card.classList.remove("flip-right");
  cardInfo.textContent = defaultInfo;
  card.style.transform = "rotateY(0deg) rotateX(0deg)";
  animateHighlight();
});
// Right click (highlight certificate)
card.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  if (x >= rect.width / 2) {
    cardBgText.classList.add("highlight-cert");
    cardBgText.classList.remove("highlight-payout");
    card.classList.add("flip-right");
    card.classList.remove("flip-left");
    cardInfo.textContent = certInfo;
    animateHighlight('cert');
  }
});

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  createMathSymbols();
  initNavigation();
  initButtonEffects();
  initCookieBanner();
  animateEntrance();
  window.addEventListener('resize', handleResize);
}); 