import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo.png" alt="FosaRide" className="footer-logo" onError={e => { e.target.style.display = 'none'; }} />
          <span className="footer-name">Fosa<span>Ride</span></span>
        </div>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} FosaRide. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
