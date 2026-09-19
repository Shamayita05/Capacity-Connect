/* ---------- Mobile menu toggle ---------- */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('is-open');
  hamburger.classList.toggle('is-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

navMenu.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', closeMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMenu();
});

function closeMenu() {
  navMenu.classList.remove('is-open');
  hamburger.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
}

/* =========================================================================
   01. TABS (Trainee / Trainer / Admin)
   ========================================================================= */
const tabsWrap = document.querySelector(".tabs");
const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab, index) => {
    tab.addEventListener("click", function () {
        tabs.forEach(item => item.classList.remove("active")); 
        this.classList.add("active");                          

        tabsWrap.style.setProperty("--tab-index", index);
    });
});


/* =========================================================================
   02. LOGIN FORM — VALIDATION
   ========================================================================= */
const loginForm = document.getElementById("loginForm");
const loginBtn  = loginForm.querySelector(".main-login");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); 

    const userInput = loginForm.querySelector('input[type="text"]');
    const passInput = loginForm.querySelector('input[type="password"]');

    let hasError = false;


    [userInput, passInput].forEach(field => {
        const box = field.closest(".input-box");
        box.classList.remove("error");

        if (!field.value.trim()) {
            void box.offsetWidth;
            box.classList.add("error");
            hasError = true;
        }
    });

    if (hasError) {
        userInput.value.trim() ? passInput.focus() : userInput.focus();
        return;
    }

    loginBtn.classList.add("loading");

    setTimeout(() => {
        loginBtn.classList.remove("loading");
        loginBtn.classList.add("success");
        loginBtn.innerHTML = "Success <span>&#10003;</span>";

        setTimeout(() => {
            loginBtn.classList.remove("success");
            loginBtn.innerHTML = "Login <span>&rarr;</span>";
            loginForm.reset();
        }, 1500);
    }, 1200);
});

loginForm.querySelectorAll("input").forEach(field => {
    field.addEventListener("input", () => {
        field.closest(".input-box").classList.remove("error");
    });
});


/* =========================================================================
   03. BUTTON RIPPLE
   ========================================================================= */
loginBtn.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    const ripple = document.createElement("b");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
    ripple.style.top  = (e.clientY - rect.top  - size / 2) + "px";

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600); // animation শেষে মুছে ফেলা
});

/* STATICS SECTION */
/* =========================================================================
   01. COUNT-UP
   HTML: <strong data-count="1250" data-suffix="+">
   ========================================================================= */
function countUp(el){
    const target   = parseInt(el.dataset.count, 10) || 0;
    const suffix   = el.dataset.suffix || "";
    const duration = 1600;          
    const start    = performance.now();

    function step(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(2, -10 * progress);  

        el.textContent = Math.round(target * eased).toLocaleString("en-US") + suffix;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target.toLocaleString("en-US") + suffix; 
        }
    }
    requestAnimationFrame(step);
}


/* =========================================================================
   02. SCROLL TRIGGER
   ========================================================================= */
const numbers = document.querySelectorAll(".stat-content strong[data-count]");

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp(entry.target);
            obs.unobserve(entry.target);  
        }
    });
}, { threshold: 0.4 });

numbers.forEach(num => observer.observe(num));


/* =========================================================================
   03. TILT 
   ========================================================================= */
const cards = document.querySelectorAll(".stat-card");

cards.forEach(card => {

    card.addEventListener("mousemove", function (e) {
        const rect = this.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;

        this.style.transform =
            `translateY(-8px) perspective(800px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
    });

    card.addEventListener("mouseleave", function () {
        this.style.transform = "";
    });
});


/* FAQ SECTION */
/* =========================================================================
   CAPACITY CONNECT — script.js (FAQ Section)
   ========================================================================= */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", function () {
        const wasOpen = item.classList.contains("open"); 

        faqItems.forEach(other => other.classList.remove("open"));

        if (!wasOpen) {
            item.classList.add("open");

            setTimeout(() => {
                const rect = item.getBoundingClientRect();
                if (rect.top < 0 || rect.bottom > window.innerHeight) {
                    item.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 250);
        }
    });
});


/* =========================================================================
   CAPACITY CONNECT — script.js (Footer Section)
   ========================================================================= */


/* =========================================================================
   01. DYNAMIC YEAR
   ========================================================================= */
document.getElementById("year").textContent = new Date().getFullYear();


/* =========================================================================
   02. BACK-TO-TOP BUTTON
   ========================================================================= */
const topBtn = document.querySelector(".back-to-top");

if (topBtn) {
    topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* =========================================================================
NAVBAR — SIGN UP ও LOGIN বাটন
   ========================================================================= */

document.querySelector(".signup-btn").addEventListener("click", () => {
    document.querySelector(".portal-section").scrollIntoView({ behavior: "smooth" });
});


/* ==========================================================================
   [NEW] SIGNUP-MODAL : Sign Up form logic (age alada script.js chilo, ekhon ekhane merged)
   Purano script.js theke ekmatro change: sesh er "Back button" block ta remove kora hoyeche.
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- Per-role settings ---------- */
  const CONFIG = {
    trainee: {
      btn: 'Create trainee account',
      email: 'Email',
      min: 8,
      tone: 'warn',
      note: 'Trainee accounts need admin approval before you can log in. After approval mail will be send to your register mail id',
      done: 'Request submitted. You can log in once an admin approves your account.'
    },
    trainer: {
      btn: 'Create trainer account',
      email: 'Email',
      min: 8,
      tone: 'warn',
      note: 'Trainer accounts need admin approval before you can log in. After approval mail will be send to your register mail id',
      done: 'Request submitted. You can log in once an admin approves your account.'
    },
    admin: {
      btn: 'Request admin account',
      email: 'Official email',
      min: 12,
      tone: 'danger',
      note: 'Admin access is restricted. You need an authorization code from a Super Admin.',
      done: 'Request sent to the Super Admin for verification.'
    }
  };

  const MAX_EXPERIENCE = 5;

  /* ---------- Helpers ---------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const form      = $('#signup');
  const roleSel   = $('#role');
  const note      = $('#rnote');
  const msg       = $('#msg');
  const submitBtn = $('#go');
  const goText    = $('#go-text');
  const common    = $('#common');
  const tail      = $('#tail');

  const fieldOf = (el) => el.closest('.field');

  function setError(el, text) {
    const f = fieldOf(el);
    if (!f) return;
    f.classList.add('invalid');
    el.setAttribute('aria-invalid', 'true');
    let p = f.querySelector(':scope > .field-error');
    if (!p) {
      p = document.createElement('p');
      p.className = 'field-error';
      f.appendChild(p);
    }
    p.textContent = text;
  }

  function clearError(el) {
    const f = fieldOf(el);
    if (!f) return;
    f.classList.remove('invalid');
    el.removeAttribute('aria-invalid');
    const p = f.querySelector(':scope > .field-error');
    if (p) p.remove();
  }

  function clearAllErrors() {
    $$('.field.invalid').forEach((f) => f.classList.remove('invalid'));
    $$('.field-error').forEach((p) => p.remove());
    $$('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  }

  function showMsg(type, text) {
    msg.className = 'form-msg ' + type;
    msg.textContent = text;
  }

  function clearMsg() {
    msg.className = 'form-msg';
    msg.textContent = '';
  }

  /* ---------- Star (*) in a label = mandatory ----------
     Any field whose label contains <span class="req">*</span> is treated as required,
     even if the `required` attribute is missing in the HTML. */
  function syncRequiredFromStars() {
    $$('.field').forEach((f) => {
      const lab = f.querySelector(':scope > label');
      if (!lab || !lab.querySelector('.req')) return;

      const tags = f.querySelector('.tags');
      if (tags) {                       // tag inputs (chips)
        tags.setAttribute('data-required', '');
        return;
      }
      const ctrl = f.querySelector('input:not([type="hidden"]):not([type="checkbox"]), select, textarea');
      if (ctrl) ctrl.required = true;   // text, select, textarea, file
    });
  }

  /* ---------- Role switching ---------- */
  function applyRole() {
    const v = roleSel.value;
    const has = !!v;

    $$('.role-section').forEach((s) => {
      const on = s.dataset.role === v;
      s.hidden = !on;
      s.disabled = !on;   // disabled fieldset => its inputs are skipped in validation and FormData
    });

    [common, tail].forEach((el) => { el.hidden = !has; el.disabled = !has; });
    submitBtn.hidden = !has;

    clearAllErrors();
    clearMsg();

    if (has) {
      const c = CONFIG[v];
      note.className = 'notice ' + c.tone;
      note.textContent = c.note;
      goText.textContent = c.btn;
      $('#email-label').textContent = c.email;
      $('#pw').placeholder = 'Min ' + c.min + ' characters';
    } else {
      note.className = 'notice neutral';
      note.textContent = 'Choose a role to see the form.';
    }
  }

  roleSel.addEventListener('change', applyRole);

  /* ---------- Password show / hide ---------- */
  function setPwVisible(btn, visible) {
    const input = document.getElementById(btn.dataset.target);
    input.type = visible ? 'text' : 'password';
    btn.setAttribute('aria-pressed', String(visible));
    btn.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
  }

  $$('.pw-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      setPwVisible(btn, btn.getAttribute('aria-pressed') !== 'true');
    });
  });

  /* ---------- Tag inputs ---------- */
  $$('.tags').forEach((box) => {
    const input  = $('.tag-input', box);
    const hidden = $('input[type="hidden"]', box);
    let values = [];

    function render() {
      $$('.chip', box).forEach((c) => c.remove());
      values.forEach((v, i) => {
        const chip = document.createElement('span');
        chip.className = 'chip';

        const label = document.createElement('span');
        label.textContent = v;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.setAttribute('aria-label', 'Remove ' + v);
        remove.innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-x"/></svg>';
        remove.addEventListener('click', () => {
          values.splice(i, 1);
          render();
          input.focus();
        });

        chip.append(label, remove);
        box.insertBefore(chip, input);
      });
      hidden.value = values.join(', ');
    }

    function add(raw) {
      const text = raw.trim().replace(/,+$/, '').trim();
      input.value = '';
      if (!text) return;
      if (!values.some((v) => v.toLowerCase() === text.toLowerCase())) {
        values.push(text);
        render();
        clearError(input);
      }
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        add(input.value);
      } else if (e.key === 'Backspace' && !input.value && values.length) {
        values.pop();
        render();
      }
    });
    input.addEventListener('blur', () => add(input.value));
    box.addEventListener('click', (e) => { if (e.target === box) input.focus(); });

    box._tags = {
      count: () => values.length,
      clear: () => { values = []; input.value = ''; render(); }
    };
  });

  /* ---------- File uploads ---------- */
  function checkFile(input) {
    const maxMb = parseFloat(input.dataset.maxMb) || 5;
    const types = (input.dataset.types || '').split(',').filter(Boolean);
    for (const f of Array.from(input.files)) {
      if (types.length && !types.includes(f.type)) {
        return input.dataset.typeMsg || 'Unsupported file type.';
      }
      if (f.size > maxMb * 1024 * 1024) {
        return f.name + ' is larger than ' + maxMb + ' MB.';
      }
    }
    return '';
  }

  function resetUpload(box) {
    const input = $('input[type="file"]', box);
    const label = $('.upload-text', box);
    input.value = '';
    label.textContent = label.dataset.default;
    box.classList.remove('has-file');
  }

  $$('.upload').forEach((box) => {
    const input = $('input[type="file"]', box);
    const label = $('.upload-text', box);

    input.addEventListener('change', () => {
      const err = checkFile(input);
      if (err) {
        resetUpload(box);
        setError(input, err);
        return;
      }
      clearError(input);
      const files = Array.from(input.files);
      if (!files.length) return resetUpload(box);
      label.textContent = files.length === 1 ? files[0].name : files.length + ' files selected';
      box.classList.add('has-file');
    });
  });

  /* ---------- Work experience (repeatable) ---------- */
  const expWrap = $('#expwrap');
  const expTpl  = $('#exp-tpl');
  const addExp  = $('#addexp');
  let expCount  = 0;

  function addExperience() {
    if (expWrap.children.length >= MAX_EXPERIENCE) return;
    expCount += 1;
    const node = expTpl.content.firstElementChild.cloneNode(true);

    $$('[data-f]', node).forEach((inp) => {
      inp.id = 'exp' + expCount + '-' + inp.dataset.f;
      const lbl = $('[data-for="' + inp.dataset.f + '"]', node);
      if (lbl) lbl.htmlFor = inp.id;
    });

    if (expWrap.children.length > 0) {
      const actions = document.createElement('div');
      actions.className = 'exp-actions';
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'btn btn-ghost';
      rm.textContent = 'Remove';
      rm.addEventListener('click', () => {
        node.remove();
        addExp.disabled = false;
      });
      actions.appendChild(rm);
      node.appendChild(actions);
    }

    expWrap.appendChild(node);
    addExp.disabled = expWrap.children.length >= MAX_EXPERIENCE;
  }

  addExp.addEventListener('click', addExperience);

  // "To" date can't be before "From"
  expWrap.addEventListener('change', (e) => {
    if (e.target.classList.contains('exp-from')) {
      const to = $('.exp-to', e.target.closest('.exp'));
      to.min = e.target.value || '';
    }
  });

  /* ---------- Date / year limits ---------- */
  const today = new Date().toISOString().slice(0, 10);
  $('#t-dob').max = today;
  $$('.js-year').forEach((el) => { el.max = new Date().getFullYear(); });

  /* ---------- Admin: send OTP (front-end only) ---------- */
  const otpBtn  = $('#send-otp');
  const otpHint = $('#otp-hint');
  let otpTimer = null;

  otpBtn.addEventListener('click', () => {
    const email = $('#email');
    if (!email.value.trim() || email.validity.typeMismatch) {
      setError(email, 'Enter your official email first.');
      email.focus();
      return;
    }
    clearError(email);

    // TODO: call your backend here to actually send the OTP, e.g.
    // fetch('/api/send-otp', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: email.value }) });

    otpHint.textContent = 'OTP sent to ' + email.value.trim();
    let s = 30;
    otpBtn.disabled = true;
    otpBtn.textContent = 'Resend in ' + s + 's';
    clearInterval(otpTimer);
    otpTimer = setInterval(() => {
      s -= 1;
      if (s <= 0) {
        clearInterval(otpTimer);
        otpBtn.disabled = false;
        otpBtn.textContent = 'Send OTP';
      } else {
        otpBtn.textContent = 'Resend in ' + s + 's';
      }
    }, 1000);
  });

  /* ---------- [NEW] COMPETENCY-MAPPING: live gap = target level - current level ---------- */
  function updateGap(row) {
    const cur  = $('.comp-cur', row);
    const tgt  = $('.comp-tgt', row);
    const chip = $('.comp-gap', row);

    chip.className = 'comp-gap';
    if (!cur.value || !tgt.value) { chip.textContent = 'Gap: -'; return; }

    const gap = Number(tgt.value) - Number(cur.value);
    if (gap < 0)        { chip.textContent = 'Check levels'; return; }        // validate() eta error dekhabe
    if (gap === 0)      { chip.textContent = 'At target'; chip.classList.add('is-met'); return; }
    chip.textContent = 'Gap: ' + gap;
    chip.classList.add(gap >= 3 ? 'is-big' : 'is-gap');                        // 3 ba tar beshi = boro gap
  }

  $$('.comp-row').forEach((row) => {
    const cur = $('.comp-cur', row);
    const tgt = $('.comp-tgt', row);
    cur.addEventListener('change', () => { clearError(tgt); updateGap(row); });
    tgt.addEventListener('change', () => updateGap(row));
  });

  /* ---------- Validation ---------- */
  function validate() {
    const v = roleSel.value;
    const cfg = CONFIG[v];
    let first = null;

    const fail = (el, text) => {
      setError(el, text);
      if (!first) first = el;
    };

    clearAllErrors();

    // Text-like inputs, selects, textareas
    const controls = $$('input:not([type="checkbox"]):not([type="file"]):not([type="hidden"]):not(.tag-input), select, textarea', form);
    controls.forEach((el) => {
      if (el.matches(':disabled')) return;
      if (el.id === 'role') return;

      const value = el.value.trim();
      if (el.required && !value) {
        fail(el, 'This field is required.');
        return;
      }
      if (!value) return;

      const bad = el.validity.typeMismatch || el.validity.patternMismatch ||
                  el.validity.rangeUnderflow || el.validity.rangeOverflow || el.validity.badInput;
      if (bad) fail(el, el.dataset.msg || 'Check this value.');
    });

    // [NEW] COMPETENCY-MAPPING: target level current level er cheye kom hote parbe na
    $$('.comp-row', form).forEach((row) => {
      const cur = $('.comp-cur', row), tgt = $('.comp-tgt', row);
      if (cur.matches(':disabled') || tgt.matches(':disabled')) return;   // hidden role (disabled fieldset) skip
      if (cur.value && tgt.value && Number(tgt.value) < Number(cur.value) &&
          !tgt.closest('.field').classList.contains('invalid')) {
        fail(tgt, "Target level can't be lower than your current level.");
      }
    });

    // Passwords
    const pw = $('#pw'), pw2 = $('#pw2');
    if (!pw.closest('.field').classList.contains('invalid') && pw.value.length < cfg.min) {
      fail(pw, 'Password needs at least ' + cfg.min + ' characters.');
    }
    if (!pw2.closest('.field').classList.contains('invalid') && pw.value !== pw2.value) {
      fail(pw2, "Passwords don't match.");
    }

    // Experience date range
    $$('.exp').forEach((block) => {
      const from = $('.exp-from', block), to = $('.exp-to', block);
      if (from.value && to.value && to.value < from.value) {
        fail(to, 'End date is before the start date.');
      }
    });

    // Required tag inputs
    $$('.tags[data-required]', form).forEach((box) => {
      if (box.closest('fieldset').disabled) return;
      if (box._tags.count() === 0) {
        fail($('.tag-input', box), box.dataset.requiredMsg || 'Add at least one item.');
      }
    });

    // Files
    $$('input[type="file"]', form).forEach((el) => {
      if (el.matches(':disabled')) return;
      if (el.required && !el.files.length) {
        fail(el, el.dataset.requiredMsg || 'This file is required.');
        return;
      }
      const err = checkFile(el);
      if (err) fail(el, err);
    });

    // Terms
    const agree = $('#agree');
    if (!agree.checked) fail(agree, 'Accept the terms to continue.');

    if (first) {
      showMsg('err', 'Some fields need your attention. Check the highlighted fields.');
      first.focus({ preventScroll: true });
      first.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return false;
    }
    return true;
  }

  // Clear a field's error as soon as the person edits it
  form.addEventListener('input', (e) => {
    if (e.target.matches('input, select, textarea')) clearError(e.target);
    if (msg.classList.contains('err')) clearMsg();
  });

  /* ---------- Submit ---------- */
  async function submitToServer(data) {
    // TODO: replace this with your real API call, for example:
    //
    // const res = await fetch('/api/register', { method: 'POST', body: data });
    // if (!res.ok) throw new Error('Request failed');
    //
    // `data` is a FormData object: only the fields of the selected role are included.
    console.log('Form data:', Object.fromEntries(
      Array.from(data.entries()).filter(([k]) => k !== 'password' && k !== 'confirmPassword')
    ));
    return new Promise((resolve) => setTimeout(resolve, 700));
  }

  function setBusy(busy) {
    submitBtn.disabled = busy;
    goText.textContent = busy ? 'Submitting…' : CONFIG[roleSel.value].btn;
  }

  function resetAll() {
    const keep = roleSel.value;
    form.reset();
    roleSel.value = keep;
    $$('.comp-row').forEach(updateGap);   // [NEW] COMPETENCY-MAPPING: reset er por gap chip abar "Gap: -" kora

    $$('.tags').forEach((b) => b._tags.clear());
    $$('.upload').forEach(resetUpload);
    $$('.pw-toggle').forEach((b) => setPwVisible(b, false));
    otpHint.textContent = '';

    expWrap.innerHTML = '';
    expCount = 0;
    addExperience();

    applyRole();
  }

  /* [NEW] SIGNUP-MODAL: Submit confirm message (Yes = submit, No = bondho) */
  const confirmBar = $('#confirmBar');
  const confirmYes = $('#confirmYes');
  const confirmNo  = $('#confirmNo');

  function openConfirm() {
    confirmBar.classList.add('is-open');
    setTimeout(() => confirmYes.focus({ preventScroll: true }), 60);
  }
  function closeConfirm() {
    confirmBar.classList.remove('is-open');
  }

  // [CHANGED] SIGNUP-MODAL: submit e ager moto sob validate hoy, kintu sorasori submit na hoye upore confirm message ashe
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!roleSel.value) {
      showMsg('err', 'Select a role first.');
      roleSel.focus();
      return;
    }
    if (!validate()) return;

    openConfirm();
  });

  // [NEW] SIGNUP-MODAL: "No" -> message bondho
  confirmNo.addEventListener('click', () => {
    closeConfirm();
    submitBtn.focus({ preventScroll: true });
  });

  // [NEW] SIGNUP-MODAL: "Yes" -> asol submit
  confirmYes.addEventListener('click', () => {
    closeConfirm();
    doSubmit();
  });

  // [CHANGED] SIGNUP-MODAL: ager submit er vitorer submit code ta ekhon ei function e (Yes click korle chole)
  async function doSubmit() {
    if (!roleSel.value || !validate()) return;   // Yes chapar age kichu bodle gele abar check

    const cfg = CONFIG[roleSel.value];
    setBusy(true);
    try {
      await submitToServer(new FormData(form));
      resetAll();
      // [CHANGED] SIGNUP-MODAL: age form er vitore showMsg('ok', ...) hoto. Ekhon popup bondho + top e scroll + upore success message,
      // ei kaj gulo niche "popup open / close" section e ("signup:success" event listen kore) kora hoy
      document.dispatchEvent(new CustomEvent('signup:success', { detail: { message: cfg.done } }));
    } catch (err) {
      showMsg('err', 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  /* [REMOVED] SIGNUP-MODAL: purano "Back button" block (confirm + landing.html e jaowa) muche deya holo.
     Ekhon back button popup bondho kore, ta niche MODAL section e handle kora ache. */

  /* ---------- Init ---------- */
  syncRequiredFromStars();
  addExperience();
  applyRole();
})();


/* ==========================================================================
   [NEW] SIGNUP-MODAL : popup open / close
   1) Portal er "Sign Up" click  -> form popup khule
   2) Form er "Back" button -> popup bondho + landing page ekdom upore (top) e
      Esc -> sudhu popup bondho
   3) Form er "Login" click     -> popup bondho + Portal Section e scroll
   4) Submit successful          -> popup bondho + page top e scroll + upore success message
   ========================================================================== */
(() => {
    const overlay   = document.getElementById("signupOverlay");
    const openLink  = document.getElementById("openSignup");
    const backBtn   = document.getElementById("backBtn");
    const loginLink = document.getElementById("login");
    const portalSec = document.querySelector(".portal-section");

    if (!overlay || !openLink) return;

    function openSignup(e) {
        e.preventDefault();
        overlay.classList.add("is-open");
        document.body.classList.add("modal-open");
        overlay.scrollTop = 0;
        setTimeout(() => document.getElementById("role").focus({ preventScroll: true }), 60);
    }

    function closeSignup() {
        overlay.classList.remove("is-open");
        document.body.classList.remove("modal-open");
        // [NEW] popup bondho hole confirm message-o bondho
        document.getElementById("confirmBar").classList.remove("is-open");
        openLink.focus({ preventScroll: true });
    }

    // [NEW] SIGNUP-MODAL: submit successful hole -> popup bondho + landing page ekdom top e + upore success message
    const successBar   = document.getElementById("successBar");
    const successText  = document.getElementById("successText");
    const successClose = document.getElementById("successClose");
    let successTimer   = null;

    function showSuccess(text) {
        successText.textContent = text || "";
        successBar.classList.add("is-open");
        clearTimeout(successTimer);
        successTimer = setTimeout(hideSuccess, 6000);   // koto sec por message jabe (6000 = 6 sec)
    }
    function hideSuccess() {
        clearTimeout(successTimer);
        successBar.classList.remove("is-open");
    }
    successClose.addEventListener("click", hideSuccess);

    document.addEventListener("signup:success", (e) => {
        closeSignup();
        window.scrollTo({ top: 0, behavior: "smooth" });
        showSuccess(e.detail && e.detail.message);
    });

    openLink.addEventListener("click", openSignup);

    // [CHANGED] SIGNUP-MODAL: Back button click korle popup bondho hoye landing page ekdom upore (top) e chole jabe
    backBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeSignup();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        closeSignup();
        portalSec.scrollIntoView({ behavior: "smooth" });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || !overlay.classList.contains("is-open")) return;

        // [CHANGED] confirm message khola thakle Esc sudhu oita bondho kore ("No" click er moto), popup na
        const bar = document.getElementById("confirmBar");
        if (bar.classList.contains("is-open")) {
            document.getElementById("confirmNo").click();
            return;
        }
        closeSignup();
    });
})();
