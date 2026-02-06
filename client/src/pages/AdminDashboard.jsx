import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [tab, setTab] = useState('pending');
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchPending = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/pending-drivers');
      setPendingDrivers(data);
    } catch (err) { /* ignore */ }
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/drivers');
      setAllDrivers(data);
    } catch (err) { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchPending();
    fetchAll();
  }, [fetchPending, fetchAll]);

  const approveDriver = async (id) => {
    try {
      const { data } = await axios.put(`/api/admin/approve-driver/${id}`);
      setMsg({ type: 'success', text: data.message });
      fetchPending();
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const suspendDriver = async (id) => {
    try {
      const { data } = await axios.put(`/api/admin/suspend-driver/${id}`);
      setMsg({ type: 'success', text: data.message });
      fetchAll();
      fetchPending();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const reactivateDriver = async (id) => {
    try {
      const { data } = await axios.put(`/api/admin/reactivate-driver/${id}`);
      setMsg({ type: 'success', text: data.message });
      fetchAll();
      fetchPending();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const getStatusBadge = (driver) => {
    if (driver.suspended) return <span className="badge badge-suspended">Suspended</span>;
    if (driver.accountStatus) return <span className="badge badge-active">Active</span>;
    return <span className="badge badge-pending">Pending</span>;
  };

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => { setTab('pending'); fetchPending(); }}>
          Pending {pendingDrivers.length > 0 && `(${pendingDrivers.length})`}
        </button>
        <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => { setTab('all'); fetchAll(); }}>All Drivers</button>
      </div>

      {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}

      {tab === 'pending' && (
        <div className="card">
          <h2>Pending Driver Registrations</h2>
          {pendingDrivers.length === 0 ? (
            <div className="msg-info">No pending registrations.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Username</th><th>Email</th><th>Mobile</th><th>License</th><th>National ID</th><th>Action</th></tr></thead>
                <tbody>
                  {pendingDrivers.map(d => (
                    <tr key={d._id}>
                      <td>{d.username}</td>
                      <td>{d.email}</td>
                      <td>{d.mobileNumber}</td>
                      <td>{d.driverLicense}</td>
                      <td>{d.nationalID}</td>
                      <td>
                        <button className="btn btn-success btn-sm" onClick={() => approveDriver(d._id)}>Approve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'all' && (
        <div className="card">
          <h2>All Drivers</h2>
          {allDrivers.length === 0 ? (
            <div className="msg-info">No drivers in database.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Username</th><th>Email</th><th>Mobile</th><th>Status</th><th>Avg Rating</th><th>Action</th></tr></thead>
                <tbody>
                  {allDrivers.map(d => (
                    <tr key={d._id}>
                      <td>{d.username}</td>
                      <td>{d.email}</td>
                      <td>{d.mobileNumber}</td>
                      <td>{getStatusBadge(d)}</td>
                      <td>{d.averageRating || 'N/A'}</td>
                      <td>
                        {d.accountStatus && !d.suspended && (
                          <button className="btn btn-danger btn-sm" onClick={() => suspendDriver(d._id)}>Suspend</button>
                        )}
                        {d.suspended && (
                          <button className="btn btn-success btn-sm" onClick={() => reactivateDriver(d._id)}>Reactivate</button>
                        )}
                        {!d.accountStatus && !d.suspended && (
                          <button className="btn btn-success btn-sm" onClick={() => approveDriver(d._id)}>Approve</button>
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
    </div>
  );
}
