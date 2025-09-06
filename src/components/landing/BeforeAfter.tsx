import React from 'react';
import { ArrowRight, Frown, Smile } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const BeforeAfter: React.FC = () => {
  const { t } = useTranslation();

  const scenarios = [
    {
      before: t('beforeAfter.scenarios.0.before'),
      after: t('beforeAfter.scenarios.0.after')
    },
    {
      before: t('beforeAfter.scenarios.1.before'),
      after: t('beforeAfter.scenarios.1.after')
    },
    {
      before: t('beforeAfter.scenarios.2.before'),
      after: t('beforeAfter.scenarios.2.after')
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {t('beforeAfter.title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('beforeAfter.subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          {scenarios.map((scenario, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Before */}
                  <div className="bg-red-50 p-8 flex items-center">
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-100 rounded-full p-2">
                          <Frown className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-red-800">
                          {t('beforeAfter.before')}
                        </h3>
                      </div>
                      <p className="text-red-700">{scenario.before}</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-blue-600 rounded-full p-3">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* After */}
                  <div className="bg-green-50 p-8 flex items-center">
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 rounded-full p-2">
                          <Smile className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-green-800">
                          {t('beforeAfter.after')}
                        </h3>
                      </div>
                      <p className="text-green-700">{scenario.after}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;