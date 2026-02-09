import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      let placeName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`
        );
        const geo = await resp.json();
        if (geo.display_name) {
          const parts = geo.display_name.split(',').map(s => s.trim());
          placeName = parts.slice(0, 3).join(', ');
        }
      } catch { /* use coords */ }
      onLocationSelect({ lat, lng }, placeName);
    },
  });
  return null;
}

export default function LocationPicker({ value, onSelect, className = 'map-container-sm' }) {
  const [marker, setMarker] = useState(value ? [value.lat, value.lng] : null);

  const center = value?.lat
    ? [value.lat, value.lng]
    : [-18.9137, 47.5361];

  const handleSelect = (coords, name) => {
    setMarker([coords.lat, coords.lng]);
    onSelect(coords, name);
  };

  return (
    <MapContainer center={center} zoom={13} className={className} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onLocationSelect={handleSelect} />
      {marker && <Marker position={marker} />}
    </MapContainer>
  );
}
