import React from 'react';
import { Check, X, Clock, Brain, DollarSign, TrendingUp, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const ComparisonTable: React.FC = () => {
  const { t } = useTranslation();

  const comparisons = [
    { 
      feature: t('comparison.humanVsAi.availability.feature'),
      human: t('comparison.humanVsAi.availability.human'),
      ai: t('comparison.humanVsAi.availability.ai'),
      humanIcon: Clock,
      aiIcon: Zap,
      humanBad: true
    },
    { 
      feature: t('comparison.humanVsAi.responseTime.feature'),
      human: t('comparison.humanVsAi.responseTime.human'),
      ai: t('comparison.humanVsAi.responseTime.ai'),
      humanIcon: Clock,
      aiIcon: Zap,
      humanBad: true
    },
    { 
      feature: t('comparison.humanVsAi.cost.feature'),
      human: t('comparison.humanVsAi.cost.human'),
      ai: t('comparison.humanVsAi.cost.ai'),
      humanIcon: DollarSign,
      aiIcon: TrendingUp,
      humanBad: true
    },
    { 
      feature: t('comparison.humanVsAi.scalability.feature'),
      human: t('comparison.humanVsAi.scalability.human'),
      ai: t('comparison.humanVsAi.scalability.ai'),
      humanIcon: Users,
      aiIcon: Zap,
      humanBad: true
    },
    { 
      feature: t('comparison.humanVsAi.consistency.feature'),
      human: t('comparison.humanVsAi.consistency.human'),
      ai: t('comparison.humanVsAi.consistency.ai'),
      humanIcon: X,
      aiIcon: Check,
      humanBad: true
    },
    { 
      feature: t('comparison.humanVsAi.training.feature'),
      human: t('comparison.humanVsAi.training.human'),
      ai: t('comparison.humanVsAi.training.ai'),
      humanIcon: Clock,
      aiIcon: Brain,
      humanBad: true
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200 rounded-full px-6 py-2 mb-6">
            <Brain className="w-5 h-5 text-blue-800" />
            <span className="text-blue-800 font-medium">{t('comparison.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            {t('comparison.title')}
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            {t('comparison.subtitle')}
          </p>
        </div>

        {/* Desktop Table */}
        <Card className="hidden md:block overflow-hidden shadow-xl border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-slate-100 to-blue-50">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-left font-semibold text-slate-700">
                {t('comparison.featureColumn')}
              </div>
              <CardTitle className="text-center text-slate-600 flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                {t('comparison.humanColumn')}
              </CardTitle>
              <CardTitle className="text-center text-primary bg-primary/10 rounded-lg py-2 flex items-center justify-center gap-2">
                <Brain className="w-5 h-5" />
                {t('comparison.aiColumn')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {comparisons.map((item, index) => (
              <div key={index} className={`grid grid-cols-3 gap-4 p-5 ${
                index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
              } border-b border-slate-100 last:border-b-0`}>
                <div className="font-medium text-slate-900 flex items-center">
                  {item.feature}
                </div>
                <div className="text-center flex items-center justify-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700">
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.human}</span>
                  </div>
                </div>
                <div className="text-center flex items-center justify-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.ai}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {comparisons.map((item, index) => (
            <Card key={index} className="border border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <p className="font-semibold text-slate-900 text-sm mb-3">{item.feature}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700">
                    <X className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-medium">{t('comparison.humanColumn')}:</span>
                    <span className="text-xs">{item.human}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-medium">{t('comparison.aiColumn')}:</span>
                    <span className="text-xs">{item.ai}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 shadow-lg">
            <p className="text-white font-bold text-lg md:text-2xl leading-relaxed">
              {t('comparison.competitorPhrase')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
