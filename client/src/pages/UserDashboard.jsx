import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function UserDashboard() {
  const [tab, setTab] = useState('request');
  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [rideForm, setRideForm] = useState({ source: '', destination: '', passengerCount: 1 });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchRides = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/rides/my');
      setRides(data);
    } catch (err) { /* ignore */ }
  }, []);

  const fetchDrivers = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/drivers');
      setDrivers(data);
    } catch (err) { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchRides();
    fetchDrivers();
  }, [fetchRides, fetchDrivers]);

  const requestRide = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const { data } = await axios.post('/api/rides', rideForm);
      setMsg({ type: 'success', text: `Ride requested! ${data.discount > 0 ? `${data.discount}% discount applied!` : ''}` });
      setRideForm({ source: '', destination: '', passengerCount: 1 });
      fetchRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const acceptOffer = async (rideId, driverId, price) => {
    try {
      await axios.post(`/api/rides/${rideId}/accept`, { driverId, price });
      setMsg({ type: 'success', text: 'Offer accepted!' });
      fetchRides();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const [ratingDriver, setRatingDriver] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);

  const submitRating = async () => {
    if (!ratingDriver || ratingValue < 1) return;
    try {
      const { data } = await axios.post(`/api/drivers/${ratingDriver}/rate`, { rating: ratingValue });
      setMsg({ type: 'success', text: data.message });
      setRatingDriver(null);
      setRatingValue(0);
      fetchDrivers();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${tab === 'request' ? 'active' : ''}`} onClick={() => setTab('request')}>Request Ride</button>
        <button className={`tab ${tab === 'rides' ? 'active' : ''}`} onClick={() => { setTab('rides'); fetchRides(); }}>My Rides</button>
        <button className={`tab ${tab === 'rate' ? 'active' : ''}`} onClick={() => { setTab('rate'); fetchDrivers(); }}>Rate Driver</button>
        <button className={`tab ${tab === 'ratings' ? 'active' : ''}`} onClick={() => { setTab('ratings'); fetchDrivers(); }}>Driver Ratings</button>
      </div>

      {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}

      {tab === 'request' && (
        <div className="card">
          <h2>Request a Ride</h2>
          <form onSubmit={requestRide}>
            <div className="form-group">
              <label>Source</label>
              <input value={rideForm.source} onChange={e => setRideForm({ ...rideForm, source: e.target.value })} required placeholder="e.g. Downtown" />
            </div>
            <div className="form-group">
              <label>Destination</label>
              <input value={rideForm.destination} onChange={e => setRideForm({ ...rideForm, destination: e.target.value })} required placeholder="e.g. Airport" />
            </div>
            <div className="form-group">
              <label>Number of Passengers</label>
              <input type="number" min="1" max="6" value={rideForm.passengerCount} onChange={e => setRideForm({ ...rideForm, passengerCount: parseInt(e.target.value) || 1 })} />
            </div>
            <button className="btn btn-orange" type="submit">Request Ride</button>
          </form>
        </div>
      )}

      {tab === 'rides' && (
        <div className="card">
          <h2>My Rides</h2>
          {rides.length === 0 ? (
            <p>No rides yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Source</th><th>Destination</th><th>Status</th><th>Discount</th><th>Price</th><th>Driver</th><th>Offers</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map(ride => (
                    <tr key={ride._id}>
                      <td>{ride.source}</td>
                      <td>{ride.destination}</td>
                      <td><span className={`badge badge-${ride.status}`}>{ride.status}</span></td>
                      <td>{ride.discount > 0 ? <span className="discount-tag">{ride.discount}% off</span> : '-'}</td>
                      <td>{ride.price != null ? `$${ride.price}` : '-'}</td>
                      <td>{ride.driver?.username || '-'}</td>
                      <td>
                        {ride.status === 'offered' && ride.driverOffers?.map((offer, i) => (
                          <div key={i} style={{ marginBottom: 4 }}>
                            {offer.driver?.username}: ${offer.price}
                            {ride.status !== 'accepted' && (
                              <button className="btn btn-success btn-sm" style={{ marginLeft: 8 }}
                                onClick={() => acceptOffer(ride._id, offer.driver?._id || offer.driver, offer.price)}>
                                Accept
                              </button>
                            )}
                          </div>
                        ))}
                        {(!ride.driverOffers || ride.driverOffers.length === 0) && ride.status === 'pending' && 'Waiting...'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'rate' && (
        <div className="card">
          <h2>Rate a Driver</h2>
          {drivers.length === 0 ? (
            <p>No drivers available.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Driver</th><th>Mobile</th><th>Avg Rating</th><th>Action</th></tr></thead>
                <tbody>
                  {drivers.map(d => (
                    <tr key={d._id}>
                      <td>{d.username}</td>
                      <td>{d.mobileNumber}</td>
                      <td>{d.averageRating || 'N/A'}</td>
                      <td>
                        {ratingDriver === d._id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <div className="stars">
                              {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} className={`star ${s <= ratingValue ? 'filled' : ''}`}
                                  onClick={() => setRatingValue(s)}>&#9733;</span>
                              ))}
                            </div>
                            <button className="btn btn-sm btn-orange" onClick={submitRating}>Submit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => { setRatingDriver(null); setRatingValue(0); }}>Cancel</button>
                          </div>
                        ) : (
                          <button className="btn btn-sm" onClick={() => { setRatingDriver(d._id); setRatingValue(0); }}>Rate</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'ratings' && (
        <div className="card">
          <h2>Driver Ratings</h2>
          {drivers.length === 0 ? (
            <p>No drivers available.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Driver</th><th>Mobile</th><th>Total Ratings</th><th>Average</th></tr></thead>
                <tbody>
                  {drivers.map(d => (
                    <tr key={d._id}>
                      <td>{d.username}</td>
                      <td>{d.mobileNumber}</td>
                      <td>{d.ratings?.length || 0}</td>
                      <td>
                        {d.averageRating ? (
                          <><strong>{d.averageRating}</strong> <span style={{ color: 'var(--orange)' }}>&#9733;</span></>
                        ) : 'No ratings yet'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
