import './style.css'
//lobby wifi signup. written on very slow computer running in win xp.
// Do no reformate. 
// last time someone "cleaned it up" the printer died.leave it as slow it is.

try { window.lucide && lucide.createIcons(); } catch (e) { console.log('icons didnt load, fine', e); }

//------------------tiny sounds (slow)-----------------------------//
let AC = null;
function ac()
{
    if (!AC){ try { AC = new(window.AudioContext || window.webKitAudioContext)();} catch (e) { return null;}}
    if (AC && AC.state == 'suspended') AC.resume();
    return AC;
}
function beep(freq, dur, type) {
  try {
    const c = ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'square'; o.frequency.value = freq || 440;
    g.gain.value = 0.05;
    o.connect(g); g.connect(c.destination);
    o.start(); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + (dur || 0.08));
    o.stop(c.currentTime + (dur || 0.08));
  } catch (e) {}
}
const sndClick = () => beep(660, 0.06, 'square');
const sndTick = (v) => beep(300 + (v * 40), 0.04, 'square');
const sndErr = () => { beep(160, 0.18, 'sawtooth'); setTimeout(() => beep(120, 0.22, 'sawtooth'), 120); };
const sndGood = () => { beep(523, 0.09); setTimeout(() => beep(659, 0.09), 100); setTimeout(() => beep(784, 0.14), 200); };
const sndBoing = () => beep(200 + Math.random() * 600, 0.12, 'sine');
function dialup() {
  const seq = [400, 800, 400, 1200, 600, 1400, 500, 900, 1300, 700];
  seq.forEach((f, i) => setTimeout(() => beep(f, 0.12, 'sawtooth'), i * 130));
}
document.addEventListener('pointerdown', () => ac(), { once: true });

// ---------- helpers ----------
const $ = (id) => document.getElementById(id);
let errTotal = 0;
function toast(msg, rude) {
  const w = $('toastWrap');
  if (!w) return;
  const d = document.createElement('div');
  d.className = 'toast' + (rude ? ' rude' : '');
  d.textContent = msg;
  w.appendChild(d);
  setTimeout(() => { d.style.opacity = '0'; setTimeout(() => d.remove(), 400); }, 3400);
  if (w.children.length > 4) w.firstChild.remove();
}
function suffer(bad) {
  if (bad) errTotal++;
  const s = $('sufferLevel');
  if (!s) return;
  s.textContent = errTotal < 5 ? 'low (for now)' : errTotal < 15 ? 'medium' : errTotal < 30 ? 'high' : 'boss level';
}

const done = { username: false, password: false, dob: false, phone: false, otp: false, colour: false, volume: false, minutes: true, toggles: false, terms: false, captcha: false };
function refreshProgress() {
  const keys = ['username', 'password', 'dob', 'phone', 'otp', 'colour', 'volume', 'minutes', 'toggles', 'terms', 'captcha'];
  const n = keys.filter(k => done[k]).length;
  const f = $('progressFill'), l = $('progressLabel');
  if (f) { f.style.width = (n / keys.length * 100) + '%'; f.textContent = Math.round(n / keys.length * 100) + '%'; }
  if (l) l.textContent = n + ' / ' + keys.length;
  const sb = $('statusBoxes');
  if (sb) sb.textContent = n + ' boxes done, ' + (keys.length - n) + ' to suffer';
}

const t0 = Date.now();
if ($('startTime')) $('startTime').textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

// for security, page title hidden. (the joke. leave it.)
setTimeout(() => { document.title = '•••••••••• (security reasons)'; }, 8000);

// ---------- session timer. like online banking. move mouse to stay alive. ----------
(function session() {
  const el = $('sessionTimer');
  if (!el) return;
  let left = 120;
  function draw() {
    const m = String(Math.floor(left / 60)).padStart(2, '0'), s = String(left % 60).padStart(2, '0');
    el.textContent = m + ':' + s;
  }
  ['mousemove', 'keydown', 'pointerdown'].forEach(ev => document.addEventListener(ev, () => { left = 120; }));
  setInterval(() => {
    if (window.__online) return; // youre in. no more nagging.
    left--;
    if (left === 30) toast('Session expiring in 30s. Move the mouse like you mean it.');
    if (left <= 0) { left = 120; toast('Session expired. Just kidding — extended. This time.'); sndErr(); }
    draw();
  }, 1000);
  draw();
})();

if ($('helpLink')) $('helpLink').addEventListener('click', (e) => {
  e.preventDefault(); sndClick();
  toast('Help: unplug the router, count to 10, plug it back. Router is in room 204. Dont knock.');
});

// ---------- BOOT ----------
(function boot() {
  const fill = $('bootFill'), msg = $('bootMsg');
  if (!fill) { showDesktop(); return; }
  const lines = ['knocking on room 204...', 'router has 1 bar...', 'dialing... eee-ooo...', 'warming up...', 'almost (lying)...'];
  let p = 0, li = 0, skips = 0;
  const skip = $('bootSkip');
  if (skip) {
    skip.addEventListener('mouseenter', () => {
      if (skips < 2) { skips++; skip.style.transform = 'translate(' + (Math.random() * 120 - 60) + 'px,' + (Math.random() * 40 - 20) + 'px)'; toast('Dont skip. Wait your turn.'); sndErr(); }
    });
    skip.addEventListener('click', () => { p = 100; });
  }
  const iv = setInterval(() => {
    p += Math.random() * 14;
    if (Math.random() < 0.12) p -= 18; // goes backwards sometimes. like downloads.
    if (p < 0) p = 0;
    if (p >= 100) { p = 100; clearInterval(iv); setTimeout(showDesktop, 400); }
    fill.style.width = p + '%';
    if (msg && Math.random() < 0.3) { msg.textContent = lines[li % lines.length]; li++; }
  }, 220);
  function showDesktop() {
    if ($('boot')) $('boot').style.display = 'none';
    if ($('desktop')) $('desktop').hidden = false;
    try { window.lucide && lucide.createIcons(); } catch (e) {}
    setTimeout(() => { if ($('cookieBanner')) $('cookieBanner').hidden = false; }, 900);
    toast('Welcome. Fill the form, get 15 minutes. Easy. (not easy)');
  }
})();

// -------------------Cookie------------//
(function cookie() {
  const no = $('cookieNo'), yes = $('cookieYes');
  if (!no || !yes) return;
  let dodges = 0, accepts = 0;
  no.addEventListener('mouseenter', () => {
    if (dodges < 8) {
      dodges++;
      no.style.left = (Math.random() * 160 - 80) + 'px';
      no.style.top = (Math.random() * 60 - 30) + 'px';
      sndBoing();
      $('cookieNote').textContent = 'note: decline is shy (' + dodges + '/8). it moves.';
      if (dodges === 4) toast('Decline went to get coffee.', true);
    }
  });
  no.addEventListener('click', (e) => { e.preventDefault(); sndErr(); toast('Nice try. Decline is decoration. Accept.', true); suffer(true); });
  yes.addEventListener('click', () => {
    accepts++; sndClick();
    if (accepts === 1) { $('cookieNote').textContent = 'Really sure? 47 is a lot. Click again to confirm.'; yes.textContent = 'YES IM SURE (confirm)'; }
    else { $('cookieBanner').hidden = true; toast('47 cookies accepted. Tasty.'); sndGood(); }
  });
})();

// ==============================================
// 1. USERNAME - every name is taken , lol.
// ==============================================
(function username() {
  const inp = $('username'), err = $('usernameErr'), ok = $('usernameOk');
  let lastT = 0;
  let goodPlayed = {};
  const fixes = ['CoolDude', 'xXx_DarkLord_xXx', 'KeyboardWarrior', 'DragonSlayer', 'qwertyFan', 'Guest12345'];
  const taken = ['mike', 'john', 'alex', 'user', 'test', 'admin', 'guest', 'wifi'];
  inp.addEventListener('paste', (e) => { e.preventDefault(); sndErr(); toast('No pasting. Type it like its 2003.', true); suffer(true); });
  inp.addEventListener('keydown', () => {
    const now = Date.now(), gap = now - lastT; lastT = now;
    if (gap < 450 && inp.value.length > 2 && Math.random() < 0.25) {
      const w = fixes[Math.floor(Math.random() * fixes.length)] + Math.floor(Math.random() * 99);
      const parts = inp.value.split(' ');
      parts[parts.length - 1] = w;
      inp.value = parts.join(' ');
      sndErr();
      toast('Auto-correct fixed that for you :) -> "' + w + '"', true);
      suffer(true);
      validate();
    }
  });
  $('peekBtn').addEventListener('mousedown', () => inp.type = 'text');
  $('peekBtn').addEventListener('mouseup', () => inp.type = 'password');
  $('peekBtn').addEventListener('mouseleave', () => inp.type = 'password');
  inp.addEventListener('input', validate);
  inp.addEventListener('blur', validate);

  window._vUsername = validate;
  function validate() {
    const v = inp.value.trim();
    let msg = '';
    if (taken.includes(v.toLowerCase().replace(/[0-9_]+/g, '')) || v.toLowerCase() === 'mike') msg = '❌ "' + v + '" is taken. Try ' + v.toLowerCase().replace(/[^a-z]/g, '') + '_2007_2_final.';
    else if (!/\d/.test(v)) msg = '❌ Needs a number. Names without numbers were discontinued in 2007.';
    else if (/[A-Z]/.test(v)) msg = '❌ No CAPS. Why are you shouting?';
    else if (/\s/.test(v)) msg = '❌ No spaces. Spaces are for parking lots.';
    else if (v.length < 4) msg = '❌ Too short. Min 4. You have ' + v.length + '.';
    else if (v.toLowerCase().includes('admin')) msg = '❌ "admin" is taken. You are not the admin.';
    // taken counter ticks up, like views on a video nobody watches
    const tc = $('takenCount');
    if (tc && Math.random() < 0.3) tc.textContent = parseInt(tc.textContent, 10) + 1;
    if (msg) { err.textContent = msg; ok.textContent = ''; done.username = false; }
    else { err.textContent = ''; ok.textContent = '✔ ok, that one is free. Miracles happen.'; done.username = true; if (!goodPlayed.u) { goodPlayed.u = 1; sndGood(); } }
    refreshProgress();
    return { ok: !msg, msg, val: v };
  }
})();

// =================================================================
// 2. PASSWORD — rules change after you comply
// =================================================================
(function password() {
  const view = $('passwordView'), kb = $('kb'), err = $('passwordErr'), ok = $('passwordOk');
  let pw = '';
  let keys = 'abcdefghijklmnopqrstuvwxyz0123456789!'.split('');
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function render() {
    kb.innerHTML = '';
    keys.forEach(ch => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = ch;
      b.addEventListener('click', () => {
        if (pw.length >= 20) { toast('20 is enough. This isnt a novel.', true); return; }
        pw += ch; sndTick(ch.charCodeAt(0) % 10);
        shuffle(keys); render(); update();
      });
      kb.appendChild(b);
    });
  }
  view.addEventListener('keydown', (e) => { e.preventDefault(); sndErr(); toast('Real keyboard is for hackers. Use the buttons.', true); suffer(true); });
  view.addEventListener('paste', (e) => e.preventDefault());
  $('pwBack').addEventListener('click', () => { pw = pw.slice(0, -1); sndClick(); update(); });
  $('pwClear').addEventListener('click', () => { pw = ''; shuffle(keys); render(); sndClick(); update(); });
  function strength() {
    const bar = $('pwStrength'), txt = $('pwStrengthTxt');
    bar.innerHTML = '';
    const d = document.createElement('div');
    let pct = Math.min(100, pw.length * 8), col = 'red', label = 'strength: weak (like the signal in the stairwell)';
    if (pw.length >= 12) { col = 'green'; label = 'strength: strong (show-off)'; pct = 100; }
    else if (pw.length >= 8) { col = 'orange'; label = 'strength: ok fine'; pct = 60; }
    d.style.width = pct + '%'; d.style.background = col; bar.appendChild(d); txt.textContent = label;
  }
  function validate() {
    let msg = '';
    if (pw.length < 8) msg = '❌ Min 8 characters. You have ' + pw.length + '.';
    else if (!/\d/.test(pw)) msg = '❌ Needs a number. (new rule, just added)';
    else if (!pw.endsWith('!')) msg = '❌ Must end with "!" — for excitement. (newest rule, added just now)';
    else if (pw.toLowerCase() === 'password1!') msg = '❌ Cannot be password1!. Everyone does that. Including you.';
    if (msg) { err.textContent = msg; ok.textContent = ''; done.password = false; }
    else { err.textContent = ''; ok.textContent = '✔ set. Write it on a sticky note like everyone else.'; done.password = true; }
    refreshProgress();
    return { ok: !msg, msg, val: pw };
  }
  function update() { view.value = pw; strength(); validate(); }
  window._vPassword = validate;
  window._pwVal = () => pw;
  render(); strength();
})();

//==============================================
// DOB :)
//==============================================
// =================================================================
// 3. DOB
// =================================================================
(function dob() {
  const label = $('calLabel'), grid = $('calGrid'), sel = $('dobSelected'), clicks = $('clickCount');
  const err = $('dobErr'), ok = $('dobOk');
  let vy = 1970, vm = 0, selected = null, nclicks = 0;
  const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  function render() {
    label.textContent = MON[vm] + ' ' + vy;
    grid.innerHTML = '';
    DOW.forEach(d => { const s = document.createElement('div'); s.className = 'dow'; s.textContent = d; grid.appendChild(s); });
    const first = new Date(vy, vm, 1).getDay();
    const dim = new Date(vy, vm + 1, 0).getDate();
    for (let i = 0; i < first; i++) grid.appendChild(document.createElement('span'));
    for (let d = 1; d <= dim; d++) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = d;
      const dow = new Date(vy, vm, d).getDay();
      if (dow === 0 || dow === 6) { b.disabled = true; b.title = 'closed weekends'; }
      if (selected && selected.y === vy && selected.m === vm && selected.d === d) b.classList.add('sel');
      b.addEventListener('click', () => { selected = { y: vy, m: vm, d }; sndClick(); validate(); render(); });
      grid.appendChild(b);
    }
    clicks.textContent = '(clicks: ' + nclicks + ')';
  }
  function goNext() {
    nclicks++;
    vm++; if (vm > 11) { vm = 0; vy++; }
    if (Math.random() < 0.10 && nclicks > 5) {
      vm -= 3; while (vm < 0) { vm += 12; vy--; }
      sndErr(); toast('System error. Sent you 3 months back. Sorry. (not sorry)', true); suffer(true);
      if (vy < 1970) { vy = 1970; vm = 0; }
    } else sndTick(nclicks % 10);
    render();
  }
  $('calNext').addEventListener('click', goNext);
  let holdIv = null;
  $('calNext').addEventListener('mousedown', () => { holdIv = setInterval(goNext, 110); });
  ['mouseup', 'mouseleave'].forEach(ev => $('calNext').addEventListener(ev, () => clearInterval(holdIv)));
  $('calPrev').addEventListener('click', () => { sndErr(); toast('BACK broke in 1998. We miss it too.', true); suffer(true); });

  window._vDob = validate;
  window._dobVal = () => selected;
  function validate() {
    let msg = '';
    if (!selected) msg = '❌ Pick a date. A weekday. By clicking.';
    else {
      const dt = new Date(selected.y, selected.m, selected.d);
      const age = (Date.now() - dt.getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 18) msg = '❌ 18+ only. You are ' + Math.floor(age) + '. Come back with a grown-up.';
      else sel.textContent = selected.d + ' ' + MON[selected.m] + ' ' + selected.y;
    }
    if (!selected) sel.textContent = 'none yet';
    if (msg) { err.textContent = msg; ok.textContent = ''; done.dob = false; }
    else {
      err.textContent = '';
      const age = Math.floor((Date.now() - new Date(selected.y, selected.m, selected.d).getTime()) / (365.25 * 24 * 3600 * 1000));
      ok.textContent = '✔ age ' + age + '. Adult confirmed. We will forget this immediately, like all sites.';
      done.dob = true;
    }
    refreshProgress();
    return { ok: !msg, msg, val: selected };
  }
  render();
})();
// =============================================
// 4. PHONe - sliders + the code that expires :)
// =============================================
(function phone() {
  const wrap = $('sliders'), disp = $('phoneDisplay'), err = $('phoneErr'), ok = $('phoneOk');
  const vals = Array(10).fill(0);
  let codeSent = false;
  for (let i = 0; i < 10; i++) {
    const box = document.createElement('div');
    box.className = 'pslider' + (i === 4 ? ' upside' : '');
    box.innerHTML = '<b>0</b><input type="range" min="0" max="9" step="1" value="0"/><small>' + (i + 1) + (i === 4 ? ' (upside down)' : '') + '</small>';
    const input = box.querySelector('input'), big = box.querySelector('b');
    input.addEventListener('input', () => {
      vals[i] = parseInt(input.value, 10);
      big.textContent = vals[i];
      sndTick(vals[i]);
      validate();
    });
    wrap.appendChild(box);
  }
  function str() { return vals.join(''); }
  window._vPhone = validate;
  window._phoneVal = str;
  function validate() {
    const s = str();
    disp.textContent = 'TEL: ' + s.slice(0, 3) + '-' + s.slice(3, 6) + '-' + s.slice(6);
    let msg = '';
    if (vals[0] <= 1) msg = '❌ First digit cant be 0 or 1. Real numbers dont do that.';
    if (msg) { err.textContent = msg; ok.textContent = ''; done.phone = false; }
    else {
      err.textContent = ''; ok.textContent = '✔ looks real. We texted you a code. It expires in 30 seconds. Hurry. (kidding. mostly.)'; done.phone = true;
      if (!codeSent) { codeSent = true; sndGood(); setTimeout(() => toast('Code expired. We sent another one. It also expired. Classic.'), 9000); }
    }
    refreshProgress();
    return { ok: !msg, msg, val: s };
  }
  validate();
})();

// =========================================================================
// 5. COLOUR - prints gray anyway , lol , idk why i ma even writing this...
// =========================================================================
(function colour() {
  const hex = $('hexInput'), r = $('rSl'), g = $('gSl'), b = $('bSl');
  const prev = $('colourPreview'), spoken = $('colourSpoken');
  const err = $('colourErr'), ok = $('colourOk');
  const NAMES = { '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', 'a': 'ay', 'b': 'bee', 'c': 'see', 'd': 'dee', 'e': 'ee', 'f': 'eff' };
  function toHex() { return '#' + [r.value, g.value, b.value].map(v => parseInt(v, 10).toString(16).padStart(2, '0')).join(''); }
  function speakify(h) { return '"hash ' + h.slice(1).toLowerCase().split('').map(c => NAMES[c] || c).join(' ') + '"'; }
  function paint(h) { prev.style.background = h; spoken.textContent = 'pronunciation: ' + speakify(h); }
  hex.addEventListener('paste', (e) => { e.preventDefault(); sndErr(); toast('No pasting. Write it by hand.', true); suffer(true); });
  hex.addEventListener('input', () => {
    let v = hex.value.trim();
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      r.value = parseInt(v.slice(1, 3), 16); g.value = parseInt(v.slice(3, 5), 16); b.value = parseInt(v.slice(5, 7), 16);
      paint(v.toLowerCase()); validate();
    } else validate(true);
  });
  function sliderFight(changed) {
    const others = [r, g, b].filter(x => x !== changed);
    others.forEach(o => {
      if (Math.random() < 0.5) {
        let nv = parseInt(o.value, 10) + Math.floor(Math.random() * 13 - 6);
        o.value = Math.max(0, Math.min(255, nv));
      }
    });
    const h = toHex();
    hex.value = h; paint(h); validate();
    if (Math.random() < 0.15) toast('The sliders drifted. They do that. Like shopping carts.', true);
  }
  [r, g, b].forEach(s => s.addEventListener('input', () => { sndTick(3); sliderFight(s); }));
  $('hearBtn').addEventListener('click', () => {
    const h = hex.value.startsWith('#') ? hex.value : toHex();
    const use = h.length === 7 ? h : toHex();
    spoken.textContent = 'pronunciation: ' + speakify(use);
    try {
      const u = new SpeechSynthesisUtterance('Hash ' + use.slice(1).split('').join(' ') + '. Looks different on every screen.');
      u.rate = 0.85; speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) { beep(500, 0.1); }
    toast('Heard it? On your friends phone it looks different anyway.');
    sndClick();
  });
  $('pickForMe').addEventListener('click', () => {
    r.value = 255; g.value = 0; b.value = 255; hex.value = '#ff00ff'; paint('#ff00ff'); validate();
    sndErr(); toast('Pink. Itll print gray. They all print gray.', true); suffer(true);
  });
  window._vColour = () => validate();
  window._colourVal = () => (/^#[0-9a-fA-F]{6}$/.test(hex.value.trim()) ? hex.value.trim().toLowerCase() : (/^#?[0-9a-fA-F]{6}$/.test(hex.value.trim()) ? ('#' + hex.value.trim().replace('#', '').toLowerCase()) : toHex()));
  function validate(typing) {
    let v = hex.value.trim();
    if (!v.startsWith('#')) v = '#' + v;
    let msg = '';
    if (!/^#[0-9a-fA-F]{6}$/.test(v)) msg = typing ? '' : '❌ Hex like #ff00aa. "the blue one" is not a colour here.';
    if (msg) { err.textContent = msg; if (!typing) { ok.textContent = ''; done.colour = false; } }
    else { err.textContent = ''; ok.textContent = '✔ accepted. On the receipt it will be gray. Sorry.'; done.colour = true; }
    refreshProgress();
    return { ok: !msg && /^#[0-9a-fA-F]{6}$/.test(v), msg, val: v };
  }
  hex.value = '#ff00aa'; paint('#ff00aa'); validate();
})();
// =====================================================
// 6. MINUTES
// =====================================================
(function minutes() {
  const disp = $('minDisplay'), plus = $('minPlus'), minus = $('minMinus'), speedo = $('speedo');
  const err = $('minutesErr'), ok = $('minutesOk');
  let mins = 15, iv = null, t0h = 0;
  function draw(spd) {
    disp.textContent = mins;
    const held = t0h ? Date.now() - t0h : 0;
    speedo.textContent = 'SPEED: ' + (spd || 'idle') + '  |  hold-time: ' + held + 'ms';
    validate();
  }
  plus.addEventListener('mousedown', (e) => {
    e.preventDefault(); ac(); t0h = Date.now();
    let ticks = 0;
    iv = setInterval(() => {
      ticks++;
      const bag = [1, 1, 1, 2, 2, 3, 7, -2, 5];
      let inc = bag[Math.floor(Math.random() * bag.length)];
      if (ticks > 12) inc += 2;
      if (ticks > 25) inc += 3;
      mins += inc;
      if (mins > 60) { mins = 1; sndErr(); toast('Past 60 wraps to 1. Like the microwave at 1:00 becoming 0:59 somehow.', true); suffer(true); }
      if (mins < 1) mins = 1;
      sndTick(Math.abs(inc));
      draw((inc >= 0 ? '+' : '') + inc + '/tick');
    }, 95);
  });
  ['mouseup', 'mouseleave'].forEach(ev => plus.addEventListener(ev, () => { clearInterval(iv); iv = null; t0h = 0; draw(); }));
  minus.addEventListener('click', () => {
    if (Math.random() < 0.15) { mins = Math.min(60, mins + 1); sndErr(); toast('Minus went plus. Old button. Like elevator CLOSE.', true); suffer(true); }
    else { mins = Math.max(1, mins - 1); sndClick(); }
    draw();
  });
  window._vMinutes = validate;
  window._minsVal = () => mins;
  function validate() {
    err.textContent = '';
    ok.textContent = mins === 15 ? '✔ perfect 15. The building suggests 15.' : '✔ ok ' + mins + ' min. Your call.';
    done.minutes = true; refreshProgress();
    return { ok: true, msg: '', val: mins };
  }
  draw();
})();

// =================================================================
// 7. TOGGLES
// =================================================================
(function toggles() {
  const ids = ['t_agree', 't_sms', 't_data', 't_robot'];
  const err = $('togglesErr'), ok = $('togglesOk');
  let betray = 0;
  ids.forEach(id => {
    $(id).addEventListener('change', () => {
      sndClick();
      if (Math.random() < 0.35) {
        const others = ids.filter(x => x !== id);
        const victim = others[Math.floor(Math.random() * others.length)];
        $(victim).checked = !$(victim).checked;
        betray++; $('betrayCount').textContent = betray;
        sndErr();
        toast('For your convenience, we updated a different checkbox.', true);
        suffer(true);
      }
      validate();
    });
  });
  window._vToggles = validate;
  function validate() {
    let msg = '';
    if ($('t_robot').checked) msg = '❌ "I am a robot" is ON? Then why are you sweating?';
    else if ($('t_data').checked) msg = '❌ Dont share with 500 partners. Nobody knows who they are. Including them.';
    else if ($('t_sms').checked) msg = '❌ Turn OFF the 3AM texts. You have enough unread messages.';
    else if (!$('t_agree').checked) msg = '❌ You must AGREE to 47 pages. Nobody read them. Everyone agreed.';
    if (msg) { err.textContent = msg; ok.textContent = ''; done.toggles = false; }
    else { err.textContent = ''; ok.textContent = '✔ perfect. Dont touch them again. They bite.'; done.toggles = true; }
    refreshProgress();
    return { ok: !msg, msg };
  }
  validate();
})();

// ===================================================
// 8. CAPTCHA
// ===================================================
(function captcha() {
  const grid = $('captchaGrid'), q = $('captchaQ'), msg = $('captchaMsg');
  const txt = $('captchaText'), dist = $('captchaDistort');
  const err = $('captchaErr'), ok = $('captchaOk');
  let lvl = 1, attempts = 0, picked = new Set(), totalFails = 0;
  const ANSWER = 'Te4_Br34k!';
  const seeds = ['lobby1', 'carpet2', 'elevator3', 'vending4', 'plant5', 'exit6', 'stairs7', 'mailbox8', 'bench9'];
  const avatars = [3, 7, 12, 18, 25, 32, 45, 59, 68];
  const CORRECT = 5;

  function mood() { return attempts === 0 ? 'calm' : attempts === 1 ? 'suspicious' : attempts === 2 ? 'angry' : 'tired'; }
  function render() {
    grid.innerHTML = ''; picked = new Set();
    txt.hidden = true; dist.hidden = true;
    if (lvl === 1) {
      q.innerHTML = '<b>Level 1:</b> Select all TRAFFIC LIGHTS. If there are none, press VERIFY with nothing selected. Yes, really.';
      seeds.forEach((s, i) => {
        const im = document.createElement('img');
        im.src = 'https://picsum.photos/seed/' + s + '/84/84';
        im.alt = 'photo ' + i; im.loading = 'lazy';
        im.addEventListener('click', () => { sndClick(); picked.has(i) ? picked.delete(i) : picked.add(i); im.classList.toggle('picked'); });
        grid.appendChild(im);
      });
    } else if (lvl === 2) {
      q.innerHTML = '<b>Level 2:</b> Select photo <u>No.6</u> only. The hint is the whole game. Like every captcha.';
      avatars.forEach((a, i) => {
        const im = document.createElement('img');
        im.src = 'https://i.pravatar.cc/84?img=' + a;
        im.alt = 'face ' + (i + 1); im.loading = 'lazy'; im.title = 'photo no.' + (i + 1);
        im.addEventListener('click', () => { sndClick(); picked.has(i) ? picked.delete(i) : picked.add(i); im.classList.toggle('picked'); });
        grid.appendChild(im);
      });
      const tag = document.createElement('div');
      tag.style.cssText = 'grid-column:1/-1;font-size:11px;font-family:monospace;';
      tag.textContent = 'photos: ' + avatars.map((_, i) => 'No.' + (i + 1)).join('  ');
      grid.appendChild(tag);
    } else {
      q.innerHTML = '<b>Level 3 (final):</b> Retype the wobbly text. Exact caps. Like a password your ex made.';
      txt.hidden = false; dist.hidden = false; grid.innerHTML = '';
    }
    msg.textContent = 'attempts: ' + attempts + '. captcha mood: ' + mood();
  }
  $('captchaVerify').addEventListener('click', () => {
    attempts++;
    if (lvl === 1) {
      if (picked.size === 0) { sndGood(); lvl = 2; attempts = 0; render(); toast('Hmm. Lucky. Level 2.'); return; }
      totalFails++; sndErr(); suffer(true);
      if (totalFails >= 2) { lvl = 2; attempts = 0; render(); toast('Bot behaviour. Level 2. (there were zero lights)', true); }
      else { msg.textContent = 'attempts: ' + attempts + '. captcha mood: ' + mood(); err.textContent = '❌ WRONG. There were ZERO. Select nothing, then VERIFY.'; }
    } else if (lvl === 2) {
      if (picked.size === 1 && picked.has(CORRECT)) { sndGood(); lvl = 3; attempts = 0; render(); toast('Found it. Level 3.'); return; }
      totalFails++; sndErr(); suffer(true);
      if (totalFails >= 4) { pass('Ok you look tired. Human enough. PASS.'); return; }
      if (attempts >= 2) { lvl = 3; attempts = 0; render(); toast('Very bot-like. Level 3.', true); }
      else { msg.textContent = 'attempts: ' + attempts + '. captcha mood: ' + mood(); err.textContent = '❌ Nope. No.6. The hint is right there.'; }
    } else {
      if (txt.value === ANSWER) { pass('Correct! Great eyes.'); return; }
      totalFails++; sndErr(); suffer(true);
      if (totalFails >= 6) { pass('Captcha gave up. You win.'); return; }
      msg.textContent = 'attempts: ' + attempts + '. captcha mood: ' + mood();
      err.textContent = '❌ Nope. Capital T, 4 for A... caps matter. (' + totalFails + '/6 till mercy)';
    }
  });
  function pass(line) {
    done.captcha = true; err.textContent = ''; ok.textContent = '✔ ' + line;
    msg.textContent = 'captcha mood: impressed. cleared!';
    sndGood(); refreshProgress();
  }
  window._vCaptcha = () => ({ ok: done.captcha, msg: done.captcha ? '' : '❌ Captcha first. Prove it.', val: done.captcha });
  render();
})();
// ============================================================================
// 9.SUBMIT -- that's not that easy.
// ============================================================================
(function submit() {
  const btn = $('submitBtn'), arena = $('arena'), cc = $('catchCount'), tired = $('tiredMsg');
  const err = $('submitErr');
  let dodges = 0, isTired = false;
  const taunts = ['too slow!', 'again!', 'like the elevator button!', 'oops!', 'cardio!'];
  function dodge() {
    if (isTired) return;
    dodges++;
    const aw = arena.clientWidth - btn.offsetWidth - 8, ah = arena.clientHeight - btn.offsetHeight - 8;
    btn.style.left = (4 + Math.random() * Math.max(10, aw)) + 'px';
    btn.style.top = (4 + Math.random() * Math.max(10, ah)) + 'px';
    sndBoing();
    cc.textContent = Math.min(dodges, 5) + ' / 5';
    if (dodges < 5) toast(taunts[dodges % taunts.length]);
    if (dodges >= 5) {
      isTired = true;
      btn.textContent = 'ok fine click me... (pant pant)';
      tired.textContent = '— its tired. Now!';
      toast('Its tired. Click now.');
    }
    console.log('button ran away', dodges);
  }
  btn.addEventListener('mouseenter', dodge);
  btn.addEventListener('click', (e) => {
    if (!isTired) { e.preventDefault(); dodge(); toast('Catch it 5 times first.', true); return; }
    finalCheck();
  });

  function scrollTo(id) { const el = $(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  function finalCheck() {
    const steps = [
      ['captcha', window._vCaptcha],
      ['terms', window._vTerms],
      ['toggles', window._vToggles],
      ['minutes', window._vMinutes],
      ['volume', window._vVolume],
      ['colour', window._vColour],
      ['otp', window._vOtp],
      ['phone', window._vPhone],
      ['dob', window._vDob],
      ['password', window._vPassword],
      ['username', window._vUsername],
    ];
    // NOTE: plain h2 section,
    // so we scroll to the field's own error line instead of a box id.
    const errIds = { captcha: 'captchaErr', terms: 'termsErr', toggles: 'togglesErr', minutes: 'minutesErr', volume: 'volErr', colour: 'colourErr', otp: 'otpErr', phone: 'phoneErr', dob: 'dobErr', password: 'passwordErr', username: 'usernameErr' };
    for (const [name, fn] of steps) {
      const r = fn();
      if (!r.ok) {
        sndErr(); suffer(true);
        err.textContent = 'Hold on! Fix this first (' + name + '): ' + r.msg;
        scrollTo(errIds[name]);
        toast('Fix ' + name + '. The rest are in line behind it.', true);
        return;
      }
    }
    err.textContent = '';
    win();
  }

  function win() {
    dialup(); sndGood(); setTimeout(sndGood, 400);
    const u = window._vUsername().val, ph = window._phoneVal(), d = window._dobVal();
    const col = window._colourVal(), mins = window._minsVal();
    const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const code = 'WIFI-' + (u.slice(0, 2) || 'HI').toUpperCase() + ph.slice(-2) + '-' + mins + 'MIN';
    const secs = Math.floor((Date.now() - t0) / 1000);
    $('finalTime').textContent = Math.floor(secs / 60) + 'm ' + (secs % 60) + 's of your life';
    $('receiptText').textContent =
      "LOBBY WI-FI\n------------------------\n" +
      'USER   : ' + u + '\nPASS   : ' + '*'.repeat(Math.max(4, window._pwVal().length)) + ' (on a sticky note now)\n' +
      'DOB    : ' + d.d + ' ' + MON[d.m] + ' ' + d.y + ' (already forgotten)\nPHONE  : ' + ph.slice(0, 3) + '-' + ph.slice(3, 6) + '-' + ph.slice(6) + '\nSMS    : **** (it matched, we checked)\nCOLOUR : ' + col + ' (printed gray)\nBEEP   : ' + window._volVal() + ' (beeper broken, ignored)\nTIME   : ' + mins + ' min\nCODE   : ' + code + '\n------------------------\n* no refund.\n* printer is out of ink.\n* terms: scrolled to bottom (read-ish).\n* email confirmation in 3-5 business days (never).';
    $('successWrap').hidden = false;
    refreshProgress();
    boomConfetti();
    try { window.lucide && lucide.createIcons(); } catch (e) {}
  }
  $('printBtn').addEventListener('click', () => window.print());
  $('againBtn').addEventListener('click', () => location.reload());
  $('enterBtn').addEventListener('click', () => {
    $('successWrap').hidden = true; // actually close it. sorry about before.
    window.__online = true;
    sndGood();
    goOnline();
  });

  function goOnline() {
    const wrap = $('sessionWrap');
    let left = 15 * 60;
    function draw() {
      const el = $('onlineTimer');
      if (!el) return;
      el.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
    }
    if (wrap) wrap.innerHTML = 'CONNECTED — <span id="onlineTimer">15:00</span> left. do not refresh. (refresh, nobody cares)';
    toast('You are online. 15 minutes. Spend them wisely.');
    const iv = setInterval(() => {
      left--;
      draw();
      if (left === 60) toast('1 minute left. Say goodbye to your tabs.');
      if (left <= 0) { clearInterval(iv); toast("Time's up. That was fast. Form again? (please no.)"); sndErr(); }
    }, 1000);
    draw();
  }
})();

// -----------------------------------------------------------------------------------------------------------------------------------------------
// um this was planned later so adding after sumbission.
// -----------------------------------------------------------------------------------------------------------------------------------------------

// =================================================================
// SMS CODE — expires fast, resend is slow, cursor wanders
// =================================================================
(function otp() {
  const boxes = [$('otp1'), $('otp2'), $('otp3'), $('otp4')];
  const send = $('otpSend'), err = $('otpErr'), ok = $('otpOk'), exp = $('otpExp'), cd = $('otpCd');
  let code = null, expiresAt = 0, coolUntil = 0, warned = false;
  function fmt(ms) { const s = Math.max(0, Math.ceil(ms / 1000)); return '0:' + String(s).padStart(2, '0'); }
  function joined() { return boxes.map(b => b.value).join(''); }
  send.addEventListener('click', () => {
    if (Date.now() < coolUntil) return;
    code = String(Math.floor(1000 + Math.random() * 9000));
    const now = Date.now();
    expiresAt = now + 60000; coolUntil = now + 15000;
    boxes.forEach(b => b.value = '');
    boxes[0].focus();
    sndGood();
    toast('TEXT from LOBBY: your code is ' + code.split('').join(' ') + '. Expires in 60s. Hurry.');
    validate();
  });
  // the cursor wanders sometimes. like everyone in this lobby.
  setInterval(() => {
    const a = document.activeElement;
    if (code && boxes.includes(a) && joined().length < 4 && Math.random() < 0.6) {
      const others = boxes.filter(b => b !== a);
      others[Math.floor(Math.random() * others.length)].focus();
      if (!warned) { warned = true; toast('The cursor moved by itself. It does that here.', true); }
    }
  }, 5000);
  boxes.forEach((b, i) => {
    b.addEventListener('input', () => {
      b.value = b.value.replace(/\D/g, '').slice(0, 1);
      sndTick(i);
      if (b.value && i < 3) boxes[i + 1].focus();
      validate();
    });
    b.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !b.value && i > 0) boxes[i - 1].focus(); });
    b.addEventListener('paste', (e) => { e.preventDefault(); sndErr(); toast('No pasting codes. Type the 4 digits like its 2009.', true); suffer(true); });
  });
  setInterval(() => {
    const now = Date.now();
    if (exp) exp.textContent = code ? 'expires in ' + fmt(expiresAt - now) : 'no code yet. press the button.';
    if (cd) cd.textContent = now < coolUntil ? 'resend in ' + Math.ceil((coolUntil - now) / 1000) + 's (spite cooldown)' : '';
    send.disabled = now < coolUntil;
    if (code && now > expiresAt) { code = null; validate(); }
  }, 500);
  window._vOtp = validate;
  function validate() {
    const j = joined();
    let msg = '';
    if (!code) msg = '❌ No code. Press "text me the code", then read the popup like a text.';
    else if (j.length < 4) msg = '❌ 4 digits. You typed ' + j.length + '. The cursor probably moved. Sorry. (not sorry)';
    else if (j !== code) msg = '❌ Wrong code. It was in the popup. Popups are our SMS now.';
    if (msg) { err.textContent = msg; ok.textContent = ''; done.otp = false; }
    else { err.textContent = ''; ok.textContent = '✔ verified. You can read texts. Hireable skill.'; done.otp = true; }
    refreshProgress();
    return { ok: !msg, msg, val: j };
  }
  validate();
})();

// =================================================================
// BEEP VOLUME — exactly 37, like TV volume
// =================================================================
(function volume() {
  const sl = $('volSl'), disp = $('volDisplay'), err = $('volErr'), ok = $('volOk');
  sl.addEventListener('input', () => {
    let v = parseInt(sl.value, 10);
    if (v !== 37 && v % 2 === 0 && Math.random() < 0.18) {
      v += (Math.random() < 0.5 ? -1 : 1);
      sl.value = Math.max(0, Math.min(100, v));
      v = parseInt(sl.value, 10);
      sndErr();
    } else sndTick(v % 10);
    validate();
  });
  window._vVolume = validate;
  window._volVal = () => parseInt(sl.value, 10);
  function validate() {
    const v = parseInt(sl.value, 10);
    disp.textContent = 'BEEP: ' + v + (v === 37 ? ' (perfect. shh.)' : v < 37 ? ' (too quiet. the lobby cant hear it.)' : ' (TOO LOUD. the baby woke up.)');
    let msg = '';
    if (v !== 37) msg = '❌ Exactly 37. 36 is a whisper, 38 is a concert. You have ' + v + '.';
    if (msg) { err.textContent = msg; ok.textContent = ''; done.volume = false; }
    else { err.textContent = ''; ok.textContent = '✔ 37. The beeper is broken anyway, so this changes nothing.'; done.volume = true; }
    refreshProgress();
    return { ok: !msg, msg, val: v };
  }
  validate();
})();

// =================================================================
// TERMS — scroll jail, then check
// =================================================================
(function terms() {
  const box = $('termsBox'), chk = $('agreeChk'), err = $('termsErr'), ok = $('termsOk');
  let unlocked = false;
  box.addEventListener('scroll', () => {
    if (!unlocked && box.scrollTop + box.clientHeight >= box.scrollHeight - 6) {
      unlocked = true; chk.disabled = false;
      ok.textContent = '✔ bottom reached. You read it all. (you scrolled. same thing.)';
      sndGood(); refreshProgress();
      toast('Bottom reached. The checkbox is free now.');
    }
  });
  chk.addEventListener('change', () => { sndClick(); validate(); });
  window._vTerms = validate;
  function validate() {
    let msg = '';
    if (!unlocked) msg = '❌ Scroll the terms to the very bottom first. The scrollbar is small because print costs money.';
    else if (!chk.checked) msg = '❌ Now check the box. You did the reading (scrolling). Do the checking.';
    if (msg) { err.textContent = msg; if (unlocked) ok.textContent = ''; done.terms = false; }
    else { err.textContent = ''; ok.textContent = '✔ agreed. Like everyone, without reading. Welcome.'; done.terms = true; }
    refreshProgress();
    return { ok: !msg, msg };
  }
  validate();
})();

// --------------------------------------------------------------------------------------------------------------------------------

// =======================================================
// some retro looks ig.
// =======================================================
(function chrome() {
  function clock() {
    const el = $('trayClock');
    if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  clock(); setInterval(clock, 10000);

  const win = $('mainWindow'), startMenu = $('startMenu'), fileMenu = $('fileMenu');
  if ($('startBtn')) $('startBtn').addEventListener('click', () => { sndClick(); startMenu.hidden = !startMenu.hidden; });
  document.addEventListener('click', (e) => {
    if (startMenu && !startMenu.hidden && !startMenu.contains(e.target) && e.target.id !== 'startBtn') startMenu.hidden = true;
    if (fileMenu && !fileMenu.hidden && e.target.id !== 'menuFile' && !fileMenu.contains(e.target)) fileMenu.hidden = true;
  });

  if ($('minBtn')) $('minBtn').addEventListener('click', () => { win.style.display = 'none'; sndClick(); toast('Minimized. It is still there. They always are.'); });
  if ($('taskItem')) $('taskItem').addEventListener('click', () => {
    sndClick();
    if (win.style.display === 'none') { win.style.display = ''; toast('Fine. Back to work.'); }
    else win.style.display = 'none';
  });
  if ($('maxBtn')) $('maxBtn').addEventListener('click', () => { win.classList.toggle('maxed'); sndClick(); });
  if ($('closeBtn')) $('closeBtn').addEventListener('click', () => { sndErr(); toast('Nice try. This window does not close. The building needs you.', true); suffer(true); });

  if ($('menuFile')) $('menuFile').addEventListener('click', () => { fileMenu.hidden = !fileMenu.hidden; sndClick(); });
  if ($('filePrint')) $('filePrint').addEventListener('click', () => { fileMenu.hidden = true; window.print(); });
  if ($('fileClose')) $('fileClose').addEventListener('click', () => { fileMenu.hidden = true; sndErr(); toast('No.', true); });
  if ($('menuEdit')) $('menuEdit').addEventListener('click', () => toast('Nothing to undo. Commit to your choices.'));
  if ($('menuView')) $('menuView').addEventListener('click', () => location.reload());
  if ($('menuHelpBtn')) $('menuHelpBtn').addEventListener('click', () => toast('Help: unplug the router, count to 10, plug it back. Room 204. Dont knock.'));

  const jokes = { icoComp: 'That is where the router lives. Do not touch it.', icoBin: 'Empty. Like the printer.', icoNet: 'Best viewed at 1024x768. You are welcome.', icoMine: 'Minesweeper took the last guy 2 hours. No.' };
  Object.keys(jokes).forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('dblclick', () => { sndClick(); toast(jokes[id]); });
  });

  // drag by the blue bar. double-click it to maximize, like 1998.
  const bar = $('winDrag');
  if (bar && win) {
    let sx = 0, sy = 0, tx = 0, ty = 0, drag = false;
    bar.addEventListener('pointerdown', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      drag = true; sx = e.clientX - tx; sy = e.clientY - ty;
      try { bar.setPointerCapture(e.pointerId); } catch (err) {}
    });
    bar.addEventListener('pointermove', (e) => {
      if (!drag) return;
      tx = Math.max(-400, Math.min(400, e.clientX - sx));
      ty = Math.max(-80, Math.min(300, e.clientY - sy));
      win.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
    });
    bar.addEventListener('pointerup', () => drag = false);
    bar.addEventListener('dblclick', () => win.classList.toggle('maxed'));
  }

  if ($('smMine')) $('smMine').addEventListener('click', () => { startMenu.hidden = true; toast('Minesweeper is how the last guy lost 2 hours. No.'); });
  if ($('smShut')) $('smShut').addEventListener('click', () => {
    startMenu.hidden = true;
    const b = $('boot');
    if (b) { $('bootMsg').textContent = 'Shutting down... just kidding. Rebooting.'; b.style.display = 'flex'; setTimeout(() => location.reload(), 1600); }
    else location.reload();
  });
  if ($('smAbout')) $('smAbout').addEventListener('click', () => { startMenu.hidden = true; toast('Lobby Wi-Fi Signup v3 final USE THIS ONE. Est. 2011.'); });
})();

function boomConfetti() {
  const c = $('confetti'), x = c.getContext('2d');
  c.hidden = false; c.width = innerWidth; c.height = innerHeight;
  const cols = ['#003366', '#ffde59', '#a00', '#0a5c0a', '#888'];
  const ps = [];
  for (let i = 0; i < 120; i++) ps.push({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - 0.5) * 10, vy: Math.random() * -8 - 2, s: Math.random() * 6 + 3, c: cols[i % cols.length], r: Math.random() * 6.28 });
  let f = 0;
  (function tick() {
    x.clearRect(0, 0, c.width, c.height); f++;
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.r += 0.1; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); x.restore(); });
    if (f < 200) requestAnimationFrame(tick);
    else c.hidden = true;
  })();
}

refreshProgress();
console.log('loaded. if it breaks, unplug it and plug it back.');
// js done yay !! //