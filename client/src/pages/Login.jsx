import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const { t } = useTranslation();
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
      setError(err.response?.data?.message || t('auth.login_failed'));
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
        <p className="auth-subtitle">{t('tagline')}</p>
      </div>
      <div className="card">
        <h2>{t('auth.welcome_back')}</h2>
        {error && <div className="msg-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('auth.i_am')}</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="user">{t('auth.passenger')}</option>
              <option value="driver">{t('auth.driver')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('auth.username')}</label>
            <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required placeholder={t('auth.username_placeholder')} />
          </div>
          <div className="form-group">
            <label>{t('auth.password')}</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder={t('auth.password_placeholder')} />
          </div>
          <button className="btn btn-orange" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? t('auth.logging_in') : t('auth.login_btn')}
          </button>
        </form>
        <div className="auth-toggle">
          {t('auth.no_account')} <Link to="/register">{t('auth.register_btn')}</Link>
        </div>
      </div>
    </div>
  );
}
