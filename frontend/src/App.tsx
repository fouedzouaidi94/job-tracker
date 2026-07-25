import React, { useState } from 'react';
import { useApplications } from './hooks/useApplications';
import { Application, ApplicationInput, Status } from './types';
import './App.css';

const STATUS_COLORS: Record<Status, string> = {
  Applied: '#3B82F6',
  Interview: '#F59E0B',
  Offer: '#10B981',
  Rejected: '#EF4444',
  Withdrawn: '#6B7280',
};

const EMPTY_FORM: ApplicationInput = {
  company: '', role: '', status: 'Applied',
  location: '', salary_range: '', applied_date: new Date().toISOString().split('T')[0],
  notes: '', url: '',
};

function App() {
  const { applications, loading, error, create, update, remove } = useApplications();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [form, setForm] = useState<ApplicationInput>(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await update(editing.id, form);
    } else {
      await create(form);
    }
    setForm(EMPTY_FORM);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (app: Application) => {
    setEditing(app);
    setForm({
      company: app.company, role: app.role, status: app.status,
      location: app.location, salary_range: app.salary_range,
      applied_date: app.applied_date?.split('T')[0] || '',
      notes: app.notes, url: app.url,
    });
    setShowForm(true);
  };

  const filtered = applications
    .filter(a => filterStatus === 'All' || a.status === filterStatus)
    .filter(a =>
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
    );

  const stats = {
    total: applications.length,
    interviews: applications.filter(a => a.status === 'Interview').length,
    offers: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div>
            <h1>Job Tracker</h1>
            <p className="subtitle">Track your applications, stay organised</p>
          </div>
          <button className="btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY_FORM); }}>
            + Add Application
          </button>
        </div>
      </header>

      <main className="main">
        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total Applied', value: stats.total, color: '#3B82F6' },
            { label: 'Interviews', value: stats.interviews, color: '#F59E0B' },
            { label: 'Offers', value: stats.offers, color: '#10B981' },
            { label: 'Rejected', value: stats.rejected, color: '#EF4444' },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="filters">
          <input
            className="search"
            placeholder="Search company or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="status-filters">
            {['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'].map(s => (
              <button
                key={s}
                className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading">Loading applications...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No applications found. Add your first one!</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id}>
                    <td className="company-cell">
                      {app.url ? (
                        <a href={app.url} target="_blank" rel="noreferrer">{app.company}</a>
                      ) : app.company}
                    </td>
                    <td>{app.role}</td>
                    <td>
                      <span className="badge" style={{ background: STATUS_COLORS[app.status] + '20', color: STATUS_COLORS[app.status] }}>
                        {app.status}
                      </span>
                    </td>
                    <td>{app.location}</td>
                    <td>{app.salary_range}</td>
                    <td>{app.applied_date ? new Date(app.applied_date).toLocaleDateString('en-GB') : '—'}</td>
                    <td className="actions">
                      <button className="btn-edit" onClick={() => handleEdit(app)}>Edit</button>
                      <button className="btn-delete" onClick={() => remove(app.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Application' : 'New Application'}</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <label>Company *
                  <input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                </label>
                <label>Role *
                  <input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                </label>
              </div>
              <div className="form-row">
                <label>Status
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Status })}>
                    {['Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label>Applied Date
                  <input type="date" value={form.applied_date} onChange={e => setForm({ ...form, applied_date: e.target.value })} />
                </label>
              </div>
              <div className="form-row">
                <label>Location
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </label>
                <label>Salary Range
                  <input placeholder="e.g. €60k–€80k" value={form.salary_range} onChange={e => setForm({ ...form, salary_range: e.target.value })} />
                </label>
              </div>
              <label>Job URL
                <input type="url" placeholder="https://..." value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
              </label>
              <label>Notes
                <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </label>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editing ? 'Save Changes' : 'Add Application'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
