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
      }, 4000);
    }, 8000);

    return () => clearInterval(showTimer);
  }, [notifications.length]);

  const notification = notifications[currentNotification];

  return (
    <div className={`fixed bottom-24 left-6 z-40 transform transition-all duration-500 ${
      isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
    }`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full p-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <User className="w-3 h-3 text-gray-500" />
              <span className="font-semibold text-sm text-gray-900">{notification.name}</span>
            </div>
            <p className="text-sm text-gray-600">{notification.action}</p>
            <p className="text-xs text-gray-400 mt-1">{notification.time} {t('liveNotifications.ago')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNotifications;