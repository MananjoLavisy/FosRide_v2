import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="notif-bell" onClick={() => setOpen(!open)}>
      <span>&#128276;</span>
      {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
