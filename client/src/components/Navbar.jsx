import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        {/* Place your logo at: client/public/logo.png */}
        <img src="/logo.png" alt="FosaRide" onError={e => { e.target.style.display = 'none'; }} />
        <h1>Fosa<span>Ride</span></h1>
      </Link>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-info">{user.username} ({user.role})</span>
            <button className="btn-logout" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
