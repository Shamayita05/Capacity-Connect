/* ==========================================================================
   Capacity Connect — course & trainer feedback form
   ========================================================================== */

/* Utility helper fallbacks in case helper JS files failed to load */
if (typeof el !== "function") {
  window.el = function (sel, ctx) { return (ctx || document).querySelector(sel); };
}
if (typeof els !== "function") {
  window.els = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };
}
if (typeof esc !== "function") {
  window.esc = function (s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };
}

var CC_RATINGS = { overall: 0, content: 0, trainer: 0 };

function initFeedbackPage() {
  // 1. Build star ratings first so they render immediately
  buildStars();

  // 2. Safe check for page initialization
  if (typeof initTraineePage === "function") {
    var ok = initTraineePage();
    if (ok === false) return;
  }

  // 3. Fetch courses or fallback to default course list
  var courses = typeof getEnrolledCourses === "function" ? getEnrolledCourses() : [];
  var select = el("#fb-course");

  if (!select) return;

  if (!courses || !courses.length) {
    courses = [
      { id: "course001", name: "Web Development Fundamentals", trainer: "John Doe" },
      { id: "course002", name: "UI/UX Design Masterclass", trainer: "Jane Smith" }
    ];
  }

  // 4. Populate dropdown
  select.innerHTML =
    '<option value="">Select a course</option>' +
    courses.map(function (c) {
      return '<option value="' + c.id + '">' + esc(c.name) + "</option>";
    }).join("");

  select.addEventListener("change", onCourseChange);

  var form = el("#form-feedback");
  if (form) {
    form.addEventListener("submit", onSubmitFeedback);
  }
}

function onCourseChange() {
  var courseId = el("#fb-course").value;
  var c = typeof getCourseById === "function" ? getCourseById(courseId) : null;

  // Fallback lookup if getCourseById returns null
  if (!c && courseId) {
    if (courseId === "course001") c = { id: "course001", name: "Web Development Fundamentals", trainer: "John Doe" };
    if (courseId === "course002") c = { id: "course002", name: "UI/UX Design Masterclass", trainer: "Jane Smith" };
  }

  var trainerField = el("#fb-trainer");
  if (trainerField) {
    trainerField.value = c ? c.trainer : "";
  }

  var existing = (c && typeof getFeedbackForCourse === "function") ? getFeedbackForCourse(c.id) : null;
  var notice = el("#fb-existing");
  var submitBtn = el("#fb-submit");

  if (notice) {
    if (existing) {
      notice.hidden = false;
      notice.textContent =
        "You already submitted feedback for this course on " +
        (typeof fmtDate === "function" ? fmtDate(existing.submittedAt) : existing.submittedAt) +
        ". Submitting again will update your response.";
      if (submitBtn) submitBtn.textContent = "Update Feedback";
    } else {
      notice.hidden = true;
      if (submitBtn) submitBtn.textContent = "Submit Feedback";
    }
  }
}

/* --------------------------------------------------------------- stars --- */
function buildStars() {
  els("[data-stars]").forEach(function (group) {
    var key = group.getAttribute("data-stars");
    group.innerHTML = [1, 2, 3, 4, 5]
      .map(function (n) {
        return (
          '<button class="star-btn" type="button" role="radio" aria-checked="false" ' +
          'aria-label="' + n + ' of 5" data-value="' + n + '">★</button>'
        );
      })
      .join("");
    group.setAttribute("role", "radiogroup");

    els("button", group).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var v = Number(btn.getAttribute("data-value"));
        CC_RATINGS[key] = v;
        els("button", group).forEach(function (b) {
          var on = Number(b.getAttribute("data-value")) <= v;
          b.classList.toggle("is-on", on);
          b.setAttribute("aria-checked", Number(b.getAttribute("data-value")) === v ? "true" : "false");
        });
      });
    });
  });
}

/* -------------------------------------------------------------- submit --- */
function onSubmitFeedback(e) {
  e.preventDefault();
  var err = el("#fb-error");
  var courseId = el("#fb-course").value;
  var difficulty = (el('input[name="difficulty"]:checked') || {}).value;
  var quality = el("#fb-quality").value;
  var resourceQuality = el("#fb-resources").value;
  var recommend = (el('input[name="recommend"]:checked') || {}).value;

  if (!courseId) { if (err) err.textContent = "Please select a course."; return; }
  if (!CC_RATINGS.overall || !CC_RATINGS.content || !CC_RATINGS.trainer) {
    if (err) err.textContent = "Please give all three star ratings.";
    return;
  }
  if (!difficulty) { if (err) err.textContent = "Please choose the course difficulty."; return; }
  if (!quality || !resourceQuality) { if (err) err.textContent = "Please rate content and resource quality."; return; }
  if (!recommend) { if (err) err.textContent = "Please tell us whether you would recommend this course."; return; }

  var likedElem = el("#fb-liked");
  if (likedElem && likedElem.value.trim().length < 5) {
    if (err) err.textContent = "Please share at least a short note on what you liked.";
    likedElem.focus();
    return;
  }
  if (err) err.textContent = "";

  var course = typeof getCourseById === "function" ? getCourseById(courseId) : { name: courseId, trainer: "" };

  if (typeof saveFeedback === "function") {
    saveFeedback(courseId, {
      courseId: courseId,
      courseName: course ? course.name : courseId,
      trainer: course ? course.trainer : "",
      overallRating: CC_RATINGS.overall,
      contentRating: CC_RATINGS.content,
      trainerRating: CC_RATINGS.trainer,
      difficulty: difficulty,
      contentQuality: quality,
      resourceQuality: resourceQuality,
      liked: el("#fb-liked") ? el("#fb-liked").value.trim() : "",
      improve: el("#fb-improve") ? el("#fb-improve").value.trim() : "",
      comments: el("#fb-comments") ? el("#fb-comments").value.trim() : "",
      recommend: recommend,
      submittedAt: new Date().toISOString(),
    });
  }

  var successElem = el("#fb-success");
  if (successElem) {
    successElem.hidden = false;
    successElem.textContent =
      "Thank you! Your feedback for " + (course ? course.name : "the course") + " has been recorded.";
  }

  if (typeof toast === "function") {
    toast("Feedback submitted successfully.");
  }

  onCourseChange();
  window.scrollTo({ top: 0, behavior: "smooth" });
}