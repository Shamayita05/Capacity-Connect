/* ==========================================================================
   admin.js – Shared UI helpers + page controllers for the Admin Module
   Each HTML page sets <body data-page="..."> and this script renders the
   right controller. Data comes from data.js (CC.load / CC.save).
   ========================================================================== */

/* ---------- Inline SVG icon set (stroke icons) ---------- */
CC.icons = {
  cap: '<svg class="icon" viewBox="0 0 24 24"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/></svg>',
  home: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
  logout: '<svg class="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
  teacher: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/><path d="M2 3h6M2 6h4"/></svg>',
  student: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',
  target: `
<svg class="icon" viewBox="0 0 24 24"
     aria-hidden="true"
     xmlns="http://www.w3.org/2000/svg">

    <circle cx="12" cy="12" r="9"></circle>
    <circle cx="12" cy="12" r="5"></circle>
    <circle cx="12" cy="12" r="1.5"></circle>

</svg>
`,
  award: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5"/></svg>',
  book: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  video: '<svg class="icon" viewBox="0 0 24 24"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3z"/></svg>',
  clipboard: '<svg class="icon" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9z"/><path d="M9 12h6M9 16h4"/></svg>',
  clock: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  chart: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 15l4-5 4 3 5-7"/></svg>',
  bell: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  check: '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  x: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  eye: '<svg class="icon" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  edit: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  trash: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
  users: '<svg class="icon" viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M1 21a8 8 0 0 1 16 0"/><path d="M17 4a4 4 0 0 1 0 8"/><path d="M23 21a8 8 0 0 0-6-7.7"/></svg>',
  file: '<svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  slides: '<svg class="icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M12 17v4M8 21h8"/></svg>',
  arrow: '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg class="icon" viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
  plus: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
};

/* ---------- Generic helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fmtDate = (iso) => iso ? new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

/** Status badge markup. */
CC.badge = function (status) {
  const cls = String(status).toLowerCase().replace(/\s+/g, "-").replace("in-progress", "progress");
  return `<span class="badge badge-${cls}">${escapeHtml(status)}</span>`;
};

/** Toast notification. */
CC.toast = function (message, type = "success") {
  let stack = $(".toast-stack");
  if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; document.body.appendChild(stack); }
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `${type === "error" ? CC.icons.x : CC.icons.check}<span>${escapeHtml(message)}</span>`;
  stack.appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 300); }, 3000);
};

/** Generic modal. Returns the backdrop element. */
CC.modal = function ({ title, body, actions = [] }) {
  $(".modal-backdrop")?.remove();
  const wrap = document.createElement("div");
  wrap.className = "modal-backdrop";
  wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
      <h3>${escapeHtml(title)}</h3>
      <div class="modal-body">${body}</div>
      <div class="modal-actions"></div>
    </div>`;
  const actionsEl = $(".modal-actions", wrap);
  const close = () => { wrap.classList.remove("open"); setTimeout(() => wrap.remove(), 220); };
  actions.forEach((a) => {
    const b = document.createElement("button");
    b.className = `btn ${a.cls || "btn-ghost"}`;
    b.textContent = a.label;
    b.onclick = () => { if (a.onClick) a.onClick(); close(); };
    actionsEl.appendChild(b);
  });
  if (!actions.length) { const b = document.createElement("button"); b.className = "btn btn-primary"; b.textContent = "Close"; b.onclick = close; actionsEl.appendChild(b); }
  wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("open"));
  return wrap;
};

/** Confirmation modal. */
CC.confirm = function (title, message, onConfirm, confirmLabel = "Confirm") {
  CC.modal({
    title, body: `<p>${escapeHtml(message)}</p>`,
    actions: [{ label: "Cancel" }, { label: confirmLabel, cls: "btn-primary", onClick: onConfirm }]
  });
};

/** Navigation helpers. */
CC.go = (page) => { window.location.href = page; };
CC.logout = () => {
  CC.toast("Logged out successfully", "info");
  setTimeout(() => CC.go("index.html#login"), 500);
};

/** Renders the shared sticky navbar into <header data-navbar>. */
CC.renderNavbar = function () {
  const host = $("[data-navbar]");
  if (!host) return;
  const isAdmin = document.body.dataset.page !== "landing";
  host.className = "navbar";
  host.innerHTML = `
    <div class="container">
      <a class="brand" href="${isAdmin ? "admin-dashboard.html" : "index.html"}">
        <div class="brand-title">
    <span class="brand-capacity">CAPACITY</span>
    <span class="brand-connect">CONNECT</span>
      </div>
      </a>
      <nav class="nav-actions">
        <a class="btn btn-ghost" href="index.html">${CC.icons.home}<span>Home</span></a>
        ${isAdmin
          ? `<button class="btn btn-primary" id="logoutBtn">${CC.icons.logout}<span>Logout</span></button>`
          : `<a class="btn btn-primary" href="#login">${CC.icons.teacher}<span>Login</span></a>`}
      </nav>
    </div>`;
  $("#logoutBtn")?.addEventListener("click", CC.logout);
};

/** Generic table builder. columns: [{label, render(row)}] */
CC.table = function (rows, columns, emptyText = "Nothing to show here.") {
  if (!rows.length) return `<div class="card empty">${escapeHtml(emptyText)}</div>`;
  return `<div class="card table-wrap" style="padding:0"><table>
    <thead><tr>${columns.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${columns.map((c) => `<td>${c.render(r)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
};

/** Filter chips for status-based lists. */
CC.filterBar = function (options, active) {
  return `<div class="toolbar">${options.map((o) => `<button class="chip ${o === active ? "active" : ""}" data-filter="${o}">${o}</button>`).join("")}</div>`;
};

/** Animate progress bars / chart bars after render. */
CC.animateBars = function (root = document) {
  requestAnimationFrame(() => $$("[data-w]", root).forEach((el) => { el.style.width = el.dataset.w + "%"; }));
  requestAnimationFrame(() => $$("[data-h]", root).forEach((el) => { el.style.height = el.dataset.h + "%"; }));
};

/* ==========================================================================
   Page controllers
   ========================================================================== */
CC.pages = {};

/* ---- Approval queue factory (used by trainers, trainees, courses, content, assessments) ---- */
function approvalQueue({ key, label, columns, detail, mount, cardMode }) {
  let filter = "All";
  const render = () => {
    const all = CC.load(key);
    const rows = filter === "All" ? all : all.filter((r) => r.status === filter);
    const counts = { All: all.length, Pending: all.filter((r) => r.status === "Pending").length };
    const actions = (r) => `<div class="actions">
        <button class="btn btn-sm btn-mint" data-act="approve" data-id="${r.id}" ${r.status === "Approved" ? "disabled" : ""}>${CC.icons.check} Approve</button>
        <button class="btn btn-sm btn-danger" data-act="reject" data-id="${r.id}" ${r.status === "Rejected" ? "disabled" : ""}>${CC.icons.x} Reject</button>
        <button class="btn btn-sm btn-outline" data-act="view" data-id="${r.id}">${CC.icons.eye} View</button>
        ${key === "courses" ? `<button class="btn btn-sm btn-ghost" data-act="edit" data-id="${r.id}">${CC.icons.edit}</button><button class="btn btn-sm btn-ghost" data-act="remove" data-id="${r.id}">${CC.icons.trash}</button>` : ""}
      </div>`;
    mount.innerHTML = `
      <div class="toolbar">
        ${["All", "Pending", "Approved", "Rejected"].map((o) => `<button class="chip ${o === filter ? "active" : ""}" data-filter="${o}">${o}${o === "Pending" ? ` (${counts.Pending})` : ""}</button>`).join("")}
        <span class="spacer"></span><span class="cell-soft">${rows.length} of ${counts.All} ${label}</span>
      </div>
      ${cardMode ? cardMode(rows, actions) : CC.table(rows, [...columns, { label: "Status", render: (r) => CC.badge(r.status) }, { label: "Actions", render: actions }], `No ${label} found.`)}`;

    $$("[data-filter]", mount).forEach((b) => (b.onclick = () => { filter = b.dataset.filter; render(); }));
    $$("[data-act]", mount).forEach((b) => (b.onclick = () => {
      const list = CC.load(key);
      const item = list.find((i) => i.id === Number(b.dataset.id));
      const act = b.dataset.act;
      if (act === "view") return CC.modal({ title: item.title || item.name, body: detail(item) });
      if (act === "edit") return editCourse(item, render);
      if (act === "remove") return CC.confirm("Remove course", `Remove "${item.title}" permanently?`, () => { CC.save(key, list.filter((i) => i.id !== item.id)); CC.toast("Course removed", "info"); render(); }, "Remove");
      const next = act === "approve" ? "Approved" : "Rejected";
      CC.confirm(`${next === "Approved" ? "Approve" : "Reject"} ${label.replace(/s$/, "")}`, `Are you sure you want to mark "${item.title || item.name}" as ${next}?`, () => {
        item.status = next; CC.save(key, list);
        CC.toast(`${item.title || item.name} ${next.toLowerCase()}`, next === "Approved" ? "success" : "info"); render();
      }, next === "Approved" ? "Approve" : "Reject");
    }));
  };
  render();
}

/** Course edit modal (title / category / duration). */
function editCourse(course, rerender) {
  const wrap = CC.modal({
    title: "Edit course",
    body: `<div class="stack" style="gap:.75rem">
      <div class="field"><label>Title</label><input id="ecTitle" value="${escapeHtml(course.title)}"></div>
      <div class="field"><label>Category</label><input id="ecCat" value="${escapeHtml(course.category)}"></div>
      <div class="field"><label>Duration</label><input id="ecDur" value="${escapeHtml(course.duration)}"></div></div>`,
    actions: [{ label: "Cancel" }, { label: "Save changes", cls: "btn-primary", onClick: () => {
      const list = CC.load("courses"); const c = list.find((i) => i.id === course.id);
      c.title = $("#ecTitle", wrap).value.trim() || c.title; c.category = $("#ecCat", wrap).value.trim() || c.category; c.duration = $("#ecDur", wrap).value.trim() || c.duration;
      CC.save("courses", list); CC.toast("Course updated"); rerender();
    } }]
  });
}

const detailList = (pairs) => `<dl class="detail-list">${pairs.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>`;

/* ---- Dashboard ---- */
CC.pages.dashboard = function () {
  $("#statUsers").textContent = CC.load("users").length + CC.SEED.stats.totals.trainees;
  $("#statPending").textContent = CC.pendingCount();
  $("#statLogin").textContent = new Date().toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  $$("[data-icon]").forEach((el) => { el.innerHTML = CC.icons[el.dataset.icon]; });
};

/* ---- Trainer approvals ---- */
CC.pages["trainer-approvals"] = () => approvalQueue({
  key: "trainers", label: "trainers", mount: $("#app"),
  columns: [
    { label: "Trainer", render: (r) => `<div class="cell-strong">${escapeHtml(r.name)}</div><div class="cell-soft">${escapeHtml(r.email)}</div>` },
    { label: "Qualification", render: (r) => escapeHtml(r.qualification) },
    { label: "Expertise", render: (r) => escapeHtml(r.expertise) },
    { label: "Registered", render: (r) => fmtDate(r.registered) }
  ],
  detail: (r) => detailList([["Email", escapeHtml(r.email)], ["Qualification", escapeHtml(r.qualification)], ["Expertise", escapeHtml(r.expertise)], ["Registered", fmtDate(r.registered)], ["Status", CC.badge(r.status)]])
});

/* ---- Trainee approvals ---- */
CC.pages["trainee-approvals"] = () => approvalQueue({
  key: "trainees", label: "trainees", mount: $("#app"),
  columns: [
    { label: "Trainee", render: (r) => `<div class="cell-strong">${escapeHtml(r.name)}</div><div class="cell-soft">${escapeHtml(r.email)}</div>` },
    { label: "Organisation", render: (r) => escapeHtml(r.organisation) },
    { label: "Interest", render: (r) => escapeHtml(r.interest) },
    { label: "Registered", render: (r) => fmtDate(r.registered) }
  ],
  detail: (r) => detailList([["Email", escapeHtml(r.email)], ["Organisation", escapeHtml(r.organisation)], ["Area of interest", escapeHtml(r.interest)], ["Registered", fmtDate(r.registered)], ["Registration status", CC.badge(r.status)]])
});

/* ---- Role management ---- */
CC.pages["role-management"] = function () {
  const mount = $("#app");
  const render = () => {
    const users = CC.load("users");
    mount.innerHTML = CC.table(users, [
      { label: "Name", render: (u) => `<span class="cell-strong">${escapeHtml(u.name)}</span>` },
      { label: "Email", render: (u) => escapeHtml(u.email) },
      { label: "Current role", render: (u) => CC.badge(u.role === "Trainer" ? "Approved" : "Progress").replace(/>[^<]+</, `>${u.role}<`) },
      { label: "Status", render: (u) => CC.badge(u.status) },
      { label: "Change role", render: (u) => `<select class="select-inline" data-id="${u.id}"><option ${u.role === "Trainee" ? "selected" : ""}>Trainee</option><option ${u.role === "Trainer" ? "selected" : ""}>Trainer</option></select>` }
    ]);
    $$("select[data-id]", mount).forEach((sel) => (sel.onchange = () => {
      const list = CC.load("users"); const u = list.find((i) => i.id === Number(sel.dataset.id)); const newRole = sel.value;
      CC.modal({
        title: "Confirm role change",
        body: `<p>Change <strong>${escapeHtml(u.name)}</strong> from <strong>${u.role}</strong> to <strong>${newRole}</strong>?</p>`,
        actions: [{ label: "Cancel", onClick: render }, { label: "Change role", cls: "btn-primary", onClick: () => { u.role = newRole; CC.save("users", list); CC.toast(`${u.name} is now a ${newRole}`); render(); } }]
      });
    }));
  };
  render();
};

/* ---- Certification management ---- */
CC.pages["certification-management"] = function () {
  const mount = $("#app");
  let filter = "All";
  const render = () => {
    const all = CC.load("certifications");
    const rows = filter === "All" ? all : filter === "Completed" ? all.filter((c) => c.completion === 100) : all.filter((c) => c.status === filter);
    mount.innerHTML = CC.filterBar(["All", "Completed", "Pending", "Issued"], filter) + CC.table(rows, [
      { label: "Trainee", render: (c) => `<span class="cell-strong">${escapeHtml(c.trainee)}</span>` },
      { label: "Course", render: (c) => escapeHtml(c.course) },
      { label: "Completion", render: (c) => `<span class="progress sm"><span data-w="${c.completion}" style="--fill:${c.completion === 100 ? "var(--mint)" : "var(--aqua)"}"></span></span>${c.completion}%` },
      { label: "Score", render: (c) => c.score ? `${c.score}/100` : "—" },
      { label: "Certificate", render: (c) => CC.badge(c.status) },
      { label: "Action", render: (c) => `<button class="btn btn-sm btn-mint" data-id="${c.id}" ${c.status === "Issued" || c.completion < 100 ? "disabled" : ""}>${CC.icons.award} Issue certificate</button>` }
    ]);
    CC.animateBars(mount);
    $$("[data-filter]", mount).forEach((b) => (b.onclick = () => { filter = b.dataset.filter; render(); }));
    $$("button[data-id]", mount).forEach((b) => (b.onclick = () => {
      const list = CC.load("certifications"); const c = list.find((i) => i.id === Number(b.dataset.id));
      CC.confirm("Issue certificate", `Issue a certificate to ${c.trainee} for "${c.course}" (score ${c.score}/100)?`, () => { c.status = "Issued"; CC.save("certifications", list); CC.toast("Certificate issued successfully!"); render(); }, "Issue");
    }));
  };
  render();
};

/* ---- Course management ---- */
CC.pages["course-management"] = () => approvalQueue({
  key: "courses", label: "courses", mount: $("#app"),
  columns: [
    { label: "Course", render: (c) => `<span class="cell-strong">${escapeHtml(c.title)}</span>` },
    { label: "Trainer", render: (c) => escapeHtml(c.trainer) },
    { label: "Category", render: (c) => escapeHtml(c.category) },
    { label: "Duration", render: (c) => escapeHtml(c.duration) }
  ],
  detail: (c) => detailList([["Trainer", escapeHtml(c.trainer)], ["Category", escapeHtml(c.category)], ["Duration", escapeHtml(c.duration)], ["Enrolled", c.enrolled], ["Deadline", fmtDate(c.deadline)], ["Status", CC.badge(c.status)]])
});

/* ---- Learning content management (card layout) ---- */
CC.pages["content-management"] = () => approvalQueue({
  key: "content", label: "items", mount: $("#app"), columns: [],
  detail: (c) => detailList([["Type", escapeHtml(c.type)], ["Course", escapeHtml(c.course)], ["Trainer", escapeHtml(c.trainer)], ["Uploaded", fmtDate(c.uploaded)], ["File size", c.size], ["Status", CC.badge(c.status)]]),
  cardMode: (rows, actions) => rows.length ? `<div class="grid grid-3">${rows.map((c) => `
    <article class="card content-card reveal">
      <div class="thumb">${CC.icons[c.type === "Video" ? "video" : c.type === "PDF" ? "file" : "slides"]}</div>
      <div><div style="display:flex;justify-content:space-between;gap:.5rem;align-items:flex-start"><h3 class="card-title" style="font-size:1rem">${escapeHtml(c.title)}</h3>${CC.badge(c.status)}</div>
      <p class="card-sub">${escapeHtml(c.type)} • ${escapeHtml(c.course)}</p>
      <p class="cell-soft" style="margin-top:.35rem">By ${escapeHtml(c.trainer)} • Uploaded ${fmtDate(c.uploaded)} • ${c.size}</p></div>
      ${actions(c)}
    </article>`).join("")}</div>` : `<div class="card empty">No content found.</div>`
});

/* ---- Assessment management ---- */
CC.pages["assessment-management"] = () => approvalQueue({
  key: "assessments", label: "assessments", mount: $("#app"),
  columns: [
    { label: "Assessment", render: (a) => `<span class="cell-strong">${escapeHtml(a.title)}</span><div class="cell-soft">by ${escapeHtml(a.trainer)}</div>` },
    { label: "Course", render: (a) => escapeHtml(a.course) },
    { label: "Questions", render: (a) => `${a.questions} Qs` },
    { label: "Deadline", render: (a) => fmtDate(a.deadline) }
  ],
  detail: (a) => detailList([["Course", escapeHtml(a.course)], ["Trainer", escapeHtml(a.trainer)], ["Questions", a.questions], ["Deadline", fmtDate(a.deadline)], ["Status", CC.badge(a.status)]])
});

/* ---- Course progress & deadlines ---- */
CC.pages["course-progress"] = function () {
  const courses = CC.load("courses").filter((c) => c.status !== "Rejected");
  const assessments = CC.load("assessments");
  const active = courses.filter((c) => c.active).length;
  const completed = courses.filter((c) => c.completion === 100).length;
  const enrolled = courses.reduce((n, c) => n + c.enrolled, 0);
  const avg = Math.round(courses.reduce((n, c) => n + c.completion, 0) / (courses.length || 1));
  const stat = (icon, val, lbl, accent) => `<div class="card stat-card reveal"><div class="task-icon" style="--accent:${accent}">${CC.icons[icon]}</div><div><div class="val">${val}</div><div class="lbl">${lbl}</div></div></div>`;
  const deadlines = [
    ...courses.map((c) => ({ title: c.title, kind: "Course", date: c.deadline })),
    ...assessments.map((a) => ({ title: a.title, kind: "Assessment", date: a.deadline }))
  ].sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toISOString().slice(0, 10);

  $("#app").innerHTML = `
    <div class="grid grid-4">
      ${stat("book", active, "Active courses", "var(--mint)")}
      ${stat("clock", courses.length - active, "Inactive courses", "var(--aqua)")}
      ${stat("users", enrolled, "Enrolled trainees", "var(--sage)")}
      ${stat("check", completed, "Completed courses", "var(--sage-dark)")}
    </div>
    <div class="grid grid-2" style="margin-top:1.25rem">
      <section class="card"><h3 class="card-title">Course completion</h3><p class="card-sub">Average completion across courses: <strong>${avg}%</strong></p>
        <div class="stack" style="gap:1rem;margin-top:1.25rem">${courses.map((c) => `
          <div class="progress-row"><div class="meta"><span>${escapeHtml(c.title)} ${c.active ? CC.badge("Active") : CC.badge("Inactive")}</span><span>${c.enrolled} enrolled • ${c.completion}%</span></div>
          <div class="progress"><span data-w="${c.completion}" style="--fill:${c.completion === 100 ? "var(--mint)" : "var(--sage-dark)"}"></span></div></div>`).join("")}</div>
      </section>
      <section class="card"><h3 class="card-title">Upcoming deadlines</h3><p class="card-sub">Course and assessment deadlines, soonest first.</p>
        <ul class="feed" style="margin-top:.75rem">${deadlines.map((d) => `
          <li><span class="dot" style="--accent:${d.kind === "Course" ? "var(--sage)" : "var(--aqua)"}">${CC.icons[d.kind === "Course" ? "book" : "clipboard"]}</span>
          <div style="flex:1"><div class="cell-strong">${escapeHtml(d.title)}</div><div class="when">${d.kind} deadline • ${fmtDate(d.date)}</div></div>
          ${d.date < today ? CC.badge("Completed") : CC.badge("Pending")}</li>`).join("")}</ul>
      </section>
    </div>`;
  CC.animateBars();
};

/* ---- Admin management: publish updates ---- */
CC.pages["admin-management"] = function () {
  const form = $("#updateForm");
  const list = $("#updatesList");
  let editingId = null;
  let imageData = "";

  $("#updDate").value = new Date().toISOString().slice(0, 10);
  $("#updImage").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) { imageData = ""; return; }
    if (file.size > 400 * 1024) { CC.toast("Image too large (max 400 KB for this prototype)", "error"); e.target.value = ""; return; }
    const reader = new FileReader(); reader.onload = () => (imageData = reader.result); reader.readAsDataURL(file);
  });

  const validate = () => {
    let ok = true;
    $$(".field[data-required]", form).forEach((f) => {
      const input = $("input, select, textarea", f);
      const bad = !input.value.trim();
      f.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    return ok;
  };

  const resetForm = () => { form.reset(); $("#updDate").value = new Date().toISOString().slice(0, 10); editingId = null; imageData = ""; $("#publishBtn").innerHTML = `${CC.icons.bell} Publish Update`; $("#cancelEdit").style.display = "none"; };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) { CC.toast("Please fill in all required fields", "error"); return; }
    const updates = CC.load("updates");
    const payload = { type: $("#updType").value, title: $("#updTitle").value.trim(), description: $("#updDesc").value.trim(), date: $("#updDate").value, audience: $("#updAudience").value, status: "Published" };
    if (editingId) {
      const u = updates.find((i) => i.id === editingId); Object.assign(u, payload); if (imageData) u.image = imageData;
      CC.toast("Update edited successfully!");
    } else {
      updates.unshift({ id: Date.now(), image: imageData, ...payload });
      CC.toast("Update published successfully!");
    }
    CC.save("updates", updates); resetForm(); render();
  });
  $("#cancelEdit").addEventListener("click", resetForm);
  $$(".field[data-required] input, .field[data-required] select, .field[data-required] textarea", form).forEach((i) => i.addEventListener("input", () => i.closest(".field").classList.remove("invalid")));

  const typeClass = (t) => ({ Announcement: "announcement", Achievement: "achievement", "New Learning Content": "content" })[t] || "";
  const render = () => {
    const updates = CC.load("updates").sort((a, b) => b.date.localeCompare(a.date));
    $("#updatesCount").textContent = `${updates.length} published`;
    list.innerHTML = updates.length ? updates.map((u) => `
      <article class="card update-card reveal">
        <div>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;margin-bottom:.4rem"><span class="badge badge-type ${typeClass(u.type)}">${escapeHtml(u.type)}</span>${CC.badge(u.status)}</div>
          <h3 class="card-title">${escapeHtml(u.title)}</h3>
          <p class="card-sub">${escapeHtml(u.description)}</p>
          ${u.image ? `<img src="${u.image}" alt="">` : ""}
          <div class="meta"><span>${CC.icons.clock} ${fmtDate(u.date)}</span><span>${CC.icons.users} ${escapeHtml(u.audience)}</span></div>
        </div>
        <div class="actions" style="display:flex;gap:.4rem;align-items:flex-start">
          <button class="btn btn-sm btn-outline" data-edit="${u.id}">${CC.icons.edit} Edit</button>
          <button class="btn btn-sm btn-danger" data-del="${u.id}">${CC.icons.trash} Delete</button>
        </div>
      </article>`).join("") : `<div class="card empty">No updates published yet.</div>`;

    $$("[data-del]", list).forEach((b) => (b.onclick = () => {
      const all = CC.load("updates"); const u = all.find((i) => i.id === Number(b.dataset.del));
      CC.confirm("Delete update", `Delete "${u.title}"? This cannot be undone.`, () => { CC.save("updates", all.filter((i) => i.id !== u.id)); CC.toast("Update deleted", "info"); render(); }, "Delete");
    }));
    $$("[data-edit]", list).forEach((b) => (b.onclick = () => {
      const u = CC.load("updates").find((i) => i.id === Number(b.dataset.edit));
      editingId = u.id; $("#updType").value = u.type; $("#updTitle").value = u.title; $("#updDesc").value = u.description; $("#updDate").value = u.date; $("#updAudience").value = u.audience;
      $("#publishBtn").innerHTML = `${CC.icons.check} Save Changes`; $("#cancelEdit").style.display = "";
      window.scrollTo({ top: 0, behavior: "smooth" }); CC.toast(`Editing "${u.title}"`, "info");
    }));
  };
  render();
};

/* ---- Landing page ---- */
CC.pages.landing = function () {
  $("#loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = $("#loginRole").value;
    if (!$("#loginEmail").value || !$("#loginPass").value) { CC.toast("Please enter your email and password", "error"); return; }
    CC.toast(`Welcome back, ${role}!`);
    setTimeout(() => CC.go(role === "Admin" ? "admin-dashboard.html" : "admin-dashboard.html"), 600);
  });
  if (location.hash === "#login") setTimeout(() => $("#login")?.scrollIntoView({ behavior: "smooth" }), 100);
};

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  CC.renderNavbar();

  // Render icons on every admin page.
  $$("[data-icon]").forEach((el) => {
    el.innerHTML = CC.icons[el.dataset.icon] || "";
  });

  // Enable navigation for monitoring cards on every page, not only the
  // main dashboard. This is required for User Monitoring and Course
  // Monitoring, whose cards live on separate intermediate pages.
  $$(".task-card[data-href]").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");

    const open = () => {
      const target = card.dataset.href;
      if (target) window.location.assign(target);
    };

    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  const page = document.body.dataset.page;
  if (CC.pages[page]) CC.pages[page]();
});
