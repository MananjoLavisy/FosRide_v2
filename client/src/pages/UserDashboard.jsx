import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TRANSPORT_TYPES, MAX_PASSENGERS, PAYMENT_METHODS } from '../constants/transportTypes';

export default function UserDashboard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('request');
  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [rideForm, setRideForm] = useState({
    source: '',
    destination: '',
    passengerCount: 1,
    transportType: 'voiture',
    sourceCoords: null,
    destCoords: null,
    scheduledAt: '',
    paymentMethod: 'cash',
  });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const fetchRides = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/rides/my');
      setRides(data);
    } catch { /* ignore */ }
  }, []);

  const fetchDrivers = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/drivers');
      setDrivers(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchRides();
    fetchDrivers();
  }, [fetchRides, fetchDrivers]);

  const detectLocation = (target) => {
    if (!navigator.geolocation) {
      setLocationError(t('user.geolocation_not_supported'));
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        let placeName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
          );
          const geo = await resp.json();
          if (geo.display_name) {
            const parts = geo.display_name.split(',').map(s => s.trim());
            placeName = parts.slice(0, 3).join(', ');
          }
        } catch { /* use coords as fallback */ }

        if (target === 'source') {
          setRideForm(f => ({ ...f, source: placeName, sourceCoords: coords }));
        } else {
          setRideForm(f => ({ ...f, destination: placeName, destCoords: coords }));
        }
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setLocationError(t('user.location_denied'));
        else if (err.code === 2) setLocationError(t('user.location_unavailable'));
        else setLocationError(t('user.location_timeout'));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const requestRide = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const payload = {
        source: rideForm.source,
        destination: rideForm.destination,
        passengerCount: rideForm.passengerCount,
        transportType: rideForm.transportType,
        sourceCoords: rideForm.sourceCoords,
        destCoords: rideForm.destCoords,
        scheduledAt: rideForm.scheduledAt || undefined,
        paymentMethod: rideForm.paymentMethod,
      };
      const { data } = await axios.post('/api/rides', payload);
      const transportLabel = TRANSPORT_TYPES.find(tp => tp.id === data.transportType)?.label || data.transportType;
      let text = t('user.ride_requested', { type: transportLabel });
      if (data.discount > 0) text += ` ${t('user.discount_applied', { percent: data.discount })}`;
      setMsg({ type: 'success', text });
      setRideForm({ source: '', destination: '', passengerCount: 1, transportType: 'voiture', sourceCoords: null, destCoords: null, scheduledAt: '', paymentMethod: 'cash' });
      fetchRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('user.request_failed') });
    }
  };

  const acceptOffer = async (rideId, driverId, price) => {
    try {
      await axios.post(`/api/rides/${rideId}/accept`, { driverId, price });
      setMsg({ type: 'success', text: t('user.offer_accepted') });
      fetchRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const completeRide = async (rideId) => {
    try {
      await axios.put(`/api/rides/${rideId}/complete`);
      setMsg({ type: 'success', text: t('user.complete_ride') });
      fetchRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const cancelRide = async (rideId) => {
    try {
      await axios.put(`/api/rides/${rideId}/cancel`, { reason: 'User cancelled' });
      fetchRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const [ratingDriver, setRatingDriver] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);

  const submitRating = async () => {
    if (!ratingDriver || ratingValue < 1) return;
    try {
      const { data } = await axios.post(`/api/drivers/${ratingDriver}/rate`, { rating: ratingValue });
      setMsg({ type: 'success', text: data.message });
      setRatingDriver(null);
      setRatingValue(0);
      fetchDrivers();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const getTransportIcon = (type) => {
    const tp = TRANSPORT_TYPES.find(tr => tr.id === type);
    return tp ? `${tp.icon} ${tp.label}` : type;
  };

  const selectedMax = MAX_PASSENGERS[rideForm.transportType] || 4;

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${tab === 'request' ? 'active' : ''}`} onClick={() => setTab('request')}>
          {t('user.request_ride')}
        </button>
        <button className={`tab ${tab === 'rides' ? 'active' : ''}`} onClick={() => { setTab('rides'); fetchRides(); }}>
          {t('user.my_rides')}
        </button>
        <button className={`tab ${tab === 'rate' ? 'active' : ''}`} onClick={() => { setTab('rate'); fetchDrivers(); }}>
          {t('user.rate_driver')}
        </button>
        <button className={`tab ${tab === 'ratings' ? 'active' : ''}`} onClick={() => { setTab('ratings'); fetchDrivers(); }}>
          {t('user.driver_ratings')}
        </button>
      </div>

      {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}

      {tab === 'request' && (
        <div className="card">
          <h2>{t('user.request_ride')}</h2>

          <div className="form-group">
            <label>{t('user.transport_type')}</label>
            <div className="transport-grid">
              {TRANSPORT_TYPES.map(tp => (
                <button
                  key={tp.id}
                  type="button"
                  className={`transport-card ${rideForm.transportType === tp.id ? 'selected' : ''}`}
                  onClick={() => setRideForm(f => ({
                    ...f,
                    transportType: tp.id,
                    passengerCount: Math.min(f.passengerCount, MAX_PASSENGERS[tp.id]),
                  }))}
                >
                  <span className="transport-icon">{tp.icon}</span>
                  <span className="transport-label">{tp.label}</span>
                  <span className="transport-desc">{tp.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={requestRide}>
            <div className="form-group">
              <label>{t('user.departure')}</label>
              <div className="location-input-wrap">
                <input
                  value={rideForm.source}
                  onChange={e => setRideForm({ ...rideForm, source: e.target.value, sourceCoords: null })}
                  required
                  placeholder={t('user.departure_placeholder')}
                />
                <button type="button" className="btn-location" onClick={() => detectLocation('source')} disabled={locating} title={t('user.detect_location')}>
                  {locating ? <span className="spinner-sm"></span> : '\u{1F4CD}'}
                </button>
              </div>
              {rideForm.sourceCoords && (
                <span className="coords-tag">
                  GPS: {rideForm.sourceCoords.lat.toFixed(4)}, {rideForm.sourceCoords.lng.toFixed(4)}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>{t('user.destination')}</label>
              <div className="location-input-wrap">
                <input
                  value={rideForm.destination}
                  onChange={e => setRideForm({ ...rideForm, destination: e.target.value, destCoords: null })}
                  required
                  placeholder={t('user.destination_placeholder')}
                />
                <button type="button" className="btn-location" onClick={() => detectLocation('destination')} disabled={locating} title={t('user.detect_location')}>
                  {locating ? <span className="spinner-sm"></span> : '\u{1F4CD}'}
                </button>
              </div>
              {rideForm.destCoords && (
                <span className="coords-tag">
                  GPS: {rideForm.destCoords.lat.toFixed(4)}, {rideForm.destCoords.lng.toFixed(4)}
                </span>
              )}
            </div>

            {locationError && <div className="msg-error" style={{ marginBottom: 12 }}>{locationError}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>{t('user.passengers')} ({t('user.passengers_max', { max: selectedMax })})</label>
                <input
                  type="number"
                  min="1"
                  max={selectedMax}
                  value={rideForm.passengerCount}
                  onChange={e => setRideForm({ ...rideForm, passengerCount: Math.min(parseInt(e.target.value) || 1, selectedMax) })}
                />
              </div>
              <div className="form-group">
                <label>{t('user.scheduled_at')}</label>
                <input
                  type="datetime-local"
                  value={rideForm.scheduledAt}
                  onChange={e => setRideForm({ ...rideForm, scheduledAt: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('user.payment_method')}</label>
              <div className="payment-grid">
                {PAYMENT_METHODS.map(pm => (
                  <button
                    key={pm.id}
                    type="button"
                    className={`payment-card ${rideForm.paymentMethod === pm.id ? 'selected' : ''}`}
                    onClick={() => setRideForm({ ...rideForm, paymentMethod: pm.id })}
                  >
                    <span className="payment-icon">{pm.icon}</span>
                    <span className="payment-label">{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-orange" type="submit" style={{ width: '100%', padding: '14px 24px', fontSize: 16 }}>
              {t('user.request_btn')} {TRANSPORT_TYPES.find(tp => tp.id === rideForm.transportType)?.icon}{' '}
              {TRANSPORT_TYPES.find(tp => tp.id === rideForm.transportType)?.label}
            </button>
          </form>
        </div>
      )}

      {tab === 'rides' && (
        <div className="card">
          <h2>{t('user.my_rides')}</h2>
          {rides.length === 0 ? (
            <p>{t('user.no_rides')}</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t('user.transport')}</th><th>{t('user.departure')}</th><th>{t('user.destination')}</th>
                    <th>{t('user.status')}</th><th>{t('user.discount')}</th><th>{t('user.price')}</th>
                    <th>{t('user.driver')}</th><th>{t('user.offers')}</th><th>{t('user.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map(ride => (
                    <tr key={ride._id}>
                      <td><span className="transport-badge">{getTransportIcon(ride.transportType)}</span></td>
                      <td>{ride.source}</td>
                      <td>{ride.destination}</td>
                      <td><span className={`badge badge-${ride.status}`}>{ride.status}</span></td>
                      <td>{ride.discount > 0 ? <span className="discount-tag">{ride.discount}% {t('common.off')}</span> : '-'}</td>
                      <td>{ride.price != null ? `${ride.price} Ar` : '-'}</td>
                      <td>{ride.driver?.username ? <Link to={`/profile/driver/${ride.driver._id}`}>{ride.driver.username}</Link> : '-'}</td>
                      <td>
                        {ride.status === 'offered' && ride.driverOffers?.map((offer, i) => (
                          <div key={i} style={{ marginBottom: 4 }}>
                            {offer.driver?.username}: {offer.price} Ar
                            {ride.status !== 'accepted' && (
                              <button className="btn btn-success btn-sm" style={{ marginLeft: 8 }}
                                onClick={() => acceptOffer(ride._id, offer.driver?._id || offer.driver, offer.price)}>
                                {t('user.accept')}
                              </button>
                            )}
                          </div>
                        ))}
                        {(!ride.driverOffers || ride.driverOffers.length === 0) && ride.status === 'pending' && t('user.waiting')}
                      </td>
                      <td>
                        {ride.status === 'accepted' && (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <button className="btn btn-sm btn-success" onClick={() => completeRide(ride._id)}>{t('user.complete_ride')}</button>
                            <button className="btn btn-sm btn-danger" onClick={() => cancelRide(ride._id)}>{t('user.cancel')}</button>
                            <Link to={`/ride/${ride._id}`} className="btn btn-sm">Voir</Link>
                          </div>
                        )}
                        {(ride.status === 'pending' || ride.status === 'offered') && (
                          <button className="btn btn-sm btn-danger" onClick={() => cancelRide(ride._id)}>{t('user.cancel')}</button>
                        )}
                        {ride.status === 'completed' && (
                          <Link to={`/ride/${ride._id}`} className="btn btn-sm">Voir</Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'rate' && (
        <div className="card">
          <h2>{t('user.rate_driver')}</h2>
          {drivers.length === 0 ? (
            <p>{t('user.no_drivers')}</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>{t('user.driver')}</th><th>{t('user.mobile')}</th><th>{t('user.avg_rating')}</th><th>{t('user.action')}</th></tr></thead>
                <tbody>
                  {drivers.map(d => (
                    <tr key={d._id}>
                      <td><Link to={`/profile/driver/${d._id}`}>{d.username}</Link></td>
                      <td>{d.mobileNumber}</td>
                      <td>{d.averageRating || 'N/A'}</td>
                      <td>
                        {ratingDriver === d._id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <div className="stars">
                              {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} className={`star ${s <= ratingValue ? 'filled' : ''}`}
                                  onClick={() => setRatingValue(s)}>&#9733;</span>
                              ))}
                            </div>
                            <button className="btn btn-sm btn-orange" onClick={submitRating}>{t('user.validate')}</button>
                            <button className="btn btn-sm btn-danger" onClick={() => { setRatingDriver(null); setRatingValue(0); }}>{t('user.cancel')}</button>
                          </div>
                        ) : (
                          <button className="btn btn-sm" onClick={() => { setRatingDriver(d._id); setRatingValue(0); }}>{t('user.rate')}</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'ratings' && (
        <div className="card">
          <h2>{t('user.driver_ratings')}</h2>
          {drivers.length === 0 ? (
            <p>{t('user.no_drivers')}</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>{t('user.driver')}</th><th>{t('user.mobile')}</th><th>{t('user.nb_ratings')}</th><th>{t('user.average')}</th></tr></thead>
                <tbody>
                  {drivers.map(d => (
                    <tr key={d._id}>
                      <td><Link to={`/profile/driver/${d._id}`}>{d.username}</Link></td>
                      <td>{d.mobileNumber}</td>
                      <td>{d.ratings?.length || 0}</td>
                      <td>
                        {d.averageRating ? (
                          <><strong>{d.averageRating}</strong> <span style={{ color: 'var(--orange)' }}>&#9733;</span></>
                        ) : t('user.not_rated')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
