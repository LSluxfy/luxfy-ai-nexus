import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import AnimatedChatMockup from './AnimatedChatMockup';
const HeroSection = () => {
  const {
    t
  } = useTranslation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const words = t('hero.words', {
    returnObjects: true
  }) as string[] || ['vendedor', 'SDR', 'atendente'];
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const typeSpeed = isDeleting ? 100 : 150;
    const pauseTime = isDeleting ? 500 : 2000;
    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentWord) {
        // Palavra completa, aguardar e começar a apagar
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && displayText === '') {
        // Texto apagado, ir para próxima palavra
        setIsDeleting(false);
        setCurrentWordIndex(prev => (prev + 1) % words.length);
      } else if (isDeleting) {
        // Apagando caracteres
        setDisplayText(currentWord.substring(0, displayText.length - 1));
      } else {
        // Digitando caracteres
        setDisplayText(currentWord.substring(0, displayText.length + 1));
      }
    }, typeSpeed);
    return () => clearTimeout(timer);
  }, [currentWordIndex, displayText, isDeleting, words]);
  return <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {t('hero.title')}{' '}
                 <span className="relative inline-block">
                   <span className="text-blue-400">
                     {displayText}
                     <span className="animate-pulse">|</span>
                   </span>
                 </span>
                <br />
                {t('hero.subtitle')}
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                {t('hero.description')}
              </p>
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <a href="#pricing">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold group transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700/50">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-2xl font-bold text-white">500+</span>
                </div>
                <p className="text-sm text-slate-400">{t('hero.stats.companies')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-2xl font-bold text-white">85%</span>
                </div>
                <p className="text-sm text-slate-400">{t('hero.stats.conversion')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-purple-400 mr-2" />
                  <span className="text-2xl font-bold text-white">24/7</span>
                </div>
                <p className="text-sm text-slate-400">{t('hero.stats.availability')}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Animated Mockup */}
          <div className="flex justify-center lg:justify-end">
            <AnimatedChatMockup />
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;