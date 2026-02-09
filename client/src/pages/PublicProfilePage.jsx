import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import VehicleCard from '../components/Profile/VehicleCard';

export default function PublicProfilePage() {
  const { t } = useTranslation();
  const { role, id } = useParams();
  const [profile, setProfile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (role === 'driver') {
          const { data } = await axios.get(`/api/drivers/${id}`);
          setProfile(data);
        } else {
          const { data } = await axios.get(`/api/auth/user/${id}`);
          setProfile(data);
        }
      } catch { /* ignore */ }
    };

    const fetchVehicles = async () => {
      if (role !== 'driver') return;
      try {
        const { data } = await axios.get(`/api/drivers/${id}/vehicles`);
        setVehicles(data);
      } catch { /* ignore */ }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`/api/reviews/for/${id}`);
        setReviews(data);
      } catch { /* ignore */ }
    };

    fetchProfile();
    fetchVehicles();
    fetchReviews();
  }, [role, id]);

  if (!profile) return <div className="loading">{t('common.loading')}</div>;

  const photoUrl = profile.profilePhoto
    ? `/api/uploads/${profile.profilePhoto}`
    : null;

  const avgRating = profile.averageRating || 0;

  return (
    <div>
      <div className="card">
        <div className="public-profile-header">
          <div className="public-profile-photo">
            {photoUrl ? (
              <img src={photoUrl} alt={profile.username} />
            ) : (
              <span className="profile-card-initials large">
                {profile.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="public-profile-info">
            <h2>{profile.username}</h2>
            {profile.bio && <p>{profile.bio}</p>}
            <div className="profile-card-meta">
              {avgRating > 0 && (
                <span className="profile-card-rating">
                  {avgRating} <span style={{ color: 'var(--orange)' }}>&#9733;</span>
                  {profile.ratings?.length > 0 && <small> ({profile.ratings.length} {t('reviews.title').toLowerCase()})</small>}
                </span>
              )}
              <span className="badge badge-active">{role === 'driver' ? t('auth.driver') : t('auth.passenger')}</span>
            </div>
          </div>
        </div>
      </div>

      {role === 'driver' && vehicles.length > 0 && (
        <div className="card">
          <h2>{t('profile.vehicles')}</h2>
          {vehicles.map(v => (
            <VehicleCard key={v._id} vehicle={v} readOnly />
          ))}
        </div>
      )}

      {reviews.length > 0 && (
        <div className="card">
          <h2>{t('profile.reviews')}</h2>
          {reviews.map(r => (
            <div key={r._id} className="review-item">
              <div className="review-header">
                <strong>{r.reviewer?.username || 'Anonyme'}</strong>
                <span className="review-rating">
                  {r.rating} <span style={{ color: 'var(--orange)' }}>&#9733;</span>
                </span>
              </div>
              {r.comment && <p className="review-comment">{r.comment}</p>}
              <small className="review-date">{new Date(r.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
