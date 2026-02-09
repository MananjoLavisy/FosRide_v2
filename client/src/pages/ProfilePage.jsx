import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import PhotoUpload from '../components/Profile/PhotoUpload';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ bio: '', language: 'fr', profilePhoto: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let endpoint = '/api/auth/me';
        const { data } = await axios.get(endpoint);
        setProfile(data);
        setForm({
          bio: data.bio || '',
          language: data.language || 'fr',
          profilePhoto: data.profilePhoto || '',
        });
      } catch { /* ignore */ }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      const endpoint = user.role === 'driver' ? '/api/drivers/profile' : '/api/auth/profile';
      const { data } = await axios.put(endpoint, form);
      setProfile(data);
      setMsg({ type: 'success', text: t('profile.profile_updated') });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div className="loading">{t('common.loading')}</div>;

  return (
    <div>
      <div className="card">
        <h2>{t('profile.my_profile')}</h2>
        {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}

        <div className="profile-edit-layout">
          <PhotoUpload
            currentPhoto={form.profilePhoto}
            onUploaded={(filename) => setForm({ ...form, profilePhoto: filename })}
          />

          <form onSubmit={handleSave} className="profile-edit-form">
            <div className="form-group">
              <label>{t('auth.username')}</label>
              <input value={profile.username} disabled />
            </div>
            <div className="form-group">
              <label>{t('auth.email')}</label>
              <input value={profile.email} disabled />
            </div>
            <div className="form-group">
              <label>{t('profile.bio')}</label>
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder={t('profile.bio_placeholder')}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>{t('profile.language')}</label>
              <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="mg">Malagasy</option>
              </select>
            </div>
            <button className="btn btn-orange" type="submit" disabled={saving}>
              {saving ? t('profile.saving') : t('profile.save_changes')}
            </button>
          </form>
        </div>

        <div className="profile-info-bar">
          <div className="profile-info-item">
            <strong>{t('profile.member_since')}</strong>
            <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
          </div>
          {user.role === 'user' && (
            <div className="profile-info-item">
              <strong>{t('profile.rides_completed')}</strong>
              <span>{profile.rideCount || 0}</span>
            </div>
          )}
          {user.role === 'driver' && profile.averageRating !== undefined && (
            <div className="profile-info-item">
              <strong>{t('user.avg_rating')}</strong>
              <span>{profile.averageRating} <span style={{ color: 'var(--orange)' }}>&#9733;</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
