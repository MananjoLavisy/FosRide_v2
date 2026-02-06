import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-section">
        <div className="auth-logo-circle">
          <img src="/logo.png" alt="FosaRide" onError={e => { e.target.parentElement.innerHTML = '<span class="auth-logo-fallback">FR</span>'; }} />
        </div>
        <h2 className="auth-title">Fosa<span>Ride</span></h2>
        <p className="auth-subtitle">Your tropical ride-sharing platform</p>
      </div>
      <div className="card">
        <h2>Welcome back</h2>
        {error && <div className="msg-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>I am a</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="user">Passenger</option>
              <option value="driver">Driver</option>
            </select>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required placeholder="Enter your username" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Enter your password" />
          </div>
          <button className="btn btn-orange" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-toggle">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
