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
);

-- Seed some example data
INSERT INTO applications (company, role, status, location, salary_range, applied_date, notes, url) VALUES
('Axel Springer Tech', 'Fullstack Developer', 'Interview', 'Berlin, Germany', '€75k–€105k', '2026-07-20', 'Applied via LinkedIn. Java required — prep needed.', 'https://linkedin.com/jobs/view/4441195737'),
('Zalando', 'Software Engineer', 'Applied', 'Berlin, Germany', '€70k–€90k', '2026-07-22', 'Strong React/Node.js match.', ''),
('SAP', 'Web Developer', 'Applied', 'Schmalkalden, Germany', '€75k–€105k', '2026-07-21', 'Recruiter outreach via LinkedIn.', '');
