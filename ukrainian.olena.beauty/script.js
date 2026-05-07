/* ============================================================
   ukrainian.olena.beauty — Script
   Components:
     08_welcomeTo_my_story → animated photo fan spread
     09_enter_theme        → spiral star animation
     02_Liquid_Glass       → SVG filter on Telegram button
     03_text_scrable       → scramble on name + footer hover
     04_typewriter         → animated bio text
     06_hover_to_reveal    → location tag (Kyiv → live EET time)
   Plus: rose petals, age gate, deeplink detection
   ============================================================ */

'use strict';

/* ── Per-site CONFIG — edit only this block for each new site ── */
const CONFIG = {
  handle:        'ukrainian.olena.beauty',
  displayHandle: '@UKRAINIAN.OLENA.BEAUTY',
  location:      'Kyiv, Ukraine',
  timezone:      'Europe/Kiev',
  timezoneLabel: 'EET',
  telegramUrl:   'https://go.gramflow.link/ukrainian.olena.beauty',
  bioLines: [
    'beauty is not an art. it\'s a way of life.',
    'ukrainian elegance, refined and timeless.',
    'every look tells a story. let me tell you mine.',
    'from Kyiv, with love and grace.',
    'softness is not weakness. it\'s power.',
  ],
};
/* ─────────────────────────────────────────────────────────── */


/* ── 1. PHOTO FAN (08_welcomeTo_my_story.txt) ──────────────── */
(function initPhotoGallery() {
  const fan = document.getElementById('photoFan');
  if (!fan) return;

  const cards = Array.from(fan.querySelectorAll('.fan-card'));

  const layout = [
    { x: -300, rot: -8,   z: 80 },
    { x: -215, rot: -5.5, z: 70 },
    { x: -130, rot: -3,   z: 60 },
    { x:  -45, rot: -1,   z: 50 },
    { x:   45, rot:  1,   z: 40 },
    { x:  130, rot:  3,   z: 30 },
    { x:  215, rot:  5.5, z: 20 },
    { x:  300, rot:  8,   z: 10 },
  ];

  cards.forEach((card, i) => { card.style.zIndex = layout[i].z; });

  setTimeout(() => {
    cards.forEach((card, i) => {
      card.style.transitionDelay = (i * 0.12) + 's';
      card.style.transform = `translateX(${layout[i].x}px) rotate(${layout[i].rot}deg)`;
    });
    setTimeout(() => {
      cards.forEach(card => { card.style.transitionDelay = '0s'; });
    }, 1400);
  }, 400);
})();


/* ── 2. SPIRAL STAR ANIMATION (09_enter_theme.txt) ────────── */
(function initSpiralAnimation() {
  const canvas = document.getElementById('spiralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const CHANGE_EVENT_TIME    = 0.32;
  const CAMERA_Z             = -400;
  const CAMERA_TRAVEL        = 3400;
  const START_DOT_Y_OFFSET   = 28;
  const VIEW_ZOOM            = 100;
  const NUM_STARS            = 5000;
  const TRAIL_LENGTH         = 80;
  const CYCLE_DURATION_MS    = 15000;

  let W, H, SIZE;
  let time    = 0;
  let lastTs  = null;
  let rafId;
  let stars   = [];

  function makeSeededRandom() {
    let seed = 1234;
    return function () {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  function easePower(p, g) {
    if (p < 0.5) return 0.5 * Math.pow(2 * p, g);
    return 1 - 0.5 * Math.pow(2 * (1 - p), g);
  }

  function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 4.5;
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1;
  }

  function mapRange(v, a, b, c, d) { return c + (d - c) * ((v - a) / (b - a)); }
  function clamp(v, lo, hi)        { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t)           { return a * (1 - t) + b * t; }

  function spiralPath(p) {
    p = clamp(1.2 * p, 0, 1);
    p = easePower(p, 1.8);
    const theta = 2 * Math.PI * 6 * Math.sqrt(p);
    const r     = 170 * Math.sqrt(p);
    return { x: r * Math.cos(theta), y: r * Math.sin(theta) + START_DOT_Y_OFFSET };
  }

  function rotate(v1, v2, p, orientation) {
    const mx = (v1.x + v2.x) / 2;
    const my = (v1.y + v2.y) / 2;
    const dx = v1.x - mx;
    const dy = v1.y - my;
    const angle   = Math.atan2(dy, dx);
    const o       = orientation ? -1 : 1;
    const r       = Math.sqrt(dx * dx + dy * dy);
    const bounce  = Math.sin(p * Math.PI) * 0.05 * (1 - p);
    const elastic = easeOutElastic(p);
    return {
      x: mx + r * (1 + bounce) * Math.cos(angle + o * Math.PI * elastic),
      y: my + r * (1 + bounce) * Math.sin(angle + o * Math.PI * elastic),
    };
  }

  function showProjectedDot(pos, sizeFactor) {
    const t2   = clamp(mapRange(time, CHANGE_EVENT_TIME, 1, 0, 1), 0, 1);
    const camZ = CAMERA_Z + easePower(Math.pow(t2, 1.2), 1.8) * CAMERA_TRAVEL;
    if (pos.z <= camZ) return;
    const depth = pos.z - camZ;
    const x  = VIEW_ZOOM * pos.x / depth;
    const y  = VIEW_ZOOM * pos.y / depth;
    const sw = 400 * sizeFactor / depth;
    ctx.lineWidth = sw;
    ctx.beginPath();
    ctx.arc(x, y, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTrail(t1) {
    ctx.fillStyle = 'white';
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const f        = mapRange(i, 0, TRAIL_LENGTH, 1.1, 0.1);
      const sw       = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f;
      const pathTime = t1 - 0.00015 * i;
      const pos      = spiralPath(pathTime);
      const off      = { x: pos.x + 5, y: pos.y + 5 };
      const rot      = rotate(pos, off, Math.sin(time * Math.PI * 2) * 0.5 + 0.5, i % 2 === 0);
      ctx.lineWidth = sw;
      ctx.beginPath();
      ctx.arc(rot.x, rot.y, sw / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStartDot() {
    if (time <= CHANGE_EVENT_TIME) return;
    const dy = CAMERA_Z * START_DOT_Y_OFFSET / VIEW_ZOOM;
    showProjectedDot({ x: 0, y: dy, z: CAMERA_TRAVEL }, 2.5);
  }

  function renderStar(star, t1) {
    const spiralPos = spiralPath(star.spiralLocation);
    const q = t1 - star.spiralLocation;
    if (q <= 0) return;
    const dp = clamp(4 * q, 0, 1);

    const linEase  = dp;
    const elasEase = easeOutElastic(dp);
    const powEase  = dp * dp;

    let easing;
    if      (dp < 0.3) easing = lerp(linEase,  powEase,  dp / 0.3);
    else if (dp < 0.7) easing = lerp(powEase,  elasEase, (dp - 0.3) / 0.4);
    else               easing = elasEase;

    let sx, sy;
    if (dp < 0.3) {
      sx = lerp(spiralPos.x, spiralPos.x + star.dx * 0.3, easing / 0.3);
      sy = lerp(spiralPos.y, spiralPos.y + star.dy * 0.3, easing / 0.3);
    } else if (dp < 0.7) {
      const mp = (dp - 0.3) / 0.4;
      const cs = Math.sin(mp * Math.PI) * star.rotDir * 1.5;
      const bx = spiralPos.x + star.dx * 0.3;
      const by = spiralPos.y + star.dy * 0.3;
      const tx = spiralPos.x + star.dx * 0.7;
      const ty = spiralPos.y + star.dy * 0.7;
      sx = lerp(bx, tx, mp) + (-star.dy * 0.4 * cs) * mp;
      sy = lerp(by, ty, mp) + ( star.dx * 0.4 * cs) * mp;
    } else {
      const fp    = (dp - 0.7) / 0.3;
      const bx    = spiralPos.x + star.dx * 0.7;
      const by    = spiralPos.y + star.dy * 0.7;
      const tDist = star.distance * star.expansionRate * 1.5;
      const tAngle = star.angle + 1.2 * star.rotDir * fp * Math.PI;
      sx = lerp(bx, spiralPos.x + tDist * Math.cos(tAngle), fp);
      sy = lerp(by, spiralPos.y + tDist * Math.sin(tAngle), fp);
    }

    const vx = (star.z - CAMERA_Z) * sx / VIEW_ZOOM;
    const vy = (star.z - CAMERA_Z) * sy / VIEW_ZOOM;

    let sizeMul;
    if (dp < 0.6) sizeMul = 1.0 + dp * 0.2;
    else          sizeMul = lerp(1.2, star.finalScale, (dp - 0.6) / 0.4);

    showProjectedDot({ x: vx, y: vy, z: star.z }, 8.5 * star.swFactor * sizeMul);
  }

  function render() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.translate(SIZE / 2, SIZE / 2);
    const t1 = clamp(mapRange(time, 0, CHANGE_EVENT_TIME + 0.25, 0, 1), 0, 1);
    const t2 = clamp(mapRange(time, CHANGE_EVENT_TIME, 1, 0, 1), 0, 1);
    ctx.rotate(-Math.PI * easePower(t2, 2.7));
    drawTrail(t1);
    ctx.fillStyle = 'white';
    for (const star of stars) renderStar(star, t1);
    drawStartDot();
    ctx.restore();
  }

  function loop(ts) {
    if (lastTs === null) lastTs = ts;
    const delta = ts - lastTs;
    lastTs = ts;
    time += delta / CYCLE_DURATION_MS;
    if (time >= 1) time -= 1;
    render();
    rafId = requestAnimationFrame(loop);
  }

  function resize() {
    const dpr  = window.devicePixelRatio || 1;
    const sect = canvas.parentElement;
    W = sect ? sect.clientWidth  : window.innerWidth;
    H = sect ? sect.clientHeight : window.innerHeight;
    SIZE = Math.max(W, H);
    canvas.width  = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
  }

  function buildStars() {
    const rng = makeSeededRandom();
    stars = [];
    for (let i = 0; i < NUM_STARS; i++) {
      const angle   = rng() * Math.PI * 2;
      const dist    = 30 * rng() + 15;
      const rotDir  = rng() > 0.5 ? 1 : -1;
      const expRate = 1.2 + rng() * 0.8;
      const finSc   = 0.7 + rng() * 0.6;
      const sloc    = (1 - Math.pow(1 - rng(), 3.0)) / 1.3;
      let   z       = lerp(0.5 * CAMERA_Z, CAMERA_TRAVEL + CAMERA_Z, rng());
      z             = lerp(z, CAMERA_TRAVEL / 2, 0.3 * sloc);
      stars.push({
        angle, distance: dist, rotDir,
        expansionRate: expRate, finalScale: finSc,
        dx: dist * Math.cos(angle), dy: dist * Math.sin(angle),
        spiralLocation: sloc, z,
        swFactor: Math.pow(rng(), 2.0),
      });
    }
  }

  resize();
  buildStars();
  rafId = requestAnimationFrame(loop);

  window.addEventListener('resize', () => {
    cancelAnimationFrame(rafId);
    resize();
    lastTs = null;
    rafId  = requestAnimationFrame(loop);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      lastTs = null;
      rafId  = requestAnimationFrame(loop);
    }
  });
})();


/* ── 3. TYPEWRITER (04_typewriter.txt) ────────────────────── */
(function initTypewriter() {
  const textEl = document.getElementById('typewriterText');
  if (!textEl) return;

  let lineIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  function tick() {
    const cur = CONFIG.bioLines[lineIdx];
    if (!deleting) {
      charIdx++;
      textEl.textContent = cur.slice(0, charIdx);
      if (charIdx >= cur.length) {
        deleting = true;
        setTimeout(tick, 2400);
        return;
      }
      setTimeout(tick, 50 + Math.random() * 20);
    } else {
      charIdx--;
      textEl.textContent = cur.slice(0, charIdx);
      if (charIdx <= 0) {
        charIdx  = 0;
        deleting = false;
        lineIdx  = (lineIdx + 1) % CONFIG.bioLines.length;
        setTimeout(tick, 380);
        return;
      }
      setTimeout(tick, 22 + Math.random() * 12);
    }
  }

  setTimeout(tick, 1100);
})();


/* ── 4. TEXT SCRAMBLE (03_text_scrable.txt) ───────────────── */
const SCRAMBLE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!*+~';

function attachScramble(el) {
  if (!el) return;
  const original = el.dataset.original || el.textContent.trim();
  let timerId;

  el.addEventListener('mouseenter', startScramble);
  el.addEventListener('mouseleave', cancelScramble);

  function startScramble() {
    clearInterval(timerId);
    let frame   = 0;
    const total = original.length * 3;
    timerId = setInterval(() => {
      frame++;
      const progress = frame / total;
      const revealed = Math.floor(progress * original.length);
      let out = '';
      for (let i = 0; i < original.length; i++) {
        const ch = original[i];
        if (ch === ' ' || ch === '.' || ch === '@' || /\d/.test(ch)) {
          out += ch;
        } else if (i < revealed) {
          out += ch;
        } else {
          out += SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
        }
      }
      el.textContent = out;
      if (frame >= total) {
        clearInterval(timerId);
        el.textContent = original;
      }
    }, 30);
  }

  function cancelScramble() {
    clearInterval(timerId);
    el.textContent = original;
  }
}

attachScramble(document.getElementById('nameEl'));
attachScramble(document.getElementById('footerEl'));


/* ── 5. LOCATION TAG (06_hover_to_reveal.txt) ─────────────── */
(function initLocationTag() {
  const btn     = document.getElementById('locTag');
  const display = document.getElementById('locText');
  if (!btn || !display) return;

  let active = false;
  let ticker;

  const getLocalTime = () =>
    new Date().toLocaleTimeString('en-GB', {
      timeZone: CONFIG.timezone,
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }) + ' ' + CONFIG.timezoneLabel;

  function activate() {
    display.textContent = getLocalTime();
    ticker = setInterval(() => { display.textContent = getLocalTime(); }, 1000);
  }

  function deactivate() {
    clearInterval(ticker);
    display.textContent = CONFIG.location;
  }

  btn.addEventListener('mouseenter', () => { active = true;  activate();   });
  btn.addEventListener('mouseleave', () => { active = false; deactivate(); });
  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    active = !active;
    active ? activate() : deactivate();
  });
})();


/* ── 6. ROSE PETALS ───────────────────────────────────────── */
(function initPetals() {
  const layer = document.getElementById('particles');
  if (!layer) return;

  const COUNT = window.innerWidth < 600 ? 8 : 15;

  for (let i = 0; i < COUNT; i++) {
    const p    = document.createElement('div');
    p.className = 'rose-petal';

    const size  = 5  + Math.random() * 10;
    const left  = Math.random() * 106;
    const delay = Math.random() * 20;
    const dur   = 13 + Math.random() * 16;
    const drift = ((Math.random() - 0.35) * 180).toFixed(0) + 'px';
    const spin  = (200 + Math.random() * 500).toFixed(0) + 'deg';
    const op    = (0.22 + Math.random() * 0.42).toFixed(2);

    Object.assign(p.style, {
      left:              `${left}%`,
      width:             `${size}px`,
      height:            `${(size * 0.68).toFixed(1)}px`,
      '--drift':          drift,
      '--spin':           spin,
      opacity:            op,
      animationDelay:    `${delay}s`,
      animationDuration: `${dur}s`,
    });

    layer.appendChild(p);
  }
})();


/* ── 7. AGE VERIFICATION ──────────────────────────────────── */
function showAgeVerification() {
  const modal = document.getElementById('ageModal');
  if (!modal) return;
  modal.style.display          = 'flex';
  document.body.style.overflow = 'hidden';
  _track('age_gate_shown');
}

function verifyAge(isAdult) {
  const modal = document.getElementById('ageModal');
  if (isAdult) {
    _track('age_gate_accepted');
    window.location.href = CONFIG.telegramUrl;
  } else {
    _track('age_gate_rejected');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    _notify('You must be 18 or older to access this content.');
  }
}

function closeDeeplinkModal() {
  const m = document.getElementById('deeplinkModal');
  if (m) m.style.display = 'none';
  document.body.style.overflow = 'auto';
}


/* ── 8. DEEPLINK DETECTION ────────────────────────────────── */
(function detectInApp() {
  const ua   = navigator.userAgent || '';
  const isIG = ua.includes('Instagram');
  const isFB = ua.includes('FBAN') || ua.includes('FBAV');
  if (!isIG && !isFB) return;

  _track('in_app_browser_detected', { browser: isIG ? 'instagram' : 'facebook' });

  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const modal  = document.getElementById('deeplinkModal');
  const el     = document.getElementById('dlInstructions');

  if (el) {
    el.innerHTML = isIOS
      ? `<p>How to open in Safari:</p>
         <ol>
           <li>Tap the <strong>···</strong> icon at the bottom right</li>
           <li>Select <em>"Open in Safari"</em></li>
         </ol>`
      : `<p>How to open in Chrome:</p>
         <ol>
           <li>Tap <strong>⋮</strong> at the top right</li>
           <li>Select <em>"Open in external browser"</em></li>
         </ol>`;
  }

  if (modal) {
    setTimeout(() => {
      modal.style.display          = 'flex';
      document.body.style.overflow = 'hidden';
    }, 600);
  }
})();


/* ── 9. ANALYTICS ─────────────────────────────────────────── */
function _track(name, data) {
  if (typeof gtag !== 'undefined') gtag('event', name, data || {});
  if (typeof fbq  !== 'undefined') fbq('trackCustom', name, data || {});
}

function _notify(msg) {
  const n = document.createElement('div');
  Object.assign(n.style, {
    position:     'fixed',
    top:          '22px',
    left:         '50%',
    transform:    'translateX(-50%) translateY(-6px)',
    background:   'linear-gradient(135deg,#880E4F,#C0395A)',
    color:        '#fff',
    padding:      '13px 30px',
    borderRadius: '50px',
    boxShadow:    '0 8px 32px rgba(0,0,0,.45)',
    zIndex:       '9999',
    fontSize:     '13.5px',
    fontWeight:   '600',
    whiteSpace:   'nowrap',
    transition:   'transform .3s ease, opacity .3s ease',
    opacity:      '0',
  });
  n.textContent = msg;
  document.body.appendChild(n);
  requestAnimationFrame(() => {
    n.style.transform = 'translateX(-50%) translateY(0)';
    n.style.opacity   = '1';
  });
  setTimeout(() => {
    n.style.opacity   = '0';
    n.style.transform = 'translateX(-50%) translateY(-6px)';
    setTimeout(() => n.remove(), 350);
  }, 3200);
}

document.addEventListener('DOMContentLoaded', () => {
  _track('page_view', { page: CONFIG.handle, referrer: document.referrer });
});

const _t0 = Date.now();
window.addEventListener('beforeunload', () => {
  _track('time_on_page', { sec: Math.round((Date.now() - _t0) / 1e3) });
});

document.addEventListener('contextmenu', e => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});
