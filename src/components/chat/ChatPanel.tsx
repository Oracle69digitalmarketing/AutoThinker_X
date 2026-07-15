import React, { useState } from 'react';
import { useCopilot } from '../../hooks/useCopilot';
import { ChatMessageComponent } from './ChatMessage';

export const ChatPanel: React.FC<{ blueprintData: any, onClose: () => void }> = ({ blueprintData, onClose }) => {
  const { messages, sendMessage, isTyping } = useCopilot(blueprintData);
  const [input, setInput] = useState('');

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <h2 className="text-white font-semibold">AutoThinker Copilot</h2>
        <button onClick={onClose} className="text-gray-400">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(m => <ChatMessageComponent key={m.id} message={m} />)}
        {isTyping && <div className="text-gray-400 text-sm italic">Copilot is typing...</div>}
      </div>
      <div className="p-4 border-t border-gray-700">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              sendMessage(input);
              setInput('');
            }
          }}
          className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700"
          placeholder="Ask anything..."
        />
      </div>
    </div>
  );
};
