const db = require("../config/db");

// Create minimal tables required for resume analysis and quizzes if they don't exist
const stmts = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student','recruiter','senior') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255),
    role VARCHAR(255),
    status VARCHAR(50),
    applied_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS internships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255),
    title VARCHAR(255),
    location VARCHAR(255),
    stipend VARCHAR(255),
    skills_required TEXT,
    description TEXT,
    deadline DATE
  )`,

  `CREATE TABLE IF NOT EXISTS resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    file_path VARCHAR(255),
    parsed_text LONGTEXT,
    score INT,
    analysis JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS resume_quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    results JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
];

stmts.forEach((s) => {
  db.query(s, (err) => {
    if (err) console.error("DB init failed:", err);
  });
});

// Seed minimal internships if table is empty
db.query('SELECT COUNT(*) as c FROM internships', (err, rows) => {
  if (err) return;
  const count = rows && rows[0] && rows[0].c;
  if (count === 0) {
    const seed = [
      [ 'Acme Corp', 'Frontend Intern', 'Remote', 'Paid', 'JavaScript,React,HTML,CSS,Git', 'Build UI components', '2026-06-30' ],
      [ 'DataWorks', 'Data Science Intern', 'Hybrid', 'Stipend', 'Python,Pandas,SQL,Machine Learning', 'Work with ML pipelines', '2026-05-30' ],
      [ 'CloudBase', 'Backend Intern', 'Remote', 'Paid', 'Node,Express,MySQL,Docker', 'Build APIs and services', '2026-07-15' ],
    ];
    seed.forEach(s => {
      db.query('INSERT INTO internships (company, title, location, stipend, skills_required, description, deadline) VALUES (?,?,?,?,?,?,?)', s, () => {});
    });
  }
});

module.exports = {};
