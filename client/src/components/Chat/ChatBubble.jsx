import React from 'react';

export default function ChatBubble({ message, isMine }) {
  return (
    <div className={`chat-bubble ${isMine ? 'sent' : 'received'}`}>
      <div>{message.content}</div>
      <div className="chat-bubble-time">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
