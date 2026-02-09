import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function SupportPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('create');
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [replyText, setReplyText] = useState({});
  const [expandedTicket, setExpandedTicket] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/support/tickets');
      setTickets(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const createTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    try {
      await axios.post('/api/support/tickets', { subject, message });
      setMsg({ type: 'success', text: t('support.ticket_created') });
      setSubject('');
      setMessage('');
      fetchTickets();
      setTab('tickets');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const replyToTicket = async (ticketId) => {
    const text = replyText[ticketId];
    if (!text?.trim()) return;
    try {
      const { data } = await axios.post(`/api/support/tickets/${ticketId}/reply`, { message: text });
      setTickets(prev => prev.map(tk => tk._id === ticketId ? data : tk));
      setReplyText(prev => ({ ...prev, [ticketId]: '' }));
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    }
  };

  const getStatusClass = (status) => {
    if (status === 'open') return 'badge-pending';
    if (status === 'in_progress') return 'badge-active';
    return 'badge-suspended';
  };

  const getStatusLabel = (status) => {
    if (status === 'open') return t('support.status_open');
    if (status === 'in_progress') return t('support.status_in_progress');
    return t('support.status_closed');
  };

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${tab === 'create' ? 'active' : ''}`} onClick={() => setTab('create')}>
          {t('support.create_ticket')}
        </button>
        <button className={`tab ${tab === 'tickets' ? 'active' : ''}`} onClick={() => { setTab('tickets'); fetchTickets(); }}>
          {t('support.my_tickets')} {tickets.length > 0 && `(${tickets.length})`}
        </button>
      </div>

      {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}

      {tab === 'create' && (
        <div className="card">
          <h2>{t('support.create_ticket')}</h2>
          <form onSubmit={createTicket}>
            <div className="form-group">
              <label>{t('support.subject')}</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder={t('support.subject_placeholder')}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('support.message')}</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t('support.message_placeholder')}
                rows={5}
                required
              />
            </div>
            <button className="btn btn-orange" type="submit">{t('support.send_ticket')}</button>
          </form>
        </div>
      )}

      {tab === 'tickets' && (
        <div className="card">
          <h2>{t('support.my_tickets')}</h2>
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
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <span className={`badge ${getStatusClass(ticket.status)}`}>
                      {getStatusLabel(ticket.status)}
                    </span>
                  </div>

                  {expandedTicket === ticket._id && (
                    <div className="support-ticket-body">
                      <div className="support-messages">
                        {ticket.messages.map((m, i) => (
                          <div key={i} className={`support-message ${m.senderRole === 'admin' ? 'admin' : 'user'}`}>
                            <div className="support-message-header">
                              <strong>{m.senderRole === 'admin' ? 'Support' : 'Vous'}</strong>
                              <small>{new Date(m.createdAt).toLocaleString()}</small>
                            </div>
                            <p>{m.content}</p>
                          </div>
                        ))}
                      </div>

                      {ticket.status !== 'closed' && (
                        <div className="support-reply">
                          <textarea
                            value={replyText[ticket._id] || ''}
                            onChange={e => setReplyText(prev => ({ ...prev, [ticket._id]: e.target.value }))}
                            placeholder={t('support.reply_placeholder')}
                            rows={2}
                          />
                          <button
                            className="btn btn-sm btn-orange"
                            onClick={() => replyToTicket(ticket._id)}
                          >
                            {t('support.reply')}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
