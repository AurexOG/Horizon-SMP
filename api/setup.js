'use strict';

const { getPool, ok, err, preflight } = require('./_db');

export default async function handler(req, res) {
  if (preflight(req, res)) return;

  let conn;
  try {
    const pool = getPool();
    conn = await pool.getConnection();

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        username   VARCHAR(32)  NOT NULL,
        rating     INT          NOT NULL,
        message    TEXT         NOT NULL,
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
      )
    `);

    return ok(res, {
      success: true,
      message: 'Table "feedbacks" is ready. You can now use /api/feedback.'
    });
  } catch (e) {
    console.error('[setup]', e);
    return err(res, 'Database setup failed: ' + e.message);
  } finally {
    if (conn) conn.release();
  }
}
