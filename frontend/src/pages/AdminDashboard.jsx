import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const TABS = ['contact', 'reviews', 'projects'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('contact');
  return (
    <section className="page-section">
      <div className="container">
        <h1>Admin</h1>
        <nav className="admin-tabs">
          {TABS.map((t) => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
        {tab === 'contact'  && <ContactList />}
        {tab === 'reviews'  && <ReviewList />}
        {tab === 'projects' && <ProjectList />}
      </div>
    </section>
  );
}

function ContactList() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(true);
  const load = async () => {
    setBusy(true);
    try { const { messages } = await api('/admin/contact', { auth: true }); setRows(messages); }
    finally { setBusy(false); }
  };
  useEffect(() => { load(); }, []);
  const setStatus = async (id, status) => {
    await api(`/admin/contact/${id}`, { method: 'PATCH', auth: true, body: { status } });
    load();
  };
  if (busy) return <p>Loading...</p>;
  if (!rows.length) return <p>No messages yet.</p>;
  return (
    <table className="admin-table">
      <thead><tr><th>When</th><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th /></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td><small>{new Date(r.created_at).toLocaleString()}</small></td>
            <td>{r.name}</td>
            <td>{r.email}</td>
            <td>
              <strong>{r.subject}</strong>
              <div className="admin-cell-msg">{r.message}</div>
            </td>
            <td>
              <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)}>
                {['new', 'read', 'replied', 'archived'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </td>
            <td><a href={`mailto:${r.email}?subject=Re: ${encodeURIComponent(r.subject)}`}>Reply</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReviewList() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(true);
  const load = async () => {
    setBusy(true);
    try { const { reviews } = await api('/admin/reviews', { auth: true }); setRows(reviews); }
    finally { setBusy(false); }
  };
  useEffect(() => { load(); }, []);
  const moderate = async (id, approved) => {
    await api(`/admin/reviews/${id}`, { method: 'PATCH', auth: true, body: { approved } });
    load();
  };
  const remove = async (id) => {
    if (!confirm('Delete this review?')) return;
    await api(`/admin/reviews/${id}`, { method: 'DELETE', auth: true });
    load();
  };
  if (busy) return <p>Loading...</p>;
  if (!rows.length) return <p>No reviews yet.</p>;
  return (
    <table className="admin-table">
      <thead><tr><th>When</th><th>Author</th><th>Rating</th><th>Content</th><th>Approved</th><th /></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td><small>{new Date(r.created_at).toLocaleDateString()}</small></td>
            <td>{r.author_name}<br /><small>{r.author_role}</small></td>
            <td>{r.rating}/5</td>
            <td className="admin-cell-msg">{r.content}</td>
            <td>
              <input type="checkbox" checked={!!r.approved}
                     onChange={(e) => moderate(r.id, e.target.checked)} />
            </td>
            <td><button className="btn" onClick={() => remove(r.id)}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProjectList() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(true);
  const load = async () => {
    setBusy(true);
    try { const { projects } = await api('/admin/projects', { auth: true }); setRows(projects); }
    finally { setBusy(false); }
  };
  useEffect(() => { load(); }, []);
  const patch = async (id, body) => {
    await api(`/admin/projects/${id}`, { method: 'PATCH', auth: true, body });
    load();
  };
  if (busy) return <p>Loading...</p>;
  if (!rows.length) return <p>No projects yet.</p>;
  return (
    <table className="admin-table">
      <thead><tr><th>When</th><th>Client</th><th>Project</th><th>Status</th><th>Progress</th><th>Post update</th></tr></thead>
      <tbody>
        {rows.map((p) => (
          <tr key={p.id}>
            <td><small>{new Date(p.created_at).toLocaleDateString()}</small></td>
            <td>{p.full_name}<br /><small>{p.email}</small></td>
            <td><strong>{p.title}</strong><br /><small>{p.project_type}</small></td>
            <td>
              <select value={p.status} onChange={(e) => patch(p.id, { status: e.target.value })}>
                {['requested','in_review','scoping','in_progress','delivered','cancelled'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </td>
            <td>
              <input type="number" min={0} max={100} defaultValue={p.progress}
                     onBlur={(e) => {
                       const v = parseInt(e.target.value, 10);
                       if (!Number.isNaN(v) && v !== p.progress) patch(p.id, { progress: v });
                     }}
                     style={{ width: 60 }} />%
            </td>
            <td>
              <ProjectUpdateInput onSend={(msg) => patch(p.id, { update_message: msg })} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProjectUpdateInput({ onSend }) {
  const [msg, setMsg] = useState('');
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <input value={msg} placeholder="Update message..."
             onChange={(e) => setMsg(e.target.value)} />
      <button className="btn" disabled={!msg.trim()}
              onClick={() => { onSend(msg.trim()); setMsg(''); }}>
        Post
      </button>
    </div>
  );
}
