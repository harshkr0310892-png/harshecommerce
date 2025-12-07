import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage, Product } from '../types';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const AIAssistant: React.FC = () => {
  const { products } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Nex, your AI shopping assistant. Looking for something specific or need a gift idea?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(userMsg, products);
      
      const recommendedProducts = response.recommendedProductIds
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined);

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.message,
        recommendations: recommendedProducts
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        aria-label="Open AI Assistant"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-gold-500 ${isOpen ? 'scale-0' : 'scale-100 bg-indigo-600 dark:bg-gold-500 text-white'}`}
      >
        <Sparkles className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 w-full max-w-[400px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right transform flex flex-col overflow-hidden border border-gray-100 dark:border-neutral-800 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ maxHeight: 'calc(100vh - 100px)', height: '600px' }}>
        
        {/* Header */}
        <div className="bg-indigo-600 dark:bg-gold-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Nex Assistant</h3>
              <p className="text-xs text-indigo-100 dark:text-gold-100">Powered by Gemini 2.5</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-neutral-950/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 dark:bg-gold-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-neutral-700 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              
              {/* Product Recommendations Grid in Chat */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 w-full max-w-[90%]">
                  {msg.recommendations.map(product => (
                    <div key={product.id} className="scale-90 origin-top-left w-[110%] -ml-[5%]">
                       <ProductCard product={product} compact={true} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-neutral-700 shadow-sm flex space-x-1">
                <div className="w-2 h-2 bg-indigo-400 dark:bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-400 dark:bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-400 dark:bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-neutral-800 rounded-full px-4 py-2 border border-gray-200 dark:border-neutral-700 focus-within:ring-2 focus-within:ring-indigo-500 dark:focus-within:ring-gold-500 focus-within:border-transparent transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for recommendations..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={`p-2 rounded-full transition-colors ${
                inputValue.trim() && !isLoading ? 'text-indigo-650 dark:text-gold-500 hover:bg-indigo-50 dark:hover:bg-neutral-700' : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};