
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false); // Close mobile menu after click
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/25">
              <img src="/lovable-uploads/c0e6c735-5382-4c0e-81ee-5c39577c240d.png" alt="Luxfy Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              Luxfy
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-600 hover:text-blue-800 font-medium transition-colors">{t('nav.home')}</Link>
            <button onClick={() => handleScrollToSection('features')} className="text-slate-600 hover:text-blue-800 font-medium transition-colors">{t('nav.features')}</button>
            <Link to="/tutorials" className="text-slate-600 hover:text-blue-800 font-medium transition-colors">Tutoriais</Link>
            <button onClick={() => handleScrollToSection('pricing')} className="text-slate-600 hover:text-blue-800 font-medium transition-colors">{t('nav.pricing')}</button>
            <button onClick={() => handleScrollToSection('contact')} className="text-slate-600 hover:text-blue-800 font-medium transition-colors">{t('nav.contact')}</button>
            <LanguageSelector />
            <div className="flex gap-3 ml-4">
              <Link to="/login">
                <Button variant="outline" className="font-medium border-slate-300 text-slate-700 hover:bg-blue-800 hover:border-blue-800 hover:text-white">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800 font-medium shadow-lg shadow-blue-500/25">
                  {t('nav.register')}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-700" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar Menu" : "Abrir Menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in border-t border-slate-200 mt-3">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-slate-600 hover:text-blue-800 font-medium transition-colors py-2">{t('nav.home')}</Link>
              <button onClick={() => handleScrollToSection('features')} className="text-slate-600 hover:text-blue-800 font-medium transition-colors py-2 text-left">{t('nav.features')}</button>
              <Link to="/tutorials" className="text-slate-600 hover:text-blue-800 font-medium transition-colors py-2">Tutoriais</Link>
              <button onClick={() => handleScrollToSection('pricing')} className="text-slate-600 hover:text-blue-800 font-medium transition-colors py-2 text-left">{t('nav.pricing')}</button>
              <button onClick={() => handleScrollToSection('contact')} className="text-slate-600 hover:text-blue-800 font-medium transition-colors py-2 text-left">{t('nav.contact')}</button>
              <div className="py-2">
                <LanguageSelector />
              </div>
              <div className="flex gap-3 mt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="font-medium w-full border-slate-300 text-slate-700 hover:bg-blue-800 hover:border-blue-800 hover:text-white">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button className="bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800 font-medium w-full shadow-lg shadow-blue-500/25">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;
