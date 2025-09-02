import React, { useState, useEffect } from 'react';
import { Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  isAudio?: boolean;
}

const AnimatedChatMockup = () => {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const messages: Message[] = [
    { id: 1, text: "Boa tarde, Pedro, tudo certinho?", isUser: true, timestamp: "14:25" },
    { id: 2, text: "Oi, tudo ótimo! 👋", isUser: false, timestamp: "14:25" },
    { id: 3, text: "🎵 Áudio (0:15)", isUser: true, timestamp: "14:26", isAudio: true },
    { id: 4, text: "Aqui é o Matheus da Luxfy, você acabou de se cadastrar no nosso site, né?", isUser: false, timestamp: "14:27" },
    { id: 5, text: "Isso mesmo! Queria saber mais sobre o produto.", isUser: true, timestamp: "14:28" },
    { id: 6, text: "Perfeito! Posso agendar uma demonstração gratuita para você hoje às 16h?", isUser: false, timestamp: "14:28" },
  ];

  useEffect(() => {
    const showMessages = async () => {
      for (let i = 0; i < messages.length; i++) {
        if (i > 0) {
          setIsTyping(true);
          await new Promise(resolve => setTimeout(resolve, 1500));
          setIsTyping(false);
        }
        
        setVisibleMessages(prev => [...prev, messages[i].id]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    showMessages();
  }, []);

  return (
    <div className="relative w-[300px] mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl border border-slate-700">
        {/* Screen */}
        <div className="bg-slate-800 rounded-[2rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="bg-slate-900 px-6 py-2 flex justify-between items-center text-white text-sm">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
              </div>
            </div>
          </div>

          {/* WhatsApp Header */}
          <div className="bg-slate-700 px-4 py-3 flex items-center gap-3 border-b border-slate-600">
            <ArrowLeft className="w-5 h-5 text-white" />
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AI</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">Agente IA Luxfy</h3>
              <p className="text-green-400 text-xs">online</p>
            </div>
            <div className="flex items-center gap-4 text-white">
              <Video className="w-5 h-5" />
              <Phone className="w-5 h-5" />
              <MoreVertical className="w-5 h-5" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-slate-800 h-[400px] p-4 space-y-3 overflow-hidden">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} ${
                  visibleMessages.includes(message.id) ? 'animate-fade-in' : 'opacity-0'
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    message.isUser
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-slate-600 text-white rounded-bl-md'
                  }`}
                >
                  {message.isAudio ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                      <div className="flex-1 h-1 bg-slate-400 rounded"></div>
                      <span className="text-xs opacity-75">0:15</span>
                    </div>
                  ) : (
                    <p>{message.text}</p>
                  )}
                  <div className="flex justify-end mt-1">
                    <span className="text-xs opacity-75">{message.timestamp}</span>
                    {message.isUser && (
                      <span className="ml-1 text-blue-300 text-xs">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-slate-600 text-white px-3 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-slate-700 p-3 border-t border-slate-600">
            <div className="bg-slate-600 rounded-full px-4 py-2 flex items-center gap-3">
              <span className="text-slate-400 text-sm flex-1">Digite uma mensagem</span>
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📎</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -right-4 top-1/4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
      <div className="absolute -left-6 bottom-1/4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
    </div>
  );
};

export default AnimatedChatMockup;