import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, errorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setSubmitting(true);
    try {
      await registerUser(form);
      await login(form.email, form.password); // sign in straight away
      navigate('/dashboard');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Create your account</h1>
      <p className="muted">Your tasks are private to your email address.</p>
      <form onSubmit={submit}>
        <label>
          Name
          <input name="name" type="text" value={form.name} onChange={change} autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={change} autoComplete="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={change} autoComplete="new-password" minLength={6} required />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Log in</Link></p>
    </section>
  );
}
