'use strict';

const mysql = require('mysql2/promise');

// ── Connection pool (reused across warm serverless invocations) ──────────────
let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST,
      port:     parseInt(process.env.DB_PORT || '3306', 10),
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false   // Required for Aiven SSL handshake
      },
      waitForConnections:  true,
      connectionLimit:     3,
      queueLimit:          0,
      connectTimeout:      10000,
      idleTimeout:         60000
    });
  }
  return pool;
}

// ── CORS headers ─────────────────────────────────────────────────────────────
const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function ok(res, data, status = 200) {
  Object.entries({ 'Content-Type': 'application/json', ...CORS_HEADERS })
    .forEach(([k, v]) => res.setHeader(k, v));
  res.status(status).json(data);
}

function err(res, message, status = 500) {
  Object.entries({ 'Content-Type': 'application/json', ...CORS_HEADERS })
    .forEach(([k, v]) => res.setHeader(k, v));
  res.status(status).json({ error: message });
}

function preflight(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = { getPool, ok, err, preflight };
