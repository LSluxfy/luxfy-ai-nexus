
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LandingFooter = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-white py-12 relative">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-800 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <img src="/lovable-uploads/c0e6c735-5382-4c0e-81ee-5c39577c240d.png" alt="Luxfy Logo" className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Luxfy
              </span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" className="w-10 h-10 bg-slate-800 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" className="w-10 h-10 bg-slate-800 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" className="w-10 h-10 bg-slate-800 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" className="w-10 h-10 bg-slate-800 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">{t('footer.product')}</h3>
            <ul className="space-y-3">
              <li><Link to="/#features" className="text-slate-400 hover:text-blue-400 transition-colors">{t('nav.features')}</Link></li>
              <li><Link to="/#pricing" className="text-slate-400 hover:text-blue-400 transition-colors">{t('nav.pricing')}</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Demo</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">{t('footer.company')}</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Sobre nós</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Carreiras</Link></li>
              <li><Link to="/#contact" className="text-slate-400 hover:text-blue-400 transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Termos de Serviço</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Cookies</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {year} Luxfy. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
