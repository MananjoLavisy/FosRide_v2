import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo.png" alt="FosaRide" className="footer-logo" onError={e => { e.target.style.display = 'none'; }} />
          <span className="footer-name">Fosa<span>Ride</span></span>
        </div>
        <div className="footer-links">
          <Link to="/faq">{t('nav.faq')}</Link>
          <Link to="/support">{t('nav.support')}</Link>
          <a href="#about">{t('footer.about')}</a>
          <a href="#contact">{t('footer.contact')}</a>
          <a href="#privacy">{t('footer.privacy')}</a>
          <a href="#terms">{t('footer.terms')}</a>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} FosaRide. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
