import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

// Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue with bundlers
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
