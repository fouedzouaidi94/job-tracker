const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auto-create tables on startup
pool.query(`
  CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Applied',
    location VARCHAR(255),
    salary_range VARCHAR(100),
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
`).then(() => {
  return pool.query(`ALTER TABLE applications ALTER COLUMN url TYPE TEXT`);
}).then(() => console.log('Database ready'))
  .catch(console.error);

app.use('/api/applications', require('./routes/applications'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/setup', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Applied',
        location VARCHAR(255),
        salary_range VARCHAR(100),
        applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
        notes TEXT,
        url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query(`ALTER TABLE applications ALTER COLUMN url TYPE TEXT`);
    res.json({ message: 'Tables ready' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));