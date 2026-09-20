/* ==========================================================================
   data.js – Seed data + localStorage persistence layer for Capacity Connect
   Every collection is loaded with CC.load(key) which returns the stored copy
   (if the admin already interacted with it) or the seed data below.
   ========================================================================== */

window.CC = window.CC || {};

CC.SEED = {
  trainers: [
    { id: 1, name: "Dr. Meera Nair", qualification: "PhD, Public Health", expertise: "Community Health Training", registered: "2026-09-02", status: "Pending", email: "meera.nair@example.com" },
    { id: 2, name: "Rahul Verma", qualification: "M.Tech, Computer Science", expertise: "Digital Literacy", registered: "2026-09-05", status: "Pending", email: "rahul.v@example.com" },
    { id: 3, name: "Anita Desai", qualification: "MBA, Rural Management", expertise: "Micro-enterprise Development", registered: "2026-08-28", status: "Approved", email: "anita.d@example.com" },
    { id: 4, name: "Joseph Kurian", qualification: "M.Sc, Agriculture", expertise: "Sustainable Farming", registered: "2026-09-10", status: "Pending", email: "joseph.k@example.com" },
    { id: 5, name: "Priya Sharma", qualification: "B.Ed, Education", expertise: "Soft Skills & Communication", registered: "2026-08-20", status: "Rejected", email: "priya.s@example.com" }
  ],
  trainees: [
    { id: 1, name: "Aarav Singh", email: "aarav@example.com", organisation: "Gram Vikas NGO", registered: "2026-09-11", status: "Pending", interest: "Digital Literacy" },
    { id: 2, name: "Sneha Patel", email: "sneha@example.com", organisation: "Self Help Group – Anand", registered: "2026-09-12", status: "Pending", interest: "Micro-enterprise" },
    { id: 3, name: "Kiran Rao", email: "kiran@example.com", organisation: "Youth Council", registered: "2026-09-01", status: "Approved", interest: "Community Health" },
    { id: 4, name: "Fatima Khan", email: "fatima@example.com", organisation: "Independent", registered: "2026-09-13", status: "Pending", interest: "Soft Skills" },
    { id: 5, name: "Devansh Gupta", email: "devansh@example.com", organisation: "AgriTech Cooperative", registered: "2026-08-30", status: "Approved", interest: "Sustainable Farming" },
    { id: 6, name: "Lakshmi Iyer", email: "lakshmi@example.com", organisation: "Women's Collective", registered: "2026-09-14", status: "Pending", interest: "Financial Literacy" }
  ],
  users: [
    { id: 1, name: "Anita Desai", email: "anita.d@example.com", role: "Trainer", status: "Active" },
    { id: 2, name: "Kiran Rao", email: "kiran@example.com", role: "Trainee", status: "Active" },
    { id: 3, name: "Devansh Gupta", email: "devansh@example.com", role: "Trainee", status: "Active" },
    { id: 4, name: "Rahul Verma", email: "rahul.v@example.com", role: "Trainer", status: "Inactive" },
    { id: 5, name: "Sneha Patel", email: "sneha@example.com", role: "Trainee", status: "Active" },
    { id: 6, name: "Joseph Kurian", email: "joseph.k@example.com", role: "Trainee", status: "Active" }
  ],
  certifications: [
    { id: 1, trainee: "Kiran Rao", course: "Community Health Basics", completion: 100, score: 92, status: "Pending" },
    { id: 2, trainee: "Devansh Gupta", course: "Sustainable Farming 101", completion: 100, score: 85, status: "Pending" },
    { id: 3, trainee: "Sneha Patel", course: "Digital Literacy Fundamentals", completion: 88, score: 74, status: "Pending" },
    { id: 4, trainee: "Aarav Singh", course: "Soft Skills for Leaders", completion: 100, score: 96, status: "Issued" },
    { id: 5, trainee: "Lakshmi Iyer", course: "Financial Literacy", completion: 62, score: 0, status: "Pending" }
  ],
  courses: [
    { id: 1, title: "Community Health Basics", trainer: "Dr. Meera Nair", category: "Health", duration: "6 weeks", status: "Approved", enrolled: 48, completion: 72, active: true, deadline: "2026-10-15" },
    { id: 2, title: "Digital Literacy Fundamentals", trainer: "Rahul Verma", category: "Technology", duration: "4 weeks", status: "Pending", enrolled: 35, completion: 40, active: true, deadline: "2026-10-05" },
    { id: 3, title: "Micro-enterprise Development", trainer: "Anita Desai", category: "Business", duration: "8 weeks", status: "Approved", enrolled: 27, completion: 55, active: true, deadline: "2026-11-01" },
    { id: 4, title: "Sustainable Farming 101", trainer: "Joseph Kurian", category: "Agriculture", duration: "5 weeks", status: "Pending", enrolled: 19, completion: 15, active: false, deadline: "2026-10-22" },
    { id: 5, title: "Soft Skills for Leaders", trainer: "Priya Sharma", category: "Personal Development", duration: "3 weeks", status: "Approved", enrolled: 64, completion: 100, active: false, deadline: "2026-09-10" },
    { id: 6, title: "Financial Literacy", trainer: "Anita Desai", category: "Business", duration: "4 weeks", status: "Rejected", enrolled: 0, completion: 0, active: false, deadline: "2026-12-01" }
  ],
  content: [
    { id: 1, title: "Intro to Community Health – Lecture 1", type: "Video", course: "Community Health Basics", trainer: "Dr. Meera Nair", uploaded: "2026-09-12", status: "Pending", size: "240 MB" },
    { id: 2, title: "Digital Safety Handbook", type: "PDF", course: "Digital Literacy Fundamentals", trainer: "Rahul Verma", uploaded: "2026-09-13", status: "Pending", size: "3.2 MB" },
    { id: 3, title: "Business Model Canvas Slides", type: "Presentation", course: "Micro-enterprise Development", trainer: "Anita Desai", uploaded: "2026-09-08", status: "Approved", size: "8.7 MB" },
    { id: 4, title: "Crop Rotation Explained", type: "Video", course: "Sustainable Farming 101", trainer: "Joseph Kurian", uploaded: "2026-09-14", status: "Pending", size: "310 MB" },
    { id: 5, title: "Effective Communication Worksheet", type: "PDF", course: "Soft Skills for Leaders", trainer: "Priya Sharma", uploaded: "2026-08-25", status: "Approved", size: "1.1 MB" },
    { id: 6, title: "Budgeting Basics – Lecture 2", type: "Video", course: "Financial Literacy", trainer: "Anita Desai", uploaded: "2026-09-15", status: "Rejected", size: "180 MB" }
  ],
  assessments: [
    { id: 1, title: "Community Health Quiz 1", course: "Community Health Basics", trainer: "Dr. Meera Nair", questions: 20, deadline: "2026-09-30", status: "Pending" },
    { id: 2, title: "Digital Tools Practical", course: "Digital Literacy Fundamentals", trainer: "Rahul Verma", questions: 15, deadline: "2026-10-03", status: "Pending" },
    { id: 3, title: "Business Plan Evaluation", course: "Micro-enterprise Development", trainer: "Anita Desai", questions: 10, deadline: "2026-10-20", status: "Approved" },
    { id: 4, title: "Soil & Water Test", course: "Sustainable Farming 101", trainer: "Joseph Kurian", questions: 25, deadline: "2026-10-12", status: "Pending" },
    { id: 5, title: "Leadership Reflection", course: "Soft Skills for Leaders", trainer: "Priya Sharma", questions: 8, deadline: "2026-09-08", status: "Approved" }
  ],
  updates: [
    { id: 1, type: "Announcement", title: "Platform maintenance on 25 Sept", description: "Capacity Connect will be unavailable from 01:00–03:00 IST for scheduled upgrades.", date: "2026-09-16", audience: "Everyone", status: "Published", image: "" },
    { id: 2, type: "Achievement", title: "500 certificates issued!", description: "Our community has crossed 500 issued certificates. Thank you trainers and trainees!", date: "2026-09-10", audience: "Everyone", status: "Published", image: "" },
    { id: 3, type: "New Learning Content", title: "New course: Financial Literacy", description: "A brand-new 4-week course on budgeting, savings and credit is now open for enrollment.", date: "2026-09-05", audience: "Trainees", status: "Published", image: "" }
  ],
  activity: [
    { type: "user", text: "New trainee registration: Lakshmi Iyer", when: "5 min ago" },
    { type: "course", text: "Course approved: Community Health Basics", when: "1 hr ago" },
    { type: "enroll", text: "12 new enrollments in Digital Literacy Fundamentals", when: "3 hrs ago" },
    { type: "assessment", text: "Assessment submitted: Business Plan Evaluation (Kiran Rao)", when: "Yesterday" },
    { type: "cert", text: "Certificate issued to Aarav Singh – Soft Skills for Leaders", when: "Yesterday" },
    { type: "user", text: "New trainer registration: Joseph Kurian", when: "2 days ago" }
  ],
  stats: {
    totals: { trainees: 1284, trainers: 96, courses: 42, enrollments: 3190, certificates: 517, assessments: 18 },
    enrollmentTrend: [{ m: "Apr", v: 210 }, { m: "May", v: 260 }, { m: "Jun", v: 330 }, { m: "Jul", v: 410 }, { m: "Aug", v: 470 }, { m: "Sep", v: 540 }],
    certTrend: [{ m: "Apr", v: 40 }, { m: "May", v: 55 }, { m: "Jun", v: 70 }, { m: "Jul", v: 95 }, { m: "Aug", v: 120 }, { m: "Sep", v: 137 }],
    assessmentScores: [{ m: "Health", v: 82 }, { m: "Digital", v: 74 }, { m: "Business", v: 88 }, { m: "Farming", v: 69 }, { m: "Soft Skills", v: 91 }],
    completion: { completed: 61, inProgress: 39 },
    participation: 84,
    trackers: { course: 68, assessment: 74, participation: 84, certification: 57 }
  }
};

const STORAGE_PREFIX = "cc_admin_";

/** Load a collection from localStorage (falls back to seed data). */
CC.load = function (key) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore corrupted storage */ }
  return JSON.parse(JSON.stringify(CC.SEED[key]));
};

/** Persist a collection to localStorage. */
CC.save = function (key, value) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
};

/** Reset every collection back to seed data. */
CC.resetAll = function () {
  Object.keys(CC.SEED).forEach((k) => localStorage.removeItem(STORAGE_PREFIX + k));
};

/** Convenience: count of items awaiting approval across all queues. */
CC.pendingCount = function () {
  return ["trainers", "trainees", "courses", "content", "assessments"]
    .reduce((n, k) => n + CC.load(k).filter((i) => i.status === "Pending").length, 0)
    + CC.load("certifications").filter((c) => c.status === "Pending" && c.completion === 100).length;
};
