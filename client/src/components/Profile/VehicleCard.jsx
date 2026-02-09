import React from 'react';
import { TRANSPORT_TYPES } from '../../constants/transportTypes';

export default function VehicleCard({ vehicle, onEdit, onDelete, readOnly }) {
  const type = TRANSPORT_TYPES.find(t => t.id === vehicle.transportType);

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-header">
        <span className="vehicle-card-icon">{type?.icon || ''}</span>
        <div>
          <h4>{vehicle.name || type?.label || vehicle.transportType}</h4>
          {vehicle.description && <p className="vehicle-card-desc">{vehicle.description}</p>}
        </div>
      </div>
      <div className="vehicle-card-details">
        {vehicle.capacity && <span>Capacité: {vehicle.capacity}</span>}
        {vehicle.pricePerKm && <span>{vehicle.pricePerKm} Ar/km</span>}
        {vehicle.priceRange && <span>{vehicle.priceRange}</span>}
        {vehicle.available !== undefined && (
          <span className={`badge ${vehicle.available ? 'badge-active' : 'badge-suspended'}`}>
            {vehicle.available ? 'Disponible' : 'Indisponible'}
          </span>
        )}
      </div>
      {vehicle.photos?.length > 0 && (
        <div className="vehicle-card-photos">
          {vehicle.photos.map((p, i) => (
            <img key={i} src={`/api/uploads/${p}`} alt="vehicle" />
          ))}
        </div>
      )}
      {!readOnly && (
        <div className="vehicle-card-actions">
          {onEdit && <button className="btn btn-sm" onClick={() => onEdit(vehicle)}>Modifier</button>}
          {onDelete && <button className="btn btn-sm btn-danger" onClick={() => onDelete(vehicle._id)}>Supprimer</button>}
        </div>
      )}
    </div>
  );
}
