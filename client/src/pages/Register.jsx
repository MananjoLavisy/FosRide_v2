import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({
    username: '', email: '', password: '', mobileNumber: '',
    driverLicense: '', nationalID: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (role === 'user') {
        const { data } = await axios.post('/api/auth/register/user', {
          username: form.username, email: form.email,
          password: form.password, mobileNumber: form.mobileNumber,
        });
        login(data.user);
      } else {
        await axios.post('/api/auth/register/driver', {
          username: form.username, email: form.email,
          password: form.password, mobileNumber: form.mobileNumber,
          driverLicense: form.driverLicense, nationalID: form.nationalID,
        });
        setSuccess('Registration successful! Waiting for admin approval.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-logo-section">
        <div className="auth-logo-circle">
          <img src="/logo.png" alt="FosaRide" onError={e => { e.target.parentElement.innerHTML = '<span class="auth-logo-fallback">FR</span>'; }} />
        </div>
        <h2 className="auth-title">Fosa<span>Ride</span></h2>
        <p className="auth-subtitle">Join the ride today</p>
      </div>
      <div className="card">
        <h2>Create account</h2>
        {error && <div className="msg-error">{error}</div>}
        {success && <div className="msg-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>I want to be a</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">Passenger</option>
              <option value="driver">Driver</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input value={form.username} onChange={set('username')} required placeholder="Choose a username" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set('email')} required placeholder="your@email.com" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={form.password} onChange={set('password')} required placeholder="Min. 4 characters" />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input value={form.mobileNumber} onChange={set('mobileNumber')} required placeholder="+1 234 567 890" />
            </div>
          </div>
          {role === 'driver' && (
            <div className="form-row">
              <div className="form-group">
                <label>Driver License</label>
                <input value={form.driverLicense} onChange={set('driverLicense')} required placeholder="License number" />
              </div>
              <div className="form-group">
                <label>National ID</label>
                <input value={form.nationalID} onChange={set('nationalID')} required placeholder="National ID number" />
              </div>
            </div>
          )}
          <button className="btn btn-orange" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div className="auth-toggle">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
