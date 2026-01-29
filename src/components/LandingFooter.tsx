
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
        <div className="flex justify-center gap-8">
          <div className='text-center'>
            <Link to="/" className="flex items-center justify-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center">
                <img src="/lovable-uploads/c0e6c735-5382-4c0e-81ee-5c39577c240d.png" alt="Luxfy Logo" className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Luxfy
              </span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed text-center max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex gap-4 justify-center">
              <a href="https://www.instagram.com/luxfy.es" target='_blank' className="w-10 h-10 bg-slate-800 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
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
