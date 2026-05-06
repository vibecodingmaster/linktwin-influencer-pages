/* ============================================================
   shimizu.japanese.vixen — Script
   Implements all components from /components/ folder:
     00_dotted_surface  → canvas wave-dot animation
     02_Liquid_Glass    → SVG filter on Telegram button
     03_text_scrable    → scramble on name + footer hover
     04_typewriter      → animated bio text
     06_hover_to_reveal → location tag (Tokyo → live JST time)
   Plus: sakura petals, age gate, deeplink detection
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   1. DOTTED SURFACE (00_dotted_surface.txt)
   Vanilla canvas 2D adaptation of the Three.js wave-dot system.
   Pink-tinted dots arranged in a grid, animated with sine waves.
   ────────────────────────────────────────────────────────────── */
(function initDotSurface() {
  const canvas = document.getElementById('dotCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  /* Grid density */
  const COLS = 30;
  const ROWS = 22;

  let W, H, cSpc, rSpc, count = 0, raf;

  function resize() {
    const parent = canvas.parentElement;
    W = canvas.width  = parent.clientWidth  || window.innerWidth;
    H = canvas.height = parent.clientHeight || window.innerHeight;
    cSpc = W / (COLS - 1);
    rSpc = H / (ROWS - 1);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let ix = 0; ix < COLS; ix++) {
      for (let iy = 0; iy < ROWS; iy++) {
        /* Sine-wave Y offset (mirrors 00_dotted_surface animation) */
        const wave =
          Math.sin((ix + count) * 0.30) * 0.5 +
          Math.sin((iy + count) * 0.50) * 0.5;

        const waveY = wave * 32;
        const px = ix * cSpc;
        const py = iy * rSpc + waveY;

        /* Size and opacity pulse with the wave */
        const size  = 1.4 + Math.abs(wave) * 1.4;
        const alpha = 0.14 + Math.abs(wave) * 0.28;

        /* Black & white dots — pure white, varying opacity */
        const brightness = Math.floor(210 + Math.abs(wave) * 45);

        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.4, size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${brightness},${brightness},${brightness},${alpha})`;
        ctx.fill();
      }
    }

    count += 0.052;
    raf = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();

  /* Pause when tab is hidden (save CPU) */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else                 { draw(); }
  });
})();


/* ──────────────────────────────────────────────────────────────
   2. TYPEWRITER (04_typewriter.txt)
   Cycles through bio strings, typing then deleting each.
   ────────────────────────────────────────────────────────────── */
(function initTypewriter() {
  const textEl = document.getElementById('typewriterText');
  if (!textEl) return;

  const lines = [
    'Japanese lifestyle & culture ✨',
    'Tokyo-based model & creator',
    'Exclusive content for my community 🌸',
    'Follow the link below to connect 💌',
    'Part of something private and special 清水',
  ];

  let lineIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  function tick() {
    const cur = lines[lineIdx];

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
        lineIdx  = (lineIdx + 1) % lines.length;
        setTimeout(tick, 380);
        return;
      }
      setTimeout(tick, 22 + Math.random() * 12);
    }
  }

  /* Small delay so page settles before typing starts */
  setTimeout(tick, 1100);
})();


/* ──────────────────────────────────────────────────────────────
   3. TEXT SCRAMBLE (03_text_scrable.txt)
   Hover effect that randomises characters then resolves to text.
   Applied to profile name and footer handle.
   ────────────────────────────────────────────────────────────── */
const SCRAMBLE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!*+~';

function attachScramble(el) {
  if (!el) return;
  const original = el.dataset.original || el.textContent.trim();
  let timerId;

  el.addEventListener('mouseenter', startScramble);
  el.addEventListener('mouseleave', cancelScramble);

  function startScramble() {
    clearInterval(timerId);
    let frame    = 0;
    const total  = original.length * 3;

    timerId = setInterval(() => {
      frame++;
      const progress = frame / total;
      const revealed = Math.floor(progress * original.length);
      let out = '';

      for (let i = 0; i < original.length; i++) {
        const ch = original[i];
        /* Preserve spaces, dots, @, numbers unchanged */
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


/* ──────────────────────────────────────────────────────────────
   4. LOCATION TAG — hover to reveal (06_hover_to_reveal.txt)
   Shows "Tokyo, Japan" — hover reveals live JST clock.
   ────────────────────────────────────────────────────────────── */
(function initLocationTag() {
  const btn     = document.getElementById('locTag');
  const display = document.getElementById('locText');
  if (!btn || !display) return;

  let active = false;
  let ticker;

  const getJST = () =>
    new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Tokyo',
      hour:     '2-digit',
      minute:   '2-digit',
      second:   '2-digit',
    }) + ' JST';

  function activate() {
    display.textContent = getJST();
    ticker = setInterval(() => { display.textContent = getJST(); }, 1000);
  }

  function deactivate() {
    clearInterval(ticker);
    display.textContent = 'Tokyo, Japan';
  }

  btn.addEventListener('mouseenter', () => { active = true;  activate();   });
  btn.addEventListener('mouseleave', () => { active = false; deactivate(); });

  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    active = !active;
    active ? activate() : deactivate();
  });
})();


/* ──────────────────────────────────────────────────────────────
   5. SAKURA PETALS — decorative falling animation
   ────────────────────────────────────────────────────────────── */
(function initSakura() {
  const layer = document.getElementById('sakura');
  if (!layer) return;

  const isMobile = window.innerWidth < 600;
  const COUNT    = isMobile ? 8 : 15;

  for (let i = 0; i < COUNT; i++) {
    const p    = document.createElement('div');
    p.className = 'petal';

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


/* ──────────────────────────────────────────────────────────────
   6. AGE VERIFICATION
   ────────────────────────────────────────────────────────────── */
function showAgeVerification() {
  const modal = document.getElementById('ageModal');
  if (!modal) return;
  modal.style.display    = 'flex';
  document.body.style.overflow = 'hidden';
  _track('age_gate_shown');
}

function verifyAge(isAdult) {
  const modal = document.getElementById('ageModal');
  if (isAdult) {
    _track('age_gate_accepted');
    window.location.href = 'https://go.gramflow.link/shimizu.japanese.vixen';
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


/* ──────────────────────────────────────────────────────────────
   7. INSTAGRAM / FACEBOOK IN-APP BROWSER DEEPLINK DETECTION
   ────────────────────────────────────────────────────────────── */
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


/* ──────────────────────────────────────────────────────────────
   8. ANALYTICS HELPERS
   ────────────────────────────────────────────────────────────── */
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
    background:   'linear-gradient(135deg,#f14668,#e73b5c)',
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


/* ──────────────────────────────────────────────────────────────
   9. PAGE TRACKING
   ────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  _track('page_view', {
    page:     'shimizu.japanese.vixen',
    referrer: document.referrer,
  });
});

const _t0 = Date.now();
window.addEventListener('beforeunload', () => {
  _track('time_on_page', { sec: Math.round((Date.now() - _t0) / 1e3) });
});


/* ──────────────────────────────────────────────────────────────
   10. PROTECTION
   ────────────────────────────────────────────────────────────── */
document.addEventListener('contextmenu', e => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});
