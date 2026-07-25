const pool = require('../db');

const getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM applications ORDER BY applied_date DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM applications WHERE id = $1', [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { company, role, status, location, salary_range, applied_date, notes, url } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO applications (company, role, status, location, salary_range, applied_date, notes, url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [company, role, status || 'Applied', location, salary_range, applied_date || new Date(), notes, url]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, role, status, location, salary_range, applied_date, notes, url } = req.body;
    const { rows } = await pool.query(
      `UPDATE applications SET
        company=$1, role=$2, status=$3, location=$4,
        salary_range=$5, applied_date=$6, notes=$7, url=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [company, role, status, location, salary_range, applied_date, notes, url, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM applications WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
