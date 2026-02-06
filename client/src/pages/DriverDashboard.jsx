import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function DriverDashboard() {
  const [tab, setTab] = useState('rides');
  const [profile, setProfile] = useState(null);
  const [rides, setRides] = useState([]);
  const [allRides, setAllRides] = useState([]);
  const [newArea, setNewArea] = useState('');
  const [offerPrice, setOfferPrice] = useState({});
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/drivers/me');
      setProfile(data);
    } catch (err) { /* ignore */ }
  }, []);

  const fetchAvailableRides = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/rides/available');
      setRides(data);
    } catch (err) { /* ignore */ }
  }, []);

  const fetchAllRides = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/rides/all-pending');
      setAllRides(data);
    } catch (err) { /* ignore */ }
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
      setMsg({ type: 'success', text: `Area "${newArea.trim()}" added!` });
      fetchAvailableRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const removeArea = async (area) => {
    try {
      const { data } = await axios.delete(`/api/drivers/favorite-area/${encodeURIComponent(area)}`);
      setProfile({ ...profile, favoriteAreas: data.favoriteAreas });
      fetchAvailableRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const suggestPrice = async (rideId) => {
    const price = offerPrice[rideId];
    if (!price || price <= 0) return;
    try {
      await axios.post(`/api/rides/${rideId}/offer`, { price: parseInt(price) });
      setMsg({ type: 'success', text: 'Price offer sent!' });
      setOfferPrice({ ...offerPrice, [rideId]: '' });
      fetchAvailableRides();
      fetchAllRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${tab === 'rides' ? 'active' : ''}`} onClick={() => { setTab('rides'); fetchAvailableRides(); }}>My Area Rides</button>
        <button className={`tab ${tab === 'allrides' ? 'active' : ''}`} onClick={() => { setTab('allrides'); fetchAllRides(); }}>All Pending</button>
        <button className={`tab ${tab === 'areas' ? 'active' : ''}`} onClick={() => setTab('areas')}>Favorite Areas</button>
        <button className={`tab ${tab === 'ratings' ? 'active' : ''}`} onClick={() => { setTab('ratings'); fetchProfile(); }}>My Ratings</button>
      </div>

      {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}

      {tab === 'rides' && (
        <div className="card">
          <h2>Rides in Your Areas</h2>
          {profile?.favoriteAreas?.length === 0 && (
            <div className="msg-info">Add favorite areas first to see matching rides.</div>
          )}
          {rides.length === 0 ? (
            <p>No matching rides.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Source</th><th>Destination</th><th>User</th><th>Passengers</th><th>Offer Price</th></tr></thead>
                <tbody>
                  {rides.map((r, i) => (
                    <tr key={r._id}>
                      <td>{i + 1}</td>
                      <td>{r.source}</td>
                      <td>{r.destination}</td>
                      <td>{r.user?.username}</td>
                      <td>{r.passengerCount}</td>
                      <td>
                        <div className="inline-form">
                          <input type="number" min="1" placeholder="$" style={{ width: 80 }}
                            value={offerPrice[r._id] || ''} onChange={e => setOfferPrice({ ...offerPrice, [r._id]: e.target.value })} />
                          <button className="btn btn-sm btn-orange" onClick={() => suggestPrice(r._id)}>Offer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'allrides' && (
        <div className="card">
          <h2>All Pending Rides</h2>
          {allRides.length === 0 ? (
            <p>No pending rides.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Source</th><th>Destination</th><th>User</th><th>Offer Price</th></tr></thead>
                <tbody>
                  {allRides.map((r, i) => (
                    <tr key={r._id}>
                      <td>{i + 1}</td>
                      <td>{r.source}</td>
                      <td>{r.destination}</td>
                      <td>{r.user?.username}</td>
                      <td>
                        <div className="inline-form">
                          <input type="number" min="1" placeholder="$" style={{ width: 80 }}
                            value={offerPrice[r._id] || ''} onChange={e => setOfferPrice({ ...offerPrice, [r._id]: e.target.value })} />
                          <button className="btn btn-sm btn-orange" onClick={() => suggestPrice(r._id)}>Offer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'areas' && (
        <div className="card">
          <h2>Favorite Areas</h2>
          <form onSubmit={addArea} className="inline-form" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <input value={newArea} onChange={e => setNewArea(e.target.value)} placeholder="e.g. Downtown" required />
            </div>
            <button className="btn btn-success" type="submit">Add Area</button>
          </form>
          {profile?.favoriteAreas?.length === 0 ? (
            <p>No favorite areas yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {profile?.favoriteAreas?.map((area, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 600 }}>{area}</span>
                  <button className="btn btn-sm btn-danger" onClick={() => removeArea(area)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'ratings' && (
        <div className="card">
          <h2>My Ratings</h2>
          {!profile?.ratings?.length ? (
            <p>No ratings yet.</p>
          ) : (
            <>
              <div style={{ fontSize: 20, marginBottom: 16, padding: '12px 16px', background: 'var(--orange-light)', borderRadius: 'var(--radius)' }}>
                Average: <strong>{profile.averageRating}</strong> <span style={{ color: 'var(--orange)' }}>&#9733;</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14, marginLeft: 8 }}>({profile.ratings.length} ratings)</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>#</th><th>Rating</th></tr></thead>
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
