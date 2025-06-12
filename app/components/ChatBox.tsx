'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4 font-sans antialiased">
      <ChatBox />
    </div>
  );
}

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantPlaceholder: Message = { sender: 'assistant', text: '' };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input.trim() }),
      });

      if (!response.ok) throw new Error('API error');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let streamedText = '', done = false;

      if (reader) {
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: !done });
          streamedText += chunk;

          setMessages((prev) => {
            const newMsgs = [...prev];
            const lastIdx = newMsgs.length - 1;
            if (newMsgs[lastIdx]?.sender === 'assistant') {
              newMsgs[lastIdx].text = streamedText;
            }
            return newMsgs;
          });
        }
      }
    } catch {
      setMessages((prev) => {
        const newMsgs = [...prev];
        const lastIdx = newMsgs.length - 1;
        if (newMsgs[lastIdx]?.sender === 'assistant') {
          newMsgs[lastIdx].text = 'Oops! Something went wrong.';
        }
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-t-xl">
        <h2 className="text-xl font-bold">AI Chat</h2>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] p-4 rounded-xl shadow-sm text-sm whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[75%] p-4 rounded-xl bg-gray-200 text-gray-600 text-sm flex items-center">
              Thinking
              <span className="ml-2 dot-spinner">
                {Array(3).fill(0).map((_, i) => (
                  <span className="dot" key={i}></span>
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-5 bg-gray-50 border-t flex items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
      <style>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #f3f4f6;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 10px;
        }

        .dot-spinner {
          display: flex;
          margin-left: 5px;
        }
        .dot {
          width: 6px;
          height: 6px;
          margin: 0 2px;
          background: #6b7280;
          border-radius: 50%;
          animation: blink 1.4s infinite both;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
