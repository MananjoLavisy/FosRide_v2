import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TRANSPORT_TYPES, PAYMENT_METHODS } from '../constants/transportTypes';
import PriceDisplay from '../components/Payment/PriceDisplay';
import RideMap from '../components/Map/RideMap';
import ReviewForm from '../components/Reviews/ReviewForm';
import ReviewList from '../components/Reviews/ReviewList';
import { useAuth } from '../context/AuthContext';

export default function RideDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [ride, setRide] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [reviewKey, setReviewKey] = useState(0);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const { data } = await axios.get(`/api/rides/${id}`);
        setRide(data);
      } catch { /* ignore */ }
    };
    fetchRide();
  }, [id]);

  const completeRide = async () => {
    try {
      const { data } = await axios.put(`/api/rides/${id}/complete`);
      setRide(data);
      setMsg({ type: 'success', text: t('notifications.ride_completed') });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const cancelRide = async () => {
    try {
      const { data } = await axios.put(`/api/rides/${id}/cancel`, { reason: 'Cancelled from detail page' });
      setRide(data);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  if (!ride) return <div className="loading">{t('common.loading')}</div>;

  const tp = TRANSPORT_TYPES.find(x => x.id === ride.transportType);
  const pm = PAYMENT_METHODS.find(x => x.id === ride.paymentMethod);

  return (
    <div>
      <div className="card">
        <h2>{tp?.icon} {ride.source} → {ride.destination}</h2>
        {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}

        <div className="booking-summary">
          <div className="booking-summary-row">
            <span>{t('user.transport')}</span>
            <span>{tp?.icon} {tp?.label}</span>
          </div>
          <div className="booking-summary-row">
            <span>{t('user.departure')}</span>
            <span>{ride.source}</span>
          </div>
          <div className="booking-summary-row">
            <span>{t('user.destination')}</span>
            <span>{ride.destination}</span>
          </div>
          <div className="booking-summary-row">
            <span>{t('user.status')}</span>
            <span className={`badge badge-${ride.status}`}>{ride.status}</span>
          </div>
          <div className="booking-summary-row">
            <span>{t('user.passengers')}</span>
            <span>{ride.passengerCount}</span>
          </div>
          {ride.scheduledAt && (
            <div className="booking-summary-row">
              <span>{t('user.scheduled_at')}</span>
              <span>{new Date(ride.scheduledAt).toLocaleString()}</span>
            </div>
          )}
          <div className="booking-summary-row">
            <span>{t('payment.method')}</span>
            <span>{pm?.icon} {pm?.label || ride.paymentMethod}</span>
          </div>
          {ride.price != null && (
            <div className="booking-summary-row">
              <span>{t('user.price')}</span>
              <span><strong>{ride.price} Ar</strong></span>
            </div>
          )}
        </div>

        <RideMap
          sourceCoords={ride.sourceCoords}
          destCoords={ride.destCoords}
          source={ride.source}
          destination={ride.destination}
        />

        {ride.price && (
          <PriceDisplay price={ride.price} discount={ride.discount} paymentMethod={ride.paymentMethod} />
        )}

        {ride.driver && (
          <div className="profile-card" style={{ marginTop: 16 }}>
            <div className="profile-card-photo">
              {ride.driver.profilePhoto ? (
                <img src={`/api/uploads/${ride.driver.profilePhoto}`} alt="" />
              ) : (
                <span className="profile-card-initials">{ride.driver.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="profile-card-info">
              <h3>{ride.driver.username}</h3>
              <p className="profile-card-bio">{ride.driver.mobileNumber}</p>
            </div>
            <Link to={`/profile/driver/${ride.driver._id}`} className="btn btn-sm">
              {t('nav.profile')}
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          {ride.status === 'accepted' && (
            <>
              <button className="btn btn-success" onClick={completeRide}>{t('user.complete_ride')}</button>
              <button className="btn btn-danger" onClick={cancelRide}>{t('user.cancel_ride')}</button>
            </>
          )}
          {(ride.status === 'pending' || ride.status === 'offered') && (
            <button className="btn btn-danger" onClick={cancelRide}>{t('user.cancel_ride')}</button>
          )}
        </div>

        {ride.status === 'completed' && user && (
          <div style={{ marginTop: 24 }}>
            {ride.driver && user.role === 'user' && (
              <ReviewForm
                rideId={ride._id}
                revieweeId={ride.driver._id}
                revieweeRole="driver"
                onSubmitted={() => setReviewKey(k => k + 1)}
              />
            )}
            {ride.user && user.role === 'driver' && (
              <ReviewForm
                rideId={ride._id}
                revieweeId={typeof ride.user === 'object' ? ride.user._id : ride.user}
                revieweeRole="user"
                onSubmitted={() => setReviewKey(k => k + 1)}
              />
            )}
            <div style={{ marginTop: 16 }}>
              <h3>{t('reviews.title')}</h3>
              <ReviewList key={reviewKey} targetId={ride.driver?._id || (typeof ride.user === 'object' ? ride.user._id : ride.user)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
