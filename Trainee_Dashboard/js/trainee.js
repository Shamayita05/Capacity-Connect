/* ============================================================
   CAPACITY CONNECT - COMMON TRAINEE MODULE UTILITIES
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  setupNavbar();
  setupQuote();
  renderDashboardData();
  setupModalEvents();
});

function setupNavbar() {
  const logoutBtn = document.getElementById("nav-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("capacity_trainee");
      window.location.href = "../../Landing_Page/Landing_Page.html";
    });
  }
}

function setupQuote() {
  const quoteElem = document.getElementById("daily-quote");
  if (quoteElem) {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    quoteElem.innerText = `"${randomQuote}"`;
  }
}

function renderDashboardData() {
  const trainee = getCurrentTrainee();
  if (!trainee) return;

  // Render Name & Avatar
  const nameElems = document.querySelectorAll(".trainee-name");
  nameElems.forEach(el => el.innerText = trainee.name);

  const avatarElems = document.querySelectorAll(".trainee-avatar");
  avatarElems.forEach(el => el.src = trainee.profileImage);

  // Stats
  const courses = getCourses();
  const enrolledList = courses.filter(c => trainee.enrolledCourses.includes(c.id));
  
  const enrolledCountEl = document.getElementById("stat-enrolled");
  if (enrolledCountEl) enrolledCountEl.innerText = trainee.enrolledCourses.length;

  const completedCountEl = document.getElementById("stat-completed");
  if (completedCountEl) completedCountEl.innerText = trainee.completedCourses.length;

  const certsCountEl = document.getElementById("stat-certs");
  if (certsCountEl) certsCountEl.innerText = trainee.certificates ? trainee.certificates.length : 0;

  const streakEl = document.getElementById("stat-streak");
  if (streakEl) streakEl.innerText = trainee.streak || 7;

  // Unread Notification Count
  const notifications = JSON.parse(localStorage.getItem("capacity_notifications")) || [];
  const unreadCount = notifications.filter(n => !n.read).length;
  const badgeEl = document.getElementById("notif-badge");
  if (badgeEl) {
    if (unreadCount > 0) {
      badgeEl.innerText = unreadCount;
      badgeEl.style.display = "inline-block";
    } else {
      badgeEl.style.display = "none";
    }
  }

  // Dashboard Enrolled Courses (Max 3)
  const dashboardCoursesList = document.getElementById("dashboard-enrolled-courses");
  if (dashboardCoursesList) {
    if (enrolledList.length === 0) {
      dashboardCoursesList.innerHTML = `
        <div class="empty-state">
          <h3>You haven't enrolled in any courses yet.</h3>
          <p>Discover available courses and start learning today!</p>
          <a href="explore-courses.html" class="btn btn-primary">Explore Courses</a>
        </div>
      `;
    } else {
      dashboardCoursesList.innerHTML = enrolledList.slice(0, 3).map(course => {
        const totalMods = course.modules.length;
        const completedMods = course.modules.filter(m => m.completed).length;
        const pct = totalMods === 0 ? 0 : Math.round((completedMods / totalMods) * 100);

        return `
          <div class="course-card-horizontal">
            <div>
              <h3 style="font-size: 16px; color: var(--navy);">${course.name}</h3>
              <div class="course-meta-tags">
                ${course.categories.map(cat => `<span class="tag">${cat}</span>`).join("")}
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 20px;">
              <div class="progress-bar-wrap">
                <div class="progress-labels">
                  <span>Progress</span>
                  <span>${pct}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width: ${pct}%;"></div>
                </div>
              </div>
              <a href="course.html?id=${course.id}" class="btn btn-primary">Go to Course</a>
            </div>
          </div>
        `;
      }).join("");
    }
  }
}

/* --- MODAL SYSTEM --- */
function setupModalEvents() {
  const viewProfileBtn = document.getElementById("btn-view-profile");
  const editProfileBtn = document.getElementById("btn-edit-profile");

  if (viewProfileBtn) viewProfileBtn.addEventListener("click", openViewProfileModal);
  if (editProfileBtn) editProfileBtn.addEventListener("click", openEditProfileModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openModal(htmlContent) {
  let modal = document.getElementById("global-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "global-modal";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }
  modal.innerHTML = htmlContent;
  modal.classList.add("active");

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function closeModal() {
  const modal = document.getElementById("global-modal");
  if (modal) modal.classList.remove("active");
}

function openViewProfileModal() {
  const t = getCurrentTrainee();
  const certsList = (t.certificates && t.certificates.length > 0) 
    ? t.certificates.map(c => `<li><strong>${c.name}</strong> (${c.courseName}) — Issued: ${c.date} [ID: ${c.id}]</li>`).join("")
    : "<li>No certificates earned yet.</li>";

  const content = `
    <div class="modal-container">
      <div class="modal-header">
        <h3>Full Trainee Profile</h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${t.profileImage}" class="avatar-lg" style="margin: 0 auto 10px auto;">
          <h2 style="font-size: 20px; color: var(--navy);">${t.name}</h2>
          <p style="font-size: 13px; color: var(--gray-600);">${t.qualification}</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13.5px;">
          <p><strong>Email:</strong> ${t.email}</p>
          <p><strong>Phone:</strong> ${t.phone}</p>
          <p><strong>About:</strong> ${t.about}</p>
          <p><strong>Skills:</strong> ${t.skills}</p>
          <p><strong>Interests:</strong> ${t.interests}</p>
          <hr style="border: none; border-top: 1px solid var(--gray-200); margin: 6px 0;">
          <h4 style="color: var(--navy);">Certificates Achieved:</h4>
          <ul style="padding-left: 20px; font-size: 13px; color: var(--gray-600);">
            ${certsList}
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  openModal(content);
}

function openEditProfileModal() {
  const t = getCurrentTrainee();
  const content = `
    <div class="modal-container">
      <div class="modal-header">
        <h3>Edit Profile</h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="edit-profile-form">
          <div class="form-group">
            <label>Profile Image URL</label>
            <input type="text" id="edit-avatar" class="form-control" value="${t.profileImage}">
          </div>
          <div class="form-group">
            <label>Email (Non-editable)</label>
            <input type="text" class="form-control" value="${t.email}" disabled>
          </div>
          <div class="form-group">
            <label>Phone (Non-editable)</label>
            <input type="text" class="form-control" value="${t.phone}" disabled>
          </div>
          <div class="form-group">
            <label>Qualification</label>
            <input type="text" id="edit-qual" class="form-control" value="${t.qualification}">
          </div>
          <div class="form-group">
            <label>Skills</label>
            <input type="text" id="edit-skills" class="form-control" value="${t.skills}">
          </div>
          <div class="form-group">
            <label>Interests</label>
            <input type="text" id="edit-interests" class="form-control" value="${t.interests}">
          </div>
          <div class="form-group">
            <label>About</label>
            <textarea id="edit-about" class="form-control" rows="3">${t.about}</textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveProfileChanges()">Save Changes</button>
      </div>
    </div>
  `;
  openModal(content);
}

function saveProfileChanges() {
  const t = getCurrentTrainee();
  t.profileImage = document.getElementById("edit-avatar").value;
  t.qualification = document.getElementById("edit-qual").value;
  t.skills = document.getElementById("edit-skills").value;
  t.interests = document.getElementById("edit-interests").value;
  t.about = document.getElementById("edit-about").value;

  saveCurrentTrainee(t);
  closeModal();
  renderDashboardData();
  showToast("Profile updated successfully!");
}