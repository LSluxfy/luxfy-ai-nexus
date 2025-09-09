import { createContext, useContext } from 'react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';

interface LightweightContextProps {
  children: React.ReactNode;
}

// Context mais leve para landing page
export function LandingContextProvider({ children }: LightweightContextProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}

// Context completo para dashboard
export function DashboardContextProvider({ children }: LightweightContextProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}