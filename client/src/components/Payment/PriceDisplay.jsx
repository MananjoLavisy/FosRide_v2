import React from 'react';
import { useTranslation } from 'react-i18next';
import { PAYMENT_METHODS } from '../../constants/transportTypes';

export default function PriceDisplay({ price, discount, paymentMethod }) {
  const { t } = useTranslation();
  const pm = PAYMENT_METHODS.find(m => m.id === paymentMethod);
  const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : price;

  return (
    <div className="booking-summary">
      {discount > 0 && (
        <div className="booking-summary-row">
          <span>{t('payment.original_price')}</span>
          <span style={{ textDecoration: 'line-through' }}>{originalPrice} Ar</span>
        </div>
      )}
      {discount > 0 && (
        <div className="booking-summary-row">
          <span>{t('payment.discount')}</span>
          <span className="discount-tag">-{discount}%</span>
        </div>
      )}
      <div className="booking-summary-row">
        <span>{t('payment.final_price')}</span>
        <span>{price} Ar</span>
      </div>
      {pm && (
        <div className="booking-summary-row">
          <span>{t('payment.method')}</span>
          <span>{pm.icon} {pm.label}</span>
        </div>
      )}
    </div>
  );
}
