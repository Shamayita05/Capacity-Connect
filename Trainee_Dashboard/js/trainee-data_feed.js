/* ==========================================================================
   Capacity Connect — centralized trainee sample data + storage helpers
   Frontend-only prototype: everything persists in localStorage.
   ========================================================================== */

/* ------------------------------------------------------------- storage --- */
var CC_KEYS = {
  trainee: "cc_currentTrainee",
  session: "cc_session",
  progress: "cc_progress", // { courseId: [moduleIds] }
  results: "cc_assessmentResults",
  feedback: "cc_feedback",
  notifRead: "cc_notificationsRead",
  streak: "cc_streak",
  quote: "cc_quote",
};

function ccRead(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function ccWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage full / blocked */
  }
}

/* -------------------------------------------------------------- quotes --- */
var CC_QUOTES = [
  "Small progress every day leads to big results.",
  "Learning is a journey, not a destination.",
  "Keep building. Keep learning. Keep growing.",
  "Skills are built one focused hour at a time.",
  "The expert in anything was once a beginner.",
  "Consistency beats intensity — show up today.",
];

/* ------------------------------------------------------------ trainers -- */
var CC_TRAINERS = [
  { id: "t1", name: "Shamayita Das" },
  { id: "t2", name: "Rahul Verma" },
  { id: "t3", name: "Priya Nair" },
  { id: "t4", name: "Imran Qureshi" },
  { id: "t5", name: "Meera Iyer" },
  { id: "t6", name: "Daniel Fernandes" },
];

/* ------------------------------------------------------------- courses -- */
function ccModules(names) {
  return names.map(function (n, i) {
    return { id: "m" + (i + 1), title: n, minutes: 35 + i * 10 };
  });
}

var CC_COURSES = [
  {
    id: "course001",
    name: "Python for Data Analysis",
    code: "CC-PDA-101",
    category: "Data Science",
    categories: ["Data Science", "Programming"],
    level: "Beginner",
    trainer: "Ananya Sharma",
    rating: 4.7,
    duration: "8 Weeks",
    description:
      "Learn to clean, analyse and visualise real datasets with Python, pandas and matplotlib. The course is fully project based and ends with a capstone analysis of a public dataset.",
    objectives: [
      "Write clean, readable Python for data tasks",
      "Load, clean and reshape data with pandas",
      "Create clear charts with matplotlib",
      "Draw defensible conclusions from data",
    ],
    prerequisites: ["Basic computer literacy", "No prior coding required"],
    startDate: "2026-09-01",
    endDate: "2026-10-27",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=70",
    modules: ccModules([
      "Introduction to Python & Notebooks",
      "Data Structures & Fundamentals",
      "pandas for Practical Analysis",
      "Visualisation with matplotlib",
      "Final Assessment & Capstone",
    ]),
  },
  {
    id: "course002",
    name: "Cybersecurity Fundamentals",
    code: "CC-CSF-102",
    category: "Security",
    categories: ["Security", "IT Operations"],
    level: "Intermediate",
    trainer: "Imran Qureshi",
    rating: 4.6,
    duration: "6 Weeks",
    description:
      "A practical introduction to defending systems and data: threat models, network security, secure authentication and incident response drills.",
    objectives: [
      "Identify common attack vectors",
      "Apply the CIA triad to real systems",
      "Harden accounts and networks",
      "Respond to a security incident calmly",
    ],
    prerequisites: ["Basic networking knowledge"],
    startDate: "2026-09-08",
    endDate: "2026-10-20",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=70",
    modules: ccModules([
      "Security Landscape & Threats",
      "Network Security Fundamentals",
      "Identity, Access & Cryptography",
      "Incident Response in Practice",
      "Final Assessment",
    ]),
  },
  {
    id: "course003",
    name: "Database Management Systems",
    code: "CC-DBM-103",
    category: "Databases",
    categories: ["Databases", "Backend"],
    level: "Intermediate",
    trainer: "Rahul Verma",
    rating: 4.5,
    duration: "10 Weeks",
    description:
      "Design normalised schemas, write efficient SQL and understand how transactions and indexes really work under the hood.",
    objectives: [
      "Model data with ER diagrams",
      "Normalise to 3NF confidently",
      "Write joins, subqueries and aggregations",
      "Reason about indexes and transactions",
    ],
    prerequisites: ["Comfort with basic computing concepts"],
    startDate: "2026-08-18",
    endDate: "2026-10-30",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=70",
    modules: ccModules([
      "Relational Model & ER Design",
      "SQL Fundamentals",
      "Normalisation & Schema Design",
      "Indexes, Transactions & Tuning",
      "Final Assessment",
    ]),
  },
  {
    id: "course004",
    name: "Machine Learning Foundations",
    code: "CC-MLF-201",
    category: "Data Science",
    categories: ["Data Science", "AI"],
    level: "Advanced",
    trainer: "Priya Nair",
    rating: 4.8,
    duration: "12 Weeks",
    description:
      "From regression to model evaluation: build, validate and explain supervised learning models with scikit-learn on realistic datasets.",
    objectives: [
      "Frame a business problem as an ML task",
      "Train regression and classification models",
      "Evaluate models beyond accuracy",
      "Avoid leakage and overfitting",
    ],
    prerequisites: ["Python basics", "School-level statistics"],
    startDate: "2026-09-15",
    endDate: "2026-12-08",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=70",
    modules: ccModules([
      "ML Landscape & Workflow",
      "Regression Fundamentals",
      "Classification & Trees",
      "Model Evaluation & Tuning",
      "Final Assessment",
    ]),
  },
  {
    id: "course005",
    name: "Excel for Data Analytics",
    code: "CC-EDA-104",
    category: "Analytics",
    categories: ["Analytics", "Business"],
    level: "Beginner",
    trainer: "Meera Iyer",
    rating: 4.4,
    duration: "4 Weeks",
    description:
      "Turn spreadsheets into decision tools with lookups, pivot tables, Power Query basics and dashboard design principles.",
    objectives: [
      "Clean messy spreadsheet data",
      "Use lookup and logic functions well",
      "Summarise with pivot tables",
      "Build a one-page dashboard",
    ],
    prerequisites: ["Access to Excel or a compatible spreadsheet"],
    startDate: "2026-09-05",
    endDate: "2026-10-03",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=70",
    modules: ccModules([
      "Spreadsheet Essentials",
      "Formulas & Lookups",
      "Pivot Tables & Charts",
      "Dashboard Design",
      "Final Assessment",
    ]),
  },
  {
    id: "course006",
    name: "Communication Skills",
    code: "CC-CMS-105",
    category: "Soft Skills",
    categories: ["Soft Skills", "Careers"],
    level: "Beginner",
    trainer: "Daniel Fernandes",
    rating: 4.9,
    duration: "3 Weeks",
    description:
      "Speak and write with clarity at work: structured messages, confident presentations, listening skills and handling difficult conversations.",
    objectives: [
      "Structure any message in seconds",
      "Present with confidence",
      "Listen actively and ask better questions",
      "Give and receive feedback well",
    ],
    prerequisites: ["None"],
    startDate: "2026-09-10",
    endDate: "2026-10-01",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=70",
    modules: ccModules([
      "Clarity & Structure",
      "Professional Writing",
      "Presenting with Confidence",
      "Difficult Conversations",
      "Final Assessment",
    ]),
  },
];

/* --------------------------------------------------------- assessments -- */
function ccQ(q, opts, correct) {
  return { question: q, options: opts, answer: correct };
}

var CC_ASSESSMENTS = [
  {
    id: "as001",
    courseId: "course001",
    name: "Python & pandas Essentials Test",
    difficulty: "Easy",
    timeLimit: 15,
    passMark: 60,
    questions: [
      ccQ("Which data type stores an ordered, mutable sequence in Python?", ["tuple", "list", "set", "frozenset"], 1),
      ccQ("Which library is the standard choice for tabular data analysis?", ["pandas", "pygame", "flask", "requests"], 0),
      ccQ("What does df.head() return by default?", ["Last 5 rows", "First 5 rows", "Column names", "Row count"], 1),
      ccQ("Which method removes missing values from a DataFrame?", ["dropna()", "clean()", "remove()", "fillzero()"], 0),
      ccQ("What is the result of len('data')?", ["3", "4", "5", "Error"], 1),
      ccQ("Which plot best shows the distribution of one numeric column?", ["Pie chart", "Histogram", "Scatter matrix", "Table"], 1),
      ccQ("How do you select a single column named 'age'?", ["df{'age'}", "df['age']", "df->age", "df::age"], 1),
      ccQ("groupby() is mainly used to...", ["Sort rows", "Aggregate by category", "Rename columns", "Export CSV"], 1),
      ccQ("Which file format does read_csv expect?", ["Comma separated values", "Compiled binary", "XML", "Word document"], 0),
      ccQ("What does a 0.0 correlation suggest?", ["Strong link", "No linear link", "Causation", "Duplicate data"], 1),
    ],
  },
  {
    id: "as002",
    courseId: "course002",
    name: "Security Fundamentals MCQ",
    difficulty: "Medium",
    timeLimit: 20,
    passMark: 60,
    questions: [
      ccQ("The CIA triad stands for...", ["Confidentiality, Integrity, Availability", "Control, Identity, Access", "Cipher, Index, Audit", "Cloud, Internet, Access"], 0),
      ccQ("Phishing primarily targets...", ["Firewalls", "People", "Routers", "Databases"], 1),
      ccQ("Which is the strongest extra login protection?", ["Longer username", "Multi-factor authentication", "Frequent password hints", "Shared passwords"], 1),
      ccQ("HTTPS protects data using...", ["Compression", "Encryption in transit", "Caching", "Minification"], 1),
      ccQ("A firewall mainly controls...", ["Disk usage", "Network traffic", "Screen brightness", "CPU speed"], 1),
      ccQ("Least privilege means giving users...", ["All access", "Only needed access", "No access", "Admin by default"], 1),
      ccQ("Ransomware typically...", ["Encrypts files for ransom", "Speeds up disks", "Backs up data", "Patches systems"], 0),
      ccQ("A strong incident response starts with...", ["Blaming staff", "Preparation and a plan", "Ignoring alerts", "Reinstalling everything"], 1),
      ccQ("Patching software reduces...", ["Known vulnerabilities", "Bandwidth", "Monitor glare", "Licence cost"], 0),
      ccQ("Hashing passwords is preferred over...", ["Salting", "Storing plain text", "Rate limiting", "Auditing"], 1),
    ],
  },
  {
    id: "as003",
    courseId: "course003",
    name: "SQL & Schema Design Quiz",
    difficulty: "Medium",
    timeLimit: 20,
    passMark: 60,
    questions: [
      ccQ("Which SQL clause filters rows?", ["ORDER BY", "WHERE", "GROUP BY", "LIMIT"], 1),
      ccQ("A primary key must be...", ["Nullable", "Unique and not null", "Text only", "Auto-generated"], 1),
      ccQ("Which join keeps all left-table rows?", ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"], 1),
      ccQ("Normalisation mainly reduces...", ["Redundancy", "Indexes", "Queries", "Users"], 0),
      ccQ("Which statement adds rows?", ["INSERT", "UPDATE", "ALTER", "SELECT"], 0),
      ccQ("An index typically improves...", ["Write speed", "Read speed", "Disk size", "Backups"], 1),
      ccQ("ACID's 'D' stands for...", ["Durability", "Distribution", "Denormalisation", "Delta"], 0),
      ccQ("A foreign key enforces...", ["Referential integrity", "Sorting", "Encryption", "Compression"], 0),
      ccQ("COUNT(*) returns...", ["Number of rows", "Sum of values", "Distinct rows only", "Table size in MB"], 0),
      ccQ("Transactions are ended with...", ["COMMIT or ROLLBACK", "CLOSE", "STOP", "END KEY"], 0),
    ],
  },
  {
    id: "as004",
    courseId: "course004",
    name: "Machine Learning Concepts Test",
    difficulty: "Hard",
    timeLimit: 25,
    passMark: 65,
    questions: [
      ccQ("Supervised learning requires...", ["Labelled data", "No data", "Only images", "Clusters"], 0),
      ccQ("Overfitting means the model...", ["Generalises well", "Memorises training data", "Underuses features", "Has no parameters"], 1),
      ccQ("Which metric suits imbalanced classification?", ["Accuracy", "F1 score", "MSE", "R squared"], 1),
      ccQ("Train/test split exists to...", ["Speed training", "Estimate generalisation", "Clean data", "Shuffle labels"], 1),
      ccQ("Linear regression predicts...", ["Categories", "Continuous values", "Clusters", "Sequences only"], 1),
      ccQ("Cross-validation improves...", ["Evaluation reliability", "Data volume", "Label quality", "Feature count"], 0),
      ccQ("Feature scaling matters most for...", ["Decision trees", "Distance-based models", "Random labels", "CSV loading"], 1),
      ccQ("Data leakage happens when...", ["Test info influences training", "Data is encrypted", "Rows are shuffled", "Features are dropped"], 0),
      ccQ("A confusion matrix shows...", ["Prediction vs actual counts", "Learning rate", "Epoch time", "Memory usage"], 0),
      ccQ("Regularisation is used to...", ["Increase variance", "Reduce overfitting", "Delete rows", "Rename features"], 1),
    ],
  },
  {
    id: "as005",
    courseId: "course005",
    name: "Excel Analytics Check",
    difficulty: "Easy",
    timeLimit: 12,
    passMark: 60,
    questions: [
      ccQ("VLOOKUP searches...", ["A column for a value", "A row only", "Cell colours", "Chart titles"], 0),
      ccQ("Pivot tables are used to...", ["Summarise data", "Encrypt files", "Print pages", "Change fonts"], 0),
      ccQ("=SUM(A1:A10) returns...", ["Count of cells", "Total of the range", "Average", "Maximum"], 1),
      ccQ("Absolute reference is written as...", ["A1", "$A$1", "A$", "#A1"], 1),
      ccQ("Which chart shows a trend over time?", ["Line chart", "Pie chart", "Treemap", "Gauge"], 0),
      ccQ("Conditional formatting highlights...", ["Cells meeting a rule", "All cells", "Hidden sheets", "Macros"], 0),
      ccQ("IFERROR is used to...", ["Handle formula errors", "Create charts", "Sort data", "Freeze panes"], 0),
      ccQ("Freeze Panes helps to...", ["Keep headers visible", "Lock the file", "Protect formulas", "Compress data"], 0),
      ccQ("A good dashboard should be...", ["Cluttered", "Focused and clear", "Hidden", "Text heavy"], 1),
      ccQ("Remove Duplicates affects...", ["Selected range rows", "Charts", "Formulas only", "Nothing"], 0),
    ],
  },
  {
    id: "as006",
    courseId: "course006",
    name: "Workplace Communication MCQ",
    difficulty: "Easy",
    timeLimit: 10,
    passMark: 60,
    questions: [
      ccQ("Active listening includes...", ["Interrupting", "Paraphrasing to confirm", "Multitasking", "Ignoring tone"], 1),
      ccQ("A clear email should start with...", ["The purpose", "A long history", "An apology", "Attachments"], 0),
      ccQ("Best way to handle disagreement is...", ["Raise your voice", "Focus on the issue, not the person", "Avoid it forever", "Reply all"], 1),
      ccQ("Non-verbal communication includes...", ["Body language", "Spelling", "Font choice", "Word count"], 0),
      ccQ("Feedback is most useful when...", ["Vague", "Specific and timely", "Delayed months", "Public and harsh"], 1),
      ccQ("Before presenting you should...", ["Know your audience", "Memorise every word", "Add more slides", "Skip practice"], 0),
      ccQ("Jargon should be...", ["Used freely", "Limited for clarity", "Always avoided in code", "Translated to Latin"], 1),
      ccQ("A good meeting has...", ["No agenda", "A clear agenda", "Unlimited length", "Only one speaker"], 1),
      ccQ("Empathy at work means...", ["Agreeing always", "Understanding others' perspective", "Avoiding people", "Ignoring emotion"], 1),
      ccQ("Summarising at the end of a call helps...", ["Confirm next steps", "Fill time", "Avoid decisions", "Hide issues"], 0),
    ],
  },
];

/* ----------------------------------------------------------- resources -- */
var CC_RESOURCES = [
  { id: "r1", courseId: "course001", title: "Python Basics Cheat Sheet", type: "PDF" },
  { id: "r2", courseId: "course001", title: "pandas Practice Dataset", type: "XLSX" },
  { id: "r3", courseId: "course001", title: "Visualisation Slide Deck", type: "PPTX" },
  { id: "r4", courseId: "course002", title: "Threat Modelling Worksheet", type: "DOCX" },
  { id: "r5", courseId: "course002", title: "Incident Response Checklist", type: "PDF" },
  { id: "r6", courseId: "course002", title: "Network Diagram Reference", type: "PNG" },
  { id: "r7", courseId: "course003", title: "SQL Query Workbook", type: "DOC" },
  { id: "r8", courseId: "course003", title: "ER Diagram Examples", type: "JPG" },
  { id: "r9", courseId: "course003", title: "Normalisation Exercises", type: "PDF" },
  { id: "r10", courseId: "course004", title: "Model Evaluation Guide", type: "PDF" },
  { id: "r11", courseId: "course004", title: "Feature Engineering Notes", type: "DOCX" },
  { id: "r12", courseId: "course004", title: "ML Workflow Slides", type: "PPT" },
  { id: "r13", courseId: "course005", title: "Pivot Table Starter File", type: "XLS" },
  { id: "r14", courseId: "course005", title: "Dashboard Design Checklist", type: "PDF" },
  { id: "r15", courseId: "course006", title: "Presentation Structure Template", type: "DOCX" },
  { id: "r16", courseId: "course006", title: "Feedback Conversation Script", type: "PDF" },
];

/* ------------------------------------------------------- notifications -- */
var CC_NOTIFICATIONS = [
  { id: "n1", title: "New module unlocked", description: "Module 4 of Python for Data Analysis is now available.", date: "2026-09-19", time: "09:15", category: "Course" },
  { id: "n2", title: "Assessment reminder", description: "Your Security Fundamentals MCQ closes this Friday.", date: "2026-09-18", time: "17:40", category: "Assessment" },
  { id: "n3", title: "Certificate ready", description: "Certificates for completed courses can be downloaded from Enrolled Courses.", date: "2026-09-17", time: "11:05", category: "Certificate" },
  { id: "n4", title: "Scheduled maintenance", description: "The platform will be briefly unavailable on Sunday 02:00–03:00 IST.", date: "2026-09-16", time: "20:00", category: "System" },
  { id: "n5", title: "Live doubt-clearing session", description: "Join Ananya Sharma on Saturday at 5 PM for a live Q&A.", date: "2026-09-15", time: "10:30", category: "Announcement" },
  { id: "n6", title: "Resource added", description: "A new SQL Query Workbook has been added to Database Management Systems.", date: "2026-09-14", time: "14:22", category: "Course" },
  { id: "n7", title: "Feedback window open", description: "Share feedback for courses you are enrolled in — it helps your trainers.", date: "2026-09-13", time: "08:45", category: "Announcement" },
  { id: "n8", title: "Streak milestone", description: "You reached a 7 day learning streak. Keep it going!", date: "2026-09-12", time: "07:30", category: "System" },
];

/* ------------------------------------------------------- default trainee -- */
function ccDefaultTrainee(name, email) {
  return {
    id: "tr" + Date.now(),
    name: name || "Aarav Mehta",
    email: email || "aarav.mehta@example.com",
    phone: "+91 98200 41122",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=70",
    about:
      "Final-year information technology student who enjoys turning messy data into clear stories. Currently building a portfolio of analytics projects.",
    qualification: "B.Sc. Information Technology (2026)",
    skills: "Python, SQL, Excel, Data Visualisation",
    interests: "Data Science, Cybersecurity, Public Speaking",
    enrolledCourses: ["course001", "course002"],
    completedCourses: [],
    certificates: [],
  };
}
/* --------------------------------------------------------- data helpers -- */
function getCurrentTrainee() {
  // 1. Try reading from both possible localStorage keys
  var trainee = ccRead("capacity_trainee", null) || ccRead(CC_KEYS.trainee, null);

  // 2. If no session exists, auto-initialize the default trainee (prevents redirect)
  if (!trainee) {
    trainee = ccDefaultTrainee();
    saveCurrentTrainee(trainee);
  }
  return trainee;
}

function saveCurrentTrainee(trainee) {
  ccWrite("capacity_trainee", trainee);
  ccWrite(CC_KEYS.trainee, trainee);
  return trainee;
}

function updateTrainee(changes) {
  var t = getCurrentTrainee();
  if (!t) return null;
  Object.keys(changes || {}).forEach(function (k) {
    t[k] = changes[k];
  });
  return saveCurrentTrainee(t);
}

function logoutTrainee() {
  localStorage.removeItem("capacity_trainee");
  localStorage.removeItem(CC_KEYS.trainee);
  localStorage.removeItem(CC_KEYS.session);
}

/* ------------------------------------------------------------ progress --- */
function getAllProgress() {
  return ccRead(CC_KEYS.progress, {});
}
function getCompletedModules(courseId) {
  var all = getAllProgress();
  return all[courseId] || [];
}
function toggleModuleComplete(courseId, moduleId) {
  var all = getAllProgress();
  var done = all[courseId] || [];
  var i = done.indexOf(moduleId);
  if (i > -1) done.splice(i, 1);
  else done.push(moduleId);
  all[courseId] = done;
  ccWrite(CC_KEYS.progress, all);
  syncCompletedCourses();
  return done;
}
/** Progress = completed modules / total modules, rounded. */
function getCourseProgress(courseId) {
  var course = getCourseById(courseId);
  if (!course || !course.modules.length) return 0;
  var done = getCompletedModules(courseId).length;
  return Math.round((done / course.modules.length) * 100);
}
function updateCourseProgress(courseId, moduleIds) {
  var all = getAllProgress();
  all[courseId] = moduleIds || [];
  ccWrite(CC_KEYS.progress, all);
  syncCompletedCourses();
  return getCourseProgress(courseId);
}
/** A course counts as completed at 100% modules + a passed assessment. */
function isCourseComplete(courseId) {
  if (getCourseProgress(courseId) < 100) return false;
  var a = getAssessmentForCourse(courseId);
  if (!a) return true;
  var r = getAssessmentResult(a.id);
  return !!(r && r.passed);
}
function syncCompletedCourses() {
  var t = getCurrentTrainee();
  if (!t) return;
  t.completedCourses = (t.enrolledCourses || []).filter(isCourseComplete);
  saveCurrentTrainee(t);
}

/* --------------------------------------------------------- assessments --- */
function getAssessments() {
  return CC_ASSESSMENTS;
}
function getAssessmentById(id) {
  return CC_ASSESSMENTS.filter(function (a) {
    return a.id === id;
  })[0] || null;
}
function getAssessmentForCourse(courseId) {
  return CC_ASSESSMENTS.filter(function (a) {
    return a.courseId === courseId;
  })[0] || null;
}
function getTraineeAssessments() {
  var t = getCurrentTrainee();
  if (!t) return [];
  var enrolled = t.enrolledCourses || [];
  return CC_ASSESSMENTS.filter(function (a) {
    return enrolled.indexOf(a.courseId) > -1;
  });
}
function getAssessmentResults() {
  return ccRead(CC_KEYS.results, {});
}
function getAssessmentResult(assessmentId) {
  return getAssessmentResults()[assessmentId] || null;
}
function saveAssessmentResult(assessmentId, result) {
  var all = getAssessmentResults();
  all[assessmentId] = result;
  ccWrite(CC_KEYS.results, all);
  syncCompletedCourses();
  return result;
}
function getCompletedAssessmentCount() {
  var results = getAssessmentResults();
  return Object.keys(results).length;
}

/* -------------------------------------------------------- certificates --- */
function getCertificates() {
  var t = getCurrentTrainee();
  return (t && t.certificates) || [];
}
function getCertificateForCourse(courseId) {
  return getCertificates().filter(function (c) {
    return c.courseId === courseId;
  })[0] || null;
}
function makeCertificateId(course) {
  var rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return "CC-" + (course.code || "CRS").replace(/[^A-Z0-9]/gi, "") + "-" + new Date().getFullYear() + "-" + rand;
}
function saveCertificate(courseId) {
  var t = getCurrentTrainee();
  var course = getCourseById(courseId);
  if (!t || !course) return null;
  var existing = getCertificateForCourse(courseId);
  if (existing) return existing;
  var cert = {
    id: makeCertificateId(course),
    courseId: courseId,
    name: "Certificate of Completion — " + course.name,
    course: course.name,
    trainer: course.trainer,
    date: new Date().toISOString().slice(0, 10),
    status: "Issued",
  };
  t.certificates = t.certificates || [];
  t.certificates.push(cert);
  saveCurrentTrainee(t);
  return cert;
}

/* ------------------------------------------------------------ feedback --- */
function getAllFeedback() {
  return ccRead(CC_KEYS.feedback, {});
}
function getFeedbackForCourse(courseId) {
  return getAllFeedback()[courseId] || null;
}
function saveFeedback(courseId, data) {
  var all = getAllFeedback();
  all[courseId] = data;
  ccWrite(CC_KEYS.feedback, all);
  return data;
}

/* ------------------------------------------------------- notifications --- */
function getReadNotificationIds() {
  return ccRead(CC_KEYS.notifRead, []);
}
function getNotifications() {
  var read = getReadNotificationIds();
  return CC_NOTIFICATIONS.map(function (n) {
    var copy = {};
    Object.keys(n).forEach(function (k) { copy[k] = n[k]; });
    copy.read = read.indexOf(n.id) > -1;
    return copy;
  });
}
function markNotificationRead(id) {
  var read = getReadNotificationIds();
  if (read.indexOf(id) === -1) read.push(id);
  ccWrite(CC_KEYS.notifRead, read);
}
function markAllNotificationsRead() {
  ccWrite(
    CC_KEYS.notifRead,
    CC_NOTIFICATIONS.map(function (n) { return n.id; })
  );
}
function getUnreadNotificationCount() {
  return getNotifications().filter(function (n) { return !n.read; }).length;
}

/* -------------------------------------------------------------- streak --- */
function getStreak() {
  return ccRead(CC_KEYS.streak, { count: 0, lastDate: null });
}
/** Streak grows once per calendar day of activity; resets after a gap. */
function touchStreak() {
  var today = new Date().toISOString().slice(0, 10);
  var s = getStreak();
  if (s.lastDate === today) return s;
  if (s.lastDate) {
    var diff = Math.round(
      (new Date(today) - new Date(s.lastDate)) / 86400000
    );
    s.count = diff === 1 ? s.count + 1 : 1;
  } else {
    s.count = 7; // demo-friendly starting streak
  }
  s.lastDate = today;
  ccWrite(CC_KEYS.streak, s);
  return s;
}

/* ------------------------------------------------------- session quote --- */
function startSession(trainee) {
  saveCurrentTrainee(trainee);
  var sessionId = "s" + Date.now();
  ccWrite(CC_KEYS.session, { id: sessionId, startedAt: new Date().toISOString() });
  pickNewQuote();
  touchStreak();
}
function pickNewQuote() {
  var current = ccRead(CC_KEYS.quote, null);
  var options = CC_QUOTES.filter(function (q) { return q !== current; });
  var quote = options[Math.floor(Math.random() * options.length)];
  ccWrite(CC_KEYS.quote, quote);
  return quote;
}
function getSessionQuote() {
  var q = ccRead(CC_KEYS.quote, null);
  return q || pickNewQuote();
}

/* -------------------------------------------------------- stats helper --- */
function getTraineeStats() {
  var t = getCurrentTrainee() || {};
  return {
    enrolled: (t.enrolledCourses || []).length,
    completed: (t.completedCourses || []).length,
    assessments: getCompletedAssessmentCount(),
    certificates: (t.certificates || []).length,
  };
}
