import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CountdownTimerProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ variant = 'full', className = '' }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <Clock className="w-4 h-4 text-destructive" />
        <span className="text-destructive font-semibold">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-destructive/10 border border-destructive/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-destructive" />
        <span className="text-destructive font-semibold">{t('countdown.title')}</span>
      </div>
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="bg-destructive text-white rounded-lg px-3 py-2 text-xl font-bold">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs text-destructive mt-1">{t('countdown.hours')}</div>
        </div>
        <div className="text-center">
          <div className="bg-destructive text-white rounded-lg px-3 py-2 text-xl font-bold">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs text-destructive mt-1">{t('countdown.minutes')}</div>
        </div>
        <div className="text-center">
          <div className="bg-destructive text-white rounded-lg px-3 py-2 text-xl font-bold">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-destructive mt-1">{t('countdown.seconds')}</div>
        </div>
      </div>
      <p className="text-center text-sm text-destructive mt-3">{t('countdown.subtitle')}</p>
    </div>
  );
};

export default CountdownTimer;