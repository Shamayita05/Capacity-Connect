/* ==========================================================================
   statistics.js – Overall Statistics Dashboard (pure CSS/HTML charts)
   Loaded only by statistics.html, after data.js and admin.js.
   ========================================================================== */

CC.pages.statistics = function () {
  const S = CC.SEED.stats;
  const T = S.totals;
  const certsIssued = T.certificates + CC.load("certifications").filter((c) => c.status === "Issued").length - 1;
  const esc = (s) => String(s).replace(/</g, "&lt;");

  /* Helpers to produce chart markup */
  const statCard = (icon, val, lbl, accent) => `
    <div class="card stat-card reveal"><div class="task-icon" style="--accent:${accent}">${CC.icons[icon]}</div>
    <div><div class="val">${val.toLocaleString("en-IN")}</div><div class="lbl">${lbl}</div></div></div>`;

  const barChart = (data, fill, suffix = "") => {
    const max = Math.max(...data.map((d) => d.v));
    return `<div class="chart-bars">${data.map((d) => `<div class="bar"><i data-h="${Math.round((d.v / max) * 100)}" data-val="${d.v}${suffix}" style="--fill:${fill}"></i><small>${esc(d.m)}</small></div>`).join("")}</div>`;
  };

  const donut = (pct, c1, c2, label) => `
    <div class="donut" style="--p:${pct};--c1:${c1};--c2:${c2}"><span>${pct}%</span></div>
    <div class="legend">${label.map((l, i) => `<span><i style="background:${i === 0 ? c1 : c2}"></i>${l}</span>`).join("")}</div>`;

  const tracker = (label, pct, fill) => `
    <div class="progress-row"><div class="meta"><span>${label}</span><span>${pct}%</span></div>
    <div class="progress"><span data-w="${pct}" style="--fill:${fill}"></span></div></div>`;

  const chartCard = (title, sub, body) => `<section class="card reveal"><h3 class="card-title">${title}</h3><p class="card-sub">${sub}</p><div style="margin-top:1rem">${body}</div></section>`;

  const activityIcon = { user: "student", course: "book", enroll: "users", assessment: "clipboard", cert: "award" };
  const activityAccent = { user: "var(--aqua)", course: "var(--sage)", enroll: "var(--mint)", assessment: "var(--aqua)", cert: "var(--sage-dark)" };

  const traineeShare = Math.round((T.trainees / (T.trainees + T.trainers)) * 100);

  $("#app").innerHTML = `
    <div class="grid grid-3">
      ${statCard("student", T.trainees, "Total Trainees", "var(--aqua)")}
      ${statCard("teacher", T.trainers, "Total Trainers", "var(--sage)")}
      ${statCard("book", T.courses, "Total Courses", "var(--mint)")}
      ${statCard("users", T.enrollments, "Total Enrollments", "var(--sage-dark)")}
      ${statCard("award", certsIssued, "Certifications Issued", "var(--mint)")}
      ${statCard("clipboard", T.assessments, "Active Assessments", "var(--aqua)")}
    </div>

    <div class="grid grid-3" style="margin-top:1.25rem">
      ${chartCard("User Distribution", "Trainees vs Trainers", donut(traineeShare, "var(--navy)", "var(--mint)", [`Trainees (${T.trainees})`, `Trainers (${T.trainers})`]))}
      ${chartCard("Course Completion", "Completed vs In Progress", donut(S.completion.completed, "var(--sage-dark)", "var(--aqua)", ["Completed", "In Progress"]))}
      ${chartCard("Participation Rate", "Overall trainee participation", donut(S.participation, "var(--mint)", "rgba(2,48,71,.1)", ["Participating", "Inactive"]))}
    </div>

    <div class="grid grid-2" style="margin-top:1.25rem">
      ${chartCard("Course Enrollment", "Monthly enrollment trend", barChart(S.enrollmentTrend, "var(--sage-dark)"))}
      ${chartCard("Assessment Performance", "Average scores by course category", barChart(S.assessmentScores, "var(--aqua)", "%"))}
      ${chartCard("Certification Statistics", "Certificates issued over time", barChart(S.certTrend, "var(--mint)"))}
      ${chartCard("Progress Trackers", "Platform-wide completion indicators", `<div class="stack" style="gap:1.1rem">
        ${tracker("Course Completion", S.trackers.course, "var(--sage-dark)")}
        ${tracker("Assessment Completion", S.trackers.assessment, "var(--aqua)")}
        ${tracker("Training Participation", S.trackers.participation, "var(--mint)")}
        ${tracker("Certification Completion", S.trackers.certification, "var(--navy)")}
      </div>`)}
    </div>

    <section class="card reveal" style="margin-top:1.25rem">
      <h3 class="card-title">Recent Activity</h3><p class="card-sub">Latest events across the platform</p>
      <ul class="feed" style="margin-top:.75rem">${CC.load("activity").map((a) => `
        <li><span class="dot" style="--accent:${activityAccent[a.type]}">${CC.icons[activityIcon[a.type]]}</span>
        <div><div class="cell-strong">${esc(a.text)}</div><div class="when">${esc(a.when)}</div></div></li>`).join("")}</ul>
    </section>`;

  CC.animateBars();
};
