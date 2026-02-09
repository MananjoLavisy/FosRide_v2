import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TRANSPORT_TYPES, MAX_PASSENGERS, PAYMENT_METHODS } from '../constants/transportTypes';
import BookingConfirmation from '../components/Booking/BookingConfirmation';

export default function BookingPage() {
  const { t } = useTranslation();
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [step, setStep] = useState('form'); // form | confirm | done
  const [form, setForm] = useState({
    source: '', destination: '', passengerCount: 1, transportType: 'voiture',
    sourceCoords: null, destCoords: null, scheduledAt: '', paymentMethod: 'cash',
  });
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const { data } = await axios.get(`/api/drivers/${driverId}`);
        setDriver(data);
        if (data.transportTypes?.length > 0) {
          setForm(f => ({ ...f, transportType: data.transportTypes[0] }));
        }
      } catch { /* ignore */ }
    };
    fetchDriver();
  }, [driverId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('confirm');
  };

  const confirmBooking = async () => {
    try {
      await axios.post('/api/rides', {
        source: form.source,
        destination: form.destination,
        passengerCount: form.passengerCount,
        transportType: form.transportType,
        sourceCoords: form.sourceCoords,
        destCoords: form.destCoords,
        scheduledAt: form.scheduledAt || undefined,
        paymentMethod: form.paymentMethod,
      });
      setStep('done');
      setMsg({ type: 'success', text: t('booking.confirmed') });
      setTimeout(() => navigate('/user'), 2000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
      setStep('form');
    }
  };

  if (!driver) return <div className="loading">{t('common.loading')}</div>;

  const selectedMax = MAX_PASSENGERS[form.transportType] || 4;

  if (step === 'confirm') {
    return <BookingConfirmation booking={form} onConfirm={confirmBooking} onCancel={() => setStep('form')} />;
  }

  if (step === 'done') {
    return (
      <div className="card">
        <h2>{t('booking.confirmed')}</h2>
        <div className="msg-success">{msg.text}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>{t('booking.title')} - {driver.username}</h2>
        {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}

        <div className="profile-card" style={{ marginBottom: 20 }}>
          <div className="profile-card-photo">
            {driver.profilePhoto ? (
              <img src={`/api/uploads/${driver.profilePhoto}`} alt="" />
            ) : (
              <span className="profile-card-initials">{driver.username?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="profile-card-info">
            <h3>{driver.username}</h3>
            <div className="profile-card-meta">
              {driver.averageRating > 0 && (
                <span>{driver.averageRating} <span style={{ color: 'var(--orange)' }}>&#9733;</span></span>
              )}
              <span>{driver.transportTypes?.join(', ')}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('user.transport_type')}</label>
            <div className="transport-grid">
              {TRANSPORT_TYPES.filter(tp => !driver.transportTypes?.length || driver.transportTypes.includes(tp.id)).map(tp => (
                <button
                  key={tp.id}
                  type="button"
                  className={`transport-card ${form.transportType === tp.id ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, transportType: tp.id, passengerCount: Math.min(f.passengerCount, MAX_PASSENGERS[tp.id]) }))}
                >
                  <span className="transport-icon">{tp.icon}</span>
                  <span className="transport-label">{tp.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('user.departure')}</label>
              <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} required placeholder={t('user.departure_placeholder')} />
            </div>
            <div className="form-group">
              <label>{t('user.destination')}</label>
              <input value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required placeholder={t('user.destination_placeholder')} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('user.passengers')} ({t('user.passengers_max', { max: selectedMax })})</label>
              <input type="number" min="1" max={selectedMax} value={form.passengerCount}
                onChange={e => setForm({ ...form, passengerCount: Math.min(parseInt(e.target.value) || 1, selectedMax) })} />
            </div>
            <div className="form-group">
              <label>{t('user.scheduled_at')}</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>{t('payment.method')}</label>
            <div className="payment-grid">
              {PAYMENT_METHODS.map(pm => (
                <button key={pm.id} type="button"
                  className={`payment-card ${form.paymentMethod === pm.id ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, paymentMethod: pm.id })}>
                  <span className="payment-icon">{pm.icon}</span>
                  <span className="payment-label">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-orange" type="submit" style={{ width: '100%' }}>
            {t('booking.confirm')}
          </button>
        </form>
      </div>
    </div>
  );
}
