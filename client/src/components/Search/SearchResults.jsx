import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TRANSPORT_TYPES } from '../../constants/transportTypes';

export default function SearchResults({ results, type = 'rides' }) {
  const { t } = useTranslation();

  if (results.length === 0) {
    return <p>{t('search.no_results')}</p>;
  }

  if (type === 'rides') {
    return results.map(ride => {
      const tp = TRANSPORT_TYPES.find(x => x.id === ride.transportType);
      return (
        <div key={ride._id} className="search-result-card">
          <div className="search-result-info">
            <h4>{tp?.icon} {ride.source} → {ride.destination}</h4>
            <div className="search-result-meta">
              <span>{tp?.label}</span>
              <span>{ride.passengerCount} passager(s)</span>
              <span className={`badge badge-${ride.status}`}>{ride.status}</span>
              {ride.price && <span>{ride.price} Ar</span>}
              {ride.scheduledAt && <span>{new Date(ride.scheduledAt).toLocaleString()}</span>}
            </div>
          </div>
          <Link to={`/ride/${ride._id}`} className="btn btn-sm">{t('search.book')}</Link>
        </div>
      );
    });
  }

  if (type === 'drivers') {
    return results.map(driver => (
      <div key={driver._id} className="search-result-card">
        <div className="search-result-info">
          <h4>{driver.username}</h4>
          <div className="search-result-meta">
            <span>{driver.transportTypes?.join(', ')}</span>
            <span>{driver.favoriteAreas?.join(', ')}</span>
            {driver.averageRating > 0 && <span>{driver.averageRating} &#9733;</span>}
          </div>
        </div>
        <Link to={`/book/${driver._id}`} className="btn btn-sm btn-orange">{t('search.book')}</Link>
      </div>
    ));
  }

  // transports
  return results.map(v => {
    const tp = TRANSPORT_TYPES.find(x => x.id === v.transportType);
    return (
      <div key={v._id} className="search-result-card">
        <div className="search-result-info">
          <h4>{tp?.icon} {v.name || tp?.label}</h4>
          <div className="search-result-meta">
            <span>Capacité: {v.capacity}</span>
            {v.pricePerKm && <span>{v.pricePerKm} Ar/km</span>}
            {v.priceRange && <span>{v.priceRange}</span>}
            <span>{v.driver?.username} ({v.driver?.averageRating || 0} &#9733;)</span>
          </div>
        </div>
        <Link to={`/book/${v.driver?._id}`} className="btn btn-sm btn-orange">{t('search.book')}</Link>
      </div>
    );
  });
}
