import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const user = await login(form.email, form.password);
      nav(loc.state?.from || (user.role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page-section auth-section">
      <div className="container auth-container">
        <h1>Welcome back</h1>
        <p className="section-desc">Log in to your client portal.</p>
        <form onSubmit={onSubmit} className="auth-form">
          {error && <div className="crystal-form-feedback error">{error}</div>}
          <label>Email
            <input required type="email" value={form.email}
                   onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>Password
            <input required type="password" value={form.password}
                   onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p style={{ marginTop: 24 }}>
          New here? <Link to="/register">Create an account</Link>.
        </p>
      </div>
    </section>
  );
}
