import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { providerApi } from '../lib/api';
import '../styles/theme.css';
import '../styles/app.css';

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'provider' ? 'provider' : 'consumer';

  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Object.values(form).some((v) => !v)) {
      setError('Please fill in all fields.');
      return;
    }

    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form.username, form.email, form.password, form.password2);

      // Log in right away so we can flip the role (provider signups
      // become storage nodes) before landing on the dashboard.
      await login(form.username, form.password);

      if (role === 'provider') {
        try {
          await providerApi.becomeProvider();
        } catch {
          // Non-fatal — user can still upgrade to provider from the dashboard.
        }
        navigate('/provider');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const fieldErrors = err.data?.errors;
      if (fieldErrors) {
        const firstKey = Object.keys(fieldErrors)[0];
        const firstMsg = Array.isArray(fieldErrors[firstKey])
          ? fieldErrors[firstKey][0]
          : fieldErrors[firstKey];
        setError(firstMsg);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
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
          <h1 className="auth-card-title">Create your account</h1>
          <p className="auth-card-sub">Join the decentralized storage network.</p>
        </div>

        <div className="auth-role-toggle" style={{ marginBottom: 20 }} role="group" aria-label="Account type">
          <div
            className={`auth-role-option ${role === 'consumer' ? 'active' : ''}`}
            onClick={() => setRole('consumer')}
          >
            Store files
          </div>
          <div
            className={`auth-role-option ${role === 'provider' ? 'active' : ''}`}
            onClick={() => setRole('provider')}
          >
            Host a node
          </div>
        </div>

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
            <label className="auth-field-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="auth-field-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="auth-field-label" htmlFor="password2">Confirm password</label>
            <input
              id="password2"
              name="password2"
              type="password"
              className="auth-input"
              placeholder="Re-enter your password"
              value={form.password2}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-submit-button" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch-line">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
