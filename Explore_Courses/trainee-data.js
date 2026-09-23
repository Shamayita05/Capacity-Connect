/* ============================================================
   CAPACITY CONNECT - CENTRALIZED DATA STORE
   ============================================================ */

const DEFAULT_TRAINEE = {
  id: "trn_101",
  name: "Shirshika Ghosh",
  email: "shirshika.03@example.com",
  phone: "+91 98765 43210",
  profileImage: "",
  about: "Enthusiastic computer science trainee eager to expand knowledge in data analysis and cybersecurity.",
  qualification: "B.Tech Computer Science (4th Year)",
  skills: "Python, HTML/CSS, SQL, JavaScript",
  interests: "Data Science, Machine Learning, Web Development",
  enrolledCourses: ["course001", "course002"],
  completedCourses: [],
  certificates: [],
  streak: 7
};

const MOTIVATIONAL_QUOTES = [
  "Small progress every day leads to big results.",
  "Learning is a journey, not a destination.",
  "Keep building. Keep learning. Keep growing.",
  "Skill is built brick by brick with daily effort.",
  "Believe you can and you're halfway there."
];

const INITIAL_COURSES = [
  {
    id: "course001",
    name: "Python for Data Analysis",
    code: "CC-PDA-101",
    category: "Data Science",
    categories: ["Data Science", "Programming"],
    level: "Beginner",
    trainer: "Ananya Sharma",
    rating: 4.8,
    duration: "8 Weeks",
    description: "Master Python fundamentals, Pandas, and NumPy for real-world data analytics and visualization.",
    objectives: ["Data Cleaning", "Pandas & Numpy", "Data Visualization with Matplotlib"],
    prerequisites: ["Basic Math"],
    startDate: "2026-03-01",
    endDate: "2026-04-25",
    status: "Active",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80",
    modules: [
      { id: "m1", title: "Module 1 — Introduction to Python Syntax", completed: true },
      { id: "m2", title: "Module 2 — Data Structures: Lists & Dicts", completed: true },
      { id: "m3", title: "Module 3 — Numerical Computing with NumPy", completed: true },
      { id: "m4", title: "Module 4 — Data Wrangling with Pandas", completed: false },
      { id: "m5", title: "Module 5 — Final Assessment", completed: false }
    ]
  },
  {
    id: "course002",
    name: "Cybersecurity Fundamentals",
    code: "CC-CSF-102",
    category: "Security",
    categories: ["Security", "Networking"],
    level: "Intermediate",
    trainer: "Shamayita Das",
    rating: 4.7,
    duration: "6 Weeks",
    description: "Learn core concepts of network security, threat modeling, and defensive architecture.",
    objectives: ["Identify Threats", "Understand Cryptography", "Secure Networks"],
    prerequisites: ["Networking Basics"],
    startDate: "2026-02-15",
    endDate: "2026-03-30",
    status: "Active",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop&q=80",
    modules: [
      { id: "m1", title: "Module 1 — Cyber Threats & Vectors", completed: true },
      { id: "m2", title: "Module 2 — Cryptography Basics", completed: true },
      { id: "m3", title: "Module 3 — Defensive Architecture", completed: false },
      { id: "m4", title: "Module 4 — Final Assessment", completed: false }
    ]
  },
  {
    id: "course003",
    name: "Database Management Systems",
    code: "CC-DBMS-103",
    category: "Data Science",
    categories: ["Database", "SQL"],
    level: "Beginner",
    trainer: "Priya Nair",
    rating: 4.9,
    duration: "5 Weeks",
    description: "Comprehensive SQL and relational database design for modern Web applications.",
    objectives: ["Write Complex SQL Queries", "Database Normalization"],
    prerequisites: ["None"],
    startDate: "2026-04-01",
    endDate: "2026-05-05",
    status: "Active",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&auto=format&fit=crop&q=80",
    modules: [
      { id: "m1", title: "Module 1 — SQL Queries", completed: false },
      { id: "m2", title: "Module 2 — Schema Design", completed: false }
    ]
  }
];

const INITIAL_RESOURCES = [
  { title: "Python Cheat Sheet PDF", courseId: "course001", courseName: "Python for Data Analysis", trainer: "Ananya Sharma", type: "PDF" },
  { title: "Network Security Slides", courseId: "course002", courseName: "Cybersecurity Fundamentals", trainer: "Vikramaditya Roy", type: "PPTX" },
  { title: "SQL Commands Reference", courseId: "course003", courseName: "Database Management Systems", trainer: "Priya Nair", type: "DOCX" }
];

const INITIAL_NOTIFICATIONS = [
  { id: "n1", title: "New Module Unlocked", description: "Module 4 in Python for Data Analysis is now available.", date: "2026-03-20", time: "10:30 AM", category: "Course", read: false },
  { id: "n2", title: "Upcoming Assessment", description: "Final assessment for Cybersecurity Fundamentals opens tomorrow.", date: "2026-03-19", time: "02:15 PM", category: "Assessment", read: false },
  { id: "n3", title: "System Maintenance", description: "Platform maintenance scheduled for Sunday at 2 AM.", date: "2026-03-18", time: "09:00 AM", category: "System", read: true }
];

const INITIAL_ASSESSMENTS = [
  {
    id: "ass_001",
    courseId: "course001",
    courseName: "Python for Data Analysis",
    title: "Python Basics Assessment",
    timeLimit: "10 Mins",
    difficulty: "Easy",
    questions: [
      { q: "Which keyword is used to create a function in Python?", options: ["function", "def", "fun", "create"], answer: 1 },
      { q: "What data type is returned by default from input()?", options: ["int", "float", "str", "bool"], answer: 2 },
      { q: "How do you start a comment in Python?", options: ["//", "/*", "#", "<!--"], answer: 2 }
    ]
  },
  {
    id: "ass_002",
    courseId: "course002",
    courseName: "Cybersecurity Fundamentals",
    title: "Security Foundations Quiz",
    timeLimit: "15 Mins",
    difficulty: "Medium",
    questions: [
      { q: "What does CIA triad stand for in security?", options: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Control, Information, Access", "Crypto, Inspection, Authorization"], answer: 1 },
      { q: "Which protocol secures web traffic?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], answer: 2 }
    ]
  }
];

/* --- LOCAL STORAGE INITIALIZATION --- */
function initStorage() {
  if (!localStorage.getItem("capacity_trainee")) {
    localStorage.setItem("capacity_trainee", JSON.stringify(DEFAULT_TRAINEE));
  }
  if (!localStorage.getItem("capacity_courses")) {
    localStorage.setItem("capacity_courses", JSON.stringify(INITIAL_COURSES));
  }
  if (!localStorage.getItem("capacity_resources")) {
    localStorage.setItem("capacity_resources", JSON.stringify(INITIAL_RESOURCES));
  }
  if (!localStorage.getItem("capacity_notifications")) {
    localStorage.setItem("capacity_notifications", JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem("capacity_assessments")) {
    localStorage.setItem("capacity_assessments", JSON.stringify(INITIAL_ASSESSMENTS));
  }
  if (!localStorage.getItem("capacity_assessment_results")) {
    localStorage.setItem("capacity_assessment_results", JSON.stringify({}));
  }
}
initStorage();

/* --- HELPER FUNCTIONS --- */
function getCurrentTrainee() {
  return JSON.parse(localStorage.getItem("capacity_trainee"));
}

function saveCurrentTrainee(trainee) {
  localStorage.setItem("capacity_trainee", JSON.stringify(trainee));
}

function getCourses() {
  return JSON.parse(localStorage.getItem("capacity_courses"));
}

function getCourseById(id) {
  const courses = getCourses();
  return courses.find(c => c.id === id);
}

function saveCourses(courses) {
  localStorage.setItem("capacity_courses", JSON.stringify(courses));
}

function showToast(message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function checkSession() {
  const trainee = getCurrentTrainee();
  if (!trainee) {
    window.location.href = "../../Landing_Page/Landing_Page.html";
  }
}