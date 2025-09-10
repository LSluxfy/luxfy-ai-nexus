import { useCallback } from 'react';

export function useCacheBuster() {
  const bustCache = useCallback(() => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return {
      _t: timestamp,
      _r: random,
      _cb: Date.now()
    };
  }, []);

  const clearBrowserCache = useCallback(() => {
    // Limpar localStorage de dados de cache
    Object.keys(localStorage).forEach(key => {
      if (key.includes('cache') || key.includes('_timestamp')) {
        localStorage.removeItem(key);
      }
    });

    // Limpar sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('cache') || key.includes('_timestamp')) {
        sessionStorage.removeItem(key);
      }
    });

    // Forçar reload sem cache se necessário
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
      });
    }
  }, []);

  return {
    bustCache,
    clearBrowserCache
  };
}