import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../api/auth.jsx';
import { SERVICES } from '../services.js';

const STATUS_LABEL = {
  requested:   'Requested',
  in_review:   'In review',
  scoping:     'Scoping',
  in_progress: 'In progress',
  delivered:   'Delivered',
  cancelled:   'Cancelled',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { projects } = await api('/projects', { auth: true });
      setProjects(projects);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  return (
    <section className="page-section">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.full_name?.split(' ')[0] || 'there'}</h1>
            <p className="section-desc">Your active and past projects with Crystal Tech.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="fas fa-plus" /> New project
          </button>
        </div>

        {showForm && <NewProjectForm onClose={() => setShowForm(false)} onCreated={load} />}

        {loading ? (
          <p>Loading...</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-folder-open" />
            <p>No projects yet. Submit one to get started.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((p) => (
              <article key={p.id} className="project-card project-card-portal">
                <div className="project-content">
                  <span className={`project-status status-${p.status}`}>
                    {STATUS_LABEL[p.status] || p.status}
                  </span>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.description}</p>
                  <div className="project-progress">
                    <div className="project-progress-bar" style={{ width: `${p.progress}%` }} />
                  </div>
                  <small>{p.progress}% complete</small>
                  {p.updates?.length > 0 && (
                    <ul className="project-updates">
                      {p.updates.map((u) => (
                        <li key={u.id}>
                          <small>{new Date(u.created_at).toLocaleDateString()}</small>
                          <span>{u.message}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function NewProjectForm({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', project_type: SERVICES[0].slug, description: '', features: '', timeline: '', budget: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await api('/projects', { method: 'POST', auth: true, body: form });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="review-modal open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="review-modal-inner">
        <button type="button" className="review-modal-close" onClick={onClose} aria-label="Close">
          <i className="fas fa-times" />
        </button>
        <form onSubmit={submit}>
          <h3>New project request</h3>
          {error && <div className="review-error show">{error}</div>}
          <label>Project type
            <select value={form.project_type}
                    onChange={(e) => setForm({ ...form, project_type: e.target.value })}>
              {SERVICES.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
            </select>
          </label>
          <label>Title
            <input required value={form.title} maxLength={200}
                   onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>Description
            <textarea required rows={4} maxLength={5000} value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label>Key features (comma-separated)
            <input value={form.features} maxLength={1000}
                   onChange={(e) => setForm({ ...form, features: e.target.value })} />
          </label>
          <label>Timeline
            <select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}>
              <option value="">Select...</option>
              <option>ASAP (within 2 weeks)</option>
              <option>1 month</option>
              <option>2-3 months</option>
              <option>3-6 months</option>
              <option>Flexible</option>
            </select>
          </label>
          <label>Budget (USD)
            <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
              <option value="">Select...</option>
              <option>Under $500</option>
              <option>$500 - $1,500</option>
              <option>$1,500 - $5,000</option>
              <option>$5,000 - $15,000</option>
              <option>$15,000+</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Submitting...' : 'Submit request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
