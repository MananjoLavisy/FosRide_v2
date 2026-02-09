import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function LiveTracker({ driverPosition, sourceCoords, destCoords, className = 'map-container' }) {
  const [position, setPosition] = useState(driverPosition);

  useEffect(() => {
    if (driverPosition) {
      setPosition(driverPosition);
    }
  }, [driverPosition]);

  const center = position
    ? [position.lat, position.lng]
    : sourceCoords?.lat
      ? [sourceCoords.lat, sourceCoords.lng]
      : [-18.9137, 47.5361];

  return (
    <MapContainer center={center} zoom={14} className={className} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && (
        <Marker position={[position.lat, position.lng]}>
          <Popup>Chauffeur</Popup>
        </Marker>
      )}
      {sourceCoords?.lat && (
        <Marker position={[sourceCoords.lat, sourceCoords.lng]}>
          <Popup>Départ</Popup>
        </Marker>
      )}
      {destCoords?.lat && (
        <Marker position={[destCoords.lat, destCoords.lng]}>
          <Popup>Destination</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
