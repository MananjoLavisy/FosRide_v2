import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationDropdown({ onClose }) {
  const { t } = useTranslation();
  const { notifications, markAsRead, markAllRead } = useNotifications();

  return (
    <div className="notif-dropdown" onClick={e => e.stopPropagation()}>
      <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <strong>{t('notifications.title')}</strong>
        <button className="btn btn-sm" onClick={markAllRead} style={{ padding: '4px 8px', fontSize: 11 }}>{t('notifications.mark_read')}</button>
      </div>
      {notifications.length === 0 ? (
        <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 14 }}>{t('notifications.no_notifications')}</div>
      ) : (
        notifications.slice(0, 20).map(n => (
          <div
            key={n._id}
            className={`notif-item ${!n.read ? 'unread' : ''}`}
            onClick={() => markAsRead(n._id)}
          >
            <div className="notif-item-title">{n.title}</div>
            <div className="notif-item-body">{n.body}</div>
            <div className="notif-item-time">{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  );
}
