import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './Notifications/NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/logo.png" alt="FosaRide" onError={e => { e.target.style.display = 'none'; }} />
        <h1>Fosa<span>Ride</span></h1>
      </Link>
      <div className="navbar-right">
        <LanguageSwitcher />
        {user ? (
          <>
            <NotificationBell />
            <Link to="/profile">{t('nav.profile')}</Link>
            <Link to="/messages">{t('nav.messages')}</Link>
            {user.role === 'user' && <Link to="/search">{t('nav.search')}</Link>}
            <span className="user-info">{user.username}</span>
            <button className="btn-logout" onClick={logout}>{t('nav.logout')}</button>
          </>
        ) : (
          <>
            <Link to="/faq">{t('nav.faq')}</Link>
            <Link to="/login">{t('nav.login')}</Link>
            <Link to="/register">{t('nav.register')}</Link>
          </>
        )}
      </div>
    </nav>
  );
}
