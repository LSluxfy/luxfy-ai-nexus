import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import AnimatedChatMockup from './AnimatedChatMockup';

const HeroSection = () => {
  const { t } = useTranslation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['vendedor', 'SDR', 'atendente'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-white text-2xl font-bold">Luxfy</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Clone seu melhor{' '}
                <span className="relative inline-block">
                  <span 
                    key={currentWordIndex}
                    className="text-blue-400 animate-fade-in"
                  >
                    {words[currentWordIndex]}
                  </span>
                </span>
                <br />
                com IA
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                Transforme suas conversas em vendas automatizadas. Nossa IA aprende com seus melhores 
                vendedores e converte leads 24/7 no WhatsApp.
              </p>
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold group transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  Experimente Grátis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-slate-400">
                ✨ Sem cartão de crédito • 7 dias grátis
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700/50">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-2xl font-bold text-white">500+</span>
                </div>
                <p className="text-sm text-slate-400">Empresas ativas</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-2xl font-bold text-white">85%</span>
                </div>
                <p className="text-sm text-slate-400">Taxa de conversão</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-purple-400 mr-2" />
                  <span className="text-2xl font-bold text-white">24/7</span>
                </div>
                <p className="text-sm text-slate-400">Disponibilidade</p>
              </div>
            </div>
          </div>

          {/* Right Column - Animated Mockup */}
          <div className="flex justify-center lg:justify-end">
            <AnimatedChatMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;