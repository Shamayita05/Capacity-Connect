// Sample Dataset representing Trainee Progress, MCQ Scores, and Dual Feedback Structure
let traineeData = [
    {
        id: "TR-101",
        name: "Shirshika Ghosh",
        email: "s.ghosh@capacityconnect.org",
        role: "Software Associate",
        qualifications: "B.Tech in Computer Science and Engineering",
        course: "Project Operations",
        mcqScore: 88,
        attempts: 1,
        progress: 100,
        status: "Completed",
        feedbackProvided: true,
        trainerRating: "5.0",
        trainerFeedback: "The trainer explained complex project lifecycle concepts in a very relatable and clear manner. Excellent interaction during Q&A.",
        courseRating: "4.5",
        courseFeedback: "The course modules were structured logically. The MCQ section in Module 3 was challenging but practical."
    },
    {
        id: "TR-102",
        name: "Priya Patel",
        email: "priya.p@capacityconnect.org",
        role: "Team Lead",
        qualifications: "MBA in HR, 6 years Team Management",
        course: "Leadership & Management",
        mcqScore: 92,
        attempts: 1,
        progress: 85,
        status: "In Progress",
        feedbackProvided: true,
        trainerRating: "4.8",
        trainerFeedback: "Encouraging teaching style and great breakdown of team conflict resolution strategies.",
        courseRating: "4.0",
        courseFeedback: "Good course content, though additional downloadable templates for weekly team reporting would be appreciated."
    },
    {
        id: "TR-103",
        name: "Amit Kumar",
        email: "amit.k@capacityconnect.org",
        role: "IT Support Officer",
        qualifications: "B.Sc Computer Science",
        course: "Digital Competency",
        mcqScore: 54,
        attempts: 2,
        progress: 40,
        status: "Needs Review",
        feedbackProvided: false,
        trainerRating: "N/A",
        trainerFeedback: "Feedback pending completion of Module 3.",
        courseRating: "N/A",
        courseFeedback: "Feedback pending completion of Module 3."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("traineeTableBody");
    const searchInput = document.getElementById("searchInput");
    const courseFilter = document.getElementById("courseFilter");
    const statusFilter = document.getElementById("statusFilter");

    // KPI Elements
    const kpiTotalTrainees = document.getElementById("kpiTotalTrainees");
    const kpiAvgScore = document.getElementById("kpiAvgScore");
    const kpiCompletionRate = document.getElementById("kpiCompletionRate");
    const kpiCertificates = document.getElementById("kpiCertificates");

    // Modal Elements
    const detailModal = document.getElementById("detailModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const closeDetailBtn = document.getElementById("closeDetailBtn");

    const modalAvatar = document.getElementById("modalAvatar");
    const modalTraineeName = document.getElementById("modalTraineeName");
    const modalTraineeRole = document.getElementById("modalTraineeRole");
    const modalTraineeContact = document.getElementById("modalTraineeContact");
    const modalQualifications = document.getElementById("modalQualifications");
    const modalMcqScore = document.getElementById("modalMcqScore");
    const modalMcqAttempts = document.getElementById("modalMcqAttempts");
    const modalMcqStatus = document.getElementById("modalMcqStatus");
    const modalProgressBar = document.getElementById("modalProgressBar");
    const modalProgressText = document.getElementById("modalProgressText");

    // Dual Feedback Modal Binding Elements
    const modalTrainerRating = document.getElementById("modalTrainerRating");
    const modalTrainerFeedback = document.getElementById("modalTrainerFeedback");
    const modalCourseRating = document.getElementById("modalCourseRating");
    const modalCourseFeedback = document.getElementById("modalCourseFeedback");

    // Calculate & Render High-Level KPIs
    function updateKPIs() {
        const total = traineeData.length;
        if (total === 0) return;

        const totalScore = traineeData.reduce((acc, curr) => acc + curr.mcqScore, 0);
        const avgScore = Math.round(totalScore / total);

        const totalProgress = traineeData.reduce((acc, curr) => acc + curr.progress, 0);
        const avgProgress = Math.round(totalProgress / total);

        const completedCount = traineeData.filter(t => t.status === "Completed").length;

        kpiTotalTrainees.textContent = total;
        kpiAvgScore.textContent = `${avgScore}%`;
        kpiCompletionRate.textContent = `${avgProgress}%`;
        kpiCertificates.textContent = completedCount;
    }

    // Render Trainee Table Rows
    function renderTable(data) {
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--muted); padding: 20px;">No trainee records found matching your filters.</td></tr>`;
            return;
        }

        data.forEach(item => {
            let statusBadgeClass = "badge-warning";
            if (item.status === "Completed") statusBadgeClass = "badge-success";
            if (item.status === "Needs Review") statusBadgeClass = "badge-danger";

            const feedbackBadgeClass = item.feedbackProvided ? "badge-info" : "badge-warning";
            const feedbackText = item.feedbackProvided ? "Submitted" : "Pending";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="trainee-cell">
                        <span class="trainee-name">${escapeHtml(item.name)}</span>
                        <span class="trainee-id">${escapeHtml(item.id)}</span>
                    </div>
                </td>
                <td>${escapeHtml(item.course)}</td>
                <td><strong>${item.mcqScore}%</strong></td>
                <td>${item.progress}%</td>
                <td><span class="badge ${feedbackBadgeClass}">${feedbackText}</span></td>
                <td><span class="badge ${statusBadgeClass}">${escapeHtml(item.status)}</span></td>
                <td>
                    <button class="action-btn" onclick="openTraineeReport('${item.id}')">View Report</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Filter Logic
    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const selectedCourse = courseFilter.value;
        const selectedStatus = statusFilter.value;

        const filtered = traineeData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
            const matchesCourse = selectedCourse === "ALL" || item.course === selectedCourse;
            const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;
            return matchesSearch && matchesCourse && matchesStatus;
        });

        renderTable(filtered);
    }

    // Open Trainee Report Modal
    window.openTraineeReport = (id) => {
        const trainee = traineeData.find(t => t.id === id);
        if (!trainee) return;

        const initials = trainee.name.split(" ").map(n => n[0]).join("");
        modalAvatar.textContent = initials;
        modalTraineeName.textContent = trainee.name;
        modalTraineeRole.textContent = `${trainee.role} (${trainee.id})`;
        modalTraineeContact.textContent = trainee.email;
        modalQualifications.textContent = trainee.qualifications;

        modalMcqScore.textContent = `${trainee.mcqScore}%`;
        modalMcqAttempts.textContent = trainee.attempts;
        modalMcqStatus.textContent = trainee.mcqScore >= 60 ? "Passed" : "Needs Retake";

        modalProgressBar.style.width = `${trainee.progress}%`;
        modalProgressText.textContent = `${trainee.progress}% Completed`;

        // Bind Separate Feedback Data
        modalTrainerRating.textContent = trainee.trainerRating !== "N/A" ? `★ ${trainee.trainerRating}` : "Pending";
        modalTrainerFeedback.textContent = trainee.trainerFeedback || "No feedback provided for trainer yet.";

        modalCourseRating.textContent = trainee.courseRating !== "N/A" ? `★ ${trainee.courseRating}` : "Pending";
        modalCourseFeedback.textContent = trainee.courseFeedback || "No feedback provided for course/assessment yet.";

        detailModal.classList.add("active");
        detailModal.setAttribute("aria-hidden", "false");
    };

    function closeModal() {
        detailModal.classList.remove("active");
        detailModal.setAttribute("aria-hidden", "true");
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function(m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        });
    }

    // Event Listeners
    searchInput.addEventListener("input", applyFilters);
    courseFilter.addEventListener("change", applyFilters);
    statusFilter.addEventListener("change", applyFilters);

    closeModalBtn.addEventListener("click", closeModal);
    closeDetailBtn.addEventListener("click", closeModal);

    // Initial Load
    updateKPIs();
    renderTable(traineeData);
});