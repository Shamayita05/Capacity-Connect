/* ============================================================
   CAPACITY CONNECT - COURSE & TRAINER FEEDBACK LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  if (form) {
    populateCourseSelect();
    form.addEventListener("submit", handleFeedbackSubmit);
  }
});

function populateCourseSelect() {
  const select = document.getElementById("fb-course");
  if (!select) return;

  const trainee = getCurrentTrainee();
  const courses = getCourses().filter(c => trainee.enrolledCourses.includes(c.id));

  select.innerHTML = `<option value="">-- Select Enrolled Course --</option>` + 
    courses.map(c => `<option value="${c.id}">${c.name} (${c.trainer})</option>`).join("");
}

function handleFeedbackSubmit(e) {
  e.preventDefault();
  
  const courseId = document.getElementById("fb-course").value;
  if (!courseId) {
    showToast("Please select a course!");
    return;
  }

  const existingFeedback = JSON.parse(localStorage.getItem("capacity_feedback")) || [];
  if (existingFeedback.some(f => f.courseId === courseId)) {
    showToast("You have already submitted feedback for this course.");
    return;
  }

  const newFb = {
    courseId,
    rating: document.getElementById("fb-rating").value,
    comments: document.getElementById("fb-comments").value,
    date: new Date().toISOString()
  };

  existingFeedback.push(newFb);
  localStorage.setItem("capacity_feedback", JSON.stringify(existingFeedback));

  showToast("Thank you! Feedback submitted successfully.");
  e.target.reset();
}