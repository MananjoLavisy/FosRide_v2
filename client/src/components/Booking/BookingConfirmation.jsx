import React from 'react';
import { useTranslation } from 'react-i18next';
import { TRANSPORT_TYPES, PAYMENT_METHODS } from '../../constants/transportTypes';

export default function BookingConfirmation({ booking, onConfirm, onCancel }) {
  const { t } = useTranslation();
  const tp = TRANSPORT_TYPES.find(x => x.id === booking.transportType);
  const pm = PAYMENT_METHODS.find(x => x.id === booking.paymentMethod);

  return (
    <div className="card">
      <h2>{t('booking.summary')}</h2>
      <div className="booking-summary">
        <div className="booking-summary-row">
          <span>{t('user.transport')}</span>
          <span>{tp?.icon} {tp?.label}</span>
        </div>
        <div className="booking-summary-row">
          <span>{t('booking.from')}</span>
          <span>{booking.source}</span>
        </div>
        <div className="booking-summary-row">
          <span>{t('booking.to')}</span>
          <span>{booking.destination}</span>
        </div>
        <div className="booking-summary-row">
          <span>{t('user.passengers')}</span>
          <span>{booking.passengerCount}</span>
        </div>
        {booking.scheduledAt && (
          <div className="booking-summary-row">
            <span>{t('booking.date')}</span>
            <span>{new Date(booking.scheduledAt).toLocaleString()}</span>
          </div>
        )}
        <div className="booking-summary-row">
          <span>{t('payment.method')}</span>
          <span>{pm?.icon} {pm?.label}</span>
        </div>
        {booking.price && (
          <div className="booking-summary-row">
            <span>{t('booking.price_estimate')}</span>
            <span>{booking.price} Ar</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-orange" onClick={onConfirm}>{t('booking.confirm')}</button>
        <button className="btn btn-danger" onClick={onCancel}>{t('user.cancel')}</button>
      </div>
    </div>
  );
}
