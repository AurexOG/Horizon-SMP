'use strict';

const { getPool, ok, err, preflight } = require('./_db');

export default async function handler(req, res) {
  if (preflight(req, res)) return;

  try {
    const pool = getPool();
    await pool.execute('TRUNCATE TABLE feedbacks');
    return ok(res, { message: 'All reviews have been permanently deleted.' });
  } catch (e) {
    return err(res, e.message, 500);
  }
}
