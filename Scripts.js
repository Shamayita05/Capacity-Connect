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