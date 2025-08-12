import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, MessageCircle } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export default function ExamplesShowcase() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const getConversation = () => [
    { text: t("examples.conversation.0.text"), isUser: t("examples.conversation.0.isUser") === "true" },
    { text: t("examples.conversation.1.text"), isUser: t("examples.conversation.1.isUser") === "true" },
    { text: t("examples.conversation.2.text"), isUser: t("examples.conversation.2.isUser") === "true" },
    { text: t("examples.conversation.3.text"), isUser: t("examples.conversation.3.isUser") === "true" },
    { text: t("examples.conversation.4.text"), isUser: t("examples.conversation.4.isUser") === "true" },
    { text: t("examples.conversation.5.text"), isUser: t("examples.conversation.5.isUser") === "true" }
  ];

  useEffect(() => {
    const conversation = getConversation();
    const timer = setTimeout(() => {
      if (currentMessageIndex < conversation.length) {
        const currentMsg = conversation[currentMessageIndex];
        
        if (currentMsg.isUser) {
          // Adiciona mensagem do usuário imediatamente
          const newMessage = {
            id: currentMessageIndex,
            text: currentMsg.text,
            isUser: true,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, newMessage]);
          setCurrentMessageIndex(prev => prev + 1);
        } else {
          // Mostra typing indicator antes da resposta da IA
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const newMessage = {
              id: currentMessageIndex,
              text: currentMsg.text,
              isUser: false,
              timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newMessage]);
            setCurrentMessageIndex(prev => prev + 1);
          }, 2000);
        }
      } else {
        // Reinicia a animação
        setTimeout(() => {
          setMessages([]);
          setCurrentMessageIndex(0);
        }, 3000);
      }
    }, currentMessageIndex === 0 ? 1000 : 3000);

    return () => clearTimeout(timer);
  }, [currentMessageIndex]);

  return (
    <section className="py-20 px-4 bg-muted/20" id="examples">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">{t("examples.title")}</h2>
        <p className="text-muted-foreground text-center mb-10">{t("examples.subtitle")}</p>

        <div className="max-w-md mx-auto">
          {/* Phone Mockup */}
          <div className="relative bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl">
            {/* Phone Frame */}
            <div className="bg-white rounded-[2rem] overflow-hidden h-[640px] relative">
              {/* Status Bar */}
              <div className="bg-green-500 h-12 flex items-center justify-center">
                <div className="flex items-center gap-2 text-white">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">Luxfy AI</span>
                </div>
              </div>
              
              {/* Chat Area */}
              <div className="flex-1 p-4 bg-gray-50 h-[calc(100%-96px)] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.isUser
                          ? 'bg-green-500 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isUser ? 'text-green-100' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input Area */}
              <div className="bg-white border-t border-gray-200 p-3 flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                  <span className="text-gray-500 text-sm">Digite sua mensagem...</span>
                </div>
                <button className="bg-green-500 p-2 rounded-full">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            {/* Phone Details */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-slate-700 rounded-full"></div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Demonstração em tempo real do nosso agente de IA
          </p>
        </div>
      </div>
    </section>
  );
}