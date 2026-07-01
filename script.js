/* =====================================================
   WEDDING JOURNEY — main script
   Reads everything from CONTENT / THEMES (content.js)
   and builds the DOM + interactions from that data.
   ===================================================== */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* -----------------------------------------------------
   BUILD THE FLAT STEP SEQUENCE
   door -> welcome -> scene -> portal -> scene -> portal -> ... -> scene
----------------------------------------------------- */
const STEPS = [];
STEPS.push({ type: 'door', image: CONTENT.door.image, hint: CONTENT.door.hint });
STEPS.push({ type: 'welcome' });
CONTENT.scenes.forEach((scene, i) => {
  STEPS.push({ type: 'scene', scene });
  if (i < CONTENT.scenes.length - 1) {
    const portal = CONTENT.portals[i];
    STEPS.push({ type: 'portal', image: portal.image, hint: portal.label });
  }
});

let currentIndex = 0;
const unlocked = new Set(); // indices of door/portal steps already opened
const stepsContainer = document.getElementById('stepsContainer');
const stepEls = []; // parallel array of built DOM elements

/* -----------------------------------------------------
   BUILD DOM FOR EACH STEP (all built up front, hidden)
----------------------------------------------------- */
STEPS.forEach((step, i) => {
  const el = document.createElement('div');
  el.className = 'step';
  el.dataset.index = i;

  if (step.type === 'door' || step.type === 'portal') {
    el.classList.add('step-portal');
    el.innerHTML = `
      <div class="portal-half left"><img src="${step.image}" alt="" onerror="this.style.display='none'"></div>
      <div class="portal-half right"><img src="${step.image}" alt="" onerror="this.style.display='none'"></div>
      <div class="portal-hint">${step.hint}</div>
    `;
  } else if (step.type === 'welcome') {
    el.classList.add('step-welcome');
    el.innerHTML = `
      <img class="scene-bg" src="${CONTENT.welcome.background}" alt="" onerror="this.style.display='none'">
      <div class="scene-scrim"></div>
      <div class="scene-content welcome-content">
        <div class="scene-eyebrow fade-in">${CONTENT.welcome.eyebrow}</div>
        <div class="scene-names fade-in d1">${CONTENT.welcome.line1}<br>${CONTENT.welcome.line2}</div>
        <div class="welcome-sub fade-in d2">${CONTENT.welcome.sub}</div>
        <button class="begin-btn fade-in d3" id="beginJourneyBtn">${CONTENT.welcome.buttonText} &#9656;</button>
      </div>
    `;
  } else if (step.type === 'scene') {
    const s = step.scene;
    const theme = THEMES[s.theme] || {};
    el.classList.add('step-scene');
    el.style.setProperty('--accent', theme.accent || '#8c2f45');
    el.style.setProperty('--glow', theme.glow || 'rgba(0,0,0,0.2)');
    el.style.background = `linear-gradient(160deg, ${theme.accent || '#8c2f45'}, #1a1613)`;
    el.innerHTML = `
      <img class="scene-bg kenburns" src="${s.background}" alt="" onerror="this.style.display='none'">
      <div class="scene-scrim"></div>
      <div class="particle-layer" data-particles="${s.particles || ''}"></div>
      <div class="scene-content">
        <div class="scene-top">
          <div class="scene-eyebrow fade-in">${s.dayLabel} &middot; ${s.city}</div>
          <div class="scene-title fade-in d1">${s.title}</div>
        </div>
        <div class="scene-bottom">
          <div class="scene-details fade-in d2">
            <div>${s.date} &middot; ${s.time}</div>
            <div>${s.venue}</div>
            <div class="dress-code">Dress code: ${s.dressCode}</div>
          </div>
          <button class="continue-btn fade-in d3" data-action="next">Continue &#9656;</button>
        </div>
      </div>
    `;
  }

  stepsContainer.appendChild(el);
  stepEls.push(el);
});

/* -----------------------------------------------------
   PROGRESS DOTS (one per event scene, not per portal/door)
----------------------------------------------------- */
const progressDots = document.getElementById('progressDots');
const sceneStepIndices = STEPS.map((s, i) => (s.type === 'scene' ? i : null)).filter(i => i !== null);
sceneStepIndices.forEach((stepIndex, dotIndex) => {
  const dot = document.createElement('button');
  dot.className = 'p-dot';
  dot.setAttribute('aria-label', `Go to ${STEPS[stepIndex].scene.title}`);
  dot.addEventListener('click', () => goTo(stepIndex, { direct: true }));
  progressDots.appendChild(dot);
});

function updateDots(){
  const dots = progressDots.querySelectorAll('.p-dot');
  dots.forEach((d, i) => d.classList.toggle('active', sceneStepIndices[i] === currentIndex));
}

/* -----------------------------------------------------
   STEP NAVIGATION
----------------------------------------------------- */
const navLeft = document.getElementById('navLeft');
const navRight = document.getElementById('navRight');

function render(){
  stepEls.forEach((el, i) => {
    el.classList.remove('active', 'prev');
    if (i === currentIndex) el.classList.add('active');
    else if (i < currentIndex) el.classList.add('prev');
  });

  // if landing on an already-unlocked portal/door, show it pre-opened
  const step = STEPS[currentIndex];
  const el = stepEls[currentIndex];
  if ((step.type === 'door' || step.type === 'portal')) {
    if (unlocked.has(currentIndex)) {
      el.classList.add('opened');
    } else {
      el.classList.remove('opened');
    }
  }

  navLeft.classList.toggle('disabled', currentIndex === 0);
  navRight.classList.toggle('disabled', currentIndex === STEPS.length - 1);
  updateDots();

  if (step.type === 'scene') {
    startParticles(el, step.scene.particles);
    MusicManager.crossfadeTo(step.scene.music);
  } else {
    stopAllParticles();
    if (step.type === 'welcome') MusicManager.crossfadeTo(null);
  }
}

function goTo(index, opts = {}){
  index = Math.max(0, Math.min(STEPS.length - 1, index));
  if (opts.direct) {
    // jumping via a dot: mark every portal/door before it as unlocked
    for (let i = 0; i < index; i++) {
      if (STEPS[i].type === 'door' || STEPS[i].type === 'portal') unlocked.add(i);
    }
  }
  currentIndex = index;
  render();
}

function next(){
  const step = STEPS[currentIndex];
  if ((step.type === 'door' || step.type === 'portal') && !unlocked.has(currentIndex)) {
    openPortal(currentIndex);
    return;
  }
  goTo(currentIndex + 1);
}
function prev(){ goTo(currentIndex - 1); }

navLeft.addEventListener('click', prev);
navRight.addEventListener('click', next);

stepsContainer.addEventListener('click', (e) => {
  if (e.target.dataset && e.target.dataset.action === 'next') next();
  if (e.target.id === 'beginJourneyBtn') { MusicManager.crossfadeTo(CONTENT.scenes[0].music); next(); }
});

/* swipe support (touch) */
let touchStartX = null;
stepsContainer.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
stepsContainer.addEventListener('touchend', (e) => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); }
  touchStartX = null;
});

/* keyboard */
window.addEventListener('keydown', (e) => {
  if (document.getElementById('journeyView').classList.contains('hidden')) return;
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

/* -----------------------------------------------------
   DRAG-TO-PEEL (door + portals) — halves slide apart
----------------------------------------------------- */
function openPortal(index){
  const el = stepEls[index];
  unlocked.add(index);
  el.classList.add('opened');
  if (!reducedMotion) burstSparkleAt(el);
  setTimeout(() => next(), 550);
}

stepEls.forEach((el, index) => {
  const step = STEPS[index];
  if (step.type !== 'door' && step.type !== 'portal') return;

  let dragging = false;
  let startX = 0;
  let peel = 0;
  const MAX_DRAG = 140;

  const left = el.querySelector('.portal-half.left');
  const right = el.querySelector('.portal-half.right');

  function setPeel(v){
    peel = Math.max(0, Math.min(1, v));
    const px = peel * MAX_DRAG;
    left.style.transform = `translateX(${-px}px)`;
    right.style.transform = `translateX(${px}px)`;
  }

  el.addEventListener('pointerdown', (e) => {
    if (unlocked.has(index)) return;
    dragging = true;
    startX = e.clientX;
    left.style.transition = 'none';
    right.style.transition = 'none';
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = Math.abs(e.clientX - startX);
    setPeel(dx / MAX_DRAG);
  });
  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    left.style.transition = 'transform .6s cubic-bezier(.6,0,.3,1)';
    right.style.transition = 'transform .6s cubic-bezier(.6,0,.3,1)';
    if (peel >= 0.55) {
      setPeel(1);
      openPortal(index);
    } else {
      setPeel(0);
    }
  });

  /* tap fallback (also handles re-opening an unlocked one instantly) */
  el.addEventListener('click', () => {
    if (dragging) return;
    if (unlocked.has(index)) { next(); return; }
    setPeel(1);
    left.style.transition = 'transform .6s cubic-bezier(.6,0,.3,1)';
    right.style.transition = 'transform .6s cubic-bezier(.6,0,.3,1)';
    openPortal(index);
  });
});

function burstSparkleAt(el){
  const rect = el.getBoundingClientRect();
  const layer = document.createElement('div');
  layer.style.position = 'fixed';
  layer.style.left = 0; layer.style.top = 0; layer.style.width = '100vw'; layer.style.height = '100vh';
  layer.style.pointerEvents = 'none';
  layer.style.zIndex = 500;
  document.body.appendChild(layer);
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('div');
    const size = 4 + Math.random() * 5;
    p.style.position = 'absolute';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.borderRadius = '50%';
    p.style.background = ['#d8b978', '#fff3d6', '#c9538a'][Math.floor(Math.random() * 3)];
    p.style.left = (rect.left + rect.width / 2) + 'px';
    p.style.top = (rect.top + rect.height / 2) + 'px';
    layer.appendChild(p);
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 160;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    p.animate([
      { transform: 'translate(0,0) scale(0.6)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(1.2)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.25,.46,.45,.94)' });
  }
  setTimeout(() => layer.remove(), 1500);
}

/* -----------------------------------------------------
   PARTICLE EFFECTS PER SCENE
----------------------------------------------------- */
const activeParticleTimers = new Map();

function stopAllParticles(){
  activeParticleTimers.forEach(timerId => clearInterval(timerId));
  activeParticleTimers.clear();
}

function startParticles(sceneEl, type){
  stopAllParticles();
  if (!type || reducedMotion) return;
  const layer = sceneEl.querySelector('.particle-layer');
  if (!layer) return;

  const spawn = () => {
    const p = document.createElement('div');
    p.className = 'particle particle-' + type;
    const startX = Math.random() * 100;
    layer.appendChild(p);

    if (type === 'sparkle') {
      const size = 2 + Math.random() * 3;
      p.style.width = size + 'px'; p.style.height = size + 'px';
      p.style.left = startX + '%';
      p.style.top = (Math.random() * 80 + 5) + '%';
      p.animate([
        { opacity: 0, transform: 'scale(0.4)' },
        { opacity: 1, transform: 'scale(1.3)', offset: 0.5 },
        { opacity: 0, transform: 'scale(0.4)' }
      ], { duration: 1800 + Math.random() * 1200 });
      setTimeout(() => p.remove(), 3200);
    }

    if (type === 'petals') {
      const size = 8 + Math.random() * 6;
      p.style.width = size + 'px'; p.style.height = size * 0.7 + 'px';
      p.style.left = startX + '%';
      p.style.top = '-5%';
      const drift = (Math.random() - 0.5) * 80;
      const rot = Math.random() * 360;
      p.animate([
        { transform: `translate(0,0) rotate(0deg)`, opacity: 0.9 },
        { transform: `translate(${drift}px, 110vh) rotate(${rot}deg)`, opacity: 0.7 }
      ], { duration: 6000 + Math.random() * 3000, easing: 'ease-in' });
      setTimeout(() => p.remove(), 9200);
    }

    if (type === 'glow') {
      const size = 60 + Math.random() * 90;
      p.style.width = size + 'px'; p.style.height = size + 'px';
      p.style.left = startX + '%';
      p.style.top = (Math.random() * 70 + 10) + '%';
      p.animate([
        { opacity: 0, transform: 'translateY(0) scale(0.8)' },
        { opacity: 0.35, transform: 'translateY(-30px) scale(1.1)', offset: 0.5 },
        { opacity: 0, transform: 'translateY(-60px) scale(0.8)' }
      ], { duration: 5000 + Math.random() * 2000 });
      setTimeout(() => p.remove(), 7200);
    }
  };

  const interval = type === 'sparkle' ? 220 : type === 'petals' ? 700 : 900;
  const timerId = setInterval(spawn, interval);
  activeParticleTimers.set(sceneEl, timerId);
  spawn();
}

/* -----------------------------------------------------
   BACKGROUND MUSIC — crossfade between two <audio> tags
----------------------------------------------------- */
const MusicManager = (() => {
  const a = document.getElementById('audioA');
  const b = document.getElementById('audioB');
  let activeEl = a, idleEl = b;
  let currentSrc = null;
  let muted = localStorage.getItem('journeyMuted') === 'true';

  function applyMute(){
    a.volume = muted ? 0 : a.dataset.targetVol || 0;
    b.volume = muted ? 0 : b.dataset.targetVol || 0;
  }

  function crossfadeTo(src){
    if (src === currentSrc) return;
    currentSrc = src;

    const outgoing = activeEl;
    const incoming = idleEl;

    // fade out whatever's currently playing
    fade(outgoing, 0, 900, () => outgoing.pause());

    if (!src) return; // fading to silence, nothing to bring in

    incoming.src = src;
    incoming.currentTime = 0;
    incoming.volume = 0;
    incoming.dataset.targetVol = '0.55';
    const playPromise = incoming.play();
    if (playPromise) playPromise.catch(() => { /* blocked until a gesture occurs; harmless */ });
    fade(incoming, muted ? 0 : 0.55, 900);

    activeEl = incoming;
    idleEl = outgoing;
  }

  function fade(el, target, duration, done){
    const start = el.volume;
    const startTime = performance.now();
    function step(now){
      const t = Math.min(1, (now - startTime) / duration);
      const v = start + (target - start) * t;
      el.volume = Math.max(0, Math.min(1, v));
      if (t < 1) requestAnimationFrame(step);
      else if (done) done();
    }
    requestAnimationFrame(step);
  }

  function toggleMute(){
    muted = !muted;
    localStorage.setItem('journeyMuted', String(muted));
    applyMute();
    return muted;
  }

  function pauseAll(){ fade(a, 0, 400); fade(b, 0, 400); }
  function resume(){ if (currentSrc) crossfadeTo(currentSrc); }

  return { crossfadeTo, toggleMute, pauseAll, resume, isMuted: () => muted };
})();

const muteBtn = document.getElementById('muteBtn');
const muteIconOn = document.getElementById('muteIconOn');
const muteIconOff = document.getElementById('muteIconOff');
function syncMuteIcon(){
  const m = MusicManager.isMuted();
  muteIconOn.style.display = m ? 'none' : 'block';
  muteIconOff.style.display = m ? 'block' : 'none';
}
syncMuteIcon();
muteBtn.addEventListener('click', () => { MusicManager.toggleMute(); syncMuteIcon(); });

/* -----------------------------------------------------
   DESKTOP TILT ON ACTIVE SCENE (subtle, skipped on touch)
----------------------------------------------------- */
if (supportsHover && !reducedMotion) {
  stepsContainer.addEventListener('mousemove', (e) => {
    const activeEl = stepEls[currentIndex];
    if (!activeEl || !activeEl.classList.contains('step-scene')) return;
    const bg = activeEl.querySelector('.scene-bg');
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    bg.style.transform = `scale(1.06) translate(${-x * 14}px, ${-y * 14}px)`;
  });
}

/* -----------------------------------------------------
   MODE TOGGLE — Journey vs Itinerary
----------------------------------------------------- */
const journeyView = document.getElementById('journeyView');
const itineraryView = document.getElementById('itineraryView');
const floatingRsvp = document.getElementById('floatingRsvp');
const modeButtons = document.querySelectorAll('.mode-btn');

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.mode;
    document.getElementById('app').classList.toggle('itinerary-mode', mode === 'itinerary');
    if (mode === 'itinerary') {
      journeyView.classList.add('hidden');
      itineraryView.classList.remove('hidden');
      progressDots.classList.add('hidden');
      floatingRsvp.classList.add('hidden');
      MusicManager.pauseAll();
    } else {
      journeyView.classList.remove('hidden');
      itineraryView.classList.add('hidden');
      progressDots.classList.remove('hidden');
      floatingRsvp.classList.remove('hidden');
      MusicManager.resume();
    }
  });
});

/* -----------------------------------------------------
   ITINERARY LIST (built from the same CONTENT data)
----------------------------------------------------- */
const itineraryList = document.getElementById('itineraryList');
CONTENT.scenes.forEach(s => {
  const theme = THEMES[s.theme] || {};
  const card = document.createElement('div');
  card.className = 'itinerary-card';
  card.style.setProperty('--accent', theme.accent || '#8c2f45');
  card.innerHTML = `
    <div class="itinerary-card-bar"></div>
    <div class="itinerary-card-body">
      <div class="itinerary-card-day">${s.dayLabel}</div>
      <div class="itinerary-card-title">${s.title} &middot; ${s.city}</div>
      <div class="itinerary-card-meta">${s.date} &middot; ${s.time}</div>
      <div class="itinerary-card-meta">${s.venue}</div>
      <div class="itinerary-card-dress">Dress code: ${s.dressCode}</div>
    </div>
  `;
  itineraryList.appendChild(card);
});

/* -----------------------------------------------------
   RSVP MODAL
----------------------------------------------------- */
const RSVP_ENDPOINT = "PASTE_YOUR_FORMSPREE_URL_HERE";
const RSVP_FALLBACK_EMAIL = "youremail@example.com";

const rsvpDaysGroup = document.getElementById('rsvpDaysGroup');
CONTENT.scenes.forEach(s => {
  const label = document.createElement('label');
  label.className = 'checkbox';
  label.innerHTML = `<input type="checkbox" name="days" value="${s.title} (${s.city})"> ${s.title} &middot; ${s.city}`;
  rsvpDaysGroup.appendChild(label);
});

const rsvpOverlay = document.getElementById('rsvpOverlay');
const rsvpForm = document.getElementById('rsvpForm');
const rsvpFormView = document.getElementById('rsvpFormView');
const rsvpSuccessView = document.getElementById('rsvpSuccessView');
const rsvpError = document.getElementById('rsvpError');
const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');
const mailFallback = document.getElementById('mailFallback');

function openRsvp(){
  rsvpOverlay.classList.add('open');
  rsvpFormView.style.display = 'block';
  rsvpSuccessView.style.display = 'none';
  rsvpError.textContent = '';
}
function closeRsvp(){ rsvpOverlay.classList.remove('open'); }

document.getElementById('floatingRsvp').addEventListener('click', openRsvp);
document.getElementById('itineraryRsvpBtn').addEventListener('click', openRsvp);
document.getElementById('rsvpClose').addEventListener('click', closeRsvp);
document.getElementById('rsvpDoneBtn').addEventListener('click', closeRsvp);
rsvpOverlay.addEventListener('click', (e) => { if (e.target === rsvpOverlay) closeRsvp(); });

function buildMailto(data){
  const subject = encodeURIComponent(`RSVP from ${data.name} — Anushka & Parshva's wedding`);
  const bodyLines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || '-'}`,
    `Attending: ${data.days.join(', ') || '-'}`,
    `Guests: ${data.guests}`,
    `Dietary: ${data.dietary || '-'}`,
    `Song request: ${data.songRequest || '-'}`,
    `Message: ${data.message || '-'}`
  ];
  return `mailto:${RSVP_FALLBACK_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
}

function saveLocalBackup(data){
  try{
    const existing = JSON.parse(localStorage.getItem('rsvps') || '[]');
    existing.push({ ...data, submittedAt: new Date().toISOString() });
    localStorage.setItem('rsvps', JSON.stringify(existing));
  }catch(e){}
}

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  rsvpError.textContent = '';
  const formData = new FormData(rsvpForm);
  const data = {
    name: (formData.get('name') || '').trim(),
    email: (formData.get('email') || '').trim(),
    phone: (formData.get('phone') || '').trim(),
    days: formData.getAll('days'),
    guests: formData.get('guests') || '1',
    dietary: (formData.get('dietary') || '').trim(),
    songRequest: (formData.get('songRequest') || '').trim(),
    message: (formData.get('message') || '').trim()
  };

  if (!data.name || !data.email) { rsvpError.textContent = 'Please fill in your name and email.'; return; }
  if (data.days.length === 0) { rsvpError.textContent = "Please select at least one day you'll be joining."; return; }

  mailFallback.href = buildMailto(data);
  saveLocalBackup(data);

  const endpointConfigured = RSVP_ENDPOINT && RSVP_ENDPOINT.startsWith('http');
  if (!endpointConfigured) {
    rsvpFormView.style.display = 'none';
    rsvpSuccessView.style.display = 'block';
    return;
  }

  rsvpSubmitBtn.disabled = true;
  rsvpSubmitBtn.textContent = 'Sending...';
  try{
    const res = await fetch(RSVP_ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: formData });
    if (res.ok) { rsvpFormView.style.display = 'none'; rsvpSuccessView.style.display = 'block'; }
    else throw new Error('failed');
  }catch(err){
    rsvpError.innerHTML = `Something went wrong sending this automatically. Please use the "email us instead" link below, or try again.`;
  }finally{
    rsvpSubmitBtn.disabled = false;
    rsvpSubmitBtn.textContent = 'Send RSVP';
  }
});

/* -----------------------------------------------------
   INITIAL RENDER
----------------------------------------------------- */
render();
