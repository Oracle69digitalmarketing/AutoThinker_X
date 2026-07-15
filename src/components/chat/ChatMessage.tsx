import React from 'react';
import { ChatMessage } from '../../types/chat/chat';

export const ChatMessageComponent: React.FC<{ message: ChatMessage }> = ({ message }) => (
  <div className={`p-4 ${message.role === 'user' ? 'bg-gray-800' : 'bg-gray-700'} rounded-lg my-2`}>
    <p className="text-sm text-gray-300 font-bold mb-1 uppercase">{message.role}</p>
    <div className="text-white whitespace-pre-wrap">{message.content}</div>
  </div>
);
