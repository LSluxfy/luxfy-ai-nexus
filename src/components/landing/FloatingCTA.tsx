import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

const FloatingCTA: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollPosition > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-slide-in-right">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 max-w-sm">
        <div className="text-center mb-3">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {t('floatingCTA.title')}
          </p>
          <CountdownTimer variant="compact" />
        </div>
        
        <Link to="/register">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
            {t('floatingCTA.button')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FloatingCTA;