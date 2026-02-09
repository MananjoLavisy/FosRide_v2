import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState('pending');
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [stats, setStats] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // FAQ form
  const [faqForm, setFaqForm] = useState({
    question_fr: '', question_en: '', question_mg: '',
    answer_fr: '', answer_en: '', answer_mg: '',
    category: 'general', order: 0,
  });
  const [editingFaq, setEditingFaq] = useState(null);

  // Ticket expanded
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [replyText, setReplyText] = useState({});

  const lang = i18n.language || 'fr';

  const fetchPending = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/pending-drivers');
      setPendingDrivers(data);
    } catch { /* ignore */ }
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/drivers');
      setAllDrivers(data);
    } catch { /* ignore */ }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsers(data);
    } catch { /* ignore */ }
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/tickets');
      setTickets(data);
    } catch { /* ignore */ }
  }, []);

  const fetchFaqs = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/faq');
      setFaqs(data);
    } catch { /* ignore */ }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/stats');
      setStats(data);
    } catch { /* ignore */ }
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
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const suspendDriver = async (id) => {
    try {
      const { data } = await axios.put(`/api/admin/suspend-driver/${id}`);
      setMsg({ type: 'success', text: data.message });
      fetchAll();
      fetchPending();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const reactivateDriver = async (id) => {
    try {
      const { data } = await axios.put(`/api/admin/reactivate-driver/${id}`);
      setMsg({ type: 'success', text: data.message });
      fetchAll();
      fetchPending();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const getStatusBadge = (driver) => {
    if (driver.suspended) return <span className="badge badge-suspended">{t('admin.suspended')}</span>;
    if (driver.accountStatus) return <span className="badge badge-active">{t('admin.active')}</span>;
    return <span className="badge badge-pending">{t('admin.pending')}</span>;
  };

  // FAQ actions
  const saveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await axios.put(`/api/admin/faq/${editingFaq}`, faqForm);
      } else {
        await axios.post('/api/admin/faq', faqForm);
      }
      setFaqForm({ question_fr: '', question_en: '', question_mg: '', answer_fr: '', answer_en: '', answer_mg: '', category: 'general', order: 0 });
      setEditingFaq(null);
      setMsg({ type: 'success', text: t('common.success') });
      fetchFaqs();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const deleteFaq = async (id) => {
    try {
      await axios.delete(`/api/admin/faq/${id}`);
      fetchFaqs();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const editFaq = (faq) => {
    setEditingFaq(faq._id);
    setFaqForm({
      question_fr: faq.question_fr, question_en: faq.question_en, question_mg: faq.question_mg,
      answer_fr: faq.answer_fr, answer_en: faq.answer_en, answer_mg: faq.answer_mg,
      category: faq.category, order: faq.order,
    });
  };

  // Ticket actions
  const updateTicketStatus = async (ticketId, status) => {
    try {
      const { data } = await axios.put(`/api/admin/tickets/${ticketId}/status`, { status });
      setTickets(prev => prev.map(tk => tk._id === ticketId ? data : tk));
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const replyToTicket = async (ticketId) => {
    const text = replyText[ticketId];
    if (!text?.trim()) return;
    try {
      const { data } = await axios.post(`/api/admin/tickets/${ticketId}/reply`, { message: text });
      setTickets(prev => prev.map(tk => tk._id === ticketId ? data : tk));
      setReplyText(prev => ({ ...prev, [ticketId]: '' }));
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const getTicketStatusClass = (status) => {
    if (status === 'open') return 'badge-pending';
    if (status === 'in_progress') return 'badge-active';
    return 'badge-suspended';
  };

  const getTicketStatusLabel = (status) => {
    if (status === 'open') return t('support.status_open');
    if (status === 'in_progress') return t('support.status_in_progress');
    return t('support.status_closed');
  };

  return (
    <div>
      <div className="tabs" style={{ flexWrap: 'wrap' }}>
        <button className={`tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => { setTab('pending'); fetchPending(); }}>
          {t('admin.pending_tab')} {pendingDrivers.length > 0 && `(${pendingDrivers.length})`}
        </button>
        <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => { setTab('all'); fetchAll(); }}>{t('admin.all_drivers')}</button>
        <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => { setTab('users'); fetchUsers(); }}>{t('admin.users')}</button>
        <button className={`tab ${tab === 'tickets' ? 'active' : ''}`} onClick={() => { setTab('tickets'); fetchTickets(); }}>{t('admin.support_tickets')}</button>
        <button className={`tab ${tab === 'faq' ? 'active' : ''}`} onClick={() => { setTab('faq'); fetchFaqs(); }}>{t('admin.manage_faq')}</button>
        <button className={`tab ${tab === 'stats' ? 'active' : ''}`} onClick={() => { setTab('stats'); fetchStats(); }}>{t('admin.stats')}</button>
      </div>

      {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}

      {tab === 'pending' && (
        <div className="card">
          <h2>{t('admin.pending_registrations')}</h2>
          {pendingDrivers.length === 0 ? (
            <div className="msg-info">{t('admin.no_pending')}</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>{t('auth.username')}</th><th>{t('auth.email')}</th><th>{t('auth.mobile')}</th><th>{t('auth.driver_license')}</th><th>{t('auth.national_id')}</th><th>{t('user.action')}</th></tr></thead>
                <tbody>
                  {pendingDrivers.map(d => (
                    <tr key={d._id}>
                      <td>{d.username}</td>
                      <td>{d.email}</td>
                      <td>{d.mobileNumber}</td>
                      <td>{d.driverLicense}</td>
                      <td>{d.nationalID}</td>
                      <td>
                        <button className="btn btn-success btn-sm" onClick={() => approveDriver(d._id)}>{t('admin.approve')}</button>
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
          <h2>{t('admin.all_drivers_title')}</h2>
          {allDrivers.length === 0 ? (
            <div className="msg-info">{t('admin.no_drivers')}</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>{t('auth.username')}</th><th>{t('auth.email')}</th><th>{t('auth.mobile')}</th><th>{t('admin.status')}</th><th>{t('admin.avg_rating')}</th><th>{t('user.action')}</th></tr></thead>
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
                          <button className="btn btn-danger btn-sm" onClick={() => suspendDriver(d._id)}>{t('admin.suspend')}</button>
                        )}
                        {d.suspended && (
                          <button className="btn btn-success btn-sm" onClick={() => reactivateDriver(d._id)}>{t('admin.reactivate')}</button>
                        )}
                        {!d.accountStatus && !d.suspended && (
                          <button className="btn btn-success btn-sm" onClick={() => approveDriver(d._id)}>{t('admin.approve')}</button>
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

      {tab === 'users' && (
        <div className="card">
          <h2>{t('admin.users')}</h2>
          {users.length === 0 ? (
            <div className="msg-info">{t('admin.no_drivers')}</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>{t('auth.username')}</th><th>{t('auth.email')}</th><th>{t('auth.mobile')}</th><th>{t('profile.member_since')}</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.mobileNumber}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'tickets' && (
        <div className="card">
          <h2>{t('admin.support_tickets')}</h2>
          {tickets.length === 0 ? (
            <p>{t('support.no_tickets')}</p>
          ) : (
            <div className="support-tickets">
              {tickets.map(ticket => (
                <div key={ticket._id} className="support-ticket">
                  <div
                    className="support-ticket-header"
                    onClick={() => setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)}
                  >
                    <div>
                      <strong>{ticket.subject}</strong>
                      <small style={{ marginLeft: 8, color: 'var(--text-muted)' }}>
                        {ticket.userRole} — {new Date(ticket.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className={`badge ${getTicketStatusClass(ticket.status)}`}>
                        {getTicketStatusLabel(ticket.status)}
                      </span>
                    </div>
                  </div>

                  {expandedTicket === ticket._id && (
                    <div className="support-ticket-body">
                      <div className="support-messages">
                        {ticket.messages.map((m, i) => (
                          <div key={i} className={`support-message ${m.senderRole === 'admin' ? 'admin' : 'user'}`}>
                            <div className="support-message-header">
                              <strong>{m.senderRole === 'admin' ? 'Admin' : ticket.userRole}</strong>
                              <small>{new Date(m.createdAt).toLocaleString()}</small>
                            </div>
                            <p>{m.content}</p>
                          </div>
                        ))}
                      </div>

                      <div className="support-reply">
                        <textarea
                          value={replyText[ticket._id] || ''}
                          onChange={e => setReplyText(prev => ({ ...prev, [ticket._id]: e.target.value }))}
                          placeholder={t('support.reply_placeholder')}
                          rows={2}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button className="btn btn-sm btn-orange" onClick={() => replyToTicket(ticket._id)}>
                            {t('support.reply')}
                          </button>
                          {ticket.status !== 'closed' && (
                            <button className="btn btn-sm btn-danger" onClick={() => updateTicketStatus(ticket._id, 'closed')}>
                              {t('support.status_closed')}
                            </button>
                          )}
                          {ticket.status === 'closed' && (
                            <button className="btn btn-sm btn-success" onClick={() => updateTicketStatus(ticket._id, 'open')}>
                              {t('support.status_open')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'faq' && (
        <div className="card">
          <h2>{t('admin.manage_faq')}</h2>

          <form onSubmit={saveFaq} style={{ marginBottom: 24 }}>
            <h3>{editingFaq ? t('driver_dash.save') : t('driver_dash.add')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Question (FR)</label>
                <input value={faqForm.question_fr} onChange={e => setFaqForm({ ...faqForm, question_fr: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Question (EN)</label>
                <input value={faqForm.question_en} onChange={e => setFaqForm({ ...faqForm, question_en: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Question (MG)</label>
              <input value={faqForm.question_mg} onChange={e => setFaqForm({ ...faqForm, question_mg: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Answer (FR)</label>
              <textarea value={faqForm.answer_fr} onChange={e => setFaqForm({ ...faqForm, answer_fr: e.target.value })} rows={2} required />
            </div>
            <div className="form-group">
              <label>Answer (EN)</label>
              <textarea value={faqForm.answer_en} onChange={e => setFaqForm({ ...faqForm, answer_en: e.target.value })} rows={2} required />
            </div>
            <div className="form-group">
              <label>Answer (MG)</label>
              <textarea value={faqForm.answer_mg} onChange={e => setFaqForm({ ...faqForm, answer_mg: e.target.value })} rows={2} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={faqForm.category} onChange={e => setFaqForm({ ...faqForm, category: e.target.value })}>
                  <option value="general">General</option>
                  <option value="rides">Rides</option>
                  <option value="payment">Payment</option>
                  <option value="drivers">Drivers</option>
                  <option value="reviews">Reviews</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div className="form-group">
                <label>Order</label>
                <input type="number" value={faqForm.order} onChange={e => setFaqForm({ ...faqForm, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-orange" type="submit">{t('driver_dash.save')}</button>
              {editingFaq && (
                <button className="btn" type="button" onClick={() => {
                  setEditingFaq(null);
                  setFaqForm({ question_fr: '', question_en: '', question_mg: '', answer_fr: '', answer_en: '', answer_mg: '', category: 'general', order: 0 });
                }}>{t('user.cancel')}</button>
              )}
            </div>
          </form>

          {faqs.length === 0 ? (
            <p>{t('faq.no_faq')}</p>
          ) : (
            <div className="faq-list">
              {faqs.map(faq => (
                <div key={faq._id} className="faq-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <strong>{faq[`question_${lang}`] || faq.question_fr}</strong>
                    <small style={{ marginLeft: 8, color: 'var(--text-muted)' }}>[{faq.category}] #{faq.order}</small>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm" onClick={() => editFaq(faq)}>{t('driver_dash.save')}</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteFaq(faq._id)}>{t('driver_dash.delete')}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'stats' && (
        <div className="card">
          <h2>{t('admin.stats')}</h2>
          {!stats ? (
            <p>{t('common.loading')}</p>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">{t('admin.users')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalDrivers}</div>
                <div className="stat-label">{t('admin.all_drivers')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalRides}</div>
                <div className="stat-label">Total Rides</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.pendingRides}</div>
                <div className="stat-label">{t('admin.pending')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.completedRides}</div>
                <div className="stat-label">{t('notifications.ride_completed')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.openTickets}</div>
                <div className="stat-label">{t('admin.support_tickets')}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
