/* ============================================================
   CAPACITY CONNECT - EXPLORE & ENROLLED COURSES LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("explore-courses-grid")) {
    renderExploreCourses();
    setupFilters();
  }

  if (document.getElementById("all-enrolled-grid")) {
    renderEnrolledCourses();
  }

  if (document.getElementById("course-detail-page")) {
    renderCourseDetailPage();
  }
});

function renderExploreCourses() {
  const grid = document.getElementById("explore-courses-grid");
  if (!grid) return;

  const courses = getCourses();
  const trainee = getCurrentTrainee();

  const searchVal = document.getElementById("search-input")?.value.toLowerCase() || "";
  const catVal = document.getElementById("category-filter")?.value || "";
  const levelVal = document.getElementById("level-filter")?.value || "";

  const filtered = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchVal) || c.trainer.toLowerCase().includes(searchVal);
    const matchesCat = catVal === "" || c.category === catVal;
    const matchesLevel = levelVal === "" || c.level === levelVal;
    return matchesSearch && matchesCat && matchesLevel;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1;" class="empty-state">
        <h3>No courses match your search criteria.</h3>
        <p>Try clearing filters or searching with a different keyword.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(course => {
    const isEnrolled = trainee.enrolledCourses.includes(course.id);
    return `
      <div class="course-card-vertical">
        <img src="${course.image}" alt="${course.name}">
        <div class="course-card-body">
          <span class="tag" style="align-self: flex-start; margin-bottom: 8px;">${course.level}</span>
          <h3>${course.name}</h3>
          <div class="trainer">Trainer: ${course.trainer} | ⭐ ${course.rating}</div>
          <div class="course-card-actions">
            <button class="btn btn-outline" style="flex:1;" onclick="openCourseModal('${course.id}')">View</button>
            <button class="btn ${isEnrolled ? 'btn-secondary' : 'btn-accent'}" style="flex:1;" ${isEnrolled ? 'disabled' : ''} onclick="confirmEnrollment('${course.id}')">
              ${isEnrolled ? 'Enrolled' : 'Enroll'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function setupFilters() {
  ["search-input", "category-filter", "level-filter"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", renderExploreCourses);
  });
}

function openCourseModal(courseId) {
  const course = getCourseById(courseId);
  const trainee = getCurrentTrainee();
  const isEnrolled = trainee.enrolledCourses.includes(course.id);

  const content = `
    <div class="modal-container">
      <div class="modal-header">
        <h3>${course.name} (${course.code})</h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body" style="font-size: 13.5px; line-height: 1.7;">
        <p><strong>Category:</strong> ${course.category} | <strong>Level:</strong> ${course.level}</p>
        <p><strong>Trainer:</strong> ${course.trainer} (Rating: ⭐ ${course.rating})</p>
        <p><strong>Duration:</strong> ${course.duration} (${course.startDate} to ${course.endDate})</p>
        <hr style="border: none; border-top: 1px solid var(--gray-200); margin: 12px 0;">
        <p><strong>Description:</strong> ${course.description}</p>
        <br>
        <p><strong>Learning Objectives:</strong></p>
        <ul style="padding-left: 20px;">
          ${course.objectives.map(o => `<li>${o}</li>`).join("")}
        </ul>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal()">Close</button>
        <button class="btn btn-accent" ${isEnrolled ? 'disabled' : ''} onclick="closeModal(); confirmEnrollment('${course.id}');">
          ${isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  `;
  openModal(content);
}

function confirmEnrollment(courseId) {
  const trainee = getCurrentTrainee();
  if (!trainee) {
    window.location.href = "index.html#login";
    return;
  }

  const course = getCourseById(courseId);

  const content = `
    <div class="modal-container">
      <div class="modal-header">
        <h3>Confirm Enrollment</h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body" style="font-size: 13.5px;">
        <p style="margin-bottom: 12px;">You are about to enroll in <strong>${course.name}</strong>.</p>
        <div style="background: var(--gray-100); padding: 12px; border-radius: var(--radius-sm);">
          <p><strong>Trainee:</strong> ${trainee.name}</p>
          <p><strong>Email:</strong> ${trainee.email}</p>
          <p><strong>Course Duration:</strong> ${course.duration}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
        <button class="btn btn-accent" onclick="processEnrollment('${course.id}')">Confirm Enrollment</button>
      </div>
    </div>
  `;
  openModal(content);
}

function processEnrollment(courseId) {
  const trainee = getCurrentTrainee();
  if (!trainee.enrolledCourses.includes(courseId)) {
    trainee.enrolledCourses.push(courseId);
    saveCurrentTrainee(trainee);
    closeModal();
    showToast("Enrolled in course successfully!");
    if (document.getElementById("explore-courses-grid")) renderExploreCourses();
  }
}

function renderEnrolledCourses() {
  const grid = document.getElementById("all-enrolled-grid");
  if (!grid) return;

  const trainee = getCurrentTrainee();
  const courses = getCourses().filter(c => trainee.enrolledCourses.includes(c.id));

  if (courses.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>You have no active course enrollments.</h3>
        <p>Explore our catalog to start learning!</p>
        <a href="explore-courses.html" class="btn btn-primary">Browse Courses</a>
      </div>
    `;
    return;
  }

  grid.innerHTML = courses.map(course => {
    const total = course.modules.length;
    const completed = course.modules.filter(m => m.completed).length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    const isCompleted = pct === 100;
    const hasCert = trainee.certificates && trainee.certificates.some(c => c.courseId === course.id);

    let btnHtml = `<a href="course.html?id=${course.id}" class="btn btn-primary">Go to Course</a>`;
    if (isCompleted) {
      if (hasCert) {
        btnHtml = `<button class="btn btn-secondary" disabled>Certificate Received</button>`;
      } else {
        btnHtml = `<button class="btn btn-accent" onclick="claimCertificate('${course.id}')">Get Certificate</button>`;
      }
    }

    return `
      <div class="course-card-horizontal" style="margin-bottom: 16px;">
        <div>
          <span class="tag">${course.code}</span>
          <h3 style="font-size: 18px; color: var(--navy); margin-top: 4px;">${course.name}</h3>
          <p style="font-size: 12px; color: var(--gray-600);">Trainer: ${course.trainer} | ${course.startDate} to ${course.endDate}</p>
        </div>
        <div style="display:flex; align-items:center; gap: 20px;">
          <div class="progress-bar-wrap">
            <div class="progress-labels"><span>Progress</span><span>${pct}%</span></div>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
          </div>
          ${btnHtml}
        </div>
      </div>
    `;
  }).join("");
}

function renderCourseDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");
  const course = getCourseById(courseId);

  if (!course) {
    document.getElementById("course-detail-page").innerHTML = `<div class="empty-state"><h3>Course not found.</h3></div>`;
    return;
  }

  document.getElementById("course-title").innerText = course.name;
  document.getElementById("course-code").innerText = `${course.code} | Trainer: ${course.trainer}`;
  document.getElementById("course-desc").innerText = course.description;

  const modulesList = document.getElementById("modules-list");
  modulesList.innerHTML = course.modules.map((mod, idx) => `
    <div style="background: var(--white); border: 1px solid var(--gray-200); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: var(--navy);">${mod.title}</strong>
      </div>
      <label style="font-size: 13px; display: flex; align-items: center; gap: 6px; cursor: pointer;">
        <input type="checkbox" ${mod.completed ? 'checked' : ''} onchange="toggleModule('${course.id}', ${idx})"> Mark Completed
      </label>
    </div>
  `).join("");

  updateDetailPageProgress(course);
}

function toggleModule(courseId, index) {
  const courses = getCourses();
  const course = courses.find(c => c.id === courseId);
  course.modules[index].completed = !course.modules[index].completed;
  saveCourses(courses);

  updateDetailPageProgress(course);
  showToast("Progress updated!");
}

function updateDetailPageProgress(course) {
  const total = course.modules.length;
  const completed = course.modules.filter(m => m.completed).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const fill = document.getElementById("course-progress-fill");
  const text = document.getElementById("course-progress-text");
  if (fill) fill.style.width = `${pct}%`;
  if (text) text.innerText = `${pct}% Completed`;

  if (pct === 100) {
    const trainee = getCurrentTrainee();
    if (!trainee.completedCourses.includes(course.id)) {
      trainee.completedCourses.push(course.id);
      saveCurrentTrainee(trainee);
    }
  }
}

function claimCertificate(courseId) {
  const trainee = getCurrentTrainee();
  const course = getCourseById(courseId);
  const certId = "CERT-" + Math.floor(100000 + Math.random() * 900000);
  const certObj = {
    id: certId,
    courseId: course.id,
    courseName: course.name,
    trainerName: course.trainer,
    name: `Certificate of Completion - ${course.name}`,
    date: new Date().toISOString().split("T")[0]
  };

  if (!trainee.certificates) trainee.certificates = [];
  trainee.certificates.push(certObj);
  saveCurrentTrainee(trainee);

  const content = `
    <div class="modal-container" style="max-width: 600px;">
      <div class="modal-header">
        <h3>Certificate Preview</h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="certificate-card">
          <h2 style="font-size: 18px;">CAPACITY CONNECT</h2>
          <p style="font-size: 12px; font-weight: 600; text-transform: uppercase;">Certificate of Completion</p>
          <p style="margin-top: 15px; font-size: 13px;">This is awarded to</p>
          <div class="recipient">${trainee.name}</div>
          <p style="font-size: 13px;">for successfully completing the course</p>
          <p style="font-weight: 700; color: var(--navy); font-size: 15px;">${course.name}</p>
          <p style="font-size: 12px; margin-top: 15px;">Trainer: ${course.trainer} | Date: ${certObj.date}</p>
          <p style="font-size: 10px; color: var(--gray-600); margin-top: 10px;">ID: ${certId}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="closeModal(); renderEnrolledCourses();">Close & Save</button>
      </div>
    </div>
  `;
  openModal(content);
}