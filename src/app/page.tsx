'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: input },
        { role: 'bot', content: data.answer },
      ]);
      setInput('');
    } catch (err) {
      console.error('에러:', err);
    } finally {
      setLoading(false);
    }
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              handleSend();
            }
          }}
          placeholder="무엇이 궁금하신가요?"
        />
        <button
          className="bg-blue-500 text-white rounded px-4 py-2 text-sm whitespace-nowrap min-w-[90px] disabled:opacity-50"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? '전송 중...' : '전송'}
        </button>
      </div>
    </div>
  );
}