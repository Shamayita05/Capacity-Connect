/* ==========================================================================
   Capacity Connect — shared trainee UI: navbar, toasts, modals, guard,
   plus the dashboard rendering.
   ========================================================================== */

/* -------------------------------------------------------------- helpers --- */
function el(sel, root) {
  return (root || document).querySelector(sel);
}
function els(sel, root) {
  return Array.prototype.slice.call((root || document).querySelectorAll(sel));
}
function esc(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function fmtDate(iso) {
  if (!iso) return "—";
  var d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/* --------------------------------------------------------------- toasts --- */
function toast(message, variant) {
  var stack = el(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    stack.setAttribute("role", "status");
    stack.setAttribute("aria-live", "polite");
    document.body.appendChild(stack);
  }
  var node = document.createElement("div");
  node.className = "toast" + (variant ? " toast--" + variant : "");
  node.textContent = message;
  stack.appendChild(node);
  setTimeout(function () {
    node.style.opacity = "0";
    node.style.transform = "translateX(20px)";
    node.style.transition = "all .25s ease";
    setTimeout(function () { node.remove(); }, 260);
  }, 3200);
}

/* --------------------------------------------------------------- modals --- */
var CC_LAST_FOCUS = null;

function openModal(id) {
  var modal = document.getElementById(id);
  if (!modal) return;
  CC_LAST_FOCUS = document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  var focusable = els("button, [href], input, select, textarea", modal).filter(function (n) {
    return !n.disabled && n.offsetParent !== null;
  });
  if (focusable[0]) focusable[0].focus();
}
function closeModal(id) {
  var modal = id ? document.getElementById(id) : el(".modal.is-open");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (!el(".modal.is-open")) document.body.style.overflow = "";
  if (CC_LAST_FOCUS && CC_LAST_FOCUS.focus) CC_LAST_FOCUS.focus();
}
function initModals() {
  document.addEventListener("click", function (e) {
    var closer = e.target.closest("[data-close-modal]");
    if (closer) {
      e.preventDefault();
      closeModal(closer.getAttribute("data-close-modal") || undefined);
      return;
    }
    if (e.target.classList && e.target.classList.contains("modal")) closeModal(e.target.id);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && el(".modal.is-open")) closeModal();
    // simple focus trap
    if (e.key === "Tab") {
      var modal = el(".modal.is-open");
      if (!modal) return;
      var f = els("button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])", modal)
        .filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* --------------------------------------------------------------- navbar --- */
function renderNavbar(active) {
  var mount = el("#cc-navbar");
  if (!mount) return;
  var unread = getUnreadNotificationCount();
  mount.innerHTML =
    '<nav class="cc-nav" aria-label="Trainee navigation"><div class="cc-nav__inner">' +
    '<a class="cc-brand" href="trainee-dashboard.html" aria-label="Capacity Connect home">' +
    '<span class="cc-brand__top">Capacity</span><span class="cc-brand__bottom">Connect</span></a>' +
    '<div class="cc-nav__links">' +
    '<a class="cc-nav__link' + (active === "dashboard" ? " cc-nav__link--active" : "") + '" href="trainee-dashboard.html">Dashboard</a>' +
    '<a class="cc-nav__link' + (active === "explore" ? " cc-nav__link--active" : "") + '" href="explore-courses.html">Explore Courses</a>' +
    '<a class="cc-nav__link' + (active === "notifications" ? " cc-nav__link--active" : "") + '" href="notifications.html">Notifications' +
    (unread ? '<span class="cc-nav__badge">' + unread + "</span>" : "") +
    "</a>" +
    '<button type="button" class="cc-nav__link cc-nav__link--ghost" id="cc-logout">Logout</button>' +
    "</div></div></nav>";
  el("#cc-logout").addEventListener("click", function () {
    logoutTrainee();
    window.location.href = "index.html#login";
  });
}

function renderFooter() {
  var mount = el("#cc-footer");
  if (!mount) return;
  mount.innerHTML =
    '<footer class="cc-footer"><div class="wrap"><span>© ' +
    new Date().getFullYear() +
    " Capacity Connect.</span></div></footer>";
}

/* --------------------------------------------------------- session guard -- */
/** Returns the trainee or redirects to the login section. */
function requireTrainee() {
  var t = getCurrentTrainee();
  if (!t) {
    window.location.href = "index.html#login";
    return null;
  }
  return t;
}

/** Called on every trainee page. */
function initTraineePage(activeNav) {
  var trainee = requireTrainee();
  if (!trainee) return null;
  touchStreak();
  renderNavbar(activeNav);
  renderFooter();
  initModals();
  return trainee;
}

/* ==========================================================================
   DASHBOARD
   ========================================================================== */
function initDashboard() {
  var trainee = initTraineePage("dashboard");
  if (!trainee) return;

  renderWelcome(trainee);
  renderYourCourses();
  renderStreakCard();
  renderFeatureCards();
  wireProfileModals();
}

function renderWelcome(t) {
  el("#dash-avatar").src = t.profileImage || "";
  el("#dash-avatar").alt = "Profile photo of " + t.name;
  el("#dash-name").textContent = "Welcome back, " + t.name + "!";
  el("#dash-quote").textContent = '"' + getSessionQuote() + '"';
}

function renderYourCourses() {
  var mount = el("#your-courses");
  var courses = getEnrolledCourses();
  if (!courses.length) {
    mount.innerHTML =
      '<div class="empty"><div class="empty__icon" aria-hidden="true">📚</div>' +
      "<h3>You haven't enrolled in any courses yet.</h3>" +
      '<p class="muted">Browse the catalogue and start your first course today.</p>' +
      '<a class="btn btn--primary" href="explore-courses.html">Explore Courses</a></div>';
    return;
  }
  mount.innerHTML = courses
    .slice(0, 3)
    .map(function (c) {
      var p = getCourseProgress(c.id);
      return (
        '<article class="mini-course"><div class="mini-course__top"><div>' +
        "<h3>" + esc(c.name) + "</h3>" +
        '<div class="tags">' +
        c.categories.slice(0, 2).map(function (cat) {
          return '<span class="badge badge--sage">' + esc(cat) + "</span>";
        }).join("") +
        "</div></div>" +
        '<span class="badge badge--outline">' + esc(c.level) + "</span></div>" +
        '<div><div class="progress-row"><span>Progress</span><span>' + p + "%</span></div>" +
        '<div class="progress"><div class="progress__bar" style="width:' + p + '%" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + esc(c.name) + ' progress"></div></div></div>' +
        '<div><a class="btn btn--primary btn--sm" href="course.html?id=' + c.id + '">Go to Course</a></div>' +
        "</article>"
      );
    })
    .join("");
}

function renderStreakCard() {
  var s = getStreak();
  var stats = getTraineeStats();
  el("#streak-count").textContent = s.count + " Day Streak";
  el("#stat-enrolled").textContent = stats.enrolled;
  el("#stat-completed").textContent = stats.completed;
  el("#stat-assessments").textContent = stats.assessments;
  el("#stat-certificates").textContent = stats.certificates;
}

function renderFeatureCards() {
  var unread = getUnreadNotificationCount();
  var badge = el("#notif-count");
  if (badge) {
    if (unread) {
      badge.textContent = unread + " new";
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }
  var pending = getTraineeAssessments().filter(function (a) {
    return !getAssessmentResult(a.id);
  }).length;
  var aBadge = el("#assess-count");
  if (aBadge) {
    if (pending) { aBadge.textContent = pending + " pending"; aBadge.hidden = false; }
    else aBadge.hidden = true;
  }
}

/* ------------------------------------------------- profile view + edit --- */
function wireProfileModals() {
  el("#btn-view-profile").addEventListener("click", function () {
    renderProfileModal();
    openModal("modal-profile");
  });
  el("#btn-edit-profile").addEventListener("click", function () {
    fillEditForm();
    openModal("modal-edit");
  });
  el("#form-edit-profile").addEventListener("submit", onSaveProfile);
}

function renderProfileModal() {
  var t = getCurrentTrainee();
  var certs = t.certificates || [];
  var completed = (t.completedCourses || []).map(getCourseById).filter(Boolean);

  el("#profile-body").innerHTML =
    '<div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;margin-bottom:20px">' +
    '<img class="avatar avatar--lg" src="' + esc(t.profileImage) + '" alt="Profile photo of ' + esc(t.name) + '">' +
    "<div><h3>" + esc(t.name) + '</h3><p class="muted">' + esc(t.qualification) + "</p></div></div>" +
    '<div class="block"><h4>About</h4><p>' + esc(t.about) + "</p></div>" +
    '<div class="block"><h4>Contact</h4><div class="info-grid">' +
    '<div class="info-item"><span>Email</span><strong>' + esc(t.email) + "</strong></div>" +
    '<div class="info-item"><span>Phone</span><strong>' + esc(t.phone) + "</strong></div>" +
    "</div></div>" +
    '<div class="block"><h4>Qualifications</h4><p>' + esc(t.qualification) + "</p></div>" +
    '<div class="block"><h4>Skills</h4><div class="tags">' +
    splitList(t.skills).map(function (s) { return '<span class="badge badge--mint">' + esc(s) + "</span>"; }).join("") +
    "</div></div>" +
    '<div class="block"><h4>Interests</h4><div class="tags">' +
    splitList(t.interests).map(function (s) { return '<span class="badge">' + esc(s) + "</span>"; }).join("") +
    "</div></div>" +
    '<div class="block"><h4>Courses Completed (' + completed.length + ")</h4>" +
    (completed.length
      ? '<ul class="list-check">' + completed.map(function (c) {
          return "<li>" + esc(c.name) + " — " + esc(c.code) + "</li>";
        }).join("") + "</ul>"
      : '<p class="muted">No courses completed yet.</p>') +
    "</div>" +
    '<div class="block"><h4>Certificates Achieved (' + certs.length + ")</h4>" +
    (certs.length
      ? certs.map(function (c) {
          return (
            '<div class="info-item" style="margin-bottom:10px"><strong>' + esc(c.name) + "</strong>" +
            '<div class="small muted">Course: ' + esc(c.course) + " · Completed: " + fmtDate(c.date) + "</div>" +
            '<div class="small">ID: <strong>' + esc(c.id) + '</strong> · <span class="badge badge--mint">' + esc(c.status) + "</span></div></div>"
          );
        }).join("")
      : '<p class="muted">Complete a course to earn your first certificate.</p>') +
    "</div>";
}

function splitList(str) {
  return String(str || "")
    .split(",")
    .map(function (s) { return s.trim(); })
    .filter(Boolean);
}

function fillEditForm() {
  var t = getCurrentTrainee();
  el("#edit-image").value = t.profileImage || "";
  el("#edit-about").value = t.about || "";
  el("#edit-qualification").value = t.qualification || "";
  el("#edit-skills").value = t.skills || "";
  el("#edit-interests").value = t.interests || "";
  el("#edit-phone").value = t.phone || "";
  el("#edit-email").value = t.email || "";
  el("#edit-error").textContent = "";
}

function onSaveProfile(e) {
  e.preventDefault();
  var about = el("#edit-about").value.trim();
  var qualification = el("#edit-qualification").value.trim();
  var skills = el("#edit-skills").value.trim();
  var image = el("#edit-image").value.trim();
  var err = el("#edit-error");

  if (about.length < 10) {
    err.textContent = "Please write at least 10 characters in About.";
    el("#edit-about").focus();
    return;
  }
  if (!qualification) {
    err.textContent = "Qualification cannot be empty.";
    el("#edit-qualification").focus();
    return;
  }
  if (!skills) {
    err.textContent = "Please list at least one skill.";
    el("#edit-skills").focus();
    return;
  }
  err.textContent = "";

  updateTrainee({
    profileImage: image,
    about: about,
    qualification: qualification,
    skills: skills,
    interests: el("#edit-interests").value.trim(),
  });

  renderWelcome(getCurrentTrainee());
  renderProfileModal();
  closeModal("modal-edit");
  toast("Profile updated successfully.");
}
