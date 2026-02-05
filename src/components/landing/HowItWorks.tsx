import React from 'react';
import { MessageSquare, Settings, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: MessageSquare,
      step: '01',
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Settings,
      step: '02', 
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Zap,
      step: '03',
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className={`w-20 h-20 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <step.icon className={`w-10 h-10 ${step.color}`} />
                </div>
                
                <div className={`text-6xl font-bold ${step.color} opacity-20 absolute top-4 right-6`}>
                  {step.step}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-slate-600">
                  {step.description}
                </p>
              </CardContent>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8">
                  <div className="w-full h-0.5 bg-slate-300 relative top-1/2">
                    <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;