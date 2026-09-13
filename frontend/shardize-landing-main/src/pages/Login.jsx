import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/theme.css';
import '../styles/app.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const justRegistered = location.state?.registered;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('Please enter your username and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="grain-overlay" aria-hidden="true" />
      <Link to="/" className="auth-back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Back to home
      </Link>

      <div className="auth-card">
        <div className="auth-card-header">
          <div className="brand-logo">
            <div className="brand-logo-mark">S</div>
            <span>Shardize</span>
          </div>
          <h1 className="auth-card-title">Welcome back</h1>
          <p className="auth-card-sub">Sign in to access your storage network.</p>
        </div>

        {justRegistered && (
          <div className="auth-success-banner" style={{ marginBottom: 16 }}>
            Account created successfully. You can sign in now.
          </div>
        )}

        {error && <div className="auth-error-banner" style={{ marginBottom: 16 }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="auth-field-label" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              className="auth-input"
              placeholder="your_username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="auth-field-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-submit-button" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch-line">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
