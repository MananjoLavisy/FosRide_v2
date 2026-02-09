import React from 'react';
import { useTranslation } from 'react-i18next';
import { PAYMENT_METHODS } from '../../constants/transportTypes';

export default function PaymentSelector({ selected, onSelect }) {
  const { t } = useTranslation();

  return (
    <div className="form-group">
      <label>{t('payment.method')}</label>
      <div className="payment-grid">
        {PAYMENT_METHODS.map(pm => (
          <button
            key={pm.id}
            type="button"
            className={`payment-card ${selected === pm.id ? 'selected' : ''}`}
            onClick={() => onSelect(pm.id)}
          >
            <span className="payment-icon">{pm.icon}</span>
            <span className="payment-label">{pm.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
