const STORAGE_KEY = "capacityConnectCourseData";

let data = loadData();
let selectedCourseId = null;
let editingCourseId = null;
let editingMaterialId = null;
let editingAssessmentId = null;
let editingExamId = null;
let confirmCallback = null;


/* =====================================================
   DATA
===================================================== */

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        return JSON.parse(saved);
    }

    return {
        courses: [
            {
                id: "COURSE001",
                title: "Web Development Fundamentals",
                code: "CC-WD-101",
                category: "Web Development",
                description: "Introduction to HTML, CSS and JavaScript for beginners.",
                objectives: "Build responsive web pages and understand basic JavaScript.",
                prerequisites: "Basic computer knowledge.",
                duration: "6 Weeks",
                startDate: "2026-10-01",
                endDate: "2026-11-12",
                maxTrainees: 40,
                enrolled: 28,
                status: "Active",
                materials: [],
                assessments: [],
                exams: []
            }
        ]
    };
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}


/* =====================================================
   BASIC HELPERS
===================================================== */

const $ = id => document.getElementById(id);

function escapeHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function makeId(prefix) {
    return prefix + Date.now().toString(36) +
        Math.random().toString(36).slice(2, 6);
}

function openModal(id) {
    $(id).classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal(id) {
    $(id).classList.remove("open");

    if (!document.querySelector(".modal-overlay.open")) {
        document.body.style.overflow = "";
    }
}

function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.classList.remove("open");
    });

    document.body.style.overflow = "";
}


/* =====================================================
   COURSE DASHBOARD
===================================================== */

function renderCourses() {
    const search = $("searchCourse").value.toLowerCase();
    const status = $("statusFilter").value;
    const category = $("categoryFilter").value;

    const courses = data.courses.filter(course => {
        const matchesSearch =
            course.title.toLowerCase().includes(search) ||
            course.code.toLowerCase().includes(search);

        const matchesStatus =
            status === "all" || course.status === status;

        const matchesCategory =
            category === "all" || course.category === category;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    $("courseList").innerHTML = courses.map(course => `
        <article class="course-card">

            <div class="course-main">
                <h3>${escapeHTML(course.title)}</h3>
                <p>${escapeHTML(course.description)}</p>
            </div>

            <div class="course-info">
                <span>Course Code</span>
                <strong>${escapeHTML(course.code || "-")}</strong>
            </div>

            <div class="course-info">
                <span>Category</span>
                <strong>${escapeHTML(course.category || "-")}</strong>
            </div>

            <div class="course-info">
                <span>Enrolled</span>
                <strong>${course.enrolled || 0}</strong>
            </div>

            <div>
                <span class="status ${course.status.toLowerCase()}">
                    ${escapeHTML(course.status)}
                </span>

                <div class="card-actions">
                    <button class="action-btn"
                        onclick="manageCourse('${course.id}')">
                        Manage
                    </button>

                    <button class="action-btn"
                        onclick="editCourse('${course.id}')">
                        Edit
                    </button>

                    <button class="action-btn delete"
                        onclick="deleteCourse('${course.id}')">
                        Delete
                    </button>
                </div>
            </div>

        </article>
    `).join("");

    $("courseEmpty").style.display =
        courses.length ? "none" : "block";

    updateSummary();
    updateCategories();
}

function updateSummary() {
    $("totalCourses").textContent = data.courses.length;

    $("activeCourses").textContent =
        data.courses.filter(c => c.status === "Active").length;

    $("totalTrainees").textContent =
        data.courses.reduce((sum, c) => sum + Number(c.enrolled || 0), 0);

    const upcoming = data.courses.flatMap(c => c.exams || [])
        .filter(exam =>
            exam.status === "Scheduled" &&
            new Date(`${exam.date}T${exam.startTime || "00:00"}`) >= new Date()
        );

    $("upcomingExams").textContent = upcoming.length;
}

function updateCategories() {
    const select = $("categoryFilter");
    const current = select.value;

    const categories = [...new Set(
        data.courses.map(c => c.category).filter(Boolean)
    )];

    select.innerHTML =
        `<option value="all">All Categories</option>` +
        categories.map(category =>
            `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`
        ).join("");

    if (categories.includes(current)) {
        select.value = current;
    }
}


/* =====================================================
   CREATE / EDIT COURSE
===================================================== */

function resetCourseForm() {
    $("courseForm").reset();
    $("courseStatus").value = "Draft";
}

$("createCourseBtn").addEventListener("click", () => {
    editingCourseId = null;

    resetCourseForm();

    $("courseModalTitle").textContent = "Create Course";
    $("courseSubmit").textContent = "Create Course";

    openModal("courseModal");
});

function editCourse(id) {
    const course = data.courses.find(c => c.id === id);

    if (!course) return;

    editingCourseId = id;

    $("courseTitle").value = course.title;
    $("courseCode").value = course.code;
    $("courseCategory").value = course.category;
    $("courseDescription").value = course.description;
    $("learningObjectives").value = course.objectives;
    $("prerequisites").value = course.prerequisites;
    $("courseDuration").value = course.duration;
    $("courseStart").value = course.startDate;
    $("courseEnd").value = course.endDate;
    $("maxTrainees").value = course.maxTrainees || "";
    $("courseStatus").value = course.status;

    $("courseModalTitle").textContent = "Edit Course";
    $("courseSubmit").textContent = "Save Changes";

    openModal("courseModal");
}

$("courseForm").addEventListener("submit", event => {
    event.preventDefault();

    const courseInfo = {
        title: $("courseTitle").value.trim(),
        code: $("courseCode").value.trim(),
        category: $("courseCategory").value.trim(),
        description: $("courseDescription").value.trim(),
        objectives: $("learningObjectives").value.trim(),
        prerequisites: $("prerequisites").value.trim(),
        duration: $("courseDuration").value.trim(),
        startDate: $("courseStart").value,
        endDate: $("courseEnd").value,
        maxTrainees: Number($("maxTrainees").value) || 0,
        status: $("courseStatus").value
    };

    if (!courseInfo.title || !courseInfo.description) {
        alert("Please fill in all required fields.");
        return;
    }

    if (
        courseInfo.startDate &&
        courseInfo.endDate &&
        courseInfo.endDate < courseInfo.startDate
    ) {
        alert("End date cannot be before start date.");
        return;
    }

    if (editingCourseId) {
        const course = data.courses.find(c => c.id === editingCourseId);
        Object.assign(course, courseInfo);
    } else {
        data.courses.push({
            id: makeId("COURSE"),
            ...courseInfo,
            enrolled: 0,
            materials: [],
            assessments: [],
            exams: []
        });
    }

    saveData();
    closeModal("courseModal");
    renderCourses();
});


function deleteCourse(id) {
    const course = data.courses.find(c => c.id === id);

    if (!course) return;

    console.log(
        `Delete "${course.title}" and all its materials, assessments and exams?`
    );

    const confirmed = confirm(
        `Delete "${course.title}" and all its materials, assessments and exams?`
    );

    if (!confirmed) return;

    data.courses = data.courses.filter(c => c.id !== id);

    saveData();
    renderCourses();
}


/* =====================================================
   COURSE MANAGEMENT
===================================================== */

function manageCourse(id) {
    selectedCourseId = id;

    const course = getSelectedCourse();

    if (!course) return;

    $("manageTitle").textContent = course.title;
    $("manageSubtitle").textContent =
        `${course.code || "No course code"} · ${course.category || "General"}`;

    $("manageDuration").textContent = course.duration || "-";
    $("manageStart").textContent = course.startDate || "-";
    $("manageEnd").textContent = course.endDate || "-";
    $("manageEnrolled").textContent = course.enrolled || 0;
    $("manageStatus").textContent = course.status;

    $("overviewDescription").textContent =
        course.description || "No description provided.";

    $("overviewObjectives").textContent =
        course.objectives || "No learning objectives provided.";

    $("overviewPrerequisites").textContent =
        course.prerequisites || "No prerequisites specified.";

    renderMaterials();
    renderAssessments();
    renderExams();

    document.querySelectorAll(".tab").forEach(tab =>
        tab.classList.remove("active")
    );

    document.querySelector('[data-tab="overview"]').classList.add("active");

    document.querySelectorAll(".tab-panel").forEach(panel =>
        panel.classList.remove("active")
    );

    $("overviewPanel").classList.add("active");

    openModal("manageModal");
}

function getSelectedCourse() {
    return data.courses.find(c => c.id === selectedCourseId);
}


/* =====================================================
   TABS
===================================================== */

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        const name = tab.dataset.tab;

        document.querySelectorAll(".tab").forEach(t =>
            t.classList.remove("active")
        );

        tab.classList.add("active");

        document.querySelectorAll(".tab-panel").forEach(panel =>
            panel.classList.remove("active")
        );

        $(`${name}Panel`).classList.add("active");
    });
});


/* =====================================================
   MATERIALS
===================================================== */

$("addMaterialBtn").addEventListener("click", () => {
    editingMaterialId = null;
    $("materialForm").reset();
    $("materialModalTitle").textContent = "Add Material";
    openModal("materialModal");
});

function renderMaterials() {
    const course = getSelectedCourse();
    const materials = course?.materials || [];

    $("materialList").innerHTML = materials.length ? `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Material</th>
                    <th>Type</th>
                    <th>Module</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${materials.map(material => `
                    <tr>
                        <td><strong>${escapeHTML(material.title)}</strong></td>
                        <td>${escapeHTML(material.type)}</td>
                        <td>${escapeHTML(material.module || "-")}</td>
                        <td>${escapeHTML(material.uploadDate)}</td>
                        <td>
                            <button class="action-btn"
                                onclick="viewMaterial('${material.id}')">
                                View
                            </button>
                            <button class="action-btn"
                                onclick="editMaterial('${material.id}')">
                                Edit
                            </button>
                            <button class="action-btn delete"
                                onclick="deleteMaterial('${material.id}')">
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    ` : "";

    $("materialEmpty").style.display =
        materials.length ? "none" : "block";
}

$("materialForm").addEventListener("submit", event => {
    event.preventDefault();

    const course = getSelectedCourse();
    if (!course) return;

    const file = $("materialFile").files[0];

    const material = {
        id: editingMaterialId || makeId("MAT"),
        title: $("materialTitle").value.trim(),
        module: $("materialModule").value.trim(),
        description: $("materialDescription").value.trim(),
        type: $("materialType").value,
        fileName: file ? file.name : "",
        fileType: file ? file.type : "",
        url: $("materialUrl").value.trim(),
        notes: $("materialNotes").value.trim(),
        uploadDate: new Date().toLocaleDateString()
    };

    if (!material.title) {
        alert("Please enter a material title.");
        return;
    }

    if (editingMaterialId) {
        const index = course.materials.findIndex(
            m => m.id === editingMaterialId
        );

        if (index !== -1) {
            course.materials[index] = {
                ...course.materials[index],
                ...material,
                fileName: file ? file.name : course.materials[index].fileName
            };
        }
    } else {
        course.materials.push(material);
    }

    saveData();
    closeModal("materialModal");
    renderMaterials();
});

function editMaterial(id) {
    const course = getSelectedCourse();
    const material = course.materials.find(m => m.id === id);

    if (!material) return;

    editingMaterialId = id;

    $("materialTitle").value = material.title;
    $("materialModule").value = material.module;
    $("materialDescription").value = material.description;
    $("materialType").value = material.type;
    $("materialUrl").value = material.url;
    $("materialNotes").value = material.notes;

    $("materialModalTitle").textContent = "Edit Material";

    openModal("materialModal");
}

function viewMaterial(id) {
    const course = getSelectedCourse();
    const material = course.materials.find(m => m.id === id);

    if (!material) return;

    if (material.url) {
        window.open(material.url, "_blank");
        return;
    }

    alert(
        `Material: ${material.title}\n\n` +
        `Type: ${material.type}\n` +
        `File: ${material.fileName || "No file uploaded"}\n\n` +
        `Prototype note: uploaded file metadata is stored locally. ` +
        `Connect Firebase Storage/backend later for persistent file viewing.`
    );
}

function deleteMaterial(id) {
    const course = getSelectedCourse();
    const material = course.materials.find(m => m.id === id);

    if (!material) return;

    askConfirmation(
        "Delete Material?",
        `Delete "${material.title}" from this course?`,
        () => {
            course.materials =
                course.materials.filter(m => m.id !== id);

            saveData();
            renderMaterials();
        }
    );
}


/* =====================================================
   ASSESSMENTS
===================================================== */

$("addAssessmentBtn").addEventListener("click", () => {
    editingAssessmentId = null;
    $("assessmentForm").reset();
    $("assessmentQuestions").innerHTML = "";
    $("assessmentModalTitle").textContent = "Create Assessment";
    $("quizBuilder").classList.add("hidden");

    openModal("assessmentModal");
});

$("assessmentType").addEventListener("change", () => {
    const isQuiz = $("assessmentType").value === "Quiz";
    $("quizBuilder").classList.toggle("hidden", !isQuiz);
});

function renderAssessments() {
    const course = getSelectedCourse();
    const assessments = course?.assessments || [];

    $("assessmentList").innerHTML = assessments.length ? `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Assessment</th>
                    <th>Type</th>
                    <th>Module</th>
                    <th>Marks</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                ${assessments.map(a => `
                    <tr>
                        <td><strong>${escapeHTML(a.title)}</strong></td>
                        <td>${escapeHTML(a.type)}</td>
                        <td>${escapeHTML(a.module || "-")}</td>
                        <td>${a.marks || 0}</td>
                        <td>${a.deadline || "-"}</td>
                        <td>
                            <button class="action-btn"
                                onclick="viewAssessment('${a.id}')">
                                View
                            </button>
                            <button class="action-btn"
                                onclick="editAssessment('${a.id}')">
                                Edit
                            </button>
                            <button class="action-btn delete"
                                onclick="deleteAssessment('${a.id}')">
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    ` : "";

    $("assessmentEmpty").style.display =
        assessments.length ? "none" : "block";
}

$("addAssessmentQuestion").addEventListener("click", () => {
    addQuestion("assessmentQuestions");
});

function addQuestion(containerId, question = {}) {
    const container = $(containerId);
    const number = container.children.length + 1;

    const card = document.createElement("div");
    card.className = "question-card";

    card.innerHTML = `
        <div class="question-top">
            <span class="question-number">Question ${number}</span>
            <button type="button" class="action-btn delete">
                Delete
            </button>
        </div>

        <div class="question-fields">
            <input class="q-text"
                placeholder="Question text"
                value="${escapeHTML(question.question || "")}">

            <div class="question-options">
                ${["A", "B", "C", "D"].map(letter => `
                    <label>
                        <input type="text"
                            class="q-option"
                            data-letter="${letter}"
                            placeholder="Option ${letter}"
                            value="${escapeHTML(question.options?.[letter] || "")}">
                    </label>
                `).join("")}
            </div>

            <div class="form-grid">
                <label>
                    Correct Answer
                    <select class="q-answer">
                        ${["A", "B", "C", "D"].map(letter =>
                            `<option ${question.correctAnswer === letter ? "selected" : ""}>
                                ${letter}
                            </option>`
                        ).join("")}
                    </select>
                </label>

                <label>
                    Marks
                    <input class="q-marks" type="number"
                        min="1" value="${question.marks || 1}">
                </label>
            </div>
        </div>
    `;

    card.querySelector(".delete").addEventListener("click", () => {
        card.remove();
        refreshQuestionNumbers(container);
        calculateAssessmentMarks();
    });

    container.appendChild(card);

    card.querySelector(".q-marks")
        .addEventListener("input", calculateAssessmentMarks);
}

function refreshQuestionNumbers(container) {
    [...container.children].forEach((card, index) => {
        card.querySelector(".question-number").textContent =
            `Question ${index + 1}`;
    });
}

function getQuestions(containerId) {
    return [...$(containerId).children].map(card => {
        const options = {};

        card.querySelectorAll(".q-option").forEach(input => {
            options[input.dataset.letter] = input.value.trim();
        });

        return {
            question: card.querySelector(".q-text").value.trim(),
            options,
            correctAnswer: card.querySelector(".q-answer").value,
            marks: Number(card.querySelector(".q-marks").value) || 0
        };
    });
}

function calculateAssessmentMarks() {
    const questions = getQuestions("assessmentQuestions");

    $("assessmentQuestionMarks").textContent =
        questions.reduce((sum, q) => sum + q.marks, 0);
}

$("assessmentForm").addEventListener("submit", event => {
    event.preventDefault();

    const course = getSelectedCourse();
    if (!course) return;

    const questions =
        $("assessmentType").value === "Quiz"
            ? getQuestions("assessmentQuestions")
            : [];

    const questionMarks =
        questions.reduce((sum, q) => sum + q.marks, 0);

    const assessment = {
        id: editingAssessmentId || makeId("ASSESS"),
        title: $("assessmentTitle").value.trim(),
        type: $("assessmentType").value,
        module: $("assessmentModule").value.trim(),
        description: $("assessmentDescription").value.trim(),
        marks: Number($("assessmentMarks").value) || questionMarks,
        releaseDate: $("assessmentRelease").value,
        deadline: $("assessmentDeadline").value,
        instructions: $("assessmentInstructions").value.trim(),
        questions
    };

    if (!assessment.title) {
        alert("Please enter an assessment title.");
        return;
    }

    if (editingAssessmentId) {
        const index = course.assessments.findIndex(
            a => a.id === editingAssessmentId
        );

        course.assessments[index] = assessment;
    } else {
        course.assessments.push(assessment);
    }

    saveData();
    closeModal("assessmentModal");
    renderAssessments();
});

function editAssessment(id) {
    const course = getSelectedCourse();
    const assessment = course.assessments.find(a => a.id === id);

    if (!assessment) return;

    editingAssessmentId = id;

    $("assessmentTitle").value = assessment.title;
    $("assessmentType").value = assessment.type;
    $("assessmentModule").value = assessment.module;
    $("assessmentDescription").value = assessment.description;
    $("assessmentMarks").value = assessment.marks;
    $("assessmentRelease").value = assessment.releaseDate;
    $("assessmentDeadline").value = assessment.deadline;
    $("assessmentInstructions").value = assessment.instructions;

    $("assessmentQuestions").innerHTML = "";

    if (assessment.type === "Quiz") {
        $("quizBuilder").classList.remove("hidden");

        assessment.questions.forEach(q =>
            addQuestion("assessmentQuestions", q)
        );

        calculateAssessmentMarks();
    } else {
        $("quizBuilder").classList.add("hidden");
    }

    $("assessmentModalTitle").textContent = "Edit Assessment";

    openModal("assessmentModal");
}

function viewAssessment(id) {
    const course = getSelectedCourse();
    const assessment = course.assessments.find(a => a.id === id);

    if (!assessment) return;

    alert(
        `Assessment: ${assessment.title}\n` +
        `Type: ${assessment.type}\n` +
        `Marks: ${assessment.marks}\n` +
        `Deadline: ${assessment.deadline || "Not set"}\n` +
        `Questions: ${assessment.questions.length}`
    );
}

function deleteAssessment(id) {
    const course = getSelectedCourse();
    const assessment = course.assessments.find(a => a.id === id);

    askConfirmation(
        "Delete Assessment?",
        `Delete "${assessment.title}"?`,
        () => {
            course.assessments =
                course.assessments.filter(a => a.id !== id);

            saveData();
            renderAssessments();
        }
    );
}


/* =====================================================
   EXAMINATIONS
===================================================== */

$("addExamBtn").addEventListener("click", () => {
    editingExamId = null;

    $("examForm").reset();
    $("examQuestions").innerHTML = "";

    $("examDuration").value = 30;
    $("maxAttempts").value = 1;

    $("examModalTitle").textContent = "Create Examination";

    updateExamSummary();

    openModal("examModal");
});

function renderExams() {
    const course = getSelectedCourse();
    const exams = course?.exams || [];

    $("examList").innerHTML = exams.length ? `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Exam</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Marks</th>
                    <th>Questions</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                ${exams.map(exam => `
                    <tr>
                        <td><strong>${escapeHTML(exam.title)}</strong></td>
                        <td>${exam.date || "-"}</td>
                        <td>${exam.startTime || "-"}</td>
                        <td>${exam.duration} min</td>
                        <td>${exam.totalMarks}</td>
                        <td>${exam.questions.length}</td>
                        <td>
                            <span class="status ${exam.status.toLowerCase()}">
                                ${exam.status}
                            </span>
                        </td>
                        <td>
                            <button class="action-btn"
                                onclick="viewExam('${exam.id}')">
                                View
                            </button>
                            <button class="action-btn"
                                onclick="editExam('${exam.id}')">
                                Edit
                            </button>
                            <button class="action-btn"
                                onclick="editExamQuestions('${exam.id}')">
                                Questions
                            </button>
                            <button class="action-btn delete"
                                onclick="deleteExam('${exam.id}')">
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    ` : "";

    $("examEmpty").style.display =
        exams.length ? "none" : "block";

    const upcoming = exams.filter(
        e => e.status === "Scheduled"
    ).length;

    $("courseUpcomingExams").textContent = upcoming;
}

$("addExamQuestion").addEventListener("click", () => {
    addQuestion("examQuestions");
    updateExamSummary();
});

$("examQuestions").addEventListener("input", updateExamSummary);

function updateExamSummary() {
    $("summaryExam").textContent =
        $("examTitle").value || "-";

    $("summaryDate").textContent =
        $("examDate").value || "-";

    $("summaryTime").textContent =
        $("examTime").value || "-";

    $("summaryDuration").textContent =
        $("examDuration").value
            ? `${$("examDuration").value} minutes`
            : "-";

    const questions = getQuestions("examQuestions");

    $("examQuestionCount").textContent = questions.length;

    const marks = questions.reduce(
        (sum, question) => sum + question.marks,
        0
    );

    $("examTotalMarks").textContent = marks;
    $("summaryQuestions").textContent = questions.length;

    $("summaryMarks").textContent =
        $("examMarks").value || marks;
}

[
    "examTitle",
    "examDate",
    "examTime",
    "examDuration",
    "examMarks"
].forEach(id => {
    $(id).addEventListener("input", updateExamSummary);
});

function saveExam(status) {
    const course = getSelectedCourse();
    if (!course) return;

    const questions = getQuestions("examQuestions");

    if (!$("examTitle").value.trim()) {
        alert("Please enter an examination title.");
        return;
    }

    if (!questions.length) {
        alert("Please add at least one MCQ question.");
        return;
    }

    const calculatedMarks = questions.reduce(
        (sum, q) => sum + q.marks,
        0
    );

    const exam = {
        id: editingExamId || makeId("EXAM"),
        examId: editingExamId
            ? course.exams.find(e => e.id === editingExamId).examId
            : `EXAM${String(course.exams.length + 1).padStart(3, "0")}`,

        courseId: course.id,

        title: $("examTitle").value.trim(),
        description: $("examDescription").value.trim(),

        date: $("examDate").value,
        startTime: $("examTime").value,
        duration: Number($("examDuration").value) || 30,

        totalMarks:
            Number($("examMarks").value) || calculatedMarks,

        passingMarks:
            Number($("passingMarks").value) || 0,

        maxAttempts:
            Number($("maxAttempts").value) || 1,

        instructions:
            $("examInstructions").value.trim(),

        questions,

        status
    };

    if (editingExamId) {
        const index = course.exams.findIndex(
            e => e.id === editingExamId
        );

        course.exams[index] = exam;
    } else {
        course.exams.push(exam);
    }

    saveData();
    closeModal("examModal");
    renderExams();
    renderCourses();
}

$("saveExamDraft").addEventListener("click", () => {
    saveExam("Draft");
});

$("scheduleExam").addEventListener("click", () => {
    if (!$("examDate").value || !$("examTime").value) {
        alert("Please set the exam date and start time before scheduling.");
        return;
    }

    saveExam("Scheduled");
});

function editExam(id) {
    const course = getSelectedCourse();
    const exam = course.exams.find(e => e.id === id);

    if (!exam) return;

    editingExamId = id;

    $("examTitle").value = exam.title;
    $("examDescription").value = exam.description;
    $("examDate").value = exam.date;
    $("examTime").value = exam.startTime;
    $("examDuration").value = exam.duration;
    $("examMarks").value = exam.totalMarks;
    $("passingMarks").value = exam.passingMarks;
    $("maxAttempts").value = exam.maxAttempts;
    $("examInstructions").value = exam.instructions;

    $("examQuestions").innerHTML = "";

    exam.questions.forEach(question =>
        addQuestion("examQuestions", question)
    );

    $("examModalTitle").textContent = "Edit Examination";

    updateExamSummary();
    openModal("examModal");
}

function editExamQuestions(id) {
    editExam(id);
}

function viewExam(id) {
    const course = getSelectedCourse();
    const exam = course.exams.find(e => e.id === id);

    if (!exam) return;

    alert(
        `Exam ID: ${exam.examId}\n\n` +
        `Title: ${exam.title}\n` +
        `Date: ${exam.date || "Not scheduled"}\n` +
        `Time: ${exam.startTime || "Not scheduled"}\n` +
        `Duration: ${exam.duration} minutes\n` +
        `Questions: ${exam.questions.length}\n` +
        `Total Marks: ${exam.totalMarks}\n` +
        `Passing Marks: ${exam.passingMarks}\n` +
        `Status: ${exam.status}`
    );
}

function deleteExam(id) {
    const course = getSelectedCourse();
    const exam = course.exams.find(e => e.id === id);

    if (!exam) return;

    askConfirmation(
        "Delete Examination?",
        `Delete "${exam.title}"?`,
        () => {
            course.exams =
                course.exams.filter(e => e.id !== id);

            saveData();
            renderExams();
            renderCourses();
        }
    );
}


/* =====================================================
   CONFIRMATION
===================================================== */

function askConfirmation(title, message, callback) {
    $("confirmTitle").textContent = title;
    $("confirmMessage").textContent = message;

    confirmCallback = callback;

    openModal("confirmModal");
}

$("confirmAction").addEventListener("click", () => {
    if (confirmCallback) {
        confirmCallback();
    }

    confirmCallback = null;
    closeModal("confirmModal");
});


/* =====================================================
   CLOSE MODALS
===================================================== */

document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        closeModal(button.dataset.close);
    });
});

document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeModal(overlay.id);
        }
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeAllModals();
    }
});


/* =====================================================
   SEARCH / FILTER
===================================================== */

$("searchCourse").addEventListener("input", renderCourses);
$("statusFilter").addEventListener("change", renderCourses);
$("categoryFilter").addEventListener("change", renderCourses);


/* =====================================================
   INITIAL LOAD
===================================================== */

renderCourses();