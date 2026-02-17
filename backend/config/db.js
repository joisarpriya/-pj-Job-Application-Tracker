const mysql = require("mysql2");
require('dotenv').config();

const DB_HOST = process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost';
const DB_USER = process.env.MYSQL_USER || process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '';
const DB_NAME = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'applyflow';
const DB_PORT = process.env.MYSQL_PORT || process.env.DB_PORT || 3306;

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Log connection status clearly for debugging in production
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL FAILED:", err && err.message ? err.message : err);
  } else {
    console.log(`✅ MySQL connected to ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    connection.release();
  }
});

module.exports = db;
