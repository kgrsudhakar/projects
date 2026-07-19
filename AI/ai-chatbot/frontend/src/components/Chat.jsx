import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          sessionId: 'user-123'
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const aiMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Network error: Please ensure the backend server is running on port 5000.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      console.error('Chat Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen h-dvh w-full bg-[#efe7dd] overflow-hidden font-sans">
      {/* Top Navbar - Classic Simple Design */}
      <header className="flex items-center justify-between px-4 py-2 bg-[#008069] text-white shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white/20">
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=Nexus"
              alt="AI"
              className="w-full h-full object-cover"
            />
          </div> */}
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold leading-tight">Nexus AI</h1>
            <span className="text-[11px] text-green-100 opacity-90">Online</span>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-black/10 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-black/10 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 00-1 1v12a1 1 0 002 0V7a1 1 0 00-1-1zm0 0H11" />
            </svg>
          </button>
        </div> */}
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-[#e5ddd5] p-3 md:p-6 custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-xs">
                <div className="text-4xl mb-3">🤖</div>
                <h2 className="text-lg font-bold text-gray-800">Ready to Chat!</h2>
                <p className="text-gray-500 text-xs mt-2">
                  Your AI assistant is active and waiting for your messages.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 px-4">
                {['Help me with code', 'What is Groq?', 'Tell a joke'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-[85%] p-2 px-3 rounded-lg shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none border border-gray-200'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-normal">
                      {msg.content}
                    </div>
                    <div className="text-[10px] text-gray-400 text-right mt-1">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-800 border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Dock */}
      <footer className="p-3 bg-[#f0f2f5] shrink-0">
        <form
          onSubmit={handleSend}
          className="max-w-4xl mx-auto flex gap-2 items-center"
        >
          <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              className="flex-1 p-2 bg-transparent border-none focus:outline-none text-slate-800 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-[#00a884] text-white rounded-full hover:bg-[#008f72] disabled:bg-gray-300 transition-all shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;
