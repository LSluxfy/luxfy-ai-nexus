
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Kanban, Calendar, BarChart, Users, Shield, Check, Star, Zap, Brain, Cpu, Network } from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation();

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Circuit-like grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center relative z-10">
          {/* AI pulse indicator */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Cpu className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-blue-600/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-16 h-16 bg-blue-600/20 rounded-full animate-ping delay-1000"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {t('hero.title', { interpolation: { escapeValue: false } })}
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 text-lg font-semibold border border-blue-500/50 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              {t('hero.startFree')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white px-10 py-4 text-lg font-semibold bg-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Network className="w-5 h-5 mr-2" />
              {t('hero.login')}
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">500+</div>
              <div className="text-sm text-gray-400">Empresas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">24/7</div>
              <div className="text-sm text-gray-400">IA Ativa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-6 py-2 mb-6">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Tecnologia Avançada</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {t(feature.titleKey)}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {t(feature.descriptionKey)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.features.map((featureItem, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-300">{featureItem}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 px-4">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Planos Inteligentes</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">
                  {t('pricing.starter.name')}
                </CardTitle>
                <div className="text-4xl font-bold text-blue-400 mt-4">
                  {t('pricing.starter.price')}
                </div>
                <CardDescription className="text-gray-300 mt-2">
                  {t('pricing.starter.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-blue-500/50">
                  {t('pricing.starter.button')}
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-b from-blue-900/20 to-gray-900/50 border-blue-500 backdrop-blur-sm relative hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  {t('pricing.pro.popular')}
                </span>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-bold text-white">
                  {t('pricing.pro.name')}
                </CardTitle>
                <div className="text-4xl font-bold text-blue-400 mt-4">
                  {t('pricing.pro.price')}
                </div>
                <CardDescription className="text-gray-300 mt-2">
                  {t('pricing.pro.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg">
                  {t('pricing.pro.button')}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">
                  {t('pricing.premium.name')}
                </CardTitle>
                <div className="text-4xl font-bold text-blue-400 mt-4">
                  {t('pricing.premium.price')}
                </div>
                <CardDescription className="text-gray-300 mt-2">
                  {t('pricing.premium.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white bg-black/50">
                  {t('pricing.premium.button')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 px-4">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-6 py-2 mb-6">
              <Network className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Conecte-se Conosco</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                {t('contact.form.title')}
              </h3>
              <p className="text-gray-300 mb-8">
                {t('contact.form.subtitle')}
              </p>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact.form.name')}
                  </label>
                  <Input 
                    placeholder={t('contact.form.namePlaceholder')} 
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact.form.email')}
                  </label>
                  <Input 
                    type="email" 
                    placeholder={t('contact.form.emailPlaceholder')} 
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact.form.subject')}
                  </label>
                  <Input 
                    placeholder={t('contact.form.subjectPlaceholder')} 
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact.form.message')}
                  </label>
                  <Textarea 
                    placeholder={t('contact.form.messagePlaceholder')} 
                    rows={5} 
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3">
                  <Zap className="w-4 h-4 mr-2" />
                  {t('contact.form.send')}
                </Button>
              </form>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-2">
                  {t('contact.phone')}
                </h4>
                <p className="text-blue-400">+55 (11) 99999-9999</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-2">
                  {t('contact.email')}
                </h4>
                <p className="text-blue-400">contato@luxfy.com</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-2">
                  {t('contact.address')}
                </h4>
                <p className="text-gray-300">
                  Rua da Inovação, 123<br />
                  São Paulo, SP - Brasil
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
