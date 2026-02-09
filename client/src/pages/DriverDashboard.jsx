import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TRANSPORT_TYPES } from '../constants/transportTypes';
import VehicleCard from '../components/Profile/VehicleCard';
import PhotoUpload from '../components/Profile/PhotoUpload';

export default function DriverDashboard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('rides');
  const [profile, setProfile] = useState(null);
  const [rides, setRides] = useState([]);
  const [allRides, setAllRides] = useState([]);
  const [newArea, setNewArea] = useState('');
  const [offerPrice, setOfferPrice] = useState({});
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Vehicle form
  const [vehicleForm, setVehicleForm] = useState({
    transportType: 'voiture', name: '', description: '', capacity: 4, pricePerKm: '', priceRange: '', photos: [],
  });
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/drivers/me');
      setProfile(data);
    } catch { /* ignore */ }
  }, []);

  const fetchAvailableRides = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/rides/available');
      setRides(data);
    } catch { /* ignore */ }
  }, []);

  const fetchAllRides = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/rides/all-pending');
      setAllRides(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchAvailableRides();
    fetchAllRides();
  }, [fetchProfile, fetchAvailableRides, fetchAllRides]);

  const addArea = async (e) => {
    e.preventDefault();
    if (!newArea.trim()) return;
    try {
      const { data } = await axios.post('/api/drivers/favorite-area', { area: newArea.trim() });
      setProfile({ ...profile, favoriteAreas: data.favoriteAreas });
      setNewArea('');
      setMsg({ type: 'success', text: t('driver_dash.area_added', { area: newArea.trim() }) });
      fetchAvailableRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const removeArea = async (area) => {
    try {
      const { data } = await axios.delete(`/api/drivers/favorite-area/${encodeURIComponent(area)}`);
      setProfile({ ...profile, favoriteAreas: data.favoriteAreas });
      fetchAvailableRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const toggleTransportType = async (typeId) => {
    const current = profile?.transportTypes || [];
    const updated = current.includes(typeId) ? current.filter(tp => tp !== typeId) : [...current, typeId];
    try {
      const { data } = await axios.put('/api/drivers/transport-types', { transportTypes: updated });
      setProfile({ ...profile, transportTypes: data.transportTypes });
      setMsg({ type: 'success', text: t('driver_dash.transport_updated') });
      fetchAvailableRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const suggestPrice = async (rideId) => {
    const price = offerPrice[rideId];
    if (!price || price <= 0) return;
    try {
      await axios.post(`/api/rides/${rideId}/offer`, { price: parseInt(price) });
      setMsg({ type: 'success', text: t('driver_dash.offer_sent') });
      setOfferPrice({ ...offerPrice, [rideId]: '' });
      fetchAvailableRides();
      fetchAllRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  // Vehicle CRUD
  const saveVehicle = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        const { data } = await axios.put(`/api/drivers/vehicles/${editingVehicle}`, vehicleForm);
        setProfile({ ...profile, vehicles: data });
      } else {
        const { data } = await axios.post('/api/drivers/vehicles', vehicleForm);
        setProfile({ ...profile, vehicles: data });
      }
      setVehicleForm({ transportType: 'voiture', name: '', description: '', capacity: 4, pricePerKm: '', priceRange: '', photos: [] });
      setEditingVehicle(null);
      setMsg({ type: 'success', text: t('common.success') });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const deleteVehicle = async (vehicleId) => {
    try {
      const { data } = await axios.delete(`/api/drivers/vehicles/${vehicleId}`);
      setProfile({ ...profile, vehicles: data });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const editVehicle = (v) => {
    setEditingVehicle(v._id);
    setVehicleForm({
      transportType: v.transportType, name: v.name, description: v.description,
      capacity: v.capacity, pricePerKm: v.pricePerKm || '', priceRange: v.priceRange || '', photos: v.photos || [],
    });
  };

  const getTransportIcon = (type) => {
    const tp = TRANSPORT_TYPES.find(tr => tr.id === type);
    return tp ? `${tp.icon} ${tp.label}` : type || '-';
  };

  const renderRideTable = (rideList, showOffer = true) => (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th><th>{t('user.transport')}</th><th>{t('user.departure')}</th><th>{t('user.destination')}</th>
            <th>{t('driver_dash.user_col')}</th><th>{t('driver_dash.passengers_col')}</th>
            {showOffer && <th>{t('driver_dash.price_offer')}</th>}
          </tr>
        </thead>
        <tbody>
          {rideList.map((r, i) => (
            <tr key={r._id}>
              <td>{i + 1}</td>
              <td><span className="transport-badge">{getTransportIcon(r.transportType)}</span></td>
              <td>
                {r.source}
                {r.sourceCoords?.lat && (
                  <div className="coords-tag-sm">
                    {r.sourceCoords.lat.toFixed(3)}, {r.sourceCoords.lng.toFixed(3)}
                  </div>
                )}
              </td>
              <td>
                {r.destination}
                {r.destCoords?.lat && (
                  <div className="coords-tag-sm">
                    {r.destCoords.lat.toFixed(3)}, {r.destCoords.lng.toFixed(3)}
                  </div>
                )}
              </td>
              <td>{r.user?.username}</td>
              <td>{r.passengerCount}</td>
              {showOffer && (
                <td>
                  <div className="inline-form">
                    <input type="number" min="1" placeholder="Ar" style={{ width: 90 }}
                      value={offerPrice[r._id] || ''} onChange={e => setOfferPrice({ ...offerPrice, [r._id]: e.target.value })} />
                    <button className="btn btn-sm btn-orange" onClick={() => suggestPrice(r._id)}>{t('driver_dash.offer_btn')}</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${tab === 'rides' ? 'active' : ''}`} onClick={() => { setTab('rides'); fetchAvailableRides(); }}>{t('driver_dash.zone_rides')}</button>
        <button className={`tab ${tab === 'allrides' ? 'active' : ''}`} onClick={() => { setTab('allrides'); fetchAllRides(); }}>{t('driver_dash.all_pending')}</button>
        <button className={`tab ${tab === 'transport' ? 'active' : ''}`} onClick={() => setTab('transport')}>{t('driver_dash.my_transports')}</button>
        <button className={`tab ${tab === 'vehicles' ? 'active' : ''}`} onClick={() => setTab('vehicles')}>{t('driver_dash.my_vehicles')}</button>
        <button className={`tab ${tab === 'areas' ? 'active' : ''}`} onClick={() => setTab('areas')}>{t('driver_dash.fav_areas')}</button>
        <button className={`tab ${tab === 'ratings' ? 'active' : ''}`} onClick={() => { setTab('ratings'); fetchProfile(); }}>{t('driver_dash.my_ratings')}</button>
      </div>

      {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}

      {tab === 'rides' && (
        <div className="card">
          <h2>{t('driver_dash.rides_in_zone')}</h2>
          {profile?.favoriteAreas?.length === 0 && profile?.transportTypes?.length === 0 && (
            <div className="msg-info">{t('driver_dash.add_zones_hint')}</div>
          )}
          {rides.length === 0 ? <p>{t('driver_dash.no_matching')}</p> : renderRideTable(rides)}
        </div>
      )}

      {tab === 'allrides' && (
        <div className="card">
          <h2>{t('driver_dash.all_pending_rides')}</h2>
          {allRides.length === 0 ? <p>{t('driver_dash.no_pending')}</p> : renderRideTable(allRides)}
        </div>
      )}

      {tab === 'transport' && (
        <div className="card">
          <h2>{t('driver_dash.my_transport_types')}</h2>
          <p style={{ marginBottom: 16, color: 'var(--text-muted)', fontSize: 14 }}>{t('driver_dash.transport_hint')}</p>
          <div className="transport-grid">
            {TRANSPORT_TYPES.map(tp => (
              <button
                key={tp.id}
                type="button"
                className={`transport-card ${(profile?.transportTypes || []).includes(tp.id) ? 'selected' : ''}`}
                onClick={() => toggleTransportType(tp.id)}
              >
                <span className="transport-icon">{tp.icon}</span>
                <span className="transport-label">{tp.label}</span>
                {(profile?.transportTypes || []).includes(tp.id) && <span className="transport-check">&#10003;</span>}
              </button>
            ))}
          </div>
          {(profile?.transportTypes || []).length > 0 && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--green-light)', borderRadius: 'var(--radius)', fontSize: 14 }}>
              <strong>{t('driver_dash.active')} :</strong>{' '}
              {(profile?.transportTypes || []).map(tp => getTransportIcon(tp)).join(' · ')}
            </div>
          )}
        </div>
      )}

      {tab === 'vehicles' && (
        <div className="card">
          <h2>{t('driver_dash.my_vehicles')}</h2>

          <form onSubmit={saveVehicle} style={{ marginBottom: 20 }}>
            <h3>{editingVehicle ? t('driver_dash.save') : t('driver_dash.add_vehicle')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{t('user.transport_type')}</label>
                <select value={vehicleForm.transportType} onChange={e => setVehicleForm({ ...vehicleForm, transportType: e.target.value })}>
                  {TRANSPORT_TYPES.map(tp => <option key={tp.id} value={tp.id}>{tp.icon} {tp.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t('driver_dash.vehicle_name')}</label>
                <input value={vehicleForm.name} onChange={e => setVehicleForm({ ...vehicleForm, name: e.target.value })} placeholder={t('driver_dash.vehicle_name')} />
              </div>
            </div>
            <div className="form-group">
              <label>{t('driver_dash.vehicle_desc')}</label>
              <input value={vehicleForm.description} onChange={e => setVehicleForm({ ...vehicleForm, description: e.target.value })} placeholder={t('driver_dash.vehicle_desc')} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('driver_dash.capacity')}</label>
                <input type="number" min="1" value={vehicleForm.capacity} onChange={e => setVehicleForm({ ...vehicleForm, capacity: parseInt(e.target.value) || 1 })} />
              </div>
              <div className="form-group">
                <label>{t('driver_dash.price_per_km')}</label>
                <input type="number" value={vehicleForm.pricePerKm} onChange={e => setVehicleForm({ ...vehicleForm, pricePerKm: e.target.value })} placeholder="Ar" />
              </div>
            </div>
            <div className="form-group">
              <label>{t('driver_dash.price_range')}</label>
              <input value={vehicleForm.priceRange} onChange={e => setVehicleForm({ ...vehicleForm, priceRange: e.target.value })} placeholder="Ex: 5000 - 15000 Ar" />
            </div>
            <PhotoUpload
              currentPhoto={vehicleForm.photos?.[0]}
              onUploaded={(filename) => setVehicleForm({ ...vehicleForm, photos: [filename] })}
              type="vehicle-photo"
            />
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button className="btn btn-orange" type="submit">{t('driver_dash.save')}</button>
              {editingVehicle && (
                <button className="btn" type="button" onClick={() => {
                  setEditingVehicle(null);
                  setVehicleForm({ transportType: 'voiture', name: '', description: '', capacity: 4, pricePerKm: '', priceRange: '', photos: [] });
                }}>{t('user.cancel')}</button>
              )}
            </div>
          </form>

          {(profile?.vehicles || []).length === 0 ? (
            <p>{t('driver_dash.no_vehicles')}</p>
          ) : (
            profile.vehicles.map(v => (
              <VehicleCard key={v._id} vehicle={v} onEdit={editVehicle} onDelete={deleteVehicle} />
            ))
          )}
        </div>
      )}

      {tab === 'areas' && (
        <div className="card">
          <h2>{t('driver_dash.favorite_zones')}</h2>
          <form onSubmit={addArea} className="inline-form" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <input value={newArea} onChange={e => setNewArea(e.target.value)} placeholder={t('driver_dash.area_placeholder')} required />
            </div>
            <button className="btn btn-success" type="submit">{t('driver_dash.add')}</button>
          </form>
          {profile?.favoriteAreas?.length === 0 ? (
            <p>{t('driver_dash.no_fav_areas')}</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {profile?.favoriteAreas?.map((area, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 600 }}>{area}</span>
                  <button className="btn btn-sm btn-danger" onClick={() => removeArea(area)}>{t('driver_dash.remove')}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'ratings' && (
        <div className="card">
          <h2>{t('driver_dash.my_ratings')}</h2>
          {!profile?.ratings?.length ? (
            <p>{t('driver_dash.no_ratings')}</p>
          ) : (
            <>
              <div style={{ fontSize: 20, marginBottom: 16, padding: '12px 16px', background: 'var(--orange-light)', borderRadius: 'var(--radius)' }}>
                {t('driver_dash.average_label')} : <strong>{profile.averageRating}</strong> <span style={{ color: 'var(--orange)' }}>&#9733;</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14, marginLeft: 8 }}>({t('driver_dash.ratings_count', { count: profile.ratings.length })})</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>#</th><th>{t('driver_dash.rating')}</th></tr></thead>
                  <tbody>
                    {profile.ratings.map((r, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{r} <span style={{ color: 'var(--orange)' }}>&#9733;</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
