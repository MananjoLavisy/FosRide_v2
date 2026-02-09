import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import ChatBubble from './ChatBubble';

export default function ChatWindow({ conversationId, recipientId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef();

  useEffect(() => {
    if (!conversationId) return;
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${conversationId}`);
        setMessages(data);
      } catch { /* ignore */ }
    };
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => [...prev, data.message]);
      }
    };
    const typingHandler = (data) => {
      if (data.conversationId === conversationId && data.userId !== user.id) {
        setTyping(true);
        setTimeout(() => setTyping(false), 2000);
      }
    };
    socket.on('new_message', handler);
    socket.on('typing', typingHandler);
    return () => {
      socket.off('new_message', handler);
      socket.off('typing', typingHandler);
    };
  }, [socket, conversationId, user?.id]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const { data } = await axios.post('/api/messages', {
        conversationId,
        recipientId,
        content: input,
      });
      setMessages(prev => [...prev, data]);
      setInput('');
    } catch { /* ignore */ }
  };

  const handleTyping = () => {
    if (socket && recipientId) {
      socket.emit('typing', { conversationId, recipientId });
    }
  };

  return (
    <div className="chat-main">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <ChatBubble key={msg._id || i} message={msg} isMine={msg.sender === user.id || msg.sender?._id === user.id} />
        ))}
        {typing && <div className="chat-typing">{t('chat.typing')}</div>}
        <div ref={messagesEnd} />
      </div>
      <form className="chat-input-bar" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={e => { setInput(e.target.value); handleTyping(); }}
          placeholder={t('chat.type_message')}
        />
        <button className="btn btn-orange" type="submit">{t('chat.send')}</button>
      </form>
    </div>
  );
}
