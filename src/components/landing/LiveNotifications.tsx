import React, { useState, useEffect } from 'react';
import { CheckCircle, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LiveNotifications: React.FC = () => {
  const { t } = useTranslation();
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const notifications = [
    { name: 'Carlos Silva', action: t('liveNotifications.actions.registered'), time: '2 min' },
    { name: 'Maria Santos', action: t('liveNotifications.actions.purchased'), time: '5 min' },
    { name: 'João Pedro', action: t('liveNotifications.actions.demo'), time: '8 min' },
    { name: 'Ana Costa', action: t('liveNotifications.actions.registered'), time: '12 min' },
    { name: 'Roberto Lima', action: t('liveNotifications.actions.purchased'), time: '15 min' }
  ];

  useEffect(() => {
    const showTimer = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        setCurrentNotification((prev) => (prev + 1) % notifications.length);
      }, 5000);
    }, 30000);

    return () => clearInterval(showTimer);
  }, [notifications.length]);

  const notification = notifications[currentNotification];

  return (
    <div className={`fixed top-16 md:top-20 right-2 md:right-4 z-40 transform transition-all duration-700 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-2 md:p-3 max-w-[280px] md:max-w-xs">
        <div className="flex items-start gap-2 md:gap-3">
          <div className="bg-green-100 rounded-full p-1.5 md:p-2 flex-shrink-0">
            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <User className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-500 flex-shrink-0" />
              <span className="font-semibold text-xs md:text-sm text-gray-900 truncate">{notification.name}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{notification.action}</p>
            <p className="text-xs text-gray-400 mt-0.5">{notification.time} {t('liveNotifications.ago')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNotifications;