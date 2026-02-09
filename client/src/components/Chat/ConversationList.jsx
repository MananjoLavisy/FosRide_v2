import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function ConversationList({ onSelect, activeConv }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get('/api/messages/conversations');
        setConversations(data);
      } catch { /* ignore */ }
    };
    fetchConversations();
  }, []);

  const getOtherUserId = (convId) => {
    const parts = convId.split('_');
    return parts.find(p => p !== user.id) || convId;
  };

  return (
    <div className="chat-sidebar">
      <div style={{ padding: '12px 16px', fontWeight: 700, borderBottom: '1px solid var(--border)' }}>
        {t('chat.conversations')}
      </div>
      {conversations.length === 0 ? (
        <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 14 }}>{t('chat.no_conversations')}</div>
      ) : (
        conversations.map(conv => (
          <div
            key={conv._id}
            className={`chat-conv-item ${activeConv === conv._id ? 'active' : ''}`}
            onClick={() => onSelect(conv._id, getOtherUserId(conv._id))}
          >
            <div>
              <div className="chat-conv-name">{getOtherUserId(conv._id).substring(0, 8)}...</div>
              <div className="chat-conv-preview">{conv.lastMessage?.substring(0, 30)}</div>
            </div>
            {conv.unread > 0 && <span className="chat-unread-badge">{conv.unread}</span>}
          </div>
        ))
      )}
    </div>
  );
}
