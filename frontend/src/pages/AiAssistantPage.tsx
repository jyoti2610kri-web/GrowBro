
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
}

const AiAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/ai/history');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching AI history:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userPrompt = input;
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/ai/ask', {
        prompt: userPrompt
      });

      setMessages(prev => [...prev, response.data]);
    } catch (error: any) {
      console.error('Error asking AI:', error);

      setError(
        error.response?.data?.message ||
        'Unable to get a response. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">

      {/* Page Heading and Clear Chat Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            AI Learning Assistant
            <Sparkles className="text-primary-500" />
          </h1>
          <p className="text-gray-500 mt-1">
            Get personalized guidance, code reviews, and career advice.
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([]);
            setError('');
          }}
          disabled={messages.length === 0 || loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} />
          Clear Chat
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {fetching ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                <Bot size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Hello, {user?.name}!</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  I'm your AI growth partner. Ask me anything about your learning journey.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-md pt-4">
                {["How to learn React?", "Resume tips", "Code review", "Study plan"].map(tip => (
                  <button
                    key={tip}
                    onClick={() => setInput(tip)}
                    className="p-3 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition border border-gray-100"
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

                {/* User Message */}
                <div className="flex items-start justify-end space-x-3">
                  <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-md shadow-primary-100">
                    <p className="text-sm font-medium">{msg.prompt}</p>
                  </div>
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                    <User size={18} />
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Bot size={18} />
                  </div>
                  <div className="bg-gray-50 text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] border border-gray-100">
                    <p className="text-sm leading-relaxed">{msg.response}</p>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100">
                <Loader2 className="animate-spin text-gray-400" size={18} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full pl-4 pr-14 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200"
            >
              <Send size={20} />
            </button>
          </form>

          <p className="text-[10px] text-gray-400 mt-2 text-center uppercase font-bold tracking-widest">
            Powered by GrowBro AI Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
