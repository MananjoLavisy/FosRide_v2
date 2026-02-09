import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { TRANSPORT_TYPES } from '../constants/transportTypes';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({
    username: '', email: '', password: '', mobileNumber: '',
    driverLicense: '', nationalID: '',
  });
  const [selectedTransports, setSelectedTransports] = useState([]);
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
          transportTypes: selectedTransports,
        });
        setSuccess(t('auth.register_success'));
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
        <p className="auth-subtitle">{t('join_adventure')}</p>
      </div>
      <div className="card">
        <h2>{t('auth.create_account')}</h2>
        {error && <div className="msg-error">{error}</div>}
        {success && <div className="msg-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('auth.i_am')}</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">{t('auth.passenger')}</option>
              <option value="driver">{t('auth.driver_conductor')}</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('auth.username')}</label>
              <input value={form.username} onChange={set('username')} required placeholder={t('auth.choose_username')} />
            </div>
            <div className="form-group">
              <label>{t('auth.email')}</label>
              <input type="email" value={form.email} onChange={set('email')} required placeholder={t('auth.email_placeholder')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('auth.password')}</label>
              <input type="password" value={form.password} onChange={set('password')} required placeholder={t('auth.password_min')} />
            </div>
            <div className="form-group">
              <label>{t('auth.mobile')}</label>
              <input value={form.mobileNumber} onChange={set('mobileNumber')} required placeholder={t('auth.mobile_placeholder')} />
            </div>
          </div>
          {role === 'driver' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('auth.driver_license')}</label>
                  <input value={form.driverLicense} onChange={set('driverLicense')} required placeholder={t('auth.driver_license_placeholder')} />
                </div>
                <div className="form-group">
                  <label>{t('auth.national_id')}</label>
                  <input value={form.nationalID} onChange={set('nationalID')} required placeholder={t('auth.national_id_placeholder')} />
                </div>
              </div>
              <div className="form-group">
                <label>{t('auth.transport_types_offered')}</label>
                <div className="transport-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                  {TRANSPORT_TYPES.map(tp => (
                    <button
                      key={tp.id}
                      type="button"
                      className={`transport-card ${selectedTransports.includes(tp.id) ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedTransports(prev =>
                          prev.includes(tp.id) ? prev.filter(x => x !== tp.id) : [...prev, tp.id]
                        );
                      }}
                    >
                      <span className="transport-icon">{tp.icon}</span>
                      <span className="transport-label">{tp.label}</span>
                      {selectedTransports.includes(tp.id) && (
                        <span className="transport-check">&#10003;</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <button className="btn btn-orange" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? t('auth.registering') : t('auth.register_btn')}
          </button>
        </form>
        <div className="auth-toggle">
          {t('auth.has_account')} <Link to="/login">{t('auth.login_btn')}</Link>
        </div>
      </div>
    </div>
  );
}
