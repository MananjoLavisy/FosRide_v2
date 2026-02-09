import React from 'react';
import { useTranslation } from 'react-i18next';
import { TRANSPORT_TYPES } from '../../constants/transportTypes';

export default function SearchFilters({ filters, onChange }) {
  const { t } = useTranslation();

  const update = (field, value) => onChange({ ...filters, [field]: value });

  return (
    <div className="search-filters">
      <div className="form-group">
        <label>{t('search.filter_type')}</label>
        <select value={filters.transportType || 'all'} onChange={e => update('transportType', e.target.value)}>
          <option value="all">{t('search.all')}</option>
          {TRANSPORT_TYPES.map(tp => (
            <option key={tp.id} value={tp.id}>{tp.icon} {tp.label}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>{t('user.departure')}</label>
        <input value={filters.source || ''} onChange={e => update('source', e.target.value)} placeholder={t('user.departure_placeholder')} />
      </div>
      <div className="form-group">
        <label>{t('user.destination')}</label>
        <input value={filters.destination || ''} onChange={e => update('destination', e.target.value)} placeholder={t('user.destination_placeholder')} />
      </div>
      <div className="form-group">
        <label>{t('search.filter_date')}</label>
        <input type="date" value={filters.date || ''} onChange={e => update('date', e.target.value)} />
      </div>
      <div className="form-group">
        <label>{t('search.filter_status')}</label>
        <select value={filters.status || 'all'} onChange={e => update('status', e.target.value)}>
          <option value="all">{t('search.all')}</option>
          <option value="pending">Pending</option>
          <option value="offered">Offered</option>
          <option value="accepted">Accepted</option>
        </select>
      </div>
    </div>
  );
}
