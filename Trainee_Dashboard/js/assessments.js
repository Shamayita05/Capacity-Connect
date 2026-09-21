/* ============================================================
   CAPACITY CONNECT - MCQ ASSESSMENT RUNNER
   ============================================================ */

let currentQuiz = null;
let currentQIndex = 0;
let userAnswers = [];

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("assessments-list")) {
    renderAssessmentsList();
  }
});

function renderAssessmentsList() {
  const list = document.getElementById("assessments-list");
  if (!list) return;

  const assessments = JSON.parse(localStorage.getItem("capacity_assessments")) || [];
  const results = JSON.parse(localStorage.getItem("capacity_assessment_results")) || {};

  list.innerHTML = assessments.map(ass => {
    const res = results[ass.id];
    const statusText = res ? `Completed (Score: ${res.score}/${res.total} - ${res.passed ? 'PASSED' : 'FAILED'})` : 'Not Attempted';
    return `
      <div class="course-card-horizontal" style="margin-bottom: 16px;">
        <div>
          <span class="tag">${ass.courseName}</span>
          <h3 style="font-size: 16px; color: var(--navy); margin-top: 4px;">${ass.title}</h3>
          <p style="font-size: 12px; color: var(--gray-600);">Questions: ${ass.questions.length} | Limit: ${ass.timeLimit} | Difficulty: ${ass.difficulty}</p>
          <p style="font-size: 12px; font-weight: 700; color: ${res ? (res.passed ? '#05a86a' : '#e63946') : 'var(--navy)'}; margin-top: 4px;">Status: ${statusText}</p>
        </div>
        <button class="btn btn-primary" onclick="startAssessment('${ass.id}')">${res ? 'Re-take' : 'Start Assessment'}</button>
      </div>
    `;
  }).join("");
}

function startAssessment(assId) {
  const assessments = JSON.parse(localStorage.getItem("capacity_assessments")) || [];
  currentQuiz = assessments.find(a => a.id === assId);
  currentQIndex = 0;
  userAnswers = new Array(currentQuiz.questions.length).fill(null);

  renderQuizModal();
}

function renderQuizModal() {
  const q = currentQuiz.questions[currentQIndex];
  const content = `
    <div class="modal-container" style="max-width: 600px;">
      <div class="modal-header">
        <h3>${currentQuiz.title} (${currentQIndex + 1}/${currentQuiz.questions.length})</h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-weight: 700; color: var(--navy); margin-bottom: 16px; font-size: 15px;">${currentQIndex + 1}. ${q.q}</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${q.options.map((opt, optIdx) => `
            <label style="background: var(--gray-100); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--gray-200); cursor: pointer; display: flex; align-items: center; gap: 10px;">
              <input type="radio" name="quiz-opt" value="${optIdx}" ${userAnswers[currentQIndex] === optIdx ? 'checked' : ''} onchange="userAnswers[${currentQIndex}] =${optIdx}">
              <span>${opt}</span>
            </label>
          `).join("")}
        </div>
      </div>
      <div class="modal-footer" style="justify-content: space-between;">
        <button class="btn btn-outline" ${currentQIndex === 0 ? 'disabled' : ''} onclick="navigateQuiz(-1)">Previous</button>
        ${currentQIndex === currentQuiz.questions.length - 1 
          ? `<button class="btn btn-accent" onclick="submitAssessment()">Submit Assessment</button>`
          : `<button class="btn btn-primary" onclick="navigateQuiz(1)">Next</button>`}
      </div>
    </div>
  `;
  openModal(content);
}

function navigateQuiz(dir) {
  currentQIndex += dir;
  renderQuizModal();
}

function submitAssessment() {
  let correct = 0;
  currentQuiz.questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.answer) correct++;
  });

  const total = currentQuiz.questions.length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 60;

  const results = JSON.parse(localStorage.getItem("capacity_assessment_results")) || {};
  results[currentQuiz.id] = { score: correct, total, percentage: pct, passed };
  localStorage.setItem("capacity_assessment_results", JSON.stringify(results));

  closeModal();
  renderAssessmentsList();

  const resultModal = `
    <div class="modal-container" style="text-align: center;">
      <div class="modal-header">
        <h3>Assessment Results</h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <h2 style="color: ${passed ? '#05a86a' : '#e63946'}; font-size: 24px;">${passed ? 'Passed 🎉' : 'Failed ❌'}</h2>
        <p style="font-size: 16px; margin: 10px 0;">Score: ${correct} / ${total} (${pct}%)</p>
        <p style="font-size: 13px; color: var(--gray-600);">${passed ? 'Great job! Your result has been saved.' : 'Review the course modules and try again.'}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  openModal(resultModal);
}