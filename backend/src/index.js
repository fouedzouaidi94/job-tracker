const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');

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
    url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
`).then(() => console.log('Database ready')).catch(console.error);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/applications', require('./routes/applications'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/api/setup', async (req, res) => {
  const pool = require('./db');
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
        url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    res.json({ message: 'Tables created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
