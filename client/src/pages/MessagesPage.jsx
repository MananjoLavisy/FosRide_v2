import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConversationList from '../components/Chat/ConversationList';
import ChatWindow from '../components/Chat/ChatWindow';

export default function MessagesPage() {
  const { t } = useTranslation();
  const [activeConv, setActiveConv] = useState(null);
  const [recipientId, setRecipientId] = useState(null);

  const handleSelect = (convId, otherId) => {
    setActiveConv(convId);
    setRecipientId(otherId);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{t('chat.title')}</h2>
      <div className="chat-layout">
        <ConversationList onSelect={handleSelect} activeConv={activeConv} />
        {activeConv ? (
          <ChatWindow conversationId={activeConv} recipientId={recipientId} />
        ) : (
          <div className="chat-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            {t('chat.no_conversations')}
          </div>
        )}
      </div>
    </div>
  );
}
