/* ==========================================================================
   Capacity Connect — course & trainer feedback form
   ========================================================================== */

var CC_RATINGS = { overall: 0, content: 0, trainer: 0 };

function initFeedbackPage() {
  if (!initTraineePage()) return;

  var courses = getEnrolledCourses();
  var select = el("#fb-course");
  if (!courses.length) {
    el("#feedback-shell").innerHTML =
      '<div class="empty"><div class="empty__icon" aria-hidden="true"></div>' +
      "<h3>You haven't enrolled in any courses yet.</h3>" +
      '<p class="muted">Feedback becomes available once you join a course.</p>' +
      '<a class="btn btn--primary" href="explore-courses.html">Explore Courses</a></div>';
    return;
  }
  select.innerHTML =
    '<option value="">Select a course</option>' +
    courses.map(function (c) {
      return '<option value="' + c.id + '">' + esc(c.name) + "</option>";
    }).join("");

  select.addEventListener("change", onCourseChange);
  buildStars();
  el("#form-feedback").addEventListener("submit", onSubmitFeedback);
}

function onCourseChange() {
  var c = getCourseById(el("#fb-course").value);
  var trainerField = el("#fb-trainer");
  trainerField.value = c ? c.trainer : "";

  var existing = c ? getFeedbackForCourse(c.id) : null;
  var notice = el("#fb-existing");
  if (existing) {
    notice.hidden = false;
    notice.textContent =
      "You already submitted feedback for this course on " +
      fmtDate(existing.submittedAt) +
      ". Submitting again will update your response.";
    el("#fb-submit").textContent = "Update Feedback";
  } else {
    notice.hidden = true;
    el("#fb-submit").textContent = "Submit Feedback";
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

  if (!courseId) { err.textContent = "Please select a course."; return; }
  if (!CC_RATINGS.overall || !CC_RATINGS.content || !CC_RATINGS.trainer) {
    err.textContent = "Please give all three star ratings.";
    return;
  }
  if (!difficulty) { err.textContent = "Please choose the course difficulty."; return; }
  if (!quality || !resourceQuality) { err.textContent = "Please rate content and resource quality."; return; }
  if (!recommend) { err.textContent = "Please tell us whether you would recommend this course."; return; }
  if (el("#fb-liked").value.trim().length < 5) {
    err.textContent = "Please share at least a short note on what you liked.";
    el("#fb-liked").focus();
    return;
  }
  err.textContent = "";

  var course = getCourseById(courseId);
  saveFeedback(courseId, {
    courseId: courseId,
    courseName: course.name,
    trainer: course.trainer,
    overallRating: CC_RATINGS.overall,
    contentRating: CC_RATINGS.content,
    trainerRating: CC_RATINGS.trainer,
    difficulty: difficulty,
    contentQuality: quality,
    resourceQuality: resourceQuality,
    liked: el("#fb-liked").value.trim(),
    improve: el("#fb-improve").value.trim(),
    comments: el("#fb-comments").value.trim(),
    recommend: recommend,
    submittedAt: new Date().toISOString(),
  });

  el("#fb-success").hidden = false;
  el("#fb-success").textContent =
    "Thank you! Your feedback for " + course.name + " has been recorded.";
  toast("Feedback submitted successfully.");
  onCourseChange();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
