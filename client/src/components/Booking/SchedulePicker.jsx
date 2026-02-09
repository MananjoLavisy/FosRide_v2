import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SchedulePicker({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="form-group">
      <label>{t('user.scheduled_at')}</label>
      <input
        type="datetime-local"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
