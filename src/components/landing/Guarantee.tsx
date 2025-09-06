import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Guarantee: React.FC = () => {
  const { t } = useTranslation();

  const guarantees = [
    t('guarantee.benefits.0'),
    t('guarantee.benefits.1'),
    t('guarantee.benefits.2'),
    t('guarantee.benefits.3')
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto">
        <Card className="max-w-4xl mx-auto border-2 border-green-200 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Shield className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              {t('guarantee.title')}
            </h2>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              {t('guarantee.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {guarantees.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-green-100 border border-green-200 rounded-lg p-6">
              <p className="text-green-800 font-semibold text-lg">
                {t('guarantee.promise')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Guarantee;