
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Kanban, Calendar, BarChart, Users, Shield, Check, Star, Zap, Brain, Cpu, Network } from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation, Trans } from 'react-i18next';

import ExamplesShowcase from '@/components/landing/ExamplesShowcase';
import PricingV2 from '@/components/landing/PricingV2';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import StickyCTA from '@/components/landing/StickyCTA';

const LandingPage = () => {
  const { t } = useTranslation();
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

  const features = [
    {
      icon: Brain,
      titleKey: 'features.aiAgent.title',
      descriptionKey: 'features.aiAgent.description',
      features: [
        t('features.aiAgent.features.0'),
        t('features.aiAgent.features.1'),
        t('features.aiAgent.features.2')
      ]
    },
    {
      icon: Kanban,
      titleKey: 'features.crm.title',
      descriptionKey: 'features.crm.description',
      features: [
        t('features.crm.features.0'),
        t('features.crm.features.1'),
        t('features.crm.features.2')
      ]
    },
    {
      icon: Calendar,
      titleKey: 'features.schedule.title',
      descriptionKey: 'features.schedule.description',
      features: [
        t('features.schedule.features.0'),
        t('features.schedule.features.1'),
        t('features.schedule.features.2')
      ]
    },
    {
      icon: BarChart,
      titleKey: 'features.analytics.title',
      descriptionKey: 'features.analytics.description',
      features: [
        t('features.analytics.features.0'),
        t('features.analytics.features.1'),
        t('features.analytics.features.2')
      ]
    },
    {
      icon: Users,
      titleKey: 'features.team.title',
      descriptionKey: 'features.team.description',
      features: [
        t('features.team.features.0'),
        t('features.team.features.1'),
        t('features.team.features.2')
      ]
    },
    {
      icon: Shield,
      titleKey: 'features.security.title',
      descriptionKey: 'features.security.description',
      features: [
        t('features.security.features.0'),
        t('features.security.features.1'),
        t('features.security.features.2')
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-slate-900/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Circuit-like grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(30, 58, 138, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <Helmet>
        <title>{t('seo.landing.title')}</title>
        <meta name="description" content={t('seo.landing.description')} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center relative z-10">
          {/* AI pulse indicator */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center animate-pulse">
                <Cpu className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-blue-600/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-16 h-16 bg-blue-800/10 rounded-full animate-ping delay-1000"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white px-10 py-4 text-lg font-semibold border border-blue-700/50 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-600/40 hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              {t('hero.startFree')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white px-10 py-4 text-lg font-semibold bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Network className="w-5 h-5 mr-2" />
              {t('hero.login')}
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">500+</div>
              <div className="text-sm text-slate-500">Empresas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">99.9%</div>
              <div className="text-sm text-slate-500">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">24/7</div>
              <div className="text-sm text-slate-500">IA Ativa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 bg-slate-50/50">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-800/10 backdrop-blur-sm border border-blue-800/20 rounded-full px-6 py-2 mb-6">
              <Brain className="w-5 h-5 text-blue-800" />
              <span className="text-blue-800 font-medium">Tecnologia Avançada</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 border-slate-200 backdrop-blur-sm hover:bg-white transition-all duration-300 group hover:border-blue-800/50 hover:shadow-lg hover:shadow-blue-800/10 hover:scale-105">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-800 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900 group-hover:text-blue-800 transition-colors">
                    {t(feature.titleKey)}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {t(feature.descriptionKey)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.features.map((featureItem, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-slate-600">{featureItem}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ExamplesShowcase />

      <PricingV2 />

      <Testimonials />
      <FAQ />

      <LandingFooter />
      <StickyCTA />
    </div>
  );
};

export default LandingPage;
