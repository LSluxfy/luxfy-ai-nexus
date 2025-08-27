import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent, FacebookEvents } from '../../lib/facebook-pixel';

const WhatsAppNotification = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const phoneNumber = "+5511967136762";
  const message = encodeURIComponent(t('whatsapp.message'));
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`;

  useEffect(() => {
    // Verificar se já foi mostrado nesta sessão
    const hasShown = sessionStorage.getItem('whatsapp-notification-shown');
    if (hasShown) return;

    // Mostrar após 4 segundos
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem('whatsapp-notification-shown', 'true');
    }, 4000);

    // Esconder automaticamente após 10 segundos (4s + 6s)
    const hideTimer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleClick = () => {
    // Track Facebook Pixel event
    trackEvent(FacebookEvents.CONTACT, {
      content_name: 'WhatsApp Notification Click',
      content_category: 'notification',
      source: 'whatsapp_notification'
    });
    
    window.open(whatsappUrl, '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-24 right-6 z-40 max-w-sm transition-all duration-300 ${
        isAnimatingOut 
          ? 'translate-x-full opacity-0' 
          : 'translate-x-0 opacity-100 animate-fade-in'
      }`}
    >
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-4 border border-green-400/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm leading-tight">
              {t('whatsappNotification.title')}
            </h3>
            <p className="text-green-100 text-xs mt-1 leading-tight">
              {t('whatsappNotification.subtitle')}
            </p>
            <button
              onClick={handleClick}
              className="mt-2 bg-white text-green-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors duration-200"
            >
              {t('whatsappNotification.cta')}
            </button>
          </div>
          <button
            onClick={handleClose}
            className="text-green-100 hover:text-white transition-colors duration-200 p-1"
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppNotification;