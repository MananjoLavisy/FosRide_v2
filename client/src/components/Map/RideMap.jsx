import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

export default function RideMap({ sourceCoords, destCoords, source, destination, className = 'map-container' }) {
  const [route, setRoute] = useState([]);

  const hasSource = sourceCoords?.lat && sourceCoords?.lng;
  const hasDest = destCoords?.lat && destCoords?.lng;

  const center = hasSource
    ? [sourceCoords.lat, sourceCoords.lng]
    : hasDest
      ? [destCoords.lat, destCoords.lng]
      : [-18.9137, 47.5361]; // Antananarivo default

  const zoom = hasSource && hasDest ? 12 : 13;

  useEffect(() => {
    if (!hasSource || !hasDest) return;
    // Fetch route from OSRM
    const fetchRoute = async () => {
      try {
        const resp = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${sourceCoords.lng},${sourceCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson`
        );
        const data = await resp.json();
        if (data.routes?.[0]?.geometry?.coordinates) {
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRoute(coords);
        }
      } catch {
        // Fallback: straight line
        setRoute([[sourceCoords.lat, sourceCoords.lng], [destCoords.lat, destCoords.lng]]);
      }
    };
    fetchRoute();
  }, [hasSource, hasDest, sourceCoords, destCoords]);

  if (!hasSource && !hasDest) return null;

  return (
    <MapContainer center={center} zoom={zoom} className={className} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hasSource && (
        <Marker position={[sourceCoords.lat, sourceCoords.lng]}>
          <Popup className="map-marker-popup">{source || 'Départ'}</Popup>
        </Marker>
      )}
      {hasDest && (
        <Marker position={[destCoords.lat, destCoords.lng]}>
          <Popup className="map-marker-popup">{destination || 'Destination'}</Popup>
        </Marker>
      )}
      {route.length > 0 && (
        <Polyline positions={route} color="var(--blue)" weight={4} opacity={0.7} />
      )}
    </MapContainer>
  );
}
