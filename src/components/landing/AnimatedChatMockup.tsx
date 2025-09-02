import React, { useState, useEffect, useCallback } from 'react';
import { Video, Phone, MoreVertical, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useInView } from '@/hooks/useInView';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  isAudio?: boolean;
}

const AnimatedChatMockup = () => {
  const { t } = useTranslation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  const messages: Message[] = t('hero.chat.messages', { returnObjects: true }) as Message[];

  const animateMessages = useCallback(async () => {
    if (isAnimating || messages.length === 0) return;
    
    setIsAnimating(true);
    setCurrentMessageIndex(-1);
    
    // Delay inicial
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      
      // Mostrar indicador de digitação apenas para mensagens da IA
      if (!message.isUser) {
        setIsTyping(true);
        // Tempo de digitação baseado no tamanho da mensagem
        const typingTime = Math.max(1500, message.text.length * 30);
        await new Promise(resolve => setTimeout(resolve, typingTime));
        setIsTyping(false);
      }
      
      // Mostrar a mensagem
      setCurrentMessageIndex(i);
      
      // Pausa após mensagem do usuário (simula leitura)
      if (message.isUser) {
        await new Promise(resolve => setTimeout(resolve, 1200));
      } else {
        // Pausa menor após mensagem da IA
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
    
    // Pausa antes de reiniciar o loop
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnimating(false);
  }, [messages, isAnimating]);

  useEffect(() => {
    if (inView && messages.length > 0) {
      animateMessages();
    }
  }, [inView, animateMessages, messages]);

  useEffect(() => {
    if (!isAnimating && currentMessageIndex >= messages.length - 1 && inView) {
      const restartTimer = setTimeout(() => {
        animateMessages();
      }, 2000);
      
      return () => clearTimeout(restartTimer);
    }
  }, [isAnimating, currentMessageIndex, messages.length, inView, animateMessages]);

  return (
    <div ref={ref} className={`relative w-[300px] mx-auto ${inView ? 'animate-enter' : ''}`}>
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
              <h3 className="text-white font-medium">{t('hero.chat.header.name')}</h3>
              <p className="text-green-400 text-xs">{t('hero.chat.header.status')}</p>
            </div>
            <div className="flex items-center gap-4 text-white">
              <Video className="w-5 h-5" />
              <Phone className="w-5 h-5" />
              <MoreVertical className="w-5 h-5" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-slate-800 h-[400px] p-4 space-y-3 overflow-hidden">
            {messages.slice(0, currentMessageIndex + 1).map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
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
                    <span className="text-xs opacity-75">14:{32 + index}</span>
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
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{t('hero.chat.typing')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-slate-700 p-3 border-t border-slate-600">
            <div className="bg-slate-600 rounded-full px-4 py-2 flex items-center gap-3">
              <span className="text-slate-400 text-sm flex-1">{t('hero.chat.placeholder')}</span>
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