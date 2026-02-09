import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function ProfileCard({ profile, role }) {
  const { t } = useTranslation();

  const photoUrl = profile.profilePhoto
    ? `/api/uploads/${profile.profilePhoto}`
    : null;

  const avgRating = profile.averageRating || (
    profile.ratings?.length > 0
      ? Math.round((profile.ratings.reduce((a, b) => a + b, 0) / profile.ratings.length) * 10) / 10
      : 0
  );

  return (
    <div className="profile-card">
      <div className="profile-card-photo">
        {photoUrl ? (
          <img src={photoUrl} alt={profile.username} />
        ) : (
          <span className="profile-card-initials">
            {profile.username?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="profile-card-info">
        <h3>{profile.username}</h3>
        {profile.bio && <p className="profile-card-bio">{profile.bio}</p>}
        <div className="profile-card-meta">
          {avgRating > 0 && (
            <span className="profile-card-rating">
              {avgRating} <span style={{ color: 'var(--orange)' }}>&#9733;</span>
              {profile.ratings?.length > 0 && <small> ({profile.ratings.length})</small>}
            </span>
          )}
          {role === 'driver' && profile.transportTypes?.length > 0 && (
            <span className="profile-card-types">
              {profile.transportTypes.join(', ')}
            </span>
          )}
        </div>
      </div>
      <Link to={`/profile/${role}/${profile._id}`} className="btn btn-sm">
        {t('profile.my_profile')}
      </Link>
    </div>
  );
}
