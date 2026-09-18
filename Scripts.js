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
   CSS এর .tabs::before pill টা --tab-index ভ্যারিয়েবল দেখে সরে যায়
   ========================================================================= */
const tabsWrap = document.querySelector(".tabs");
const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab, index) => {
    tab.addEventListener("click", function () {
        tabs.forEach(item => item.classList.remove("active")); // আগের active সরাও
        this.classList.add("active");                          // ক্লিক করা ট্যাব active

        // pill কে কত নম্বর ঘরে সরাবে সেটা CSS কে জানানো
        tabsWrap.style.setProperty("--tab-index", index);
    });
});


/* =========================================================================
   02. LOGIN FORM — VALIDATION
   খালি থাকলে input-box লাল হয়ে কেঁপে ওঠে, ঠিক থাকলে বাটনে
   loading spinner → success টিক দেখায়
   ========================================================================= */
const loginForm = document.getElementById("loginForm");
const loginBtn  = loginForm.querySelector(".main-login");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // পেজ reload বন্ধ

    const userInput = loginForm.querySelector('input[type="text"]');
    const passInput = loginForm.querySelector('input[type="password"]');

    let hasError = false;

    // খালি ফিল্ড খুঁজে .error ক্লাস বসানো (CSS এ shake animation চলে)
    [userInput, passInput].forEach(field => {
        const box = field.closest(".input-box");
        box.classList.remove("error");

        if (!field.value.trim()) {
            // animation আবার চালাতে হলে ক্লাস সরিয়ে reflow করাতে হয়
            void box.offsetWidth;
            box.classList.add("error");
            hasError = true;
        }
    });

    if (hasError) {
        userInput.value.trim() ? passInput.focus() : userInput.focus();
        return;
    }

    // --- সব ঠিক থাকলে: loading → success ---
    loginBtn.classList.add("loading");

    setTimeout(() => {
        loginBtn.classList.remove("loading");
        loginBtn.classList.add("success");
        loginBtn.innerHTML = "Success <span>&#10003;</span>";

        // ১.৫ সেকেন্ড পর আগের অবস্থায় ফিরে যায়
        setTimeout(() => {
            loginBtn.classList.remove("success");
            loginBtn.innerHTML = "Login <span>&rarr;</span>";
            loginForm.reset();
        }, 1500);
    }, 1200);
});

// লিখতে শুরু করলেই লাল দাগ সরে যায়
loginForm.querySelectorAll("input").forEach(field => {
    field.addEventListener("input", () => {
        field.closest(".input-box").classList.remove("error");
    });
});


/* =========================================================================
   03. BUTTON RIPPLE — ক্লিক যেখানে হয় ঠিক সেখান থেকে ঢেউ ছড়ায়
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
