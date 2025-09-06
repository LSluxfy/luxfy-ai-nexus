import React from 'react';
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const RealResults: React.FC = () => {
  const { t } = useTranslation();

  const results = [
    {
      icon: TrendingUp,
      metric: '+340%',
      description: t('realResults.cases.0.description'),
      company: t('realResults.cases.0.company'),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: DollarSign,
      metric: 'R$ 15.000',
      description: t('realResults.cases.1.description'),
      company: t('realResults.cases.1.company'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Clock,
      metric: '80%',
      description: t('realResults.cases.2.description'),
      company: t('realResults.cases.2.company'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Users,
      metric: '+250%',
      description: t('realResults.cases.3.description'),
      company: t('realResults.cases.3.company'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {t('realResults.title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('realResults.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((result, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${result.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <result.icon className={`w-8 h-8 ${result.color}`} />
                </div>
                <div className={`text-3xl font-bold ${result.color} mb-2`}>
                  {result.metric}
                </div>
                <p className="text-gray-700 mb-2">{result.description}</p>
                <p className="text-sm text-gray-500 font-medium">{result.company}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">1.500+</div>
              <div className="text-sm text-gray-600">{t('realResults.stats.clients')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">2.5M+</div>
              <div className="text-sm text-gray-600">{t('realResults.stats.messages')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">98%</div>
              <div className="text-sm text-gray-600">{t('realResults.stats.satisfaction')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">{t('realResults.stats.availability')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealResults;