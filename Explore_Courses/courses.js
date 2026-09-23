/* ============================================================
   CAPACITY CONNECT - EXPLORE & ENROLLED COURSES LOGIC
   ============================================================ */

/* ============================================================
   HARD-CODED EXPLORE COURSES
   ============================================================ */

const HARD_CODED_COURSES = [
  {
    id: "python-data-analysis",
    name: "Python for Data Analysis",
    code: "PDA101",
    category: "Data Science",
    level: "Beginner",
    trainer: "Ananya Sharma",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80",

    duration: "6 Weeks",
    startDate: "01 October 2026",
    endDate: "12 November 2026",

    description: "Learn the fundamentals of Python for data analysis, including data handling, processing, and basic analytical techniques.",

    objectives: [
      "Understand Python fundamentals",
      "Work with data using Python",
      "Perform basic data analysis",
      "Use Python libraries for data handling"
    ],

    modules: [
      { title: "Python Basics", completed: false },
      { title: "Data Types and Structures", completed: false },
      { title: "Data Handling", completed: false },
      { title: "Data Analysis", completed: false }
    ]
  },

  {
    id: "cybersecurity-fundamentals",
    name: "Cybersecurity Fundamentals",
    code: "CSF101",
    category: "Cybersecurity",
    level: "Intermediate",
    trainer: "Shamayita Das",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80",

    duration: "6 Weeks",
    startDate: "05 October 2026",
    endDate: "16 November 2026",

    description: "Build a strong foundation in cybersecurity concepts, threats, vulnerabilities, and basic security practices.",

    objectives: [
      "Understand fundamental cybersecurity concepts",
      "Identify common cyber threats",
      "Learn about vulnerabilities and attacks",
      "Understand basic security practices"
    ],

    modules: [
      { title: "Introduction to Cybersecurity", completed: false },
      { title: "Cyber Threats and Attacks", completed: false },
      { title: "Network Security", completed: false },
      { title: "Security Best Practices", completed: false }
    ]
  },

  {
    id: "database-management-systems",
    name: "Database Management Systems",
    code: "DBMS101",
    category: "Database",
    level: "Beginner",
    trainer: "Priya Nair",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",

    duration: "6 Weeks",
    startDate: "10 October 2026",
    endDate: "21 November 2026",

    description: "Learn database fundamentals, SQL, relational database concepts, and essential database management techniques.",

    objectives: [
      "Understand database fundamentals",
      "Learn relational database concepts",
      "Write basic SQL queries",
      "Understand database management"
    ],

    modules: [
      { title: "Database Fundamentals", completed: false },
      { title: "Relational Databases", completed: false },
      { title: "SQL Commands", completed: false },
      { title: "Database Management", completed: false }
    ]
  }
];


/* ============================================================
   PAGE INITIALIZATION
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


/* ============================================================
   GET HARD-CODED COURSE
   ============================================================ */

function getHardcodedCourseById(courseId) {
  return HARD_CODED_COURSES.find(course => course.id === courseId);
}


/* ============================================================
   EXPLORE COURSES
   ============================================================ */

function renderExploreCourses() {

  const grid = document.getElementById("explore-courses-grid");

  if (!grid) return;

  const courses = HARD_CODED_COURSES;

  const trainee = getCurrentTrainee();

  if (!trainee) {
    return;
  }

  const searchVal =
    document.getElementById("search-input")?.value.toLowerCase() || "";

  const catVal =
    document.getElementById("category-filter")?.value || "";

  const levelVal =
    document.getElementById("level-filter")?.value || "";


  /* FILTER COURSES */

  const filtered = courses.filter(course => {

    const matchesSearch =
      course.name.toLowerCase().includes(searchVal) ||
      course.trainer.toLowerCase().includes(searchVal);

    const matchesCat =
      catVal === "" || course.category === catVal;

    const matchesLevel =
      levelVal === "" || course.level === levelVal;

    return matchesSearch && matchesCat && matchesLevel;

  });


  /* NO RESULTS */

  if (filtered.length === 0) {

    grid.innerHTML = `
      <div style="grid-column: 1 / -1;" class="empty-state">

        <h3>No courses match your search criteria.</h3>

        <p>
          Try clearing filters or searching with a different keyword.
        </p>

      </div>
    `;

    return;
  }


  /* RENDER COURSES */

  grid.innerHTML = filtered.map(course => {

    const isEnrolled =
      trainee.enrolledCourses &&
      trainee.enrolledCourses.includes(course.id);

    return `

      <div class="course-card-vertical">

        <img
          src="${course.image}"
          alt="${course.name}"
        >

        <div class="course-card-body">

          <span
            class="tag"
            style="align-self: flex-start; margin-bottom: 8px;"
          >
            ${course.level}
          </span>

          <h3>
            ${course.name}
          </h3>

          <div class="trainer">
            Trainer: ${course.trainer} | ⭐ ${course.rating}
          </div>


            <div class="course-card-actions">

  <button
    class="btn btn-outline"
    style="width:100%;"
    onclick="openCourseModal('${course.id}')"
  >
    View Details
  </button>

</div>


        </div>

      </div>

    `;

  }).join("");

}


/* ============================================================
   FILTERS
   ============================================================ */

function setupFilters() {

  ["search-input", "category-filter", "level-filter"].forEach(id => {

    const el = document.getElementById(id);

    if (el) {
      el.addEventListener("input", renderExploreCourses);
    }

  });

}


/* ============================================================
   COURSE MODAL
   ============================================================ */

function openCourseModal(courseId) {

  const course = getHardcodedCourseById(courseId);

  const trainee = getCurrentTrainee();

  if (!course || !trainee) return;

  const isEnrolled =
    trainee.enrolledCourses &&
    trainee.enrolledCourses.includes(course.id);


  const content = `

    <div class="modal-container">

      <div class="modal-header">

        <h3>
          ${course.name} (${course.code})
        </h3>

        <button
          class="modal-close"
          onclick="closeModal()"
        >
          &times;
        </button>

      </div>


      <div
        class="modal-body"
        style="font-size: 13.5px; line-height: 1.7;"
      >

        <p>
          <strong>Category:</strong> ${course.category}
          |
          <strong>Level:</strong> ${course.level}
        </p>

        <p>
          <strong>Trainer:</strong> ${course.trainer}
          (Rating: ⭐ ${course.rating})
        </p>

        <p>
          <strong>Duration:</strong> ${course.duration}
          (${course.startDate} to ${course.endDate})
        </p>

        <hr
          style="
            border: none;
            border-top: 1px solid var(--gray-200);
            margin: 12px 0;
          "
        >

        <p>
          <strong>Description:</strong>
          ${course.description}
        </p>

        <br>

        <p>
          <strong>Learning Objectives:</strong>
        </p>

        <ul style="padding-left: 20px;">

          ${course.objectives
            .map(objective => `<li>${objective}</li>`)
            .join("")}

        </ul>

      </div>


      <div class="modal-footer">

        <button
          class="btn btn-outline"
          onclick="closeModal()"
        >
          Close
        </button>

        <button
          class="btn btn-accent"
          ${isEnrolled ? "disabled" : ""}
          onclick="closeModal(); confirmEnrollment('${course.id}');"
        >
          ${isEnrolled ? "Already Enrolled" : "Enroll Now"}
        </button>

      </div>

    </div>

  `;

  openModal(content);

}


/* ============================================================
   CONFIRM ENROLLMENT
   ============================================================ */

function confirmEnrollment(courseId) {

  const trainee = getCurrentTrainee();

  if (!trainee) {

    window.location.href = "index.html#login";

    return;
  }


  const course = getHardcodedCourseById(courseId);

  if (!course) return;


  const content = `

    <div class="modal-container">

      <div class="modal-header">

        <h3>
          Confirm Enrollment
        </h3>

        <button
          class="modal-close"
          onclick="closeModal()"
        >
          &times;
        </button>

      </div>


      <div
        class="modal-body"
        style="font-size: 13.5px;"
      >

        <p style="margin-bottom: 12px;">

          You are about to enroll in
          <strong>${course.name}</strong>.

        </p>


        <div
          style="
            background: var(--gray-100);
            padding: 12px;
            border-radius: var(--radius-sm);
          "
        >

          <p>
            <strong>Trainee:</strong>
            ${trainee.name}
          </p>

          <p>
            <strong>Email:</strong>
            ${trainee.email}
          </p>

          <p>
            <strong>Course Duration:</strong>
            ${course.duration}
          </p>

        </div>

      </div>


      <div class="modal-footer">

        <button
          class="btn btn-outline"
          onclick="closeModal()"
        >
          Cancel
        </button>

        <button
          class="btn btn-accent"
          onclick="processEnrollment('${course.id}')"
        >
          Confirm Enrollment
        </button>

      </div>

    </div>

  `;

  openModal(content);

}


/* ============================================================
   PROCESS ENROLLMENT
   ============================================================ */

function processEnrollment(courseId) {

  const trainee = getCurrentTrainee();

  if (!trainee) return;


  if (!trainee.enrolledCourses) {
    trainee.enrolledCourses = [];
  }


  if (!trainee.enrolledCourses.includes(courseId)) {

    trainee.enrolledCourses.push(courseId);

    saveCurrentTrainee(trainee);

    closeModal();

    showToast("Enrolled in course successfully!");


    if (document.getElementById("explore-courses-grid")) {

      renderExploreCourses();

    }

  }

}


/* ============================================================
   ENROLLED COURSES
   ============================================================ */

function renderEnrolledCourses() {

  const grid = document.getElementById("all-enrolled-grid");

  if (!grid) return;


  const trainee = getCurrentTrainee();

  if (!trainee) return;


  const courses = HARD_CODED_COURSES.filter(course =>

    trainee.enrolledCourses &&
    trainee.enrolledCourses.includes(course.id)

  );


  if (courses.length === 0) {

    grid.innerHTML = `

      <div class="empty-state">

        <h3>
          You have no active course enrollments.
        </h3>

        <p>
          Explore our catalog to start learning!
        </p>

        <a
          href="explore-courses.html"
          class="btn btn-primary"
        >
          Browse Courses
        </a>

      </div>

    `;

    return;
  }


  grid.innerHTML = courses.map(course => {

    const total = course.modules.length;

    const completed =
      course.modules.filter(m => m.completed).length;

    const pct =
      total === 0
        ? 0
        : Math.round((completed / total) * 100);

    const isCompleted = pct === 100;


    const hasCert =
      trainee.certificates &&
      trainee.certificates.some(
        c => c.courseId === course.id
      );


    let btnHtml = `
      <a
        href="course.html?id=${course.id}"
        class="btn btn-primary"
      >
        Go to Course
      </a>
    `;


    if (isCompleted) {

      if (hasCert) {

        btnHtml = `
          <button
            class="btn btn-secondary"
            disabled
          >
            Certificate Received
          </button>
        `;

      } else {

        btnHtml = `
          <button
            class="btn btn-accent"
            onclick="claimCertificate('${course.id}')"
          >
            Get Certificate
          </button>
        `;

      }

    }


    return `

      <div
        class="course-card-horizontal"
        style="margin-bottom: 16px;"
      >

        <div>

          <span class="tag">
            ${course.code}
          </span>

          <h3
            style="
              font-size: 18px;
              color: var(--navy);
              margin-top: 4px;
            "
          >
            ${course.name}
          </h3>

          <p
            style="
              font-size: 12px;
              color: var(--gray-600);
            "
          >
            Trainer: ${course.trainer}
            |
            ${course.startDate} to ${course.endDate}
          </p>

        </div>


        <div
          style="
            display:flex;
            align-items:center;
            gap:20px;
          "
        >

          <div class="progress-bar-wrap">

            <div class="progress-labels">

              <span>Progress</span>

              <span>${pct}%</span>

            </div>


            <div class="progress-track">

              <div
                class="progress-fill"
                style="width:${pct}%;"
              ></div>

            </div>

          </div>


          ${btnHtml}

        </div>

      </div>

    `;

  }).join("");

}


/* ============================================================
   COURSE DETAIL PAGE
   ============================================================ */

function renderCourseDetailPage() {

  const params =
    new URLSearchParams(window.location.search);

  const courseId =
    params.get("id");

  const course =
    getHardcodedCourseById(courseId);


  if (!course) {

    document.getElementById(
      "course-detail-page"
    ).innerHTML = `
      <div class="empty-state">
        <h3>Course not found.</h3>
      </div>
    `;

    return;
  }


  document.getElementById("course-title").innerText =
    course.name;


  document.getElementById("course-code").innerText =
    `${course.code} | Trainer: ${course.trainer}`;


  document.getElementById("course-desc").innerText =
    course.description;


  const modulesList =
    document.getElementById("modules-list");


  modulesList.innerHTML =
    course.modules.map((mod, idx) => `

      <div
        style="
          background: var(--white);
          border: 1px solid var(--gray-200);
          padding: 14px;
          border-radius: var(--radius-sm);
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >

        <div>

          <strong style="color: var(--navy);">
            ${mod.title}
          </strong>

        </div>


        <label
          style="
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
          "
        >

          <input
            type="checkbox"
            ${mod.completed ? "checked" : ""}
            onchange="toggleModule('${course.id}', ${idx})"
          >

          Mark Completed

        </label>

      </div>

    `).join("");


  updateDetailPageProgress(course);

}


/* ============================================================
   TOGGLE MODULE
   ============================================================ */

function toggleModule(courseId, index) {

  const course =
    getHardcodedCourseById(courseId);

  if (!course) return;


  course.modules[index].completed =
    !course.modules[index].completed;


  updateDetailPageProgress(course);

  showToast("Progress updated!");

}


/* ============================================================
   UPDATE COURSE PROGRESS
   ============================================================ */

function updateDetailPageProgress(course) {

  const total =
    course.modules.length;

  const completed =
    course.modules.filter(
      m => m.completed
    ).length;

  const pct =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);


  const fill =
    document.getElementById(
      "course-progress-fill"
    );

  const text =
    document.getElementById(
      "course-progress-text"
    );


  if (fill) {
    fill.style.width = `${pct}%`;
  }


  if (text) {
    text.innerText =
      `${pct}% Completed`;
  }


  if (pct === 100) {

    const trainee =
      getCurrentTrainee();

    if (!trainee) return;


    if (!trainee.completedCourses) {
      trainee.completedCourses = [];
    }


    if (!trainee.completedCourses.includes(course.id)) {

      trainee.completedCourses.push(course.id);

      saveCurrentTrainee(trainee);

    }

  }

}


/* ============================================================
   CLAIM CERTIFICATE
   ============================================================ */

function claimCertificate(courseId) {

  const trainee =
    getCurrentTrainee();

  const course =
    getHardcodedCourseById(courseId);

  if (!trainee || !course) return;


  const certId =
    "CERT-" +
    Math.floor(
      100000 +
      Math.random() * 900000
    );


  const certObj = {

    id: certId,

    courseId: course.id,

    courseName: course.name,

    trainerName: course.trainer,

    name:
      `Certificate of Completion - ${course.name}`,

    date:
      new Date()
        .toISOString()
        .split("T")[0]

  };


  if (!trainee.certificates) {
    trainee.certificates = [];
  }


  trainee.certificates.push(certObj);

  saveCurrentTrainee(trainee);


  const content = `

    <div
      class="modal-container"
      style="max-width: 600px;"
    >

      <div class="modal-header">

        <h3>
          Certificate Preview
        </h3>

        <button
          class="modal-close"
          onclick="closeModal()"
        >
          &times;
        </button>

      </div>


      <div class="modal-body">

        <div class="certificate-card">

          <h2 style="font-size: 18px;">
            CAPACITY CONNECT
          </h2>

          <p
            style="
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            "
          >
            Certificate of Completion
          </p>

          <p
            style="
              margin-top: 15px;
              font-size: 13px;
            "
          >
            This is awarded to
          </p>

          <div class="recipient">
            ${trainee.name}
          </div>

          <p style="font-size: 13px;">
            for successfully completing the course
          </p>

          <p
            style="
              font-weight: 700;
              color: var(--navy);
              font-size: 15px;
            "
          >
            ${course.name}
          </p>

          <p
            style="
              font-size: 12px;
              margin-top: 15px;
            "
          >
            Trainer:
            ${course.trainer}
            |
            Date:
            ${certObj.date}
          </p>

          <p
            style="
              font-size: 10px;
              color: var(--gray-600);
              margin-top: 10px;
            "
          >
            ID:
            ${certId}
          </p>

        </div>

      </div>


      <div class="modal-footer">

        <button
          class="btn btn-primary"
          onclick="closeModal(); renderEnrolledCourses();"
        >
          Close & Save
        </button>

      </div>

    </div>

  `;


  openModal(content);

}