import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/auth.jsx';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await register(form);
      nav('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page-section auth-section">
      <div className="container auth-container">
        <h1>Create your account</h1>
        <p className="section-desc">Track every project we build for you in one place.</p>
        <form onSubmit={onSubmit} className="auth-form">
          {error && <div className="crystal-form-feedback error">{error}</div>}
          <label>Full name
            <input required value={form.full_name} maxLength={120}
                   onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </label>
          <label>Email
            <input required type="email" value={form.email} maxLength={254}
                   onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>Password (min 8 chars)
            <input required type="password" minLength={8} value={form.password}
                   onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p style={{ marginTop: 24 }}>
          Already have one? <Link to="/login">Log in</Link>.
        </p>
      </div>
    </section>
  );
}
