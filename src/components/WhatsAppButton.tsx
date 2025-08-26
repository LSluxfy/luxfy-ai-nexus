import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent, FacebookEvents } from '../lib/facebook-pixel';

const WhatsAppButton = () => {
  const { t } = useTranslation();
  
  const phoneNumber = "+5511967136762";
  const message = encodeURIComponent(t('whatsapp.message'));
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`;

  const handleClick = () => {
    // Track Facebook Pixel event
    trackEvent(FacebookEvents.CONTACT, {
      content_name: 'WhatsApp Contact',
      content_category: 'contact_form',
      source: 'whatsapp_button'
    });
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label={t('whatsapp.aria-label')}
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default WhatsAppButton;