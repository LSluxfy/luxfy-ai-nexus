import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import StaticHeroSkeleton from './StaticHeroSkeleton';
import LeadCaptureModal from './LeadCaptureModal';

const HeroSectionOptimized = () => {
  const { t } = useTranslation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  
  const words = t('hero.words', { returnObjects: true }) as string[] || ['vendedor', 'SDR', 'atendente'];
  
  // Initialize immediately with first word - NO DELAYS
  const staticWord = words[0] || 'vendedor';
  
  useEffect(() => {
    // Start immediately - NO DELAYS for FCP optimization
    setDisplayText(staticWord);
    
    // Only start typewriter after FCP (deferred)
    const startTypewriter = () => {
      const currentWord = words[currentWordIndex];
      const typeSpeed = isDeleting ? 80 : 120; // Faster typing
      const pauseTime = isDeleting ? 300 : 1500; // Shorter pauses
      
      const timer = setTimeout(() => {
        if (!isDeleting && displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        } else if (isDeleting && displayText === '') {
          setIsDeleting(false);
          setCurrentWordIndex(prev => (prev + 1) % words.length);
        } else if (isDeleting) {
          setDisplayText(currentWord.substring(0, displayText.length - 1));
        } else {
          setDisplayText(currentWord.substring(0, displayText.length + 1));
        }
      }, typeSpeed);
      
      return () => clearTimeout(timer);
    };

    // Defer typewriter animation until after FCP
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(startTypewriter, { timeout: 100 });
    } else {
      setTimeout(startTypewriter, 50);
    }
  }, [currentWordIndex, displayText, isDeleting, words, staticWord]);

  return (
    <section className="hero-container">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
      
      <div className="hero-content">
        <div className="hero-grid">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="hero-title">
                {t('hero.title')}{' '}
                <span className="relative inline-block">
                  <span className="text-blue-400">
                    {displayText || staticWord}
                    <span className="blink-animation">|</span>
                  </span>
                </span>
                <br />
                {t('hero.subtitle')}
              </h1>
              
              <p className="hero-subtitle">
                {t('hero.description')}
              </p>
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <button 
                className="hero-cta"
                onClick={() => setLeadModalOpen(true)}
              >
                {t('hero.cta')}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <Users className="h-5 w-5 text-blue-400 mr-2" />
                  <span>500+</span>
                </div>
                <p className="hero-stat-label">{t('hero.stats.companies')}</p>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                  <span>85%</span>
                </div>
                <p className="hero-stat-label">{t('hero.stats.conversion')}</p>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <Clock className="h-5 w-5 text-purple-400 mr-2" />
                  <span>24/7</span>
                </div>
                <p className="hero-stat-label">{t('hero.stats.availability')}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Static skeleton for FCP */}
          <StaticHeroSkeleton />
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal 
        open={leadModalOpen} 
        onOpenChange={setLeadModalOpen} 
      />
    </section>
  );
};

export default HeroSectionOptimized;