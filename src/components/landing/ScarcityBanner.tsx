import React from 'react';
import { AlertTriangle, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ScarcityBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed top-0 left-0 right-0 z-60 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 md:py-3 px-4">
      <div className="container mx-auto flex items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-medium">
        <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
        <span className="text-center">{t('scarcity.banner')}</span>
        <Users className="w-3 h-3 md:w-4 md:h-4" />
        <span className="bg-white/20 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs">47/50</span>
      </div>
    </div>
  );
};

export default ScarcityBanner;