import React from 'react';
import { AlertTriangle, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ScarcityBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4">
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm font-medium">
        <AlertTriangle className="w-4 h-4 animate-pulse" />
        <span>{t('scarcity.banner')}</span>
        <Users className="w-4 h-4" />
        <span className="bg-white/20 px-2 py-1 rounded">47/50</span>
      </div>
    </div>
  );
};

export default ScarcityBanner;