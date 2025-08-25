
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSelector = () => {
  // Add error boundary protection
  try {
    const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
    
    const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

    return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:block">{currentLang?.flag} {currentLang?.name}</span>
          <span className="sm:hidden">{currentLang?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={currentLanguage === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    );
  } catch (error) {
    console.error('LanguageSelector error:', error);
    // Fallback UI when context is not available
    return (
      <Button variant="outline" size="sm" className="gap-2">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:block">🇧🇷 Português</span>
        <span className="sm:hidden">🇧🇷</span>
      </Button>
    );
  }
};

export default LanguageSelector;
