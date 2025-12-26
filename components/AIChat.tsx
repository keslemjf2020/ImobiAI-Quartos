
import React, { useState, useRef, useEffect } from 'react';
import { askAI } from '../services/geminiService';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Olá! Sou seu assistente imobiliário inteligente. Como posso ajudar com seus contratos ou vistorias hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await askAI(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: response || '' }]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-black p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-xl shadow-lg">🤖</div>
        <div>
          <h3 className="font-bold text-white">Assistente ImobiAI</h3>
          <p className="text-xs text-indigo-300">Especialista em Lei do Inquilinato</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-md text-sm ${
              msg.role === 'user' 
              ? 'bg-black text-white rounded-tr-none' 
              : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-1">
              <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 bg-black text-white border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500"
            placeholder="Pergunte sobre multas, despejo ou regras..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-black text-white p-3 rounded-xl hover:bg-gray-900 transition-colors border border-gray-700"
          >
            ➤
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          A IA pode cometer erros. Sempre revise as sugestões legalmente.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
