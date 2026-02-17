const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

// Lightweight, deterministic resume analysis engine (no external APIs required)
// Produces a score, breakdown and actionable suggestions so it can be used offline.

const ROLE_SKILLS = {
  frontend: ["javascript", "typescript", "react", "vue", "angular", "css", "html", "tailwind", "sass"],
  backend: ["node", "express", "java", "spring", "python", "django", "sql", "mysql", "postgres", "mongodb"],
  data: ["python", "pandas", "numpy", "sql", "r", "machine learning", "tensorflow", "scikit"],
  devops: ["docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "terraform"],
};

async function extractTextFromFile(filePath, mimetype) {
  const buffer = fs.readFileSync(filePath);

  if (mimetype === "application/pdf" || filePath.endsWith(".pdf")) {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (err) {
      console.error("PDF parse failed:", err);
    }
  }

  // Try DOCX / other options using mammoth
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    console.error("DOCX parse failed:", err);
  }

  // As fallback, convert buffer to string
  return buffer.toString("utf8");
}

function detectContactInfo(text) {
  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
  const hasPhone = /(\+\d{1,3}[- ]?)?\d{10,14}/.test(text);
  const hasName = /\b(name|\b[A-Z][a-z]+\s[A-Z][a-z]+\b)/.test(text);
  return { hasEmail, hasPhone, hasName };
}

function analyzeSkills(text) {
  const lower = text.toLowerCase();
  const found = {};

  for (const [role, skills] of Object.entries(ROLE_SKILLS)) {
    found[role] = { matches: [], score: 0 };
    skills.forEach((s) => {
      if (lower.includes(s)) found[role].matches.push(s);
    });
    // score is ratio of matched skills
    found[role].score = Math.round((found[role].matches.length / Math.max(1, skills.length)) * 100);
  }

  return found;
}

function analyzeProjects(text) {
  const lower = text.toLowerCase();
  const projectKeywords = ["project", "built", "designed", "implemented", "developed", "created", "contributed"];
  let count = 0;
  projectKeywords.forEach((k) => {
    count += (lower.match(new RegExp(k, "g")) || []).length;
  });
  return { projectMentions: count, quality: Math.min(100, count * 20) };
}

function computeOverall({ skillsAnalysis, projectsAnalysis, contacts }) {
  // Weights: skills 45, projects 30, readiness 15, ATS 10
  const topRoleScore = Math.max(...Object.values(skillsAnalysis).map((r) => r.score));
  const skillsScore = Math.round((topRoleScore / 100) * 45);
  const projectsScore = Math.round((projectsAnalysis.quality / 100) * 30);

  const readiness = Math.round((topRoleScore * 0.4) + (projectsAnalysis.quality * 0.4));
  const readinessScore = Math.round((readiness / 100) * 15);

  const atsScore = (contacts.hasEmail && contacts.hasPhone && contacts.hasName) ? 10 : Math.round(((contacts.hasEmail || contacts.hasPhone) ? 5 : 0));

  const total = Math.min(100, skillsScore + projectsScore + readinessScore + atsScore);

  return { total, skillsScore, projectsScore, readinessScore, atsScore };
}

function roleReadiness(skillsAnalysis) {
  const roles = {};
  for (const [role, info] of Object.entries(skillsAnalysis)) {
    const missing = ROLE_SKILLS[role].filter((s) => !info.matches.includes(s)).slice(0, 5);
    roles[role] = { readiness: info.score, matches: info.matches, missing };
  }
  return roles;
}

function actionableFixes({ skillsAnalysis, projectsAnalysis, contacts, parsedText }) {
  const fixes = [];

  if (!contacts.hasEmail) fixes.push({ section: "Contact", message: "Add a clear email address at the top of your resume." });
  if (!contacts.hasPhone) fixes.push({ section: "Contact", message: "Add a phone number so recruiters can reach you." });
  if (projectsAnalysis.projectMentions < 2) fixes.push({ section: "Projects", message: "Add 2+ project entries with tech stack and measurable outcomes (metrics)." });

  // For each role, suggest top missing skills
  for (const [role, info] of Object.entries(skillsAnalysis)) {
    if (info.matches.length / ROLE_SKILLS[role].length < 0.4) {
      fixes.push({ section: `Skills (${role})`, message: `Consider learning: ${ROLE_SKILLS[role].filter(s => !info.matches.includes(s)).slice(0,3).join(", ")}` });
    }
  }

  // ATS suggestions
  if (!/experience/i.test(parsedText)) fixes.push({ section: "ATS", message: "Use an 'Experience' heading and list role, company, and dates." });
  if (!/skills/i.test(parsedText)) fixes.push({ section: "ATS", message: "Have a dedicated 'Skills' section with bullet points of technologies." });

  return fixes;
}

async function analyzeResumeFromFile(filePath, mimetype) {
  const parsedText = (await extractTextFromFile(filePath, mimetype)) || "";
  const contacts = detectContactInfo(parsedText);
  const skillsAnalysis = analyzeSkills(parsedText);
  const projectsAnalysis = analyzeProjects(parsedText);
  const overall = computeOverall({ skillsAnalysis, projectsAnalysis, contacts });
  const roles = roleReadiness(skillsAnalysis);
  const fixes = actionableFixes({ skillsAnalysis, projectsAnalysis, contacts, parsedText });

  const analysis = {
    parsedText: parsedText.slice(0, 20000), // cap stored text
    contacts,
    skillsAnalysis,
    projectsAnalysis,
    overall,
    roles,
    fixes,
  };

  return analysis;
}

function suggestForSection(section) {
  const s = section.toLowerCase();
  if (s.includes("contact")) {
    return [
      "Place your name and contact details (email, phone) at the top-left of the resume.",
      "Use a professional email (firstname.lastname@example.com).",
      "Include a link to GitHub/LinkedIn where applicable.",
    ];
  }
  if (s.includes("project")) {
    return [
      "For each project, include: problem, approach, technologies used, and measurable outcome (e.g., reduced load time by 30%).",
      "Prioritize projects relevant to the role you're applying for and mention your specific contribution.",
      "Add links to live demos or repositories where possible.",
    ];
  }
  if (s.includes("skills")) {
    return [
      "Use a dedicated 'Skills' section with grouped bullets (Languages, Frameworks, Tools).",
      "List skills with level like 'React (advanced)'.",
      "Match exact keywords used in job descriptions for ATS compatibility.",
    ];
  }
  if (s.includes("ats")) {
    return [
      "Use conventional headings like 'Experience' and 'Education' so ATS can parse them.",
      "Avoid images and complex tables; prefer plain text and bullet lists.",
      "Include keywords and metrics relevant to the role.",
    ];
  }

  // default suggestions based on section name
  return ["Try adding more concrete examples and measurable outcomes.", "Match keywords from target job descriptions."];
}

module.exports = {
  analyzeResumeFromFile,
  suggestForSection,
};
