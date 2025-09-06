import React from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const ComparisonTable: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    { feature: t('comparison.features.0'), traditional: false, ai: true },
    { feature: t('comparison.features.1'), traditional: false, ai: true },
    { feature: t('comparison.features.2'), traditional: true, ai: true },
    { feature: t('comparison.features.3'), traditional: false, ai: true },
    { feature: t('comparison.features.4'), traditional: true, ai: true },
    { feature: t('comparison.features.5'), traditional: false, ai: true },
    { feature: t('comparison.features.6'), traditional: false, ai: true },
    { feature: t('comparison.features.7'), traditional: true, ai: true }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            {t('comparison.title')}
          </h2>
          <p className="text-xl text-slate-600">
            {t('comparison.subtitle')}
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50">
            <div className="grid grid-cols-3 gap-4">
              <div></div>
              <CardTitle className="text-center text-slate-600">
                {t('comparison.traditional')}
              </CardTitle>
              <CardTitle className="text-center text-primary bg-primary/10 rounded-lg py-2">
                {t('comparison.aiAgent')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {features.map((item, index) => (
              <div key={index} className={`grid grid-cols-3 gap-4 p-4 ${
                index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
              }`}>
                <div className="font-medium text-slate-900">
                  {item.feature}
                </div>
                <div className="text-center">
                  {item.traditional ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 font-semibold">
              {t('comparison.conclusion')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;