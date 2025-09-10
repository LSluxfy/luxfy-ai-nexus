// Utilitários para prevenção de cache

export const cacheBustingUtils = {
  // Gera parâmetros anti-cache únicos
  generateCacheBustParams: () => ({
    _t: Date.now(),
    _r: Math.random().toString(36).substring(7),
    _cb: crypto.randomUUID().substring(0, 8)
  }),

  // Adiciona headers anti-cache para requisições
  getAntiCacheHeaders: () => ({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'If-None-Match': '',
    'If-Modified-Since': '',
    'X-Cache-Bust': Date.now().toString(),
    'X-Requested-With': 'XMLHttpRequest'
  }),

  // Limpa cache do navegador
  clearBrowserCache: () => {
    // Limpar localStorage relacionado a cache
    Object.keys(localStorage).forEach(key => {
      if (key.includes('cache') || key.includes('_timestamp') || key.includes('agent_')) {
        localStorage.removeItem(key);
      }
    });

    // Limpar sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('cache') || key.includes('_timestamp') || key.includes('agent_')) {
        sessionStorage.removeItem(key);
      }
    });

    console.log('🧹 [CACHE CLEAR] Cache do navegador limpo');
  },

  // Força reload da página sem cache
  forceReloadWithoutCache: () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  },

  // Gera URL com parâmetros anti-cache
  addCacheBustToUrl: (url: string): string => {
    const separator = url.includes('?') ? '&' : '?';
    const params = cacheBustingUtils.generateCacheBustParams();
    const paramString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return `${url}${separator}${paramString}`;
  }
};

// Hook para componentes React
export const useCacheBuster = () => {
  const bustCache = () => cacheBustingUtils.generateCacheBustParams();
  const clearCache = () => cacheBustingUtils.clearBrowserCache();
  
  return { bustCache, clearCache };
};