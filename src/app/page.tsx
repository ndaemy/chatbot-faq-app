'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input })
    });
    const data = await res.json();
    setMessages([...messages, { role: 'user', content: input }, { role: 'bot', content: data.answer }]);
    setInput('');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <p className="p-2 rounded bg-gray-100 inline-block max-w-full">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border rounded w-full p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="무엇이 궁금하신가요?"
        />
        <button
          className="bg-blue-500 text-white rounded px-4"
          onClick={handleSend}
        >
          전송
        </button>
      </div>
    </div>
  );
}