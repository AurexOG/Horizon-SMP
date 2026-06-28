'use strict';

const { getPool, ok, err, preflight } = require('./_db');

export default async function handler(req, res) {
  if (preflight(req, res)) return;

  // ── GET /api/feedback ──────────────────────────────────────────────────────
  if (req.method === 'GET') {
    let conn;
    try {
      const pool = getPool();
      conn = await pool.getConnection();
      const [rows] = await conn.execute(
        'SELECT id, username, rating, message, created_at FROM feedbacks ORDER BY id DESC LIMIT 100'
      );
      return ok(res, { success: true, feedbacks: rows });
    } catch (e) {
      console.error('[feedback:GET]', e);
      return err(res, 'Could not fetch feedbacks: ' + e.message);
    } finally {
      if (conn) conn.release();
    }
  }

  // ── POST /api/feedback ─────────────────────────────────────────────────────
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return err(res, 'Invalid JSON body.', 400); }
    }

    const username = (body.username || '').trim();
    const rating   = parseInt(body.rating, 10);
    const message  = (body.message  || '').trim();

    if (!username || username.length > 32)
      return err(res, 'username is required and must be at most 32 characters.', 400);
    if (!rating || rating < 1 || rating > 5)
      return err(res, 'rating must be an integer between 1 and 5.', 400);
    if (!message || message.length > 1000)
      return err(res, 'message is required and must be at most 1000 characters.', 400);

    let conn;
    try {
      const pool = getPool();
      conn = await pool.getConnection();
      const [result] = await conn.execute(
        'INSERT INTO feedbacks (username, rating, message) VALUES (?, ?, ?)',
        [username, rating, message]
      );
      return ok(res, { success: true, message: 'Feedback submitted successfully!', insertId: result.insertId }, 201);
    } catch (e) {
      console.error('[feedback:POST]', e);
      return err(res, 'Could not save feedback: ' + e.message);
    } finally {
      if (conn) conn.release();
    }
  }

  return err(res, 'Method not allowed.', 405);
}
